'use server';

import { query } from '@/lib/db';
import { Anggota, ActionResult } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

interface AnggotaRow extends RowDataPacket, Anggota {}

export async function getMembers(): Promise<Anggota[]> {
  try {
    const members = await query<AnggotaRow[]>(`
      SELECT 
        id_anggota,
        nomor_identitas,
        nama_lengkap,
        no_telepon,
        alamat,
        tanggal_daftar
      FROM anggota
      ORDER BY nama_lengkap ASC
    `);
    return members;
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export async function getMemberById(id: number): Promise<Anggota | null> {
  try {
    const members = await query<AnggotaRow[]>(`
      SELECT 
        id_anggota,
        nomor_identitas,
        nama_lengkap,
        no_telepon,
        alamat,
        tanggal_daftar
      FROM anggota
      WHERE id_anggota = ?
    `, [id]);
    return members[0] || null;
  } catch (error) {
    console.error('Error fetching member:', error);
    return null;
  }
}

export async function searchMemberByIdentity(nomor_identitas: string): Promise<Anggota | null> {
  try {
    const members = await query<AnggotaRow[]>(`
      SELECT 
        id_anggota,
        nomor_identitas,
        nama_lengkap,
        no_telepon,
        alamat,
        tanggal_daftar
      FROM anggota
      WHERE nomor_identitas = ?
    `, [nomor_identitas]);
    return members[0] || null;
  } catch (error) {
    console.error('Error searching member:', error);
    return null;
  }
}

// Search members by name or identity (for dropdown)
export async function searchMembers(keyword: string = "", limit: number = 20): Promise<Anggota[]> {
  try {
    console.log("[DEBUG] searchMembers called with keyword:", keyword);
    
    // Debug: Return ALL members without limit param to test simple query
    if (!keyword.trim()) {
      const members = await query<AnggotaRow[]>(`
        SELECT 
          id_anggota,
          nomor_identitas,
          nama_lengkap,
          no_telepon,
          alamat,
          tanggal_daftar
        FROM anggota
        LIMIT 50
      `);
      console.log("[DEBUG] Found members (no keyword):", members.length);
      return members;
    }

    // Debug: Standard search but log results
    const searchPattern = `%${keyword.trim()}%`;
    const members = await query<AnggotaRow[]>(`
      SELECT 
        id_anggota,
        nomor_identitas,
        nama_lengkap,
        no_telepon,
        alamat,
        tanggal_daftar
      FROM anggota
      WHERE nama_lengkap LIKE ? OR nomor_identitas LIKE ?
      ORDER BY nama_lengkap ASC
      LIMIT 20
    `, [searchPattern, searchPattern]);
    
    console.log("[DEBUG] Found members (with keyword):", members.length);
    return members;
  } catch (error) {
    console.error('[DEBUG] Error searching members:', error);
    return [];
  }
}

export async function createMember(data: {
  nomor_identitas: string;
  nama_lengkap: string;
  no_telepon?: string;
  alamat?: string;
}): Promise<ActionResult<{ id_anggota: number }>> {
  try {
    const result = await query<{ insertId: number }>(
      `INSERT INTO anggota (nomor_identitas, nama_lengkap, no_telepon, alamat)
       VALUES (?, ?, ?, ?)`,
      [
        data.nomor_identitas,
        data.nama_lengkap,
        data.no_telepon || null,
        data.alamat || null,
      ]
    );
    return { success: true, data: { id_anggota: result.insertId } };
  } catch (error) {
    console.error('Error creating member:', error);
    return { success: false, error: 'Gagal menambahkan anggota' };
  }
}

export async function updateMember(
  id: number,
  data: {
    nomor_identitas?: string;
    nama_lengkap?: string;
    no_telepon?: string;
    alamat?: string;
  }
): Promise<ActionResult> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.nomor_identitas !== undefined) {
      fields.push('nomor_identitas = ?');
      values.push(data.nomor_identitas);
    }
    if (data.nama_lengkap !== undefined) {
      fields.push('nama_lengkap = ?');
      values.push(data.nama_lengkap);
    }
    if (data.no_telepon !== undefined) {
      fields.push('no_telepon = ?');
      values.push(data.no_telepon);
    }
    if (data.alamat !== undefined) {
      fields.push('alamat = ?');
      values.push(data.alamat);
    }

    if (fields.length === 0) {
      return { success: false, error: 'Tidak ada data yang diubah' };
    }

    values.push(id);
    await query(
      `UPDATE anggota SET ${fields.join(', ')} WHERE id_anggota = ?`,
      values
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating member:', error);
    return { success: false, error: 'Gagal mengupdate anggota' };
  }
}

// Check if member has active loans
export async function checkMemberHasActiveLoans(id: number): Promise<boolean> {
  try {
    const result = await query<{ count: number }[]>(`
      SELECT COUNT(*) as count
      FROM detail_peminjaman dp
      JOIN peminjaman p ON dp.no_peminjaman = p.no_peminjaman
      WHERE p.id_anggota = ? AND dp.status_kembali = 'Pinjam'
    `, [id]);
    return (result[0]?.count ?? 0) > 0;
  } catch (error) {
    console.error('Error checking active loans:', error);
    return true; // Return true to be safe (prevent deletion)
  }
}

// Delete member (only if no active loans)
export async function deleteMember(id: number): Promise<ActionResult> {
  try {
    // Check for active loans first
    const hasActiveLoans = await checkMemberHasActiveLoans(id);
    if (hasActiveLoans) {
      return { 
        success: false, 
        error: 'Tidak dapat menghapus anggota yang sedang meminjam buku' 
      };
    }

    // Delete the member
    await query(`DELETE FROM anggota WHERE id_anggota = ?`, [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, error: 'Gagal menghapus anggota' };
  }
}
