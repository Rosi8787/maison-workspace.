# 01 — Requirements

## Member

| ID | Requirement |
|---|---|
| M1 | Register: nama lengkap, instansi, telepon, alamat, username, password, foto profil |
| M2 | Login |
| M3 | Lihat ketersediaan Personal Desk, Private Office, Meeting Room beserta foto, kapasitas, fasilitas, harga/jam |
| M4 | Reservasi dengan tanggal, jam mulai, durasi, kode diskon |
| M5 | Lihat status: Belum Dikonfirmasi, Disetujui, Aktif/Digunakan, Selesai, Dibatalkan |
| M6 | Histori berdasarkan bulan |
| M7 | Cetak e-ticket/nota dengan kode reservasi + QR |

## Admin Space

| ID | Requirement |
|---|---|
| A1 | Register pengelola, lokasi, profil, akun admin |
| A2 | Login |
| A3 | Update nama space, pemilik, alamat, telepon, deskripsi fasilitas |
| A4 | CRUD member |
| A5 | CRUD space, tipe, kapasitas, harga/jam, deskripsi, foto |
| A6 | CRUD promo/diskon |
| A7 | Konfirmasi/status/check-in/check-out |
| A8 | Semua reservasi dengan filter status dan bulan |
| A9 | Rekap pendapatan bulanan + distribusi per jenis space |

## Security

- Password hashing wajib.
- Validasi input wajib.
- Authorization role wajib untuk area admin.

## Reservation

Input:
- space
- tanggal
- jam mulai
- durasi
- diskon opsional

Status:
```text
belum_dikonfirm → disetujui → aktif → selesai
```

Pembatalan dapat terjadi sesuai kebutuhan bisnis, tetapi transisi lengkap belum dijelaskan oleh PDF.

## Pricing

`DERIVED`:

```text
total_harga_awal = harga_per_jam × durasi_jam
potongan_diskon = total_harga_awal × persentase_diskon / 100
total_bayar = total_harga_awal - potongan_diskon
```

## Upload

Rekomendasi local storage:

```text
/uploads/members/
/uploads/spaces/
/uploads/general/
```

DB menyimpan path/filename.

## QR / E-ticket

Wajib:
- kode reservasi
- QR untuk check-in

Payload QR dan format cetak belum ditentukan.

## Non-goals

- Tidak memakai API panitia.
- Tidak membuat App Maker sebagai fitur user Fullstack.
- Tidak menambah fitur bisnis yang tidak diperlukan.
