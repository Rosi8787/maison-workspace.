import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateMemberDto {
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
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  foto?: string;
}
