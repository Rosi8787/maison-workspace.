import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipeSpaceEnum {
  Personal_Desk = 'Personal_Desk',
  Private_Office = 'Private_Office',
  Meeting_Room = 'Meeting_Room',
}

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  nama_space: string;

  @IsNotEmpty()
  @IsEnum(TipeSpaceEnum, {
    message: 'Tipe harus Personal_Desk, Private_Office, atau Meeting_Room',
  })
  tipe: TipeSpaceEnum;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  kapasitas: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  harga_per_jam: number;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
