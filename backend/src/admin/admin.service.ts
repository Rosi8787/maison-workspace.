import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const owner = await this.prisma.space_owner.findUnique({
      where: { id_user: userId },
      include: {
        user: { select: { id: true, username: true, role: true } },
      },
    });

    if (!owner) {
      throw new NotFoundException('Profil admin tidak ditemukan');
    }

    return owner;
  }

  async updateProfile(userId: number, dto: UpdateAdminProfileDto) {
    const owner = await this.prisma.space_owner.findUnique({
      where: { id_user: userId },
    });

    if (!owner) {
      throw new NotFoundException('Profil admin tidak ditemukan');
    }

    return this.prisma.space_owner.update({
      where: { id_user: userId },
      data: {
        ...(dto.nama_coworking && { nama_coworking: dto.nama_coworking }),
        ...(dto.nama_pemilik && { nama_pemilik: dto.nama_pemilik }),
        ...(dto.telp && { telp: dto.telp }),
        ...(dto.alamat && { alamat: dto.alamat }),
        ...(dto.deskripsi !== undefined && { deskripsi: dto.deskripsi }),
        ...(dto.foto !== undefined && { foto: dto.foto }),
      },
    });
  }

  async getOwnerId(userId: number): Promise<number> {
    const owner = await this.prisma.space_owner.findUnique({
      where: { id_user: userId },
    });

    if (!owner) {
      throw new NotFoundException('Space owner tidak ditemukan');
    }

    return owner.id;
  }
}
