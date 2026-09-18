# Technical Steering

## Status
`DECIDED — Stack final ditetapkan per master implementation prompt`

## Stack Final
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + App Router
- **Backend**: NestJS + TypeScript
- **ORM**: Prisma
- **Database**: MySQL/MariaDB lokal via XAMPP
- **Storage**: Local filesystem

## Architecture
```text
Browser
   ↓
Next.js App Router (SSR-first)
   ↓ server-to-server
NestJS (REST API)
   ↓
Prisma ORM
   ↓
MySQL/MariaDB (XAMPP)
```

## Decision Log
- R1 (arsitektur): **DECIDED** — Browser → Next.js → NestJS (server-to-server). Browser tidak memanggil NestJS langsung.
- R2 (framework): **DECIDED** — Node.js + NestJS digunakan sesuai master implementation prompt.

## Compliance
Fullstack: SSR-first, tanpa API eksternal, database dikelola sendiri.

- NestJS tidak diakses browser langsung.
- Next.js Server Components sebagai default.
- Client Components hanya bila diperlukan.

## Rendering
SSR-first, Server Components sebagai default.

## Database
Self-managed local database (XAMPP MySQL/MariaDB).

## Storage
Local filesystem untuk foto member/space.
```text
backend/uploads/members/
backend/uploads/spaces/
backend/uploads/general/
```

## Security
- Password hashing (bcrypt).
- Input validation (class-validator).
- Role authorization (JWT + Guards).
- Secret server-only.

## API
50 endpoint Bagian III = reference untuk Fullstack, bukan otomatis implementation contract.
Semua 50 endpoint yang relevan untuk fitur M1–M7 dan A1–A9 diimplementasikan.

## Dependency
Jangan install dependency tanpa alasan yang jelas.
