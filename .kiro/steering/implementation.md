# Implementation Steering

## Workflow

```text
Task
→ Read minimal context
→ Confirm requirements
→ Implement
→ Review diff
→ Test
→ Verify acceptance criteria
→ DONE
→ Next task
```

## Anti-Hallucination

1. PDF adalah source of truth.
2. Jangan invent requirement.
3. Jangan invent endpoint.
4. Field baru harus `DERIVED`/`RECOMMENDED`.
5. API panitia bukan otomatis kontrak Fullstack.
6. Konflik PDF tidak boleh diselesaikan diam-diam.
7. Catat keputusan.
8. Tandai `UNKNOWN`.
9. Hindari scope creep.
10. Jangan ubah ERD tanpa alasan.
11. Jangan install dependency tanpa alasan.
12. Jangan broad refactor saat mengerjakan task kecil.

## Task Rules

Setiap task harus punya:
- Task ID
- objective
- source requirement
- dependencies
- scope
- out of scope
- acceptance criteria
- tests

Jika informasi blocking tidak tersedia:

```text
STOP → UNKNOWN → minta keputusan
```

## Database Gate

```text
Final ERD → schema.prisma → migration
```

## Reservation Integrity

Cegah overlapping booking untuk space yang sama. Ini `DERIVED` dari availability/reservation.

## Status

Gunakan status:
```text
belum_dikonfirm
disetujui
aktif
selesai
dibatalkan
```

Jangan mengarang transition rule yang belum ditentukan.

## Testing

Setiap task harus diverifikasi. Final E2E wajib mencakup M1–M7 dan A1–A9.

## Definition of Done

- Requirement ter-cover.
- Acceptance criteria pass.
- Test pass.
- Tidak ada scope creep.
- Dependency aman.
- Dokumentasi diperbarui.

## Git

Rekomendasi satu commit per Task ID.

```text
TASK-BE-AUTH: implement authentication
```

## Compliance Protection

Jangan menghapus:
- no panitia API;
- self-managed DB;
- SSR-first;
- password hashing;
- input validation;
- M1–M7;
- A1–A9.

## Open Decisions

- R1: arsitektur Next.js/NestJS.
- R2: approval Node.js framework.

Jangan menandai R1/R2 selesai tanpa keputusan eksplisit.
