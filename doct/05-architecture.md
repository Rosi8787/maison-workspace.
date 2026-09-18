# 05 — Architecture

## Status

`PROPOSED — NEEDS OFFICIAL CLARIFICATION`

```text
Browser
   ↓
Next.js App Router
   ↓ server-to-server
NestJS
   ↓
Prisma
   ↓
Local Database
```

## Frontend

- Next.js App Router.
- SSR-first.
- Server Components sebagai default.
- Client Components hanya bila diperlukan.

## Backend

NestJS modules:

```text
auth
member
admin-profile
space
discount
reservation
upload
report
```

## Database

Self-managed local database.

PostgreSQL/MySQL lokal masih merupakan pilihan implementasi, bukan keputusan eksplisit PDF.

## Storage

```text
public/uploads/members/
public/uploads/spaces/
public/uploads/general/
```

Gunakan local filesystem sebagai rekomendasi.

## Security

- password hashing;
- validation;
- role authorization;
- server secrets tidak boleh masuk client;
- upload validation.

## External API

Tidak memanggil API panitia atau layanan bisnis eksternal.

## Architecture Gate

R1 dan R2 harus diputuskan sebelum arsitektur dianggap final.
