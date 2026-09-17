import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MembersModule } from '../members/members.module';
import { SpacesModule } from '../spaces/spaces.module';
import { DiskonModule } from '../diskon/diskon.module';
import { ReservasiModule } from '../reservasi/reservasi.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [MembersModule, SpacesModule, DiskonModule, ReservasiModule, ReportsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
