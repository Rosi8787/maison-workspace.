import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Nama bucket di Supabase Storage — buat ketiga bucket ini di Dashboard
// Settings > Storage > New bucket (set Public = true)
const BUCKETS = {
  general: 'general',
  spaces: 'spaces',
  members: 'members',
} as const;

type BucketName = keyof typeof BUCKETS;

@Injectable()
export class SupabaseStorageService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env');
    }

    // Gunakan service role key agar bisa upload tanpa RLS
    this.supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  /**
   * Upload buffer ke Supabase Storage bucket.
   * Return: public URL file yang bisa diakses dari browser manapun.
   */
  async upload(
    bucket: BucketName,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<string> {
    const ext = extname(originalName).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const path = filename; // simpan flat di root bucket

    const { error } = await this.supabase.storage
      .from(BUCKETS[bucket])
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Gagal upload ke Supabase Storage (${bucket}): ${error.message}`,
      );
    }

    // Ambil public URL — bucket harus di-set Public di Supabase Dashboard
    const { data } = this.supabase.storage
      .from(BUCKETS[bucket])
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Hapus file dari bucket berdasarkan public URL-nya.
   */
  async delete(bucket: BucketName, publicUrl: string): Promise<void> {
    // Ekstrak filename dari public URL
    const parts = publicUrl.split('/');
    const filename = parts[parts.length - 1];

    const { error } = await this.supabase.storage
      .from(BUCKETS[bucket])
      .remove([filename]);

    if (error) {
      // Non-fatal — log saja, jangan throw
      console.warn(`Gagal hapus file dari Supabase Storage: ${error.message}`);
    }
  }
}
