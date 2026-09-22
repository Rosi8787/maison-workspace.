import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['error', 'warn'],
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    });
  }

  async onModuleInit() {
    // Retry connect dengan jeda yang lebih pendek
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        this.logger.log('Database connected');

        // Warm up koneksi dengan query ringan agar query pertama user tidak lambat
        // Ini menghilangkan cold-start latency Supabase pooler
        await this.$queryRaw`SELECT 1`;
        this.logger.log('Connection warmed up');
        return;
      } catch (error) {
        this.logger.warn(`DB connect attempt ${attempt}/${maxRetries} failed`);
        if (attempt === maxRetries) throw error;
        await new Promise((r) => setTimeout(r, 2000)); // jeda lebih pendek dari sebelumnya
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
