import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SupabaseStorageService } from './supabase-storage.service';

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Multer pakai memoryStorage — file masuk sebagai Buffer, lalu dikirim ke Supabase */
const memStorage = memoryStorage();

function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(
      new BadRequestException('Hanya file gambar (jpg, png, webp) yang diperbolehkan'),
      false,
    );
  }
  cb(null, true);
}

const interceptorOptions = {
  storage: memStorage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
};

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private storageService: SupabaseStorageService) {}

  // POST /api/upload/image  (general)
  @Post('image')
  @UseInterceptors(FileInterceptor('file', interceptorOptions))
  async uploadGeneral(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');

    const publicUrl = await this.storageService.upload(
      'general',
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      url: publicUrl,
      // path alias supaya frontend yang masih pakai field "path" tetap kompatibel
      path: publicUrl,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  // POST /api/upload/spaces
  @Post('spaces')
  @UseInterceptors(FileInterceptor('file', interceptorOptions))
  async uploadSpace(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');

    const publicUrl = await this.storageService.upload(
      'spaces',
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      url: publicUrl,
      path: publicUrl,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  // POST /api/upload/members
  @Post('members')
  @UseInterceptors(FileInterceptor('file', interceptorOptions))
  async uploadMember(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');

    const publicUrl = await this.storageService.upload(
      'members',
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      url: publicUrl,
      path: publicUrl,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
