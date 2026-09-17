import { IsNotEmpty, IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiskonDto {
  @IsNotEmpty()
  @IsString()
  nama_diskon: string;

  @IsNotEmpty()
  @IsString()
  kode_diskon: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  persentase_diskon: number;

  @IsNotEmpty()
  @IsDateString()
  tanggal_awal: string;

  @IsNotEmpty()
  @IsDateString()
  tanggal_akhir: string;
}
