import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiskonDto } from './dto/create-diskon.dto';
import { UpdateDiskonDto } from './dto/update-diskon.dto';

@Injectable()
export class DiskonService {
  constructor(private prisma: PrismaService) {}

  // GET /api/diskon/active
  async getActive() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.diskon.findMany({
      where: {
        tanggal_awal: { lte: today },
        tanggal_akhir: { gte: today },
      },
    });
  }

  // POST /api/diskon/check — cek kode diskon
  async checkKode(kode_diskon: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diskon = await this.prisma.diskon.findFirst({
      where: {
        kode_diskon,
        tanggal_awal: { lte: today },
        tanggal_akhir: { gte: today },
      },
    });

    if (!diskon) {
      throw new NotFoundException('Kode diskon tidak valid atau sudah kedaluwarsa');
    }

    return diskon;
  }

  // GET /api/diskon/:id
  async findOne(id: number) {
    const diskon = await this.prisma.diskon.findUnique({ where: { id } });
    if (!diskon) {
      throw new NotFoundException(`Diskon ${id} tidak ditemukan`);
    }
    return diskon;
  }

  // Admin CRUD

  async findAll() {
    return this.prisma.diskon.findMany({ orderBy: { tanggal_awal: 'desc' } });
  }

  async create(dto: CreateDiskonDto) {
    const existing = await this.prisma.diskon.findUnique({
      where: { kode_diskon: dto.kode_diskon },
    });
    if (existing) {
      throw new ConflictException('Kode diskon sudah digunakan');
    }

    const awal = new Date(dto.tanggal_awal);
    const akhir = new Date(dto.tanggal_akhir);
    if (awal > akhir) {
      throw new BadRequestException('Tanggal awal tidak boleh setelah tanggal akhir');
    }

    return this.prisma.diskon.create({
      data: {
        nama_diskon: dto.nama_diskon,
        kode_diskon: dto.kode_diskon,
        persentase_diskon: dto.persentase_diskon,
        tanggal_awal: awal,
        tanggal_akhir: akhir,
      },
    });
  }

  async update(id: number, dto: UpdateDiskonDto) {
    const diskon = await this.prisma.diskon.findUnique({ where: { id } });
    if (!diskon) {
      throw new NotFoundException(`Diskon ${id} tidak ditemukan`);
    }

    if (dto.kode_diskon && dto.kode_diskon !== diskon.kode_diskon) {
      const existing = await this.prisma.diskon.findUnique({
        where: { kode_diskon: dto.kode_diskon },
      });
      if (existing) {
        throw new ConflictException('Kode diskon sudah digunakan');
      }
    }

    return this.prisma.diskon.update({
      where: { id },
      data: {
        ...(dto.nama_diskon && { nama_diskon: dto.nama_diskon }),
        ...(dto.kode_diskon && { kode_diskon: dto.kode_diskon }),
        ...(dto.persentase_diskon !== undefined && { persentase_diskon: dto.persentase_diskon }),
        ...(dto.tanggal_awal && { tanggal_awal: new Date(dto.tanggal_awal) }),
        ...(dto.tanggal_akhir && { tanggal_akhir: new Date(dto.tanggal_akhir) }),
      },
    });
  }

  async delete(id: number) {
    const diskon = await this.prisma.diskon.findUnique({ where: { id } });
    if (!diskon) {
      throw new NotFoundException(`Diskon ${id} tidak ditemukan`);
    }
    await this.prisma.diskon.delete({ where: { id } });
    return { message: 'Diskon berhasil dihapus' };
  }
}
