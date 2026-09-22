import axios, { AxiosError } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token untuk setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Coba sessionStorage dulu
    let token = sessionStorage.getItem('access_token');
    // Fallback ke cookie jika tab baru / sessionStorage kosong
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match) token = decodeURIComponent(match[1]);
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear semua auth data dan redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user');
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// ==========================================
// AUTH
// ==========================================
export const authApi = {
  registerMember: (data: any) => api.post('/auth/register/member', data),
  registerAdmin: (data: any) => api.post('/auth/register/admin-space', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateFoto: (foto: string) => api.patch('/auth/profile/foto', { foto }),
};

// ==========================================
// SPACES
// ==========================================
export const spacesApi = {
  getTypes: () => api.get('/spaces/types'),
  getAvailability: (tanggal: string, jam_mulai: string, durasi: number) =>
    api.get(`/spaces/availability?tanggal=${tanggal}&jam_mulai=${encodeURIComponent(jam_mulai)}&durasi=${durasi}`),
  getAll: () => api.get('/spaces'),
  getOne: (id: number) => api.get(`/spaces/${id}`),
};

// ==========================================
// DISKON
// ==========================================
export const diskonApi = {
  getActive: () => api.get('/diskon/active'),
  check: (kode_diskon: string) => api.post('/diskon/check', { kode_diskon }),
  getOne: (id: number) => api.get(`/diskon/${id}`),
};

// ==========================================
// RESERVASI (MEMBER)
// ==========================================
export const reservasiApi = {
  create: (data: any) => api.post('/reservasi', data),
  getMy: () => api.get('/reservasi/my'),
  getMyHistory: (bulan?: string) =>
    api.get(`/reservasi/my/history${bulan ? `?bulan=${bulan}` : ''}`),
  getEticket: (id: number) => api.get(`/reservasi/${id}/e-ticket`),
  getOne: (id: number) => api.get(`/reservasi/${id}`),
  cancel: (id: number) => api.patch(`/reservasi/${id}/cancel`),
};

// ==========================================
// ADMIN
// ==========================================
export const adminApi = {
  // Profile
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data: any) => api.put('/admin/profile', data),

  // Members
  getMembers: () => api.get('/admin/members'),
  getMember: (id: number) => api.get(`/admin/members/${id}`),
  createMember: (data: any) => api.post('/admin/members', data),
  updateMember: (id: number, data: any) => api.put(`/admin/members/${id}`, data),
  deleteMember: (id: number) => api.delete(`/admin/members/${id}`),

  // Spaces
  getSpaces: () => api.get('/admin/spaces'),
  getSpace: (id: number) => api.get(`/admin/spaces/${id}`),
  createSpace: (data: any) => api.post('/admin/spaces', data),
  updateSpace: (id: number, data: any) => api.put(`/admin/spaces/${id}`, data),
  deleteSpace: (id: number) => api.delete(`/admin/spaces/${id}`),

  // Diskon
  getDiskon: () => api.get('/admin/diskon'),
  getDiskonOne: (id: number) => api.get(`/admin/diskon/${id}`),
  createDiskon: (data: any) => api.post('/admin/diskon', data),
  updateDiskon: (id: number, data: any) => api.put(`/admin/diskon/${id}`, data),
  deleteDiskon: (id: number) => api.delete(`/admin/diskon/${id}`),

  // Reservasi
  getReservasi: (status?: string, bulan?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (bulan) params.append('bulan', bulan);
    return api.get(`/admin/reservasi?${params.toString()}`);
  },
  updateReservasiStatus: (id: number, status: string) =>
    api.patch(`/admin/reservasi/${id}/status`, { status }),
  checkIn: (id: number) => api.post(`/admin/reservasi/${id}/check-in`),
  checkOut: (id: number) => api.post(`/admin/reservasi/${id}/check-out`),

  // Reports
  getMonthlyReport: (bulan: string, tahun: string) =>
    api.get(`/admin/reports/monthly?bulan=${bulan}&tahun=${tahun}`),
  getIncomeReport: (tahun: string) =>
    api.get(`/admin/reports/income?tahun=${tahun}`),
};

// ==========================================
// UPLOAD
// ==========================================
export const uploadApi = {
  uploadGeneral: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadSpace: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/spaces', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMember: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/upload/members', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
