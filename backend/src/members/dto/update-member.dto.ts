import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  nama_member?: string;

  @IsOptional()
  @IsString()
  instansi?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  telp?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
