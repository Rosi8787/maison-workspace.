import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { MembersService } from '../members/members.service';
import { SpacesService } from '../spaces/spaces.service';
import { DiskonService } from '../diskon/diskon.service';
import { ReservasiService } from '../reservasi/reservasi.service';
import { ReportsService } from '../reports/reports.service';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { UpdateReservasiStatusDto } from './dto/update-reservasi-status.dto';
import { CreateMemberDto } from '../members/dto/create-member.dto';
import { UpdateMemberDto } from '../members/dto/update-member.dto';
import { CreateSpaceDto } from '../spaces/dto/create-space.dto';
import { UpdateSpaceDto } from '../spaces/dto/update-space.dto';
import { CreateDiskonDto } from '../diskon/dto/create-diskon.dto';
import { UpdateDiskonDto } from '../diskon/dto/update-diskon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private membersService: MembersService,
    private spacesService: SpacesService,
    private diskonService: DiskonService,
    private reservasiService: ReservasiService,
    private reportsService: ReportsService,
  ) {}

  // ==========================================
  // PROFILE
  // ==========================================

  @Get('profile')
  getProfile(@GetUser('id') userId: number) {
    return this.adminService.getProfile(userId);
  }

  @Put('profile')
  updateProfile(
    @GetUser('id') userId: number,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.adminService.updateProfile(userId, dto);
  }

  // ==========================================
  // MEMBERS
  // ==========================================

  @Get('members')
  getMembers() {
    return this.membersService.findAll();
  }

  @Post('members')
  createMember(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Get('members/:id')
  getMember(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  @Put('members/:id')
  updateMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, dto);
  }

  @Delete('members/:id')
  deleteMember(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.delete(id);
  }

  // ==========================================
  // SPACES
  // ==========================================

  @Get('spaces')
  async getSpaces(@GetUser('id') userId: number) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.spacesService.findAllByAdmin(ownerId);
  }

  @Post('spaces')
  async createSpace(
    @GetUser('id') userId: number,
    @Body() dto: CreateSpaceDto,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.spacesService.createByAdmin(ownerId, dto);
  }

  @Get('spaces/:id')
  async getSpace(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.spacesService.findOneByAdmin(ownerId, id);
  }

  @Put('spaces/:id')
  async updateSpace(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpaceDto,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.spacesService.updateByAdmin(ownerId, id, dto);
  }

  @Delete('spaces/:id')
  async deleteSpace(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.spacesService.deleteByAdmin(ownerId, id);
  }

  // ==========================================
  // DISKON
  // ==========================================

  @Get('diskon')
  getAllDiskon() {
    return this.diskonService.findAll();
  }

  @Post('diskon')
  createDiskon(@Body() dto: CreateDiskonDto) {
    return this.diskonService.create(dto);
  }

  @Get('diskon/:id')
  getDiskon(@Param('id', ParseIntPipe) id: number) {
    return this.diskonService.findOne(id);
  }

  @Put('diskon/:id')
  updateDiskon(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiskonDto,
  ) {
    return this.diskonService.update(id, dto);
  }

  @Delete('diskon/:id')
  deleteDiskon(@Param('id', ParseIntPipe) id: number) {
    return this.diskonService.delete(id);
  }

  // ==========================================
  // RESERVASI
  // ==========================================

  @Get('reservasi')
  async getReservasi(
    @GetUser('id') userId: number,
    @Query('status') status?: string,
    @Query('bulan') bulan?: string,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.reservasiService.getAllForAdmin(ownerId, status, bulan);
  }

  @Patch('reservasi/:id/status')
  async updateReservasiStatus(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservasiStatusDto,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.reservasiService.updateStatus(ownerId, id, dto.status);
  }

  @Post('reservasi/:id/check-in')
  async checkIn(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.reservasiService.checkIn(ownerId, id);
  }

  @Post('reservasi/:id/check-out')
  async checkOut(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.reservasiService.checkOut(ownerId, id);
  }

  // ==========================================
  // REPORTS
  // ==========================================

  @Get('reports/monthly')
  async getMonthlyReport(
    @GetUser('id') userId: number,
    @Query('bulan') bulan: string,
    @Query('tahun') tahun: string,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.reportsService.getMonthly(ownerId, bulan, tahun);
  }

  @Get('reports/income')
  async getIncomeReport(
    @GetUser('id') userId: number,
    @Query('tahun') tahun: string,
  ) {
    const ownerId = await this.adminService.getOwnerId(userId);
    return this.reportsService.getIncome(ownerId, tahun);
  }
}
