# Poestaka - Library Management System

<div align="center">
  <h3>📚 Sistem Manajemen Perpustakaan Modern</h3>
  <p>Built with Next.js 16, TypeScript, Tailwind CSS, and MySQL</p>
</div>

---

## ✨ Features

- **📊 Dashboard** - Overview of library statistics (books, items, active loans, members)
- **📖 Book Management** - Browse book catalog with search and category filtering
- **📦 Stock Tracking** - View and manage physical book items (exemplars) with status badges
- **👥 Member Management** - Register and manage library members
- **🔄 Circulation** - Process book borrowing and returns with barcode scanning support
- **📜 History** - Complete transaction history with fine tracking
- **⚙️ Settings** - System configuration and info

## 🎨 Design System

| Element | Style |
|---------|-------|
| **Background** | `#FFFFFF` (White) & `#F9FAFB` (Gray-50) |
| **Text** | `#111827` (Gray-900) headings, `#4B5563` (Gray-600) body |
| **Primary Accent** | `#1A73E8` (Google Blue) |
| **Borders** | `#E5E7EB` (Gray-200) |
| **Radius** | `rounded-md` (Medium) |
| **Shadows** | `shadow-sm` (Subtle) |
| **Layout** | Fixed dark sidebar + scrollable main content |

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Database:** MySQL with `mysql2/promise`
- **UI Components:** Radix UI Primitives
- **Architecture:** Server Components + Server Actions

## 📁 Project Structure

```
poestaka-library-system/
├── app/
│   ├── actions/          # Server Actions
│   │   ├── books.ts      # Book CRUD operations
│   │   ├── circulation.ts # Loan/Return with transactions
│   │   ├── dashboard.ts  # Dashboard statistics
│   │   └── members.ts    # Member management
│   ├── books/            # Book catalog page
│   ├── circulation/      # Borrow/Return page
│   ├── history/          # Transaction history
│   ├── members/          # Member management
│   ├── settings/         # System settings
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with sidebar
│   └── page.tsx          # Dashboard
├── components/
│   ├── layout/           # Layout components
│   │   ├── sidebar.tsx   # Navigation sidebar
│   │   └── page-header.tsx
│   └── ui/               # UI components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── table.tsx
│       └── tabs.tsx
├── database/
│   └── setup.sql         # Database setup script
├── lib/
│   ├── db.ts             # MySQL connection pool
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Utility functions
└── .env.local            # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Run the SQL script to create the database and populate sample data:

```bash
mysql -u root -p < database/setup.sql
```

Or execute `database/setup.sql` in your MySQL client (phpMyAdmin, MySQL Workbench, etc.).

### 3. Configure Environment

Edit `.env.local` with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=poestaka
FINE_PER_DAY=2000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

```sql
-- Categories
kategori (id_kategori, nama_kategori, rak_lokasi)

-- Books
buku (id_buku, judul, penulis, penerbit, tahun_terbit, isbn, id_kategori)

-- Physical book items
item_buku (id_item, id_buku, kondisi, status)
  -- kondisi: 'Baik', 'Rusak', 'Hilang'
  -- status: 'Tersedia', 'Dipinjam', 'Perbaikan', 'Hilang'

-- Members
anggota (id_anggota, nomor_identitas, nama_lengkap, no_telepon, alamat, tanggal_daftar)

-- Loans
peminjaman (no_peminjaman, id_anggota, id_petugas, tanggal_pinjam, batas_kembali)

-- Loan details
detail_peminjaman (id_detail, no_peminjaman, id_item, tanggal_kembali_aktual, denda, status_kembali)
  -- status_kembali: 'Pinjam', 'Kembali', 'Hilang'
```

## 🔑 Key Features

### Circulation System
- **Borrowing:** Search member by ID → Scan multiple item barcodes → Confirm loan
- **Returning:** Scan item barcode → Auto-calculate late fees → Confirm return
- **Late Fee:** Rp 2,000 per day (configurable)
- **Loan Duration:** 14 days default

### Status Badges
| Status | Color |
|--------|-------|
| Tersedia | 🟢 Green |
| Dipinjam | 🔵 Blue |
| Rusak/Hilang | 🔴 Red |
| Perbaikan | 🟡 Yellow |

## 📝 API-less Architecture

This application uses **Server Actions** for all mutations:
- No API routes needed
- Direct database access from server components
- Type-safe end-to-end with TypeScript
- Automatic form handling with Next.js

## 📄 License

MIT License - Built for educational purposes.

---

<div align="center">
  <p>Made with ❤️ for UAS Pengolahan Basis Data</p>
</div>
