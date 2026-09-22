import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerMember(dto: RegisterMemberDto) {
    // Cek username unik
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

    return {
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        member: user.member,
      },
    };
  }

  async registerAdmin(dto: RegisterAdminDto) {
    // Cek username unik
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
        role: 'ADMIN',
        space_owner: {
          create: {
            nama_coworking: dto.nama_coworking,
            nama_pemilik: dto.nama_pemilik,
            telp: dto.telp,
            alamat: dto.alamat,
            deskripsi: dto.deskripsi || null,
            foto: dto.foto || null,
          },
        },
      },
      include: { space_owner: true },
    });

    return {
      message: 'Registrasi admin berhasil',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        space_owner: user.space_owner,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { username: dto.username },
      include: {
        member: true,
        space_owner: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        profile: user.role === 'MEMBER' ? user.member : user.space_owner,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        member: true,
        space_owner: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const { password, ...result } = user;
    return result;
  }

  /** Update foto profil — berlaku untuk member maupun admin */
  async updateFoto(userId: number, fotoUrl: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true, member: { select: { id: true } }, space_owner: { select: { id: true } } },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (user.role === 'MEMBER' && user.member) {
      await this.prisma.member.update({
        where: { id: user.member.id },
        data: { foto: fotoUrl },
      });
    } else if (user.role === 'ADMIN' && user.space_owner) {
      await this.prisma.space_owner.update({
        where: { id: user.space_owner.id },
        data: { foto: fotoUrl },
      });
    }

    return this.getProfile(userId);
  }
}
