import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { SupabaseStorageService } from './supabase-storage.service';

@Module({
  imports: [
    // memoryStorage dikonfigurasi per-endpoint di controller,
    // MulterModule.register() di sini hanya sebagai entry point NestJS
    MulterModule.register(),
  ],
  providers: [SupabaseStorageService],
  controllers: [UploadController],
  exports: [SupabaseStorageService],
})
export class UploadModule {}
