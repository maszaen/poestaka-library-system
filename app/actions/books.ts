'use server';

import { query } from '@/lib/db';
import { BukuWithKategori, ItemBuku, ActionResult, Kategori } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

interface BookRow extends RowDataPacket, BukuWithKategori {}
interface ItemRow extends RowDataPacket, ItemBuku {}
interface KategoriRow extends RowDataPacket, Kategori {}

export async function getBooks(): Promise<BukuWithKategori[]> {
  try {
    const books = await query<BookRow[]>(`
      SELECT 
        b.id_buku,
        b.judul,
        b.penulis,
        b.penerbit,
        b.tahun_terbit,
        b.isbn,
        b.id_kategori,
        k.nama_kategori,
        k.rak_lokasi
      FROM buku b
      LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
      ORDER BY b.judul ASC
    `);
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function getBookById(id: number): Promise<BukuWithKategori | null> {
  try {
    const books = await query<BookRow[]>(`
      SELECT 
        b.id_buku,
        b.judul,
        b.penulis,
        b.penerbit,
        b.tahun_terbit,
        b.isbn,
        b.id_kategori,
        k.nama_kategori,
        k.rak_lokasi
      FROM buku b
      LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
      WHERE b.id_buku = ?
    `, [id]);
    return books[0] || null;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

export async function getBookItems(id_buku: number): Promise<ItemBuku[]> {
  try {
    const items = await query<ItemRow[]>(`
      SELECT 
        id_item,
        id_buku,
        kondisi,
        status
      FROM item_buku
      WHERE id_buku = ?
      ORDER BY id_item ASC
    `, [id_buku]);
    return items;
  } catch (error) {
    console.error('Error fetching book items:', error);
    return [];
  }
}

export async function getCategories(): Promise<Kategori[]> {
  try {
    const categories = await query<KategoriRow[]>(`
      SELECT id_kategori, nama_kategori, rak_lokasi
      FROM kategori
      ORDER BY nama_kategori ASC
    `);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createBook(data: {
  judul: string;
  penulis?: string;
  penerbit?: string;
  tahun_terbit?: number;
  isbn?: string;
  id_kategori?: number;
}): Promise<ActionResult<{ id_buku: number }>> {
  try {
    const result = await query<{ insertId: number }>(
      `INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, isbn, id_kategori)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.judul,
        data.penulis || null,
        data.penerbit || null,
        data.tahun_terbit || null,
        data.isbn || null,
        data.id_kategori || null,
      ]
    );
    return { success: true, data: { id_buku: result.insertId } };
  } catch (error) {
    console.error('Error creating book:', error);
    return { success: false, error: 'Gagal menambahkan buku' };
  }
}

export async function createBookItem(data: {
  id_item: string;
  id_buku: number;
  kondisi?: 'Baik' | 'Rusak' | 'Hilang';
}): Promise<ActionResult> {
  try {
    await query(
      `INSERT INTO item_buku (id_item, id_buku, kondisi, status)
       VALUES (?, ?, ?, 'Tersedia')`,
      [data.id_item, data.id_buku, data.kondisi || 'Baik']
    );
    return { success: true };
  } catch (error) {
    console.error('Error creating book item:', error);
    return { success: false, error: 'Gagal menambahkan item buku' };
  }
}
