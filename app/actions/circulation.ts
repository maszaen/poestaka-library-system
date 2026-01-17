'use server';

import { getConnection, query } from '@/lib/db';
import { ActionResult, LoanInfo, DetailPeminjamanWithItem } from '@/lib/types';
import { generateLoanNumber, calculateLateDays, calculateFine } from '@/lib/utils';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ItemStatusRow extends RowDataPacket {
  id_item: string;
  status: string;
  judul: string;
}

interface LoanInfoRow extends RowDataPacket {
  no_peminjaman: string;
  nama_lengkap: string;
  judul: string;
  batas_kembali: Date;
}

interface DetailRow extends RowDataPacket, DetailPeminjamanWithItem {}

// Process a new loan (borrow books)
export async function processLoan(
  memberId: number,
  itemBarcodes: string[],
  loanDays: number = 14
): Promise<ActionResult<{ no_peminjaman: string }>> {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Validate items are available
    for (const barcode of itemBarcodes) {
      const [items] = await connection.execute<ItemStatusRow[]>(
        `SELECT id_item, status, b.judul 
         FROM item_buku ib 
         JOIN buku b ON ib.id_buku = b.id_buku 
         WHERE id_item = ?`,
        [barcode]
      );
      
      if (items.length === 0) {
        throw new Error(`Item dengan barcode ${barcode} tidak ditemukan`);
      }
      
      if (items[0].status !== 'Tersedia') {
        throw new Error(`Item "${items[0].judul}" (${barcode}) tidak tersedia untuk dipinjam`);
      }
    }

    // Generate loan number
    const noPeminjaman = generateLoanNumber();
    
    // Calculate dates
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + loanDays);
    
    const tanggalPinjam = today.toISOString().split('T')[0];
    const batasKembali = dueDate.toISOString().split('T')[0];

    // Insert into peminjaman
    await connection.execute(
      `INSERT INTO peminjaman (no_peminjaman, id_anggota, id_petugas, tanggal_pinjam, batas_kembali)
       VALUES (?, ?, NULL, ?, ?)`,
      [noPeminjaman, memberId, tanggalPinjam, batasKembali]
    );

    // Insert into detail_peminjaman and update item status
    for (const barcode of itemBarcodes) {
      // Insert detail
      await connection.execute(
        `INSERT INTO detail_peminjaman (no_peminjaman, id_item, status_kembali)
         VALUES (?, ?, 'Pinjam')`,
        [noPeminjaman, barcode]
      );

      // Update item status
      await connection.execute(
        `UPDATE item_buku SET status = 'Dipinjam' WHERE id_item = ?`,
        [barcode]
      );
    }

    await connection.commit();
    return { success: true, data: { no_peminjaman: noPeminjaman } };
    
  } catch (error) {
    await connection.rollback();
    console.error('Error processing loan:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Gagal memproses peminjaman' 
    };
  } finally {
    connection.release();
  }
}

// Get loan information by item barcode
export async function getLoanInfoByBarcode(barcode: string): Promise<ActionResult<LoanInfo>> {
  try {
    const results = await query<LoanInfoRow[]>(`
      SELECT 
        p.no_peminjaman,
        a.nama_lengkap,
        b.judul,
        p.batas_kembali
      FROM detail_peminjaman dp
      JOIN peminjaman p ON dp.no_peminjaman = p.no_peminjaman
      JOIN anggota a ON p.id_anggota = a.id_anggota
      JOIN item_buku ib ON dp.id_item = ib.id_item
      JOIN buku b ON ib.id_buku = b.id_buku
      WHERE dp.id_item = ? AND dp.status_kembali = 'Pinjam'
    `, [barcode]);

    if (results.length === 0) {
      return { success: false, error: 'Item tidak dalam status dipinjam' };
    }

    const loan = results[0];
    const daysLate = calculateLateDays(loan.batas_kembali);
    const fine = calculateFine(loan.batas_kembali);

    return {
      success: true,
      data: {
        no_peminjaman: loan.no_peminjaman,
        nama_lengkap: loan.nama_lengkap,
        judul: loan.judul,
        batas_kembali: loan.batas_kembali,
        daysLate,
        fine,
      },
    };
  } catch (error) {
    console.error('Error getting loan info:', error);
    return { success: false, error: 'Gagal mendapatkan informasi peminjaman' };
  }
}

// Process a return
export async function processReturn(barcode: string): Promise<ActionResult<{ fine: number }>> {
  const connection = await getConnection();
  const dendaPerHari = 1000;
  
  try {
    await connection.beginTransaction();

    // Find active loan for this item to ensure validity
    const [details] = await connection.execute<LoanInfoRow[]>(`
      SELECT 
        dp.id_detail,
        p.no_peminjaman
      FROM detail_peminjaman dp
      JOIN peminjaman p ON dp.no_peminjaman = p.no_peminjaman
      WHERE dp.id_item = ? AND dp.status_kembali = 'Pinjam'
    `, [barcode]);

    if (details.length === 0) {
      throw new Error('Item tidak dalam status dipinjam');
    }

    // Update detail_peminjaman with SQL calculation for Fine
    // Logic: If Late > 0, Denda = Late * 1000, Else 0
    await connection.execute(
      `UPDATE detail_peminjaman dp
       JOIN peminjaman p ON dp.no_peminjaman = p.no_peminjaman
       SET 
         dp.tanggal_kembali_aktual = CURDATE(), 
         dp.denda = CASE 
           WHEN DATEDIFF(CURDATE(), p.batas_kembali) > 0 
           THEN DATEDIFF(CURDATE(), p.batas_kembali) * ?
           ELSE 0 
         END, 
         dp.status_kembali = 'Kembali'
       WHERE dp.id_item = ? AND dp.status_kembali = 'Pinjam'`,
      [dendaPerHari, barcode]
    );

    // Update item_buku status back to available
    await connection.execute(
      `UPDATE item_buku SET status = 'Tersedia' WHERE id_item = ?`,
      [barcode]
    );

    // Fetch the calculated fine to return to client
    const [updated] = await connection.execute<RowDataPacket[]>(
      `SELECT denda FROM detail_peminjaman WHERE id_item = ? AND status_kembali = 'Kembali' ORDER BY id_detail DESC LIMIT 1`,
      [barcode]
    );

    await connection.commit();
    return { success: true, data: { fine: Number(updated[0]?.denda) || 0 } };
    
  } catch (error) {
    await connection.rollback();
    console.error('Error processing return:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Gagal memproses pengembalian' 
    };
  } finally {
    connection.release();
  }
}

// Get all active loans
export async function getActiveLoans(): Promise<DetailPeminjamanWithItem[]> {
  try {
    const loans = await query<DetailRow[]>(`
      SELECT 
        dp.id_detail,
        dp.no_peminjaman,
        dp.id_item,
        dp.tanggal_kembali_aktual,
        dp.denda,
        dp.status_kembali,
        b.judul,
        p.batas_kembali,
        a.nama_lengkap
      FROM detail_peminjaman dp
      JOIN peminjaman p ON dp.no_peminjaman = p.no_peminjaman
      JOIN anggota a ON p.id_anggota = a.id_anggota
      JOIN item_buku ib ON dp.id_item = ib.id_item
      JOIN buku b ON ib.id_buku = b.id_buku
      WHERE dp.status_kembali = 'Pinjam'
      ORDER BY p.batas_kembali ASC
    `);
    return loans;
  } catch (error) {
    console.error('Error fetching active loans:', error);
    return [];
  }
}

// Get loan history
export async function getLoanHistory(): Promise<DetailPeminjamanWithItem[]> {
  try {
    const loans = await query<DetailRow[]>(`
      SELECT 
        dp.id_detail,
        dp.no_peminjaman,
        dp.id_item,
        dp.tanggal_kembali_aktual,
        dp.denda,
        dp.status_kembali,
        b.judul,
        p.batas_kembali,
        a.nama_lengkap
      FROM detail_peminjaman dp
      JOIN peminjaman p ON dp.no_peminjaman = p.no_peminjaman
      JOIN anggota a ON p.id_anggota = a.id_anggota
      JOIN item_buku ib ON dp.id_item = ib.id_item
      JOIN buku b ON ib.id_buku = b.id_buku
      ORDER BY p.tanggal_pinjam DESC
      LIMIT 100
    `);
    return loans;
  } catch (error) {
    console.error('Error fetching loan history:', error);
    return [];
  }
}
