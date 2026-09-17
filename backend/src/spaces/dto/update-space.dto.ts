import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipeSpaceEnum } from './create-space.dto';

export class UpdateSpaceDto {
  @IsOptional()
  @IsString()
  nama_space?: string;

  @IsOptional()
  @IsEnum(TipeSpaceEnum, {
    message: 'Tipe harus Personal_Desk, Private_Office, atau Meeting_Room',
  })
  tipe?: TipeSpaceEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  kapasitas?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  harga_per_jam?: number;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
