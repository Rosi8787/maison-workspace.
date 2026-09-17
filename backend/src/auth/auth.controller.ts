import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/auth/register/member
  @Post('register/member')
  registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto);
  }

  // POST /api/auth/register/admin-space
  @Post('register/admin-space')
  registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  // POST /api/auth/login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /api/auth/profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }
}
