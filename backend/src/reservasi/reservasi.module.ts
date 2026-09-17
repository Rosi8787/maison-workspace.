import { Module } from '@nestjs/common';
import { ReservasiService } from './reservasi.service';
import { ReservasiController } from './reservasi.controller';

@Module({
  providers: [ReservasiService],
  controllers: [ReservasiController],
  exports: [ReservasiService],
})
export class ReservasiModule {}
