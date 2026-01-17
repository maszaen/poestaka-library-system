-- Poestaka Library Management System
-- Database Setup Script
-- Run this script in MySQL to create the database and initial data

-- Create Database
CREATE DATABASE IF NOT EXISTS poestaka CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE poestaka;

-- ============================================
-- TABLE DEFINITIONS
-- ============================================

-- Kategori (Categories)
CREATE TABLE IF NOT EXISTS kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    rak_lokasi VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Buku (Books)
CREATE TABLE IF NOT EXISTS buku (
    id_buku INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(100),
    penerbit VARCHAR(100),
    tahun_terbit YEAR,
    isbn VARCHAR(20),
    id_kategori INT,
    FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Item Buku (Book Items / Physical Copies)
CREATE TABLE IF NOT EXISTS item_buku (
    id_item VARCHAR(20) PRIMARY KEY,
    id_buku INT,
    kondisi ENUM('Baik', 'Rusak', 'Hilang') DEFAULT 'Baik',
    status ENUM('Tersedia', 'Dipinjam', 'Perbaikan', 'Hilang') DEFAULT 'Tersedia',
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Anggota (Members)
CREATE TABLE IF NOT EXISTS anggota (
    id_anggota INT AUTO_INCREMENT PRIMARY KEY,
    nomor_identitas VARCHAR(20) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    no_telepon VARCHAR(15),
    alamat TEXT,
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Peminjaman (Loans)
CREATE TABLE IF NOT EXISTS peminjaman (
    no_peminjaman VARCHAR(20) PRIMARY KEY,
    id_anggota INT,
    id_petugas INT,
    tanggal_pinjam DATE NOT NULL,
    batas_kembali DATE NOT NULL,
    FOREIGN KEY (id_anggota) REFERENCES anggota(id_anggota) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Detail Peminjaman (Loan Details)
CREATE TABLE IF NOT EXISTS detail_peminjaman (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    no_peminjaman VARCHAR(20),
    id_item VARCHAR(20),
    tanggal_kembali_aktual DATE NULL,
    denda DECIMAL(10, 2) DEFAULT 0,
    status_kembali ENUM('Pinjam', 'Kembali', 'Hilang') DEFAULT 'Pinjam',
    FOREIGN KEY (no_peminjaman) REFERENCES peminjaman(no_peminjaman) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES item_buku(id_item) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Categories
INSERT INTO kategori (nama_kategori, rak_lokasi) VALUES
('Fiksi', 'A-01'),
('Non-Fiksi', 'A-02'),
('Sains & Teknologi', 'B-01'),
('Sejarah', 'B-02'),
('Bisnis & Ekonomi', 'C-01'),
('Pendidikan', 'C-02'),
('Sastra', 'D-01'),
('Referensi', 'D-02');

-- Books
INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, isbn, id_kategori) VALUES
('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '978-979-1227-00-2', 1),
('Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, '978-979-9023-21-7', 1),
('Sang Pemimpi', 'Andrea Hirata', 'Bentang Pustaka', 2006, '978-979-1227-06-4', 1),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Harper', 2015, '978-0-06-231609-7', 2),
('Atomic Habits', 'James Clear', 'Avery', 2018, '978-0-7352-1131-3', 2),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '978-0-13-235088-4', 3),
('The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Addison-Wesley', 2019, '978-0-13-595705-9', 3),
('Sejarah Indonesia Modern', 'M.C. Ricklefs', 'Gadjah Mada University Press', 2005, '978-979-420-585-3', 4),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 'Warner Books', 1997, '978-1-61268-017-5', 5),
('Psikologi Pendidikan', 'John W. Santrock', 'McGraw-Hill', 2011, '978-0-07-811183-3', 6),
('Ronggeng Dukuh Paruk', 'Ahmad Tohari', 'Gramedia', 1982, '978-979-22-0283-2', 7),
('Kamus Besar Bahasa Indonesia', 'Tim Penyusun KBBI', 'Balai Pustaka', 2016, '978-979-407-182-7', 8);

-- Book Items (Physical copies)
INSERT INTO item_buku (id_item, id_buku, kondisi, status) VALUES
-- Laskar Pelangi (3 copies)
('BK001-001', 1, 'Baik', 'Tersedia'),
('BK001-002', 1, 'Baik', 'Tersedia'),
('BK001-003', 1, 'Rusak', 'Perbaikan'),
-- Bumi Manusia (2 copies)
('BK002-001', 2, 'Baik', 'Tersedia'),
('BK002-002', 2, 'Baik', 'Tersedia'),
-- Sang Pemimpi (2 copies)
('BK003-001', 3, 'Baik', 'Tersedia'),
('BK003-002', 3, 'Baik', 'Tersedia'),
-- Sapiens (2 copies)
('BK004-001', 4, 'Baik', 'Tersedia'),
('BK004-002', 4, 'Baik', 'Tersedia'),
-- Atomic Habits (3 copies)
('BK005-001', 5, 'Baik', 'Tersedia'),
('BK005-002', 5, 'Baik', 'Tersedia'),
('BK005-003', 5, 'Baik', 'Tersedia'),
-- Clean Code (2 copies)
('BK006-001', 6, 'Baik', 'Tersedia'),
('BK006-002', 6, 'Baik', 'Tersedia'),
-- The Pragmatic Programmer (1 copy)
('BK007-001', 7, 'Baik', 'Tersedia'),
-- Sejarah Indonesia Modern (1 copy)
('BK008-001', 8, 'Baik', 'Tersedia'),
-- Rich Dad Poor Dad (2 copies)
('BK009-001', 9, 'Baik', 'Tersedia'),
('BK009-002', 9, 'Baik', 'Tersedia'),
-- Psikologi Pendidikan (1 copy)
('BK010-001', 10, 'Baik', 'Tersedia'),
-- Ronggeng Dukuh Paruk (2 copies)
('BK011-001', 11, 'Baik', 'Tersedia'),
('BK011-002', 11, 'Rusak', 'Perbaikan'),
-- KBBI (1 copy - Reference)
('BK012-001', 12, 'Baik', 'Tersedia');

-- Members
INSERT INTO anggota (nomor_identitas, nama_lengkap, no_telepon, alamat) VALUES
('MHS001', 'Ahmad Fauzi', '081234567890', 'Jl. Merdeka No. 10, Jakarta'),
('MHS002', 'Siti Nurhaliza', '081234567891', 'Jl. Sudirman No. 25, Bandung'),
('MHS003', 'Budi Santoso', '081234567892', 'Jl. Gatot Subroto No. 45, Surabaya'),
('MHS004', 'Dewi Lestari', '081234567893', 'Jl. Diponegoro No. 12, Yogyakarta'),
('MHS005', 'Rizky Pratama', '081234567894', 'Jl. Pahlawan No. 8, Semarang'),
('MHS006', 'Anisa Rahma', '081234567895', 'Jl. Ahmad Yani No. 30, Malang'),
('MHS007', 'Doni Kusuma', '081234567896', 'Jl. Veteran No. 15, Medan'),
('MHS008', 'Maya Sari', '081234567897', 'Jl. Pemuda No. 20, Makassar');

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX idx_buku_judul ON buku(judul);
CREATE INDEX idx_buku_kategori ON buku(id_kategori);
CREATE INDEX idx_item_status ON item_buku(status);
CREATE INDEX idx_anggota_nomor ON anggota(nomor_identitas);
CREATE INDEX idx_peminjaman_anggota ON peminjaman(id_anggota);
CREATE INDEX idx_detail_status ON detail_peminjaman(status_kembali);

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Database setup complete!' AS message;
SELECT 'Categories:' AS info, COUNT(*) AS total FROM kategori;
SELECT 'Books:' AS info, COUNT(*) AS total FROM buku;
SELECT 'Book Items:' AS info, COUNT(*) AS total FROM item_buku;
SELECT 'Members:' AS info, COUNT(*) AS total FROM anggota;
