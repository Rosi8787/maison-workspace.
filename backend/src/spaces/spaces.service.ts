import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  // GET /api/spaces/types
  async getTypes() {
    return {
      types: ['Personal_Desk', 'Private_Office', 'Meeting_Room'],
    };
  }

  // GET /api/spaces/availability?tanggal=&jam_mulai=&durasi=
  async getAvailability(tanggal: string, jam_mulai: string, durasi: number) {
    const spaces = await this.prisma.space.findMany({
      include: {
        detail_reservasi: {
          include: {
            reservasi: true,
          },
        },
      },
    });

    const targetDate = new Date(tanggal);
    const [jamH, jamM] = jam_mulai.split(':').map(Number);
    const mulaiMinutes = jamH * 60 + jamM;
    const selesaiMinutes = mulaiMinutes + durasi * 60;

    const result = spaces.map((space) => {
      const isBooked = space.detail_reservasi.some((detail) => {
        const res = detail.reservasi;
        if (!res) return false;
        if (
          res.status === 'dibatalkan' ||
          res.status === 'selesai'
        ) return false;

        const resDate = new Date(res.tanggal_reservasi);
        if (resDate.toDateString() !== targetDate.toDateString()) return false;

        // jam_mulai adalah String "HH:MM"
        const [rH, rM] = res.jam_mulai.split(':').map(Number);
        const resStart = rH * 60 + rM;
        const resEnd = resStart + res.durasi_jam * 60;

        // Cek overlap
        return mulaiMinutes < resEnd && selesaiMinutes > resStart;
      });

      const { detail_reservasi, ...spaceData } = space;
      return {
        ...spaceData,
        tersedia: !isBooked,
      };
    });

    return result;
  }

  // GET /api/spaces
  async findAll() {
    const spaces = await this.prisma.space.findMany({
      include: {
        owner: {
          select: {
            id: true,
            nama_coworking: true,
            nama_pemilik: true,
          },
        },
      },
    });
    return spaces;
  }

  // GET /api/spaces/:id
  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            nama_coworking: true,
            nama_pemilik: true,
            telp: true,
            alamat: true,
          },
        },
      },
    });

    if (!space) {
      throw new NotFoundException(`Space dengan id ${id} tidak ditemukan`);
    }

    return space;
  }

  // Admin: POST /api/admin/spaces
  async createByAdmin(ownerId: number, dto: CreateSpaceDto) {
    const owner = await this.prisma.space_owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Space owner tidak ditemukan');
    }

    return this.prisma.space.create({
      data: {
        nama_space: dto.nama_space,
        tipe: dto.tipe as any,
        kapasitas: dto.kapasitas,
        harga_per_jam: dto.harga_per_jam,
        deskripsi: dto.deskripsi || null,
        foto: dto.foto || null,
        id_owner: ownerId,
      },
    });
  }

  // Admin: PUT /api/admin/spaces/:id
  async updateByAdmin(ownerId: number, spaceId: number, dto: UpdateSpaceDto) {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space ${spaceId} tidak ditemukan`);
    }

    if (space.id_owner !== ownerId) {
      throw new ForbiddenException('Anda tidak berhak mengubah space ini');
    }

    return this.prisma.space.update({
      where: { id: spaceId },
      data: {
        ...(dto.nama_space && { nama_space: dto.nama_space }),
        ...(dto.tipe && { tipe: dto.tipe as any }),
        ...(dto.kapasitas && { kapasitas: dto.kapasitas }),
        ...(dto.harga_per_jam !== undefined && { harga_per_jam: dto.harga_per_jam }),
        ...(dto.deskripsi !== undefined && { deskripsi: dto.deskripsi }),
        ...(dto.foto !== undefined && { foto: dto.foto }),
      },
    });
  }

  // Admin: DELETE /api/admin/spaces/:id
  async deleteByAdmin(ownerId: number, spaceId: number) {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space ${spaceId} tidak ditemukan`);
    }

    if (space.id_owner !== ownerId) {
      throw new ForbiddenException('Anda tidak berhak menghapus space ini');
    }

    await this.prisma.space.delete({ where: { id: spaceId } });
    return { message: 'Space berhasil dihapus' };
  }

  // Admin: GET /api/admin/spaces
  async findAllByAdmin(ownerId: number) {
    return this.prisma.space.findMany({
      where: { id_owner: ownerId },
    });
  }

  // Admin: GET /api/admin/spaces/:id
  async findOneByAdmin(ownerId: number, spaceId: number) {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space ${spaceId} tidak ditemukan`);
    }

    if (space.id_owner !== ownerId) {
      throw new ForbiddenException('Space bukan milik Anda');
    }

    return space;
  }
}
