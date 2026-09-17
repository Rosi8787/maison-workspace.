import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservasiDto } from './dto/create-reservasi.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class ReservasiService {
  constructor(private prisma: PrismaService) {}

  private generateKodeReservasi(): string {
    const prefix = 'RES';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /** Parse "HH:MM" ke total menit */
  private jamToMinutes(jamStr: string): number {
    const [h, m] = jamStr.split(':').map(Number);
    return h * 60 + m;
  }

  // POST /api/reservasi — buat reservasi baru
  async create(userId: number, dto: CreateReservasiDto) {
    // Ambil member dari userId
    const member = await this.prisma.member.findUnique({
      where: { id_user: userId },
    });
    if (!member) {
      throw new NotFoundException('Profil member tidak ditemukan');
    }

    // Cek space ada
    const space = await this.prisma.space.findUnique({
      where: { id: dto.id_space },
      include: { owner: true },
    });
    if (!space) {
      throw new NotFoundException(`Space ${dto.id_space} tidak ditemukan`);
    }

    // Parse tanggal — simpan sebagai midnight UTC
    const tanggalReservasi = new Date(dto.tanggal_reservasi);
    tanggalReservasi.setUTCHours(0, 0, 0, 0);

    // jam_mulai disimpan sebagai String "HH:MM"
    const jam_mulai_str = dto.jam_mulai; // e.g. "09:00"
    const mulaiMinutes = this.jamToMinutes(jam_mulai_str);
    const selesaiMinutes = mulaiMinutes + dto.durasi_jam * 60;

    if (selesaiMinutes > 24 * 60) {
      throw new BadRequestException('Jam selesai melebihi hari (> 24:00)');
    }

    // Validasi tanggal tidak di masa lalu
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (tanggalReservasi < today) {
      throw new BadRequestException('Tanggal reservasi tidak boleh di masa lalu');
    }

    // Cek overlap reservasi untuk space yang sama
    const existingReservasi = await this.prisma.reservasi.findMany({
      where: {
        status: { in: ['belum_dikonfirm', 'disetujui', 'aktif'] },
        detail_reservasi: {
          some: { id_space: dto.id_space },
        },
      },
    });

    for (const res of existingReservasi) {
      const resDate = new Date(res.tanggal_reservasi);
      resDate.setUTCHours(0, 0, 0, 0);
      if (resDate.getTime() !== tanggalReservasi.getTime()) continue;

      // jam_mulai sekarang String "HH:MM"
      const resStart = this.jamToMinutes(res.jam_mulai);
      const resEnd = resStart + res.durasi_jam * 60;

      if (mulaiMinutes < resEnd && selesaiMinutes > resStart) {
        throw new BadRequestException(
          'Space sudah dipesan pada waktu tersebut (bentrok reservasi)',
        );
      }
    }

    // Hitung harga
    const hargaPerJam = Number(space.harga_per_jam);
    const totalHargaAwal = hargaPerJam * dto.durasi_jam;
    let totalBayar = totalHargaAwal;
    let diskonId: number | null = null;

    // Proses diskon jika ada
    if (dto.kode_diskon) {
      const today2 = new Date();
      today2.setHours(0, 0, 0, 0);

      const diskon = await this.prisma.diskon.findFirst({
        where: {
          kode_diskon: dto.kode_diskon,
          tanggal_awal: { lte: today2 },
          tanggal_akhir: { gte: today2 },
        },
      });

      if (!diskon) {
        throw new BadRequestException('Kode diskon tidak valid atau sudah kedaluwarsa');
      }

      const potongan = (totalHargaAwal * Number(diskon.persentase_diskon)) / 100;
      totalBayar = totalHargaAwal - potongan;
      diskonId = diskon.id;
    }

    const kodeReservasi = this.generateKodeReservasi();

    // Buat reservasi + detail dalam satu transaction
    const reservasi = await this.prisma.$transaction(async (tx) => {
      const res = await tx.reservasi.create({
        data: {
          kode_reservasi: kodeReservasi,
          tanggal_reservasi: tanggalReservasi,
          jam_mulai: jam_mulai_str,   // String "HH:MM"
          durasi_jam: dto.durasi_jam,
          status: 'belum_dikonfirm',
          id_member: member.id,
          id_owner: space.id_owner,
        },
      });

      await tx.detail_reservasi.create({
        data: {
          id_reservasi: res.id,
          id_space: dto.id_space,
          id_diskon: diskonId,
          total_harga: totalBayar,
        },
      });

      return res;
    });

    return this.getDetailReservasi(reservasi.id);
  }

  // GET /api/reservasi/my — reservasi aktif member
  async getMyReservasi(userId: number) {
    const member = await this.prisma.member.findUnique({
      where: { id_user: userId },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    return this.prisma.reservasi.findMany({
      where: {
        id_member: member.id,
        status: { in: ['belum_dikonfirm', 'disetujui', 'aktif'] },
      },
      include: {
        detail_reservasi: {
          include: { space: true, diskon: true },
        },
      },
      orderBy: { tanggal_reservasi: 'desc' },
    });
  }

  // GET /api/reservasi/my/history — histori per bulan
  async getMyHistory(userId: number, bulan?: string) {
    const member = await this.prisma.member.findUnique({
      where: { id_user: userId },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    const whereClause: any = { id_member: member.id };

    if (bulan) {
      const [year, month] = bulan.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      whereClause.tanggal_reservasi = { gte: startDate, lte: endDate };
    }

    return this.prisma.reservasi.findMany({
      where: whereClause,
      include: {
        detail_reservasi: {
          include: { space: true, diskon: true },
        },
      },
      orderBy: { tanggal_reservasi: 'desc' },
    });
  }

  // GET /api/reservasi/:id
  async getDetailReservasi(reservasiId: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: reservasiId },
      include: {
        member: true,
        owner: true,
        detail_reservasi: {
          include: { space: true, diskon: true },
        },
      },
    });

    if (!reservasi) {
      throw new NotFoundException(`Reservasi ${reservasiId} tidak ditemukan`);
    }

    return reservasi;
  }

  // GET /api/reservasi/:id/e-ticket
  async getEticket(reservasiId: number, userId: number) {
    const member = await this.prisma.member.findUnique({
      where: { id_user: userId },
    });

    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: reservasiId },
      include: {
        member: true,
        owner: true,
        detail_reservasi: {
          include: { space: true, diskon: true },
        },
      },
    });

    if (!reservasi) {
      throw new NotFoundException(`Reservasi ${reservasiId} tidak ditemukan`);
    }

    if (member && reservasi.id_member !== member.id) {
      throw new ForbiddenException('Anda tidak berhak melihat e-ticket ini');
    }

    // Generate QR code
    const qrPayload = JSON.stringify({
      kode: reservasi.kode_reservasi,
      id: reservasi.id,
      member: reservasi.member.nama_member,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    return { ...reservasi, qr_code: qrCodeDataUrl };
  }

  // PATCH /api/reservasi/:id/cancel
  async cancelReservasi(reservasiId: number, userId: number) {
    const member = await this.prisma.member.findUnique({
      where: { id_user: userId },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: reservasiId },
    });

    if (!reservasi) {
      throw new NotFoundException(`Reservasi ${reservasiId} tidak ditemukan`);
    }

    if (reservasi.id_member !== member.id) {
      throw new ForbiddenException('Anda tidak berhak membatalkan reservasi ini');
    }

    if (!['belum_dikonfirm', 'disetujui'].includes(reservasi.status)) {
      throw new BadRequestException(
        `Reservasi dengan status ${reservasi.status} tidak dapat dibatalkan`,
      );
    }

    return this.prisma.reservasi.update({
      where: { id: reservasiId },
      data: { status: 'dibatalkan' },
    });
  }

  // Admin: GET /api/admin/reservasi
  async getAllForAdmin(ownerId: number, status?: string, bulan?: string) {
    const whereClause: any = { id_owner: ownerId };

    if (status) whereClause.status = status;

    if (bulan) {
      const [year, month] = bulan.split('-').map(Number);
      whereClause.tanggal_reservasi = {
        gte: new Date(year, month - 1, 1),
        lte: new Date(year, month, 0),
      };
    }

    return this.prisma.reservasi.findMany({
      where: whereClause,
      include: {
        member: true,
        detail_reservasi: {
          include: { space: true, diskon: true },
        },
      },
      orderBy: { tanggal_reservasi: 'desc' },
    });
  }

  // Admin: PATCH /api/admin/reservasi/:id/status
  async updateStatus(ownerId: number, reservasiId: number, status: string) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: reservasiId },
    });

    if (!reservasi) throw new NotFoundException(`Reservasi ${reservasiId} tidak ditemukan`);
    if (reservasi.id_owner !== ownerId) throw new ForbiddenException('Reservasi bukan milik space Anda');

    const validStatuses = ['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Status '${status}' tidak valid`);
    }

    return this.prisma.reservasi.update({
      where: { id: reservasiId },
      data: { status: status as any },
    });
  }

  // Admin: POST /api/admin/reservasi/:id/check-in
  async checkIn(ownerId: number, reservasiId: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: reservasiId },
    });

    if (!reservasi) throw new NotFoundException(`Reservasi ${reservasiId} tidak ditemukan`);
    if (reservasi.id_owner !== ownerId) throw new ForbiddenException('Reservasi bukan milik space Anda');

    if (reservasi.status !== 'disetujui') {
      throw new BadRequestException(
        'Check-in hanya bisa dilakukan pada reservasi dengan status disetujui',
      );
    }

    return this.prisma.reservasi.update({
      where: { id: reservasiId },
      data: { status: 'aktif', checkin_at: new Date() },
    });
  }

  // Admin: POST /api/admin/reservasi/:id/check-out
  async checkOut(ownerId: number, reservasiId: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: reservasiId },
    });

    if (!reservasi) throw new NotFoundException(`Reservasi ${reservasiId} tidak ditemukan`);
    if (reservasi.id_owner !== ownerId) throw new ForbiddenException('Reservasi bukan milik space Anda');

    if (reservasi.status !== 'aktif') {
      throw new BadRequestException(
        'Check-out hanya bisa dilakukan pada reservasi dengan status aktif',
      );
    }

    return this.prisma.reservasi.update({
      where: { id: reservasiId },
      data: { status: 'selesai', checkout_at: new Date() },
    });
  }
}
