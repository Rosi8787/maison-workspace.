<div align="center">

<img src="readme.png" alt="Maison Workspace Banner" width="100%" style="border-radius:12px;" />

<br /><br />

<h1>🏢 Maison Workspace</h1>

<p><strong>Smart Coworking Space Reservation System</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p>
  Platform reservasi coworking space fullstack modern — dari pencarian ruang, pemesanan real-time, manajemen diskon, hingga laporan pendapatan. Dibangun dengan arsitektur <strong>SSR-first</strong> tanpa dependensi layanan eksternal berbayar.
</p>

<br />

[**🚀 Live Demo**](#) &nbsp;·&nbsp; [**📖 Dokumentasi**](#dokumentasi) &nbsp;·&nbsp; [**🐛 Report Bug**](#) &nbsp;·&nbsp; [**✨ Request Feature**](#)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tech Stack](#-tech-stack)
- [Fitur](#-fitur)
- [Arsitektur](#-arsitektur)
- [Struktur Project](#-struktur-project)
- [Cara Menjalankan](#-cara-menjalankan)
- [API Endpoints](#-api-endpoints)
- [Akun Demo](#-akun-demo)
- [Database Schema](#-database-schema)

---

## 🏢 Tentang Proyek

**Maison Workspace** adalah sistem reservasi coworking space berbasis web fullstack yang memungkinkan:

- **Member** mencari, memesan, dan mengelola reservasi ruang kerja secara mandiri
- **Admin** mengelola seluruh operasional — dari data member, ruang, diskon, hingga laporan keuangan bulanan

Sistem ini dibangun sebagai proyek **UKK (Uji Kompetensi Keahlian)** dengan pendekatan fullstack modern menggunakan Next.js App Router sebagai frontend SSR dan NestJS sebagai REST API backend yang terhubung ke database PostgreSQL cloud via Supabase.

---

## 🛠 Tech Stack

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Teknologi</th>
      <th>Keterangan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>Next.js 14 · TypeScript · Tailwind CSS · App Router</td>
      <td>SSR-first, Server Components sebagai default</td>
    </tr>
    <tr>
      <td><strong>Backend</strong></td>
      <td>NestJS 10 · TypeScript · Passport JWT</td>
      <td>REST API, modular architecture</td>
    </tr>
    <tr>
      <td><strong>ORM</strong></td>
      <td>Prisma 5</td>
      <td>Type-safe database access, migration</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>PostgreSQL via Supabase</td>
      <td>Cloud-hosted, connection pooler</td>
    </tr>
    <tr>
      <td><strong>Storage</strong></td>
      <td>Supabase Storage</td>
      <td>CDN publik untuk foto member & space</td>
    </tr>
    <tr>
      <td><strong>Auth</strong></td>
      <td>JWT · bcrypt</td>
      <td>Role-based (MEMBER / ADMIN), sessionStorage</td>
    </tr>
  </tbody>
</table>

---

## ✨ Fitur

### 👤 Member

| Kode | Fitur | Deskripsi |
|------|-------|-----------|
| M1 | **Register** | Daftar akun dengan nama, instansi, telepon, alamat, username, password, foto profil |
| M2 | **Login** | Autentikasi dengan JWT, isolasi per-tab browser via sessionStorage |
| M3 | **Katalog Ruang** | Lihat daftar Personal Desk, Private Office, Meeting Room beserta foto, kapasitas, fasilitas, harga/jam |
| M3 | **Cek Ketersediaan** | Filter ruang tersedia berdasarkan tanggal, jam, dan durasi secara real-time |
| M4 | **Buat Reservasi** | Pesan ruang dengan pilihan tanggal, jam mulai, durasi, dan kode diskon opsional |
| M4 | **Kalkulasi Harga** | Harga otomatis dihitung: `total = harga/jam × durasi − diskon%` |
| M5 | **Status Reservasi** | Pantau status: Belum Dikonfirmasi → Disetujui → Aktif → Selesai / Dibatalkan |
| M5 | **Batalkan Reservasi** | Pembatalan diizinkan saat status `belum_dikonfirm` atau `disetujui` |
| M6 | **Histori** | Riwayat reservasi difilter per bulan |
| M7 | **E-Ticket** | Tiket digital dengan kode reservasi unik dan QR Code untuk check-in |

### 🔧 Admin

| Kode | Fitur | Deskripsi |
|------|-------|-----------|
| A1 | **Register Admin** | Daftar akun pengelola dengan data coworking space |
| A2 | **Login** | Autentikasi admin dengan redirect ke dashboard |
| A3 | **Profil Coworking** | Update nama space, pemilik, alamat, telepon, deskripsi, foto |
| A4 | **CRUD Member** | Tambah, lihat, edit, hapus data member beserta akun login |
| A5 | **CRUD Space** | Kelola ruang — tipe, kapasitas, harga/jam, deskripsi, foto |
| A6 | **CRUD Diskon** | Buat promo dengan kode, persentase, dan periode berlaku |
| A7 | **Manajemen Reservasi** | Konfirmasi, ubah status, check-in, check-out reservasi |
| A8 | **Filter Reservasi** | Saring reservasi berdasarkan status dan bulan |
| A9 | **Laporan Bulanan** | Rekap jumlah & pendapatan reservasi per bulan |
| A9 | **Laporan Pendapatan** | Grafik pendapatan tahunan + distribusi per tipe ruang |

### 🔒 Keamanan

- ✅ Password di-hash dengan **bcrypt** (salt rounds: 10)
- ✅ JWT token expires in 7 hari
- ✅ **sessionStorage** — token terisolasi per tab browser (admin & member bisa login bersamaan di tab berbeda)
- ✅ Role-based guard (`MEMBER` / `ADMIN`) di semua endpoint sensitif
- ✅ Input validation via `class-validator` DTO
- ✅ File upload: validasi MIME type + ukuran maks 5MB
- ✅ CORS dikonfigurasi hanya untuk origin frontend

---

## 🏗 Arsitektur

```
Browser (Tab Admin)          Browser (Tab Member)
       │                            │
       │ sessionStorage (isolated)  │ sessionStorage (isolated)
       ▼                            ▼
┌─────────────────────────────────────────┐
│           Next.js 14 (SSR)              │
│   App Router · Server + Client Comp     │
│   http://localhost:3000                 │
└──────────────┬──────────────────────────┘
               │ HTTP / REST (server-to-server)
               ▼
┌─────────────────────────────────────────┐
│           NestJS REST API               │
│   Modules: auth · spaces · reservasi    │
│   diskon · admin · upload · reports     │
│   http://localhost:3001/api             │
└──────┬─────────────────┬────────────────┘
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────────────┐
│   Prisma 5  │   │   Supabase Storage   │
│  (ORM)      │   │  Bucket: spaces      │
└──────┬──────┘   │  Bucket: members     │
       │          │  Bucket: general     │
       ▼          └──────────────────────┘
┌─────────────────────────────────────────┐
│     PostgreSQL (Supabase Cloud)         │
│  7 tables · Enum types · Relations      │
└─────────────────────────────────────────┘
```

---

## 📁 Struktur Project

```
Maison-Workspace/
│
├── 📂 backend/                    # NestJS API
│   ├── 📂 src/
│   │   ├── 📂 auth/               # JWT auth, register, login
│   │   ├── 📂 admin/              # Admin profile + orchestration
│   │   ├── 📂 members/            # CRUD member
│   │   ├── 📂 spaces/             # Katalog + availability
│   │   ├── 📂 diskon/             # Promo & kode diskon
│   │   ├── 📂 reservasi/          # Booking logic + e-ticket + QR
│   │   ├── 📂 reports/            # Laporan bulanan & income
│   │   ├── 📂 upload/             # Supabase Storage service
│   │   └── 📂 prisma/             # PrismaService (global)
│   ├── 📂 prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Data awal
│   └── .env                       # Environment variables
│
├── 📂 frontend/                   # Next.js 14 App Router
│   ├── 📂 app/
│   │   ├── 📂 (member)/           # Route group member
│   │   │   ├── spaces/            # Katalog & detail ruang
│   │   │   ├── reservation/       # Buat & detail reservasi
│   │   │   ├── history/           # Histori per bulan
│   │   │   └── profile/           # Profil member
│   │   ├── 📂 (admin)/            # Route group admin
│   │   │   └── admin/
│   │   │       ├── dashboard/     # Statistik ringkasan
│   │   │       ├── profile/       # Edit profil coworking
│   │   │       ├── members/       # CRUD member
│   │   │       ├── spaces/        # CRUD space
│   │   │       ├── diskon/        # CRUD diskon
│   │   │       ├── reservasi/     # Kelola reservasi
│   │   │       └── reports/       # Laporan
│   │   ├── login/                 # Halaman login
│   │   └── register/              # Halaman register (member & admin)
│   ├── 📂 components/
│   │   ├── ui/                    # LoadingSpinner, Alert, Modal, Badge
│   │   ├── member/                # MemberNav
│   │   ├── admin/                 # AdminSidebar
│   │   ├── dashboard/             # DashboardHeader, BookingPanel
│   │   └── landing/               # Hero, Navbar (landing page)
│   ├── 📂 lib/
│   │   ├── api.ts                 # Axios instance + semua API calls
│   │   └── auth.ts                # Token, formatter, getImageUrl()
│   └── 📂 types/
│       └── index.ts               # TypeScript types & interfaces
│
└── 📂 doct/                       # Dokumentasi teknis proyek
    ├── 01-requirements.md
    ├── 03-database-erd.md
    ├── 04-api-contract-reference.md
    └── ...
```

---

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js **v18+**
- npm **v9+**
- Akun [Supabase](https://supabase.com) (gratis)

### 1. Clone Repository

```bash
git clone https://github.com/username/maison-workspace.git
cd maison-workspace
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
```

Isi `.env`:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
JWT_SECRET="ganti-dengan-secret-kuat"
JWT_EXPIRES_IN="7d"
PORT=3001
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
MAX_FILE_SIZE=5242880
```

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed data awal (admin + member demo + spaces + diskon)
npx ts-node prisma/seed.ts

# Jalankan backend
npm run start:dev
```

> Backend berjalan di **http://localhost:3001**

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Buat file .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > .env.local

# Jalankan frontend
npm run dev
```

> Frontend berjalan di **http://localhost:3000**

### 4. Buat Storage Bucket (Supabase)

Bucket dibuat otomatis oleh script berikut (jalankan sekali):

```bash
cd backend
node -e "
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
['general','spaces','members'].forEach(async b => {
  await sb.storage.createBucket(b, { public: true, fileSizeLimit: 5242880 });
  console.log('Bucket created:', b);
});
"
```

---

## 📡 API Endpoints

> Base URL: `http://localhost:3001/api`  
> 🔓 Public — tidak perlu token  
> 🔐 Auth — perlu `Authorization: Bearer <token>`  
> 👑 Admin — perlu token dengan role `ADMIN`

### Authentication

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/auth/register/member` | 🔓 | Daftar akun member baru |
| `POST` | `/auth/register/admin-space` | 🔓 | Daftar akun admin coworking |
| `POST` | `/auth/login` | 🔓 | Login, return JWT token |
| `GET` | `/auth/profile` | 🔐 | Profil user yang sedang login |

### Spaces

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/spaces/types` | 🔓 | Daftar tipe ruang yang tersedia |
| `GET` | `/spaces/availability` | 🔓 | Cek ketersediaan ruang (`?tanggal=&jam_mulai=&durasi=`) |
| `GET` | `/spaces` | 🔓 | Semua ruang + info owner |
| `GET` | `/spaces/:id` | 🔓 | Detail satu ruang |

### Diskon

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/diskon/active` | 🔓 | Semua diskon yang aktif hari ini |
| `POST` | `/diskon/check` | 🔓 | Validasi kode diskon (`{ kode_diskon }`) |
| `GET` | `/diskon/:id` | 🔓 | Detail satu diskon |

### Reservasi (Member)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/reservasi` | 🔐 | Buat reservasi baru, validasi bentrok otomatis |
| `GET` | `/reservasi/my` | 🔐 | Reservasi aktif milik member login |
| `GET` | `/reservasi/my/history` | 🔐 | Histori reservasi (`?bulan=YYYY-MM`) |
| `GET` | `/reservasi/:id/e-ticket` | 🔐 | E-ticket + QR Code dalam base64 |
| `GET` | `/reservasi/:id` | 🔐 | Detail reservasi |
| `PATCH` | `/reservasi/:id/cancel` | 🔐 | Batalkan reservasi |

### Admin — Profil

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/admin/profile` | 👑 | Profil coworking admin |
| `PUT` | `/admin/profile` | 👑 | Update profil coworking |

### Admin — Member

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/admin/members` | 👑 | Semua member |
| `POST` | `/admin/members` | 👑 | Tambah member baru |
| `GET` | `/admin/members/:id` | 👑 | Detail member |
| `PUT` | `/admin/members/:id` | 👑 | Update data member |
| `DELETE` | `/admin/members/:id` | 👑 | Hapus member |

### Admin — Space

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/admin/spaces` | 👑 | Semua space milik admin |
| `POST` | `/admin/spaces` | 👑 | Tambah space baru |
| `GET` | `/admin/spaces/:id` | 👑 | Detail space |
| `PUT` | `/admin/spaces/:id` | 👑 | Update space |
| `DELETE` | `/admin/spaces/:id` | 👑 | Hapus space |

### Admin — Diskon

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/admin/diskon` | 👑 | Semua diskon |
| `POST` | `/admin/diskon` | 👑 | Buat diskon baru |
| `GET` | `/admin/diskon/:id` | 👑 | Detail diskon |
| `PUT` | `/admin/diskon/:id` | 👑 | Update diskon |
| `DELETE` | `/admin/diskon/:id` | 👑 | Hapus diskon |

### Admin — Reservasi

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/admin/reservasi` | 👑 | Semua reservasi (`?status=&bulan=`) |
| `PATCH` | `/admin/reservasi/:id/status` | 👑 | Ubah status reservasi |
| `POST` | `/admin/reservasi/:id/check-in` | 👑 | Proses check-in |
| `POST` | `/admin/reservasi/:id/check-out` | 👑 | Proses check-out |

### Admin — Laporan

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/admin/reports/monthly` | 👑 | Laporan bulanan (`?bulan=&tahun=`) |
| `GET` | `/admin/reports/income` | 👑 | Rekap income tahunan (`?tahun=`) |

### Upload

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/upload/image` | 🔐 | Upload gambar umum → bucket `general` |
| `POST` | `/upload/spaces` | 🔐 | Upload foto space → bucket `spaces` |
| `POST` | `/upload/members` | 🔐 | Upload foto member → bucket `members` |

---

## 🗄 Database Schema

```
users ──────────── member
  │                  │
  └── space_owner    └── reservasi ─── detail_reservasi
        │                    │               │
        └── space ──────────►│               ├── space
                             │               └── diskon
                        reservasi
```

| Model | Fields Utama |
|-------|-------------|
| `users` | id, username, password, role (MEMBER/ADMIN) |
| `member` | id, nama_member, instansi, alamat, telp, foto, id_user |
| `space_owner` | id, nama_coworking, nama_pemilik, telp, alamat, deskripsi, foto, id_user |
| `space` | id, nama_space, tipe, kapasitas, harga_per_jam, deskripsi, foto, id_owner |
| `diskon` | id, nama_diskon, kode_diskon, persentase_diskon, tanggal_awal, tanggal_akhir |
| `reservasi` | id, kode_reservasi, tanggal_reservasi, jam_mulai, durasi_jam, status, id_member, id_owner |
| `detail_reservasi` | id, id_reservasi, id_space, id_diskon, total_harga |

**Status Reservasi Flow:**
```
belum_dikonfirm → disetujui → aktif → selesai
       └─────────────────────────────► dibatalkan
```

---

## 👤 Akun Demo

Setelah menjalankan `seed.ts`, akun berikut tersedia:

| Role | Username | Password | Keterangan |
|------|----------|----------|-----------|
| 🔧 Admin | `admin` | `admin123` | Pengelola Smart Coworking Space |
| 👤 Member | `member1` | `member123` | Member demo |

> ⚠️ **Ganti password default** setelah deployment ke production.

---

## 💡 Pricing Logic

```
total_harga_awal  = harga_per_jam × durasi_jam
potongan_diskon   = total_harga_awal × persentase_diskon / 100
total_bayar       = total_harga_awal - potongan_diskon
```

---

## 🌐 URL Ringkasan

| Service | URL |
|---------|-----|
| 🖥 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:3001/api |
| 🗄 Supabase Dashboard | https://supabase.com/dashboard |

---

<div align="center">

<br />

Made with ❤️ for **UKK 2026–2027**

<br />

<img src="https://img.shields.io/badge/Status-In_Development-yellow?style=flat-square" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
<img src="https://img.shields.io/badge/Node.js-v25-green?style=flat-square&logo=node.js" />

</div>
