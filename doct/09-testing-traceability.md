# 09 — Testing & Traceability

## E2E Member

```text
Register
→ Login
→ Katalog
→ Availability
→ Reservasi
→ Diskon
→ Status
→ Histori
→ E-ticket
→ QR
```

## E2E Admin

```text
Register
→ Login
→ Update Profil
→ CRUD Member
→ CRUD Space
→ CRUD Diskon
→ Lihat Reservasi
→ Filter
→ Konfirmasi
→ Check-in
→ Check-out
→ Laporan
```

## Negative Tests

- duplicate username;
- wrong password;
- invalid/expired promo;
- overlapping reservation;
- unauthorized admin;
- unauthorized member;
- empty required input;
- invalid upload.

## Traceability

| Requirement | Backend | Frontend | Test |
|---|---|---|---|
| M1 | BE-AUTH | FE-AUTH | E2E-01 |
| M2 | BE-AUTH | FE-AUTH | E2E-02 |
| M3 | BE-SPACE | FE-SPACE | E2E-03 |
| M4 | BE-RESERVATION | FE-RESERVATION | E2E-04 |
| M5 | BE-RESERVATION | FE-RESERVATION | E2E-05 |
| M6 | BE-RESERVATION | FE-RESERVATION | E2E-06 |
| M7 | BE-ETICKET | FE-ETICKET | E2E-07 |
| A1 | BE-AUTH | FE-AUTH | E2E-08 |
| A3 | BE-ADMIN-PROFILE | FE-ADMIN-PROFILE | E2E-09 |
| A4 | BE-ADMIN-MEMBER | FE-ADMIN-MEMBER | E2E-10 |
| A5 | BE-SPACE | FE-ADMIN-SPACE | E2E-11 |
| A6 | BE-DISCOUNT | FE-ADMIN-DISCOUNT | E2E-12 |
| A7 | BE-CHECKIN-OUT | FE-ADMIN-RESERVATION | E2E-13 |
| A8 | BE-CHECKIN-OUT | FE-ADMIN-RESERVATION | E2E-14 |
| A9 | BE-REPORT | FE-ADMIN-REPORT | E2E-15 |

## Definition of Done

- Requirement ter-cover.
- Acceptance criteria pass.
- Test pass.
- Tidak ada scope creep.
- Tidak merusak dependency.
- Dokumentasi/status diperbarui.
