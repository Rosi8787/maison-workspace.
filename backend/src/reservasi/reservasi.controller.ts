import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReservasiService } from './reservasi.service';
import { CreateReservasiDto } from './dto/create-reservasi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';

@Controller('reservasi')
@UseGuards(JwtAuthGuard)
export class ReservasiController {
  constructor(private reservasiService: ReservasiService) {}

  // POST /api/reservasi
  @Post()
  @Roles('MEMBER')
  @UseGuards(RolesGuard)
  create(
    @GetUser('id') userId: number,
    @Body() dto: CreateReservasiDto,
  ) {
    return this.reservasiService.create(userId, dto);
  }

  // GET /api/reservasi/my
  @Get('my')
  @Roles('MEMBER')
  @UseGuards(RolesGuard)
  getMyReservasi(@GetUser('id') userId: number) {
    return this.reservasiService.getMyReservasi(userId);
  }

  // GET /api/reservasi/my/history
  @Get('my/history')
  @Roles('MEMBER')
  @UseGuards(RolesGuard)
  getMyHistory(
    @GetUser('id') userId: number,
    @Query('bulan') bulan?: string,
  ) {
    return this.reservasiService.getMyHistory(userId, bulan);
  }

  // GET /api/reservasi/:id/e-ticket
  @Get(':id/e-ticket')
  getEticket(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.reservasiService.getEticket(id, userId);
  }

  // GET /api/reservasi/:id
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.reservasiService.getDetailReservasi(id);
  }

  // PATCH /api/reservasi/:id/cancel
  @Patch(':id/cancel')
  @Roles('MEMBER')
  @UseGuards(RolesGuard)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.reservasiService.cancelReservasi(id, userId);
  }
}
