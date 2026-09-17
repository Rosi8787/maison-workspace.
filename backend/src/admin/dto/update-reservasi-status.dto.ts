import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateReservasiStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'])
  status: string;
}
