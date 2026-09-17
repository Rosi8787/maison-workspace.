import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';

@Controller('spaces')
export class SpacesController {
  constructor(private spacesService: SpacesService) {}

  // GET /api/spaces/types
  @Get('types')
  getTypes() {
    return this.spacesService.getTypes();
  }

  // GET /api/spaces/availability?tanggal=&jam_mulai=&durasi=
  @Get('availability')
  getAvailability(
    @Query('tanggal') tanggal: string,
    @Query('jam_mulai') jam_mulai: string,
    @Query('durasi') durasi: string,
  ) {
    return this.spacesService.getAvailability(tanggal, jam_mulai, parseInt(durasi));
  }

  // GET /api/spaces
  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  // GET /api/spaces/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spacesService.findOne(id);
  }
}
