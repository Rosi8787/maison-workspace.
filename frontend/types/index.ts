// ==========================================
// AUTH & USER TYPES
// ==========================================

export type Role = 'MEMBER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  role: Role;
  profile?: Member | SpaceOwner;
}

export interface Member {
  id: number;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  foto?: string;
  id_user: number;
}

export interface SpaceOwner {
  id: number;
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
  alamat: string;
  deskripsi?: string;
  id_user: number;
}

export interface AuthUser {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: Role;
    profile: Member | SpaceOwner;
  };
}

// ==========================================
// SPACE TYPES
// ==========================================

export type TipeSpace = 'Personal_Desk' | 'Private_Office' | 'Meeting_Room';

export interface Space {
  id: number;
  nama_space: string;
  tipe: TipeSpace;
  kapasitas: number;
  harga_per_jam: number | string;
  deskripsi?: string;
  foto?: string;
  id_owner: number;
  owner?: {
    id: number;
    nama_coworking: string;
    nama_pemilik: string;
    telp?: string;
    alamat?: string;
  };
  tersedia?: boolean;
}

// ==========================================
// DISKON TYPES
// ==========================================

export interface Diskon {
  id: number;
  nama_diskon: string;
  kode_diskon: string;
  persentase_diskon: number | string;
  tanggal_awal: string;
  tanggal_akhir: string;
}

// ==========================================
// RESERVASI TYPES
// ==========================================

export type StatusReservasi =
  | 'belum_dikonfirm'
  | 'disetujui'
  | 'aktif'
  | 'selesai'
  | 'dibatalkan';

export interface DetailReservasi {
  id: number;
  id_reservasi: number;
  id_space: number;
  id_diskon?: number;
  total_harga: number | string;
  space: Space;
  diskon?: Diskon;
}

export interface Reservasi {
  id: number;
  kode_reservasi: string;
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  status: StatusReservasi;
  id_member: number;
  id_owner: number;
  member?: Member;
  owner?: SpaceOwner;
  detail_reservasi: DetailReservasi[];
  checkin_at?: string;
  checkout_at?: string;
  createdAt: string;
  qr_code?: string;
}

// ==========================================
// REPORT TYPES
// ==========================================

export interface MonthlyReport {
  periode: { bulan: number; tahun: number };
  summary: {
    total_reservasi: number;
    selesai: number;
    dibatalkan: number;
    aktif: number;
    disetujui: number;
    belum_dikonfirm: number;
  };
  total_pendapatan: number;
  data: Reservasi[];
}

export interface IncomeReport {
  tahun: number;
  total_pendapatan: number;
  per_bulan: Record<number, number>;
  per_tipe_space: Record<string, number>;
}

// ==========================================
// FORM TYPES
// ==========================================

export interface RegisterMemberForm {
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  username: string;
  password: string;
  foto?: string;
}

export interface RegisterAdminForm {
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
  alamat: string;
  deskripsi?: string;
  username: string;
  password: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface CreateReservasiForm {
  id_space: number;
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  kode_diskon?: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
