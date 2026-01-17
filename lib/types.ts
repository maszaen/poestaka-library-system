// TypeScript interfaces matching the database schema exactly

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  rak_lokasi: string | null;
}

export interface Buku {
  id_buku: number;
  judul: string;
  penulis: string | null;
  penerbit: string | null;
  tahun_terbit: number | null;
  isbn: string | null;
  id_kategori: number | null;
}

export interface BukuWithKategori extends Buku {
  nama_kategori: string | null;
  rak_lokasi: string | null;
}

export interface ItemBuku {
  id_item: string;
  id_buku: number | null;
  kondisi: 'Baik' | 'Rusak' | 'Hilang';
  status: 'Tersedia' | 'Dipinjam' | 'Perbaikan' | 'Hilang';
}

export interface ItemBukuWithDetails extends ItemBuku {
  judul: string | null;
}

export interface Anggota {
  id_anggota: number;
  nomor_identitas: string;
  nama_lengkap: string;
  no_telepon: string | null;
  alamat: string | null;
  tanggal_daftar: Date;
}

export interface Peminjaman {
  no_peminjaman: string;
  id_anggota: number | null;
  id_petugas: number | null;
  tanggal_pinjam: Date;
  batas_kembali: Date;
}

export interface PeminjamanWithDetails extends Peminjaman {
  nama_lengkap: string | null;
  nomor_identitas: string | null;
}

export interface DetailPeminjaman {
  id_detail: number;
  no_peminjaman: string | null;
  id_item: string | null;
  tanggal_kembali_aktual: Date | null;
  denda: number;
  status_kembali: 'Pinjam' | 'Kembali' | 'Hilang';
}

export interface DetailPeminjamanWithItem extends DetailPeminjaman {
  judul: string | null;
  batas_kembali: Date | null;
  nama_lengkap: string | null;
}

export interface DashboardStats {
  totalBooks: number;
  totalItems: number;
  activeLoans: number;
  totalMembers: number;
}

export interface LoanInfo {
  no_peminjaman: string;
  nama_lengkap: string;
  judul: string;
  batas_kembali: Date;
  daysLate: number;
  fine: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
