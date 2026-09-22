import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SupabaseStorageService } from './supabase-storage.service';

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

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
// Guard TIDAK di controller level — dipasang per-endpoint sesuai kebutuhan
export class UploadController {
  constructor(private storageService: SupabaseStorageService) {}

  // POST /api/upload/image — publik, dipakai saat register & upload umum
  @Post('image')
  @UseInterceptors(FileInterceptor('file', interceptorOptions))
  async uploadGeneral(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');
    const publicUrl = await this.storageService.upload('general', file.buffer, file.originalname, file.mimetype);
    return { url: publicUrl, path: publicUrl, size: file.size, mimetype: file.mimetype };
  }

  // POST /api/upload/spaces — hanya admin yang boleh upload foto space
  @Post('spaces')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', interceptorOptions))
  async uploadSpace(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');
    const publicUrl = await this.storageService.upload('spaces', file.buffer, file.originalname, file.mimetype);
    return { url: publicUrl, path: publicUrl, size: file.size, mimetype: file.mimetype };
  }

  // POST /api/upload/members — publik, dipakai saat register member (belum punya token)
  @Post('members')
  @UseInterceptors(FileInterceptor('file', interceptorOptions))
  async uploadMember(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File tidak ditemukan');
    const publicUrl = await this.storageService.upload('members', file.buffer, file.originalname, file.mimetype);
    return { url: publicUrl, path: publicUrl, size: file.size, mimetype: file.mimetype };
  }
}
