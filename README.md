# Poestaka

Poestaka adalah aplikasi sistem perpustakaan berbasis web yang dibangun untuk mengelola data buku, eksemplar buku, anggota, serta transaksi peminjaman dan pengembalian.
Project ini dikembangkan sebagai bagian dari tugas Ujian Akhir Semester mata kuliah **Pengolahan Basis Data (DT192)**.

Aplikasi ini menerapkan konsep pemodelan basis data relasional menggunakan ERD, normalisasi, serta implementasi query SQL untuk mendukung proses CRUD dan penyajian informasi.

---

## Fitur Utama

* Manajemen data buku dan eksemplar buku
* Manajemen data anggota
* Transaksi peminjaman dan pengembalian buku
* Pengecekan ketersediaan buku berdasarkan eksemplar
* Operasi CRUD pada seluruh data
* Query SQL sederhana hingga lanjutan (JOIN, agregasi, fungsi kondisi)

---

## Tech Stack

* **Frontend**: Next.js
* **Backend**: Next.js API Routes
* **Database**: MySQL
* **DBMS Tools**: phpMyAdmin / MySQL Workbench
* **Version Control**: Git & GitHub

---

## Desain Database

* Menggunakan pendekatan **Entity Relationship Diagram (ERD)**
* Menerapkan relasi antar entitas seperti Buku, Eksemplar_Buku, Anggota, dan Peminjaman
* Struktur tabel disusun berdasarkan prinsip **normalisasi** untuk menghindari redundansi data

---

## Prasyarat

Pastikan perangkat sudah terpasang:

* Node.js (disarankan versi LTS)
* MySQL
* Git

---

## Cara Instalasi

1. Clone repository

   ```bash
   git clone https://github.com/username/poestaka-db.git
   ```

2. Masuk ke direktori project

   ```bash
   cd poestaka-db
   ```

3. Install dependency

   ```bash
   npm install
   ```

4. Konfigurasi database

   * Buat database MySQL baru
   * Import file SQL (jika tersedia) atau jalankan query pembuatan tabel
   * Sesuaikan konfigurasi koneksi database pada file environment (`.env.local`)

   Contoh:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=poestaka
   ```

5. Jalankan aplikasi

   ```bash
   npm run dev
   ```

6. Akses aplikasi melalui browser

   ```
   http://localhost:3000
   ```

---

## Penggunaan Aplikasi

* Admin dapat mengelola data buku, eksemplar, dan anggota
* Sistem akan mencatat transaksi peminjaman dan pengembalian
* Data ditampilkan dalam bentuk tabel sebagai hasil eksekusi query database

---

## Tujuan Pengembangan

* Menerapkan konsep pengolahan basis data secara nyata
* Membuktikan pemahaman terhadap pemodelan konseptual dan fisik basis data
* Mengimplementasikan query SQL sederhana dan lanjutan
* Mengintegrasikan database dengan aplikasi berbasis web

---

## Kontributor

* Zaeni Ahmad (me)
* XXXX
* XXXX
* XXXX

Program Studi D3 Teknik Informatika
Universitas AMIKOM Yogyakarta

---

## Lisensi

Project ini dibuat untuk keperluan akademik dan pembelajaran, feel free to use and copy this project.
