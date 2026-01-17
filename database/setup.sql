-- Poestaka Library Management System
-- Complete Database Setup & Seeding Script
-- This script creates tables if not exist, clears data, then seeds simulation data

-- ============================================
-- 1. TABLE CREATION (IF NOT EXISTS)
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Kategori
CREATE TABLE IF NOT EXISTS kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    rak_lokasi VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Buku
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

-- Item Buku
CREATE TABLE IF NOT EXISTS item_buku (
    id_item VARCHAR(20) PRIMARY KEY,
    id_buku INT,
    kondisi ENUM('Baik', 'Rusak', 'Hilang') DEFAULT 'Baik',
    status ENUM('Tersedia', 'Dipinjam', 'Perbaikan', 'Hilang') DEFAULT 'Tersedia',
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Anggota
CREATE TABLE IF NOT EXISTS anggota (
    id_anggota INT AUTO_INCREMENT PRIMARY KEY,
    nomor_identitas VARCHAR(20) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    no_telepon VARCHAR(15),
    alamat TEXT,
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Peminjaman
CREATE TABLE IF NOT EXISTS peminjaman (
    no_peminjaman VARCHAR(20) PRIMARY KEY,
    id_anggota INT,
    id_petugas INT,
    tanggal_pinjam DATE NOT NULL,
    batas_kembali DATE NOT NULL,
    FOREIGN KEY (id_anggota) REFERENCES anggota(id_anggota) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Detail Peminjaman
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
-- 2. CLEAR EXISTING DATA
-- ============================================

DELETE FROM detail_peminjaman;
DELETE FROM peminjaman;
DELETE FROM item_buku;
DELETE FROM buku;
DELETE FROM anggota;
DELETE FROM kategori;

-- Reset Auto Increment
ALTER TABLE kategori AUTO_INCREMENT = 1;
ALTER TABLE buku AUTO_INCREMENT = 1;
ALTER TABLE anggota AUTO_INCREMENT = 1;
ALTER TABLE detail_peminjaman AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 3. SEEDING DATA
-- ============================================

-- A. Categories (10)
INSERT INTO kategori (id_kategori, nama_kategori, rak_lokasi) VALUES
(1, 'Teknologi & Komputer', 'A-01'),
(2, 'Novel & Fiksi', 'B-01'),
(3, 'Sains & Alam', 'C-01'),
(4, 'Psikologi', 'D-01'),
(5, 'Bisnis & Ekonomi', 'E-01'),
(6, 'Sejarah', 'F-01'),
(7, 'Filsafat', 'G-01'),
(8, 'Seni & Desain', 'H-01'),
(9, 'Biografi', 'I-01'),
(10, 'Pendidikan', 'J-01');

-- B. Books (20 Top Titles)
INSERT INTO buku (id_buku, judul, penulis, penerbit, tahun_terbit, isbn, id_kategori) VALUES
(1, 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '978-0132350884', 1),
(2, 'The Pragmatic Programmer', 'Andrew Hunt', 'Addison-Wesley', 1999, '978-0201616224', 1),
(3, 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '978-9791227002', 2),
(4, 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, '978-9799731232', 2),
(5, 'Sapiens: Riwayat Singkat Umat Manusia', 'Yuval Noah Harari', 'KPG', 2011, '978-6024246945', 3),
(6, 'Atomic Habits', 'James Clear', 'Avery', 2018, '978-0735211292', 4),
(7, 'Psychology of Money', 'Morgan Housel', 'Harriman House', 2020, '978-0857197689', 5),
(8, 'Filosofi Teras', 'Henry Manampiring', 'Kompas', 2018, '978-6024125189', 7),
(9, 'Rich Dad Poor Dad', 'Robert Kiyosaki', 'Plata Publishing', 1997, '978-1612680194', 5),
(10, 'Dunia Sophie', 'Jostein Gaarder', 'Mizan', 1991, '978-6024410209', 7),
(11, 'Laut Bercerita', 'Leila S. Chudori', 'KPG', 2017, '978-6024246945', 2),
(12, 'Cantik Itu Luka', 'Eka Kurniawan', 'Gramedia', 2002, '978-6020312583', 2),
(13, 'Guns, Germs, and Steel', 'Jared Diamond', 'Norton', 1997, '978-0393317558', 6),
(14, 'Design of Everyday Things', 'Don Norman', 'Basic Books', 1988, '978-0465050659', 8),
(15, 'Steve Jobs', 'Walter Isaacson', 'Simon & Schuster', 2011, '978-1451648539', 9),
(16, 'Sebuah Seni untuk Bersikap Bodo Amat', 'Mark Manson', 'Grasindo', 2016, '978-6023758364', 4),
(17, 'Thinking, Fast and Slow', 'Daniel Kahneman', 'Farrar, Straus and Giroux', 2011, '978-0374275631', 4),
(18, 'Eloquent JavaScript', 'Marijn Haverbeke', 'No Starch Press', 2018, '978-1593279509', 1),
(19, 'Harry Potter and the Sorcerers Stone', 'J.K. Rowling', 'Bloomsbury', 1997, '978-0747532743', 2),
(20, 'Introduction to Algorithms', 'Thomas H. Cormen', 'MIT Press', 2009, '978-0262033848', 1);

-- C. Items (Book Copies)
INSERT INTO item_buku (id_item, id_buku, kondisi, status) VALUES
('B001-01', 1, 'Baik', 'Tersedia'), ('B001-02', 1, 'Baik', 'Dipinjam'), ('B001-03', 1, 'Rusak', 'Perbaikan'),
('B002-01', 2, 'Baik', 'Tersedia'), ('B002-02', 2, 'Baik', 'Tersedia'),
('B003-01', 3, 'Baik', 'Dipinjam'), ('B003-02', 3, 'Baik', 'Dipinjam'), ('B003-03', 3, 'Baik', 'Dipinjam'), ('B003-04', 3, 'Baik', 'Tersedia'),
('B004-01', 4, 'Baik', 'Tersedia'), ('B004-02', 4, 'Baik', 'Tersedia'),
('B005-01', 5, 'Baik', 'Dipinjam'), ('B005-02', 5, 'Baik', 'Tersedia'), ('B005-03', 5, 'Baik', 'Tersedia'),
('B006-01', 6, 'Baik', 'Dipinjam'), ('B006-02', 6, 'Baik', 'Dipinjam'), ('B006-03', 6, 'Baik', 'Tersedia'),
('B007-01', 7, 'Baik', 'Tersedia'), ('B007-02', 7, 'Baik', 'Tersedia'),
('B008-01', 8, 'Baik', 'Tersedia'), ('B008-02', 8, 'Baik', 'Tersedia'),
('B009-01', 9, 'Baik', 'Tersedia'), ('B009-02', 9, 'Baik', 'Tersedia'),
('B010-01', 10, 'Baik', 'Tersedia'), ('B010-02', 10, 'Baik', 'Tersedia'),
('B011-01', 11, 'Baik', 'Dipinjam'), ('B011-02', 11, 'Baik', 'Tersedia'),
('B012-01', 12, 'Baik', 'Tersedia'), ('B012-02', 12, 'Baik', 'Tersedia'),
('B013-01', 13, 'Baik', 'Tersedia'), ('B013-02', 13, 'Baik', 'Tersedia'),
('B014-01', 14, 'Baik', 'Tersedia'), ('B014-02', 14, 'Baik', 'Tersedia'),
('B015-01', 15, 'Baik', 'Tersedia'), ('B015-02', 15, 'Baik', 'Tersedia'),
('B016-01', 16, 'Baik', 'Dipinjam'), ('B016-02', 16, 'Baik', 'Tersedia'),
('B017-01', 17, 'Baik', 'Tersedia'), ('B017-02', 17, 'Baik', 'Tersedia'),
('B018-01', 18, 'Baik', 'Tersedia'), ('B018-02', 18, 'Baik', 'Tersedia'),
('B019-01', 19, 'Baik', 'Dipinjam'), ('B019-02', 19, 'Baik', 'Tersedia'),
('B020-01', 20, 'Baik', 'Tersedia'), ('B020-02', 20, 'Baik', 'Tersedia');

-- D. Members (25 Simulations - Format 24.01.XXXX)
INSERT INTO anggota (nomor_identitas, nama_lengkap, no_telepon, alamat) VALUES
('24.01.0001', 'Aditya Pratama', '081234560001', 'Jl. Sudirman No 1'),
('24.01.0002', 'Bella Safitri', '081234560002', 'Jl. Thamrin No 2'),
('24.01.0003', 'Chandra Wijaya', '081234560003', 'Jl. Gatot Subroto No 3'),
('24.01.0004', 'Dina Kusuma', '081234560004', 'Jl. Asia Afrika No 4'),
('24.01.0005', 'Eko Prasetyo', '081234560005', 'Jl. Merdeka No 5'),
('24.01.0006', 'Fani Rahmawati', '081234560006', 'Jl. Diponegoro No 6'),
('24.01.0007', 'Gilang Saputra', '081234560007', 'Jl. Imam Bonjol No 7'),
('24.01.0008', 'Hana Pertiwi', '081234560008', 'Jl. Kartini No 8'),
('24.01.0009', 'Indra Lesmana', '081234560009', 'Jl. Antasari No 9'),
('24.01.0010', 'Joko Susilo', '081234560010', 'Jl. Sudirman No 10'),
('24.01.0011', 'Kartika Sari', '081234560011', 'Jl. Thamrin No 11'),
('24.01.0012', 'Lukman Hakim', '081234560012', 'Jl. Gatot Subroto No 12'),
('24.01.0013', 'Maya Indah', '081234560013', 'Jl. Asia Afrika No 13'),
('24.01.0014', 'Nanda Putra', '081234560014', 'Jl. Merdeka No 14'),
('24.01.0015', 'Olivia Putri', '081234560015', 'Jl. Diponegoro No 15'),
('24.01.0016', 'Panji Gumilang', '081234560016', 'Jl. Imam Bonjol No 16'),
('24.01.0017', 'Qori Aulia', '081234560017', 'Jl. Kartini No 17'),
('24.01.0018', 'Rizky Febian', '081234560018', 'Jl. Antasari No 18'),
('24.01.0019', 'Siti Aminah', '081234560019', 'Jl. Sudirman No 19'),
('24.01.0020', 'Taufik Hidayat', '081234560020', 'Jl. Thamrin No 20'),
('24.01.0021', 'Umar Bakri', '081234560021', 'Jl. Gatot Subroto No 21'),
('24.01.0022', 'Vina Panduwinata', '081234560022', 'Jl. Asia Afrika No 22'),
('24.01.0023', 'Wahyu Setiawan', '081234560023', 'Jl. Merdeka No 23'),
('24.01.0024', 'Xena Warrior', '081234560024', 'Jl. Diponegoro No 24'),
('24.01.0025', 'Yusuf Mansur', '081234560025', 'Jl. Imam Bonjol No 25');

-- E. Transactions

-- Active Loans (10 peminjaman aktif dengan berbagai durasi)
INSERT INTO peminjaman (no_peminjaman, id_anggota, tanggal_pinjam, batas_kembali) VALUES
('P-20240117-001', 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('P-20240117-002', 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('P-20240110-001', 3, DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL 14 DAY)),
('P-20240110-002', 4, DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL 14 DAY)),
('P-20231228-001', 5, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 20 DAY), INTERVAL 14 DAY)),
('P-20231228-002', 6, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 20 DAY), INTERVAL 14 DAY)),
('P-20231218-001', 7, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 30 DAY), INTERVAL 14 DAY));

INSERT INTO detail_peminjaman (no_peminjaman, id_item, status_kembali) VALUES
('P-20240117-001', 'B001-02', 'Pinjam'),
('P-20240117-002', 'B003-01', 'Pinjam'),
('P-20240110-001', 'B003-02', 'Pinjam'),
('P-20240110-002', 'B005-01', 'Pinjam'),
('P-20231228-001', 'B006-01', 'Pinjam'),
('P-20231228-002', 'B006-02', 'Pinjam'),
('P-20231218-001', 'B011-01', 'Pinjam');

-- Historical Returns (sudah dikembalikan - untuk statistik)
INSERT INTO peminjaman (no_peminjaman, id_anggota, tanggal_pinjam, batas_kembali) VALUES
('P-20231101-001', 8, '2023-11-01', '2023-11-15'),
('P-20231105-001', 9, '2023-11-05', '2023-11-19'),
('P-20231201-001', 10, '2023-12-01', '2023-12-15'),
('P-20231210-001', 11, '2023-12-10', '2023-12-24'),
('P-20231220-001', 12, '2023-12-20', '2024-01-03');

INSERT INTO detail_peminjaman (no_peminjaman, id_item, status_kembali, tanggal_kembali_aktual, denda) VALUES
('P-20231101-001', 'B001-01', 'Kembali', '2023-11-10', 0),
('P-20231105-001', 'B002-01', 'Kembali', '2023-11-25', 6000),
('P-20231201-001', 'B004-01', 'Kembali', '2023-12-14', 0),
('P-20231210-001', 'B007-01', 'Kembali', '2023-12-30', 6000),
('P-20231220-001', 'B008-01', 'Kembali', '2024-01-05', 2000);
