# 03 — Database / ERD

## Models

### users
```text
id
username
password
role
```

### member
```text
id
nama_member
instansi
alamat
telp
id_user
foto
```

### space_owner
```text
id
nama_coworking
nama_pemilik
telp
id_user
alamat       # DERIVED
deskripsi    # DERIVED
```

### space
```text
id
nama_space
harga_per_jam
tipe
kapasitas
foto
deskripsi
id_owner
```

### diskon
```text
id
nama_diskon
persentase_diskon
tanggal_awal
tanggal_akhir
```

### reservasi
```text
id
tanggal_reservasi
jam_mulai
durasi_jam
id_owner
id_member
status
kode_reservasi  # DERIVED
```

### detail_reservasi
```text
id
id_reservasi
id_space
id_diskon
total_harga
```

## Relations

```text
users 1—1 member
users 1—1 space_owner
space_owner 1—N space
space_owner 1—N reservasi
member 1—N reservasi
reservasi 1—N detail_reservasi
space 1—N detail_reservasi
diskon 1—N detail_reservasi
```

Kardinalitas users pada PDF memiliki ambiguity; 1:1 adalah rekomendasi yang paling konsisten dengan single-role account.

## Important Gaps

- `space_owner.alamat`
- `space_owner.deskripsi`
- `reservasi.kode_reservasi`
- QR payload/storage

## Prisma Gate

```text
Final ERD
→ schema.prisma
→ migration
→ seed
```

Jangan membuat migration final sebelum gap diputuskan.
