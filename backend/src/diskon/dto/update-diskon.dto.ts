import { IsString, IsNumber, IsDateString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDiskonDto {
  @IsOptional()
  @IsString()
  nama_diskon?: string;

  @IsOptional()
  @IsString()
  kode_diskon?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  persentase_diskon?: number;

  @IsOptional()
  @IsDateString()
  tanggal_awal?: string;

  @IsOptional()
  @IsDateString()
  tanggal_akhir?: string;
}
