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
