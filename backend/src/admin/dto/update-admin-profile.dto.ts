import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString()
  nama_coworking?: string;

  @IsOptional()
  @IsString()
  nama_pemilik?: string;

  @IsOptional()
  @IsString()
  telp?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
