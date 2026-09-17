import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { SpacesModule } from './spaces/spaces.module';
import { DiskonModule } from './diskon/diskon.module';
import { ReservasiModule } from './reservasi/reservasi.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    MembersModule,
    SpacesModule,
    DiskonModule,
    ReservasiModule,
    AdminModule,
    UploadModule,
    ReportsModule,
  ],
})
export class AppModule {}
