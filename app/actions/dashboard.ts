'use server';

import { query } from '@/lib/db';
import { DashboardStats } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

interface CountResult extends RowDataPacket {
  count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total book titles
    const [booksResult] = await query<CountResult[]>(
      'SELECT COUNT(*) as count FROM buku'
    );
    
    // Get total book items (exemplars)
    const [itemsResult] = await query<CountResult[]>(
      'SELECT COUNT(*) as count FROM item_buku'
    );
    
    // Get active loans (items with status 'Pinjam')
    const [loansResult] = await query<CountResult[]>(
      `SELECT COUNT(*) as count FROM detail_peminjaman WHERE status_kembali = 'Pinjam'`
    );
    
    // Get total members
    const [membersResult] = await query<CountResult[]>(
      'SELECT COUNT(*) as count FROM anggota'
    );

    return {
      totalBooks: booksResult?.count || 0,
      totalItems: itemsResult?.count || 0,
      activeLoans: loansResult?.count || 0,
      totalMembers: membersResult?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalBooks: 0,
      totalItems: 0,
      activeLoans: 0,
      totalMembers: 0,
    };
  }
}

export interface PopularBook {
  judul: string;
  penulis: string;
  total_peminjaman: number;
}

export async function getPopularBooks(): Promise<PopularBook[]> {
  try {
    interface PopularBookRow extends RowDataPacket {
      judul: string;
      penulis: string;
      total_peminjaman: number;
    }

    const books = await query<PopularBookRow[]>(`
      SELECT 
        b.judul,
        b.penulis,
        COUNT(dp.id_detail) as total_peminjaman
      FROM detail_peminjaman dp
      JOIN item_buku ib ON dp.id_item = ib.id_item
      JOIN buku b ON ib.id_buku = b.id_buku
      GROUP BY b.id_buku, b.judul, b.penulis
      ORDER BY total_peminjaman DESC
      LIMIT 5
    `);

    return books;
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return [];
  }
}
