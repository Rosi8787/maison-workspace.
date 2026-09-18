# 04 — API Contract Reference

## Important

Bagian III PDF memiliki **50 endpoint**.

Untuk Fullstack, endpoint ini adalah **REFERENCE ONLY**. Jangan otomatis membuat 50 endpoint yang sama.

## Inventory

| # | Method | Endpoint |
|---:|---|---|
| 1 | GET | `/` |
| 2 | GET | `/health` |
| 3 | POST | `/api/maker/register` |
| 4 | POST | `/api/maker/login` |
| 5 | GET | `/api/maker/me` |
| 6 | GET | `/api/maker/stats` |
| 7 | GET | `/api/maker/list` |
| 8 | POST | `/api/auth/register/member` |
| 9 | POST | `/api/auth/register/admin-space` |
| 10 | POST | `/api/auth/login` |
| 11 | GET | `/api/auth/profile` |
| 12 | GET | `/api/spaces/types` |
| 13 | GET | `/api/spaces/availability` |
| 14 | GET | `/api/spaces` |
| 15 | GET | `/api/spaces/{id}` |
| 16 | GET | `/api/diskon/active` |
| 17 | POST | `/api/diskon/check` |
| 18 | GET | `/api/diskon/{id}` |
| 19 | POST | `/api/reservasi` |
| 20 | GET | `/api/reservasi/my` |
| 21 | GET | `/api/reservasi/my/history` |
| 22 | GET | `/api/reservasi/{id}/e-ticket` |
| 23 | GET | `/api/reservasi/{id}` |
| 24 | PATCH | `/api/reservasi/{id}/cancel` |
| 25 | GET | `/api/admin/profile` |
| 26 | PUT | `/api/admin/profile` |
| 27 | GET | `/api/admin/members` |
| 28 | POST | `/api/admin/members` |
| 29 | GET | `/api/admin/members/{id}` |
| 30 | PUT | `/api/admin/members/{id}` |
| 31 | DELETE | `/api/admin/members/{id}` |
| 32 | GET | `/api/admin/spaces` |
| 33 | POST | `/api/admin/spaces` |
| 34 | GET | `/api/admin/spaces/{id}` |
| 35 | PUT | `/api/admin/spaces/{id}` |
| 36 | DELETE | `/api/admin/spaces/{id}` |
| 37 | GET | `/api/admin/diskon` |
| 38 | POST | `/api/admin/diskon` |
| 39 | GET | `/api/admin/diskon/{id}` |
| 40 | PUT | `/api/admin/diskon/{id}` |
| 41 | DELETE | `/api/admin/diskon/{id}` |
| 42 | GET | `/api/admin/reservasi` |
| 43 | PATCH | `/api/admin/reservasi/{id}/status` |
| 44 | POST | `/api/admin/reservasi/{id}/check-in` |
| 45 | POST | `/api/admin/reservasi/{id}/check-out` |
| 46 | GET | `/api/admin/reports/monthly` |
| 47 | GET | `/api/admin/reports/income` |
| 48 | POST | `/api/upload/image` |
| 49 | POST | `/api/upload/spaces` |
| 50 | POST | `/api/upload/members` |

## Internal Contract

Jika Next.js + NestJS dipertahankan:

```text
Requirements + Final ERD
→ Internal Contract
→ NestJS
→ Next.js Server
```

Internal contract dibuat per domain, bukan copy-paste otomatis dari API panitia.
