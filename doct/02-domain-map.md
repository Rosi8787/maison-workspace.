# 02 — Domain Map

```text
AUTH
(users, member, space_owner)
        ↓
PROFILE
(member/admin)
        ↓
SPACE ───────── DISCOUNT
   \             /
    \           /
     → RESERVATION
            ↓
     CHECK-IN / CHECK-OUT
            ↓
      E-TICKET / QR
            ↓
          REPORT
```

## Dependency

- Auth → Profile.
- Space dan Discount dapat paralel.
- Reservation membutuhkan Auth + Space + Discount.
- Check-in/out membutuhkan Reservation.
- E-ticket membutuhkan Reservation.
- Report membutuhkan Reservation + Detail Reservation + Space.
- Upload independen dan dipakai Member/Space.
