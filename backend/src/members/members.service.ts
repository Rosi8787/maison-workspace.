import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.member.findMany({
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
    });

    if (!member) {
      throw new NotFoundException(`Member ${id} tidak ditemukan`);
    }

    return member;
  }

  async create(dto: CreateMemberDto) {
    const existing = await this.prisma.users.findUnique({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ConflictException('Username sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: 'MEMBER',
        member: {
          create: {
            nama_member: dto.nama_member,
            instansi: dto.instansi,
            alamat: dto.alamat,
            telp: dto.telp,
            foto: dto.foto || null,
          },
        },
      },
      include: { member: true },
    });

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, dto: UpdateMemberDto) {
    const member = await this.prisma.member.findUnique({
      where: { id },
    });
    if (!member) {
      throw new NotFoundException(`Member ${id} tidak ditemukan`);
    }

    // Update member data
    const updatedMember = await this.prisma.member.update({
      where: { id },
      data: {
        ...(dto.nama_member && { nama_member: dto.nama_member }),
        ...(dto.instansi && { instansi: dto.instansi }),
        ...(dto.alamat && { alamat: dto.alamat }),
        ...(dto.telp && { telp: dto.telp }),
        ...(dto.foto !== undefined && { foto: dto.foto }),
      },
    });

    // Update password jika ada
    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      await this.prisma.users.update({
        where: { id: member.id_user },
        data: { password: hashed },
      });
    }

    return updatedMember;
  }

  async delete(id: number) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member ${id} tidak ditemukan`);
    }

    // Hapus user (cascade ke member)
    await this.prisma.users.delete({ where: { id: member.id_user } });
    return { message: 'Member berhasil dihapus' };
  }
}
