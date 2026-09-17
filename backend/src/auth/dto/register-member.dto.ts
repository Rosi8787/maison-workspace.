import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterMemberDto {
  @IsNotEmpty()
  @IsString()
  nama_member: string;

  @IsNotEmpty()
  @IsString()
  instansi: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsNotEmpty()
  @IsString()
  telp: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
