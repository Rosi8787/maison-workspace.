import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsUrl, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';

class UpdateFotoDto {
  @IsNotEmpty()
  @IsString()
  foto: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/member')
  registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto);
  }

  @Post('register/admin-space')
  registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }

  // PATCH /api/auth/profile/foto — update foto diri sendiri (member & admin)
  @Patch('profile/foto')
  @UseGuards(JwtAuthGuard)
  updateFoto(@GetUser('id') userId: number, @Body() dto: UpdateFotoDto) {
    return this.authService.updateFoto(userId, dto.foto);
  }
}
