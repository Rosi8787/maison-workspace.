import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservasiDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id_space: number;

  @IsNotEmpty()
  @IsDateString()
  tanggal_reservasi: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?\d|2[0-3]):[0-5]\d$/, {
    message: 'jam_mulai harus format HH:MM',
  })
  jam_mulai: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(24)
  durasi_jam: number;

  @IsOptional()
  @IsString()
  kode_diskon?: string;
}
