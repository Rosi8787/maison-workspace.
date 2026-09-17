import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin seed
  const adminPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      space_owner: {
        create: {
          nama_coworking: 'Smart Coworking Space',
          nama_pemilik: 'Admin Pengelola',
          telp: '081234567890',
          alamat: 'Jl. Coworking No. 1, Kota',
          deskripsi: 'Coworking space modern dengan fasilitas lengkap',
        },
      },
    },
    include: { space_owner: true },
  });

  console.log('Admin created:', adminUser.username);

  // Member seed
  const memberPassword = await bcrypt.hash('member123', 10);

  const memberUser = await prisma.users.upsert({
    where: { username: 'member1' },
    update: {},
    create: {
      username: 'member1',
      password: memberPassword,
      role: 'MEMBER',
      member: {
        create: {
          nama_member: 'Budi Santoso',
          instansi: 'PT. Teknologi Maju',
          alamat: 'Jl. Sudirman No. 5, Jakarta',
          telp: '081234567891',
        },
      },
    },
    include: { member: true },
  });

  console.log('Member created:', memberUser.username);

  // Spaces seed
  if (adminUser.space_owner) {
    const ownerId = adminUser.space_owner.id;

    await prisma.space.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nama_space: 'Personal Desk A1',
        tipe: 'Personal_Desk',
        kapasitas: 1,
        harga_per_jam: 15000,
        deskripsi: 'Meja kerja personal dengan kursi ergonomis dan akses WiFi',
        id_owner: ownerId,
      },
    });

    await prisma.space.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nama_space: 'Private Office Suite 1',
        tipe: 'Private_Office',
        kapasitas: 4,
        harga_per_jam: 75000,
        deskripsi: 'Ruang private untuk tim kecil, dilengkapi whiteboard dan printer',
        id_owner: ownerId,
      },
    });

    await prisma.space.upsert({
      where: { id: 3 },
      update: {},
      create: {
        nama_space: 'Meeting Room Utama',
        tipe: 'Meeting_Room',
        kapasitas: 10,
        harga_per_jam: 150000,
        deskripsi: 'Ruang meeting besar dengan proyektor dan AC',
        id_owner: ownerId,
      },
    });

    console.log('Spaces created');
  }

  // Diskon seed
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);

  await prisma.diskon.upsert({
    where: { kode_diskon: 'HEMAT10' },
    update: {},
    create: {
      nama_diskon: 'Promo Hemat 10%',
      kode_diskon: 'HEMAT10',
      persentase_diskon: 10,
      tanggal_awal: today,
      tanggal_akhir: endDate,
    },
  });

  await prisma.diskon.upsert({
    where: { kode_diskon: 'DISKON20' },
    update: {},
    create: {
      nama_diskon: 'Diskon 20% Member Baru',
      kode_diskon: 'DISKON20',
      persentase_diskon: 20,
      tanggal_awal: today,
      tanggal_akhir: endDate,
    },
  });

  console.log('Diskons created');
  console.log('Seed selesai!');
  console.log('\nAkun demo:');
  console.log('  Admin   - username: admin    | password: admin123');
  console.log('  Member  - username: member1  | password: member123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
