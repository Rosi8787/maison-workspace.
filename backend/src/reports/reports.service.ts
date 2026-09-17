import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // GET /api/admin/reports/monthly?bulan=&tahun=
  async getMonthly(ownerId: number, bulan: string, tahun: string) {
    if (!bulan || !tahun) {
      throw new BadRequestException('Parameter bulan dan tahun diperlukan (format: bulan=1-12, tahun=YYYY)');
    }

    const monthNum = parseInt(bulan);
    const yearNum = parseInt(tahun);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new BadRequestException('Bulan tidak valid (1-12)');
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);

    const reservasi = await this.prisma.reservasi.findMany({
      where: {
        id_owner: ownerId,
        tanggal_reservasi: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        member: true,
        detail_reservasi: {
          include: {
            space: true,
            diskon: true,
          },
        },
      },
      orderBy: { tanggal_reservasi: 'asc' },
    });

    // Hitung total per status
    const summary = {
      total_reservasi: reservasi.length,
      selesai: reservasi.filter((r) => r.status === 'selesai').length,
      dibatalkan: reservasi.filter((r) => r.status === 'dibatalkan').length,
      aktif: reservasi.filter((r) => r.status === 'aktif').length,
      disetujui: reservasi.filter((r) => r.status === 'disetujui').length,
      belum_dikonfirm: reservasi.filter((r) => r.status === 'belum_dikonfirm').length,
    };

    const totalPendapatan = reservasi
      .filter((r) => r.status === 'selesai')
      .reduce((sum, r) => {
        return sum + r.detail_reservasi.reduce((s, d) => s + Number(d.total_harga), 0);
      }, 0);

    return {
      periode: { bulan: monthNum, tahun: yearNum },
      summary,
      total_pendapatan: totalPendapatan,
      data: reservasi,
    };
  }

  // GET /api/admin/reports/income?tahun=
  async getIncome(ownerId: number, tahun: string) {
    if (!tahun) {
      throw new BadRequestException('Parameter tahun diperlukan');
    }

    const yearNum = parseInt(tahun);
    if (isNaN(yearNum)) {
      throw new BadRequestException('Tahun tidak valid');
    }

    const startDate = new Date(yearNum, 0, 1);
    const endDate = new Date(yearNum, 11, 31);

    const reservasi = await this.prisma.reservasi.findMany({
      where: {
        id_owner: ownerId,
        status: 'selesai',
        tanggal_reservasi: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        detail_reservasi: {
          include: {
            space: true,
          },
        },
      },
    });

    // Rekap per bulan
    const monthlyIncome: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) {
      monthlyIncome[i] = 0;
    }

    reservasi.forEach((r) => {
      const month = new Date(r.tanggal_reservasi).getMonth() + 1;
      const income = r.detail_reservasi.reduce((s, d) => s + Number(d.total_harga), 0);
      monthlyIncome[month] += income;
    });

    // Distribusi per tipe space
    const spaceTypeIncome: Record<string, number> = {
      Personal_Desk: 0,
      Private_Office: 0,
      Meeting_Room: 0,
    };

    reservasi.forEach((r) => {
      r.detail_reservasi.forEach((d) => {
        const tipe = d.space.tipe;
        spaceTypeIncome[tipe] = (spaceTypeIncome[tipe] || 0) + Number(d.total_harga);
      });
    });

    const totalIncome = Object.values(monthlyIncome).reduce((a, b) => a + b, 0);

    return {
      tahun: yearNum,
      total_pendapatan: totalIncome,
      per_bulan: monthlyIncome,
      per_tipe_space: spaceTypeIncome,
    };
  }
}
