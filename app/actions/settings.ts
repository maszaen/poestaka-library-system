'use server';

import { getConnection } from '@/lib/db';
import { ActionResult } from '@/lib/types';
import { SEED_QUERIES } from '@/lib/seed-data';

export async function resetDatabase(): Promise<ActionResult> {
    const connection = await getConnection();
    try {
        for (const q of SEED_QUERIES.clearData) {
            await connection.query(q);
        }
        await connection.query(SEED_QUERIES.finalize);
        return { success: true, data: { message: 'Database berhasil dikosongkan' } };
    } catch (error) {
        return { success: false, error: 'Gagal: ' + (error as Error).message };
    } finally {
        connection.release();
    }
}

export async function seedDatabase(): Promise<ActionResult> {
    const connection = await getConnection();
    try {
        // Clear
        for (const q of SEED_QUERIES.clearData) {
            await connection.query(q);
        }

        // Seed
        await connection.query(SEED_QUERIES.categories);
        await connection.query(SEED_QUERIES.books);
        await connection.query(SEED_QUERIES.items);
        await connection.query(SEED_QUERIES.members);
        await connection.query(SEED_QUERIES.activeLoans);
        await connection.query(SEED_QUERIES.activeLoanDetails);
        await connection.query(SEED_QUERIES.historicalLoans);
        await connection.query(SEED_QUERIES.historicalLoanDetails);
        await connection.query(SEED_QUERIES.finalize);

        return { 
            success: true, 
            data: { message: 'Seeding berhasil! 10 kategori, 20 buku, 34 item, 25 anggota, 12 transaksi.' } 
        };
    } catch (error) {
        return { success: false, error: 'Gagal seed: ' + (error as Error).message };
    } finally {
        connection.release();
    }
}
