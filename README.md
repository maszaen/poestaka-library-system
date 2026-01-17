# Poestaka - Library Management System

<div align="center">
  <h3>📚 Sistem Manajemen Perpustakaan Modern</h3>
  <p>Built with Next.js 15, TypeScript, Tailwind CSS v4, and MySQL</p>
</div>

---

## ✨ Features

- **📊 Dashboard** - Statistik perpustakaan (buku, peminjaman aktif, telat, total denda)
- **📖 Koleksi Buku** - Katalog buku dengan pencarian dan filter kategori (server-side)
- **📦 Stok Item** - Kelola eksemplar fisik buku dengan status tracking
- **👥 Anggota** - CRUD data anggota perpustakaan
- **🔄 Sirkulasi** - Proses peminjaman dan pengembalian buku
- **📜 Riwayat** - Histori transaksi lengkap dengan tracking denda
- **⚙️ Pengaturan** - Konfigurasi sistem dan manajemen data (reset/seed)

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Database | MySQL 8.0 + mysql2/promise |
| UI Components | Radix UI (Dialog, Tabs) |
| Architecture | Server Components + Server Actions |
| Containerization | Docker + Docker Compose |

## 📁 Project Structure

```
poestaka-library-system/
├── app/
│   ├── actions/              # Server Actions
│   │   ├── books.ts          # CRUD buku + filter
│   │   ├── circulation.ts    # Peminjaman/Pengembalian
│   │   ├── dashboard.ts      # Statistik dashboard
│   │   ├── members.ts        # CRUD anggota
│   │   └── settings.ts       # Reset/Seed database
│   ├── books/                # Halaman koleksi buku
│   ├── circulation/          # Halaman sirkulasi
│   ├── history/              # Halaman riwayat
│   ├── members/              # Halaman anggota
│   ├── settings/             # Halaman pengaturan
│   ├── layout.tsx            # Root layout + sidebar
│   └── page.tsx              # Dashboard
├── components/
│   ├── layout/               # Sidebar, PageHeader
│   ├── ui/                   # Button, Card, Dialog, Table, Tabs, etc.
│   ├── member-search-dropdown.tsx
│   ├── item-search-dropdown.tsx
│   └── category-search-dropdown.tsx
├── lib/
│   ├── db.ts                 # MySQL connection pool
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Utility functions
│   └── seed-data.ts          # SQL queries untuk seeding
├── database/
│   └── setup.sql             # Database schema + sample data
└── .env.local                # Environment variables
```

## 🚀 Getting Started

### 🐳 Option 1: Docker (Recommended)

Cara paling mudah untuk menjalankan aplikasi ini adalah menggunakan Docker.

#### Quick Start (Tanpa Clone Repo)

```bash
# Buat folder dan masuk
mkdir poestaka && cd poestaka

# Download file yang diperlukan
curl -O https://raw.githubusercontent.com/maszaen/poestaka-library-system/main/docker-compose.public.yml
mkdir database
curl -o database/setup.sql https://raw.githubusercontent.com/maszaen/poestaka-library-system/main/database/setup.sql

# Jalankan
docker compose -f docker-compose.public.yml up -d
```

Buka [http://localhost:3000](http://localhost:3000)

#### Dengan Clone Repo

```bash
git clone https://github.com/maszaen/poestaka-library-system.git
cd poestaka-library-system
docker compose up -d
```

#### Docker Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# Reset database (hapus semua data, seed ulang)
docker compose down -v && docker compose up -d

# Lihat logs
docker compose logs -f
```

#### Docker Hub Image

```bash
docker pull exqeon/poestaka:latest
```

---

### 💻 Option 2: Manual Setup

#### Prerequisites

- Node.js 20+
- MySQL 8.0+
- npm

#### 1. Clone & Install

```bash
git clone https://github.com/maszaen/poestaka-library-system.git
cd poestaka-library-system
npm install
```

#### 2. Setup Database

Buat database dan jalankan script setup:

```bash
mysql -u root -p -e "CREATE DATABASE poestaka_db"
mysql -u root -p poestaka_db < database/setup.sql
```

#### 3. Configure Environment

Buat file `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=poestaka_db
FINE_PER_DAY=2000
```

#### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  kategori   │────<│    buku     │────<│  item_buku  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│   anggota   │────<│ peminjaman  │────<│ detail_peminjaman   │
└─────────────┘     └─────────────┘     └─────────────────────┘
```

### Tables

| Table | Description |
|-------|-------------|
| `kategori` | Kategori buku (id, nama, lokasi_rak) |
| `buku` | Data buku (judul, penulis, penerbit, tahun, isbn) |
| `item_buku` | Eksemplar fisik (barcode, kondisi, status) |
| `anggota` | Data anggota (NIM: 24.01.XXXX, nama, telepon, alamat) |
| `peminjaman` | Header transaksi (no_peminjaman, tanggal) |
| `detail_peminjaman` | Detail item dipinjam (status, denda) |

## 🔑 Key Features

### Sistem Sirkulasi
- **Peminjaman:** Cari anggota → Scan/pilih item → Konfirmasi
- **Pengembalian:** Scan item → Hitung denda otomatis → Konfirmasi
- **Denda:** Rp 2.000/hari keterlambatan (via SQL DATEDIFF)
- **Durasi:** 14 hari

### Data Management
- **Reset Database:** Hapus semua data
- **Seed Simulation:** Isi data contoh (25 anggota, 20 buku, 46 item, 12 transaksi)

### Status Badges

| Status | Color |
|--------|-------|
| Tersedia | 🟢 Green |
| Dipinjam | 🔵 Blue |
| Rusak/Hilang | 🔴 Red |
| Perbaikan | 🟡 Yellow |

## 📝 Architecture

Aplikasi menggunakan **Server Actions** untuk semua operasi database:
- Tidak ada API routes
- Direct database access dari server components
- Type-safe end-to-end dengan TypeScript
- Kalkulasi denda menggunakan SQL (DATEDIFF, CASE WHEN)

## 📄 License

MIT License - Built for educational purposes.

---

<div align="center">
  <p>Made with ❤️ for UAS Pengolahan Basis Data</p>
</div>
