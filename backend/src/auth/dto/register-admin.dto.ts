import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsString()
  nama_coworking: string;

  @IsNotEmpty()
  @IsString()
  nama_pemilik: string;

  @IsNotEmpty()
  @IsString()
  telp: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
