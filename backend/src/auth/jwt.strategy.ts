import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; username: string; role: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Token tidak valid');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
