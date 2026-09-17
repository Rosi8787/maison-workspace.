import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DiskonService } from './diskon.service';

@Controller('diskon')
export class DiskonController {
  constructor(private diskonService: DiskonService) {}

  // GET /api/diskon/active
  @Get('active')
  getActive() {
    return this.diskonService.getActive();
  }

  // POST /api/diskon/check
  @Post('check')
  checkKode(@Body('kode_diskon') kode_diskon: string) {
    return this.diskonService.checkKode(kode_diskon);
  }

  // GET /api/diskon/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.diskonService.findOne(id);
  }
}
