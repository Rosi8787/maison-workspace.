# 00 — Compliance

## Fullstack Requirements

PDF menetapkan Fullstack sebagai web fullstack dengan server-side rendering, tanpa konsumsi API eksternal, database dibuat/dikelola sendiri, dan API panitia tidak diperlukan.

## R1 — Arsitektur

**Status: NEEDS OFFICIAL CLARIFICATION**

Apakah NestJS boleh berjalan sebagai service terpisah yang dipanggil Next.js secara server-to-server, atau logika harus menyatu dalam Next.js?

Mitigasi sementara:
- Browser → Next.js.
- Next.js server → NestJS.
- Browser tidak memanggil NestJS langsung.
- SSR-first.

## R2 — Framework

**Status: NEEDS OFFICIAL CLARIFICATION**

Tabel kategori utama menyebut minimal PHP/native PHP, sedangkan Lampiran A menyebut PHP, Node Express, atau framework lain dan daftar peralatan mengizinkan Node.js untuk Fullstack.

Jangan menyatakan Next.js + NestJS sudah pasti diperbolehkan.

## R3 — SSR

**Status: NEEDS REVIEW**

Gunakan Next.js App Router + Server Components sebagai default. Hindari SPA murni.

## Safe Rules

- Database lokal mandiri.
- File foto lokal.
- Password wajib di-hash.
- Input wajib divalidasi.
- API panitia tidak boleh dipanggil.
- Jangan menambah external service tanpa klarifikasi.

## ERD Gaps

A3 membutuhkan `space_owner.alamat` dan `space_owner.deskripsi`.

M7 membutuhkan kode reservasi dan QR.

PDF mengizinkan penyesuaian ERD selama fitur tidak dikurangi.

## Gate

- [ ] R1 diklarifikasi
- [ ] R2 diklarifikasi
- [ ] Stack final ditetapkan
- [ ] Keputusan dicatat
