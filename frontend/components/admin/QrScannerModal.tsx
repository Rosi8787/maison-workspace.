'use client';

/**
 * QrScannerModal — QR Scanner + Upload Gambar untuk check-in admin
 *
 * Dua mode:
 * 1. KAMERA: Scan langsung dari webcam/kamera HP
 * 2. UPLOAD: Pilih file gambar QR dari device (fallback jika kamera tidak bisa)
 *
 * Fixes:
 * - Race condition DOM: initScanner dipanggil via useEffect SETELAH render
 * - facingMode fallback: environment → user (laptop webcam)
 * - overflow-hidden dihapus dari container html5-qrcode (merusak render viewfinder)
 * - handleRetry menunggu stopScanner selesai sebelum set state scanning
 * - Stale closure: semua state kritis pakai ref
 */

import { useEffect, useRef, useState } from 'react';
import { QrCode, X, CheckCircle, AlertCircle, Camera, Upload, SwitchCamera } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'error';
type ScanMode  = 'camera' | 'upload';

const BORDER = 'rgba(255,255,255,0.08)';
const DOM_ID = 'qr-reader-admin-v2';

export default function QrScannerModal({ isOpen, onClose, onSuccess }: Props) {
  const scannerRef     = useRef<any>(null);
  const processingRef  = useRef(false);
  const lastScannedRef = useRef('');
  const stoppingRef    = useRef(false);   // mencegah init saat stop sedang berjalan

  const [scanState,  setScanState]  = useState<ScanState>('idle');
  const [scanMode,   setScanMode]   = useState<ScanMode>('camera');
  const [resultMsg,  setResultMsg]  = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');

  /* ─── Stop scanner dengan aman ─────────────────────────────────── */
  async function stopScanner() {
    stoppingRef.current = true;
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch { /* ignore */ }
      scannerRef.current = null;
    }
    stoppingRef.current = false;
  }

  /* ─── Inisialisasi kamera scanner ─────────────────────────────── */
  async function initCameraScanner() {
    if (stoppingRef.current) return; // tunggu stop selesai

    const { Html5Qrcode } = await import('html5-qrcode');

    const el = document.getElementById(DOM_ID);
    if (!el) {
      setScanState('error');
      setErrorMsg('Elemen scanner tidak tersedia. Coba tutup dan buka kembali modal.');
      return;
    }

    const scanner = new Html5Qrcode(DOM_ID, { verbose: false });
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 220, height: 220 },
      aspectRatio: 1.0,
    };

    const onScanSuccess = async (decodedText: string) => {
      if (processingRef.current) return;
      if (decodedText === lastScannedRef.current) return;
      lastScannedRef.current = decodedText;
      processingRef.current  = true;
      await stopScanner();
      await processQrResult(decodedText);
    };

    // Coba kamera belakang (HP) → fallback kamera depan (laptop)
    let started = false;
    for (const facing of ['environment', 'user'] as const) {
      if (started) break;
      try {
        await scanner.start({ facingMode: facing }, config, onScanSuccess, () => {});
        started = true;
      } catch { /* coba facing berikutnya */ }
    }

    if (!started) {
      setScanState('error');
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        setErrorMsg('Izin kamera ditolak. Klik ikon 🔒 di address bar browser → izinkan akses kamera → refresh halaman.');
      } else {
        setErrorMsg('Kamera tidak dapat diakses. Coba mode Upload Gambar sebagai alternatif.');
      }
    }
  }

  /* ─── Cek apakah user sudah izinkan kamera ─────────────────────── */
  async function checkCameraPermission(): Promise<boolean> {
    try {
      if (!navigator.permissions) return false;
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state !== 'denied';
    } catch { return false; }
  }

  /* ─── Proses file upload gambar QR ─────────────────────────────── */
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanState('processing');

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const tempId = 'qr-file-reader';

      // Buat elemen temp tersembunyi untuk scan dari file
      let tempEl = document.getElementById(tempId);
      if (!tempEl) {
        tempEl = document.createElement('div');
        tempEl.id = tempId;
        tempEl.style.display = 'none';
        document.body.appendChild(tempEl);
      }

      const scanner = new Html5Qrcode(tempId, { verbose: false });
      const result  = await scanner.scanFile(file, false);
      scanner.clear();
      tempEl.remove();

      processingRef.current = true;
      await processQrResult(result);
    } catch (err: any) {
      setScanState('error');
      setErrorMsg('QR Code tidak terdeteksi pada gambar. Pastikan gambar jelas dan QR Code terlihat penuh.');
      processingRef.current = false;
    }

    // Reset input agar file yang sama bisa dipilih lagi
    e.target.value = '';
  }

  /* ─── Parse QR dan lakukan check-in ─────────────────────────────── */
  async function processQrResult(decoded: string) {
    setScanState('processing');

    try {
      let kodeReservasi = decoded;
      let reservasiId: number | null = null;

      // Format 1 — JSON dari backend kita: { kode, id, member }
      try {
        const parsed = JSON.parse(decoded);
        if (parsed.kode) kodeReservasi = parsed.kode;
        if (parsed.id)   reservasiId   = parseInt(String(parsed.id));
      } catch { /* bukan JSON, lanjut */ }

      if (reservasiId) {
        await adminApi.checkIn(reservasiId);
        setScanState('success');
        setResultMsg(`Kode: ${kodeReservasi}`);
        onSuccess(`Check-in berhasil — ${kodeReservasi}`);
        return;
      }

      // Format 2 — Panitia: "VERIFY-RESERVASI-{id}-{key}"
      const m = decoded.match(/VERIFY-RESERVASI-(\d+)/);
      if (m) {
        const id = parseInt(m[1]);
        await adminApi.checkIn(id);
        setScanState('success');
        setResultMsg(`Reservasi #${id}`);
        onSuccess(`Check-in berhasil — Reservasi #${id}`);
        return;
      }

      // Format 3 — Hanya kode teks tanpa ID
      setScanState('error');
      setErrorMsg(
        `QR terbaca: "${kodeReservasi}"\n\nKode tidak mengandung ID reservasi yang dikenali.\nGunakan tombol Check-In manual pada tabel reservasi.`,
      );
    } catch (err: any) {
      setScanState('error');
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes('disetujui')) {
        setErrorMsg('Reservasi belum "Disetujui". Konfirmasi reservasi terlebih dahulu.');
      } else if (msg.includes('404') || msg.toLowerCase().includes('tidak ditemukan')) {
        setErrorMsg('Reservasi tidak ditemukan. QR Code mungkin sudah tidak valid.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      processingRef.current = false;
    }
  }

  /* ─── useEffect: init kamera setelah DOM render elemen target ──── */
  useEffect(() => {
    if (scanState === 'scanning' && scanMode === 'camera' && isOpen) {
      const t = setTimeout(() => { initCameraScanner(); }, 100);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanState, scanMode, isOpen]);

  /* ─── useEffect: cleanup saat modal tutup ───────────────────────── */
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setScanState('idle');
      setScanMode('camera');
      setResultMsg('');
      setErrorMsg('');
      processingRef.current  = false;
      lastScannedRef.current = '';
    }
  }, [isOpen]); // eslint-disable-line

  /* ─── Cleanup saat unmount ──────────────────────────────────────── */
  useEffect(() => {
    return () => { stopScanner(); };
  }, []); // eslint-disable-line

  /* ─── Handlers ──────────────────────────────────────────────────── */
  function handleClose() {
    stopScanner();
    setScanState('idle');
    setScanMode('camera');
    setResultMsg('');
    setErrorMsg('');
    processingRef.current  = false;
    lastScannedRef.current = '';
    onClose();
  }

  async function handleStartCamera() {
    await stopScanner(); // pastikan scanner lama sudah berhenti
    setResultMsg('');
    setErrorMsg('');
    processingRef.current  = false;
    lastScannedRef.current = '';
    setScanMode('camera');
    setScanState('scanning');
  }

  async function handleRetry() {
    await stopScanner(); // tunggu selesai sebelum re-init
    setResultMsg('');
    setErrorMsg('');
    processingRef.current  = false;
    lastScannedRef.current = '';
    if (scanMode === 'camera') {
      setScanState('scanning');
    } else {
      setScanState('idle');
    }
  }

  function handleSwitchToUpload() {
    stopScanner();
    setScanMode('upload');
    setScanState('idle');
    setErrorMsg('');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)' }}
        onClick={handleClose}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl z-10"
        style={{ background: '#1c1410', border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,167,122,0.15)', border: '1px solid rgba(201,167,122,0.25)' }}
            >
              <QrCode size={15} style={{ color: '#c9a77a' }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: '#f4eee7' }}>Scan QR Check-In</h2>
              <p className="text-xs" style={{ color: '#7a6a5a' }}>
                {scanMode === 'camera' ? 'Kamera aktif' : 'Upload gambar QR'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg" style={{ color: '#7a6a5a' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">

          {/* ── IDLE ── */}
          {scanState === 'idle' && (
            <div className="space-y-3">
              <div className="text-center pb-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(201,167,122,0.10)', border: '1px solid rgba(201,167,122,0.20)' }}
                >
                  <QrCode size={28} style={{ color: '#c9a77a' }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: '#f4eee7' }}>
                  {scanMode === 'camera' ? 'Scan via Kamera' : 'Pilih Gambar QR'}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#7a6a5a' }}>
                  {scanMode === 'camera'
                    ? 'Arahkan kamera ke QR Code pada e-ticket member. Pastikan izin kamera sudah diberikan.'
                    : 'Pilih file gambar yang berisi QR Code dari galeri atau folder.'}
                </p>
              </div>

              {scanMode === 'camera' && (
                <button onClick={handleStartCamera} className="btn-primary w-full justify-center">
                  <Camera size={15} />
                  Aktifkan Kamera
                </button>
              )}

              {scanMode === 'upload' && (
                <label className="btn-primary w-full justify-center cursor-pointer flex items-center gap-2">
                  <Upload size={15} />
                  Pilih Gambar QR
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}

              {/* Toggle mode */}
              <button
                onClick={scanMode === 'camera' ? handleSwitchToUpload : () => { setScanMode('camera'); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs transition-colors"
                style={{ color: '#7a6a5a', background: 'rgba(255,255,255,0.04)' }}
              >
                <SwitchCamera size={13} />
                {scanMode === 'camera' ? 'Pakai Upload Gambar sebagai gantinya' : 'Kembali ke mode Kamera'}
              </button>
            </div>
          )}

          {/* ── SCANNING (kamera aktif) ──
              PENTING: div#DOM_ID harus ada di DOM saat initCameraScanner() dipanggil.
              Karena state === 'scanning' menyebabkan ini dirender,
              dan useEffect jalan SETELAH render → elemen sudah pasti ada.
          ── */}
          {scanState === 'scanning' && scanMode === 'camera' && (
            <div>
              {/* html5-qrcode akan inject video stream ke dalam div ini */}
              {/* JANGAN pakai overflow-hidden — akan memblokir viewfinder scanner */}
              <div
                id={DOM_ID}
                style={{ width: '100%', minHeight: '300px', background: '#120d0b', borderRadius: '12px' }}
              />
              <p className="text-xs text-center mt-3" style={{ color: '#7a6a5a' }}>
                Posisikan QR Code di dalam bingkai · Deteksi otomatis
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={handleSwitchToUpload} className="btn-secondary flex-1 text-xs justify-center">
                  <Upload size={12} /> Upload
                </button>
                <button onClick={handleClose} className="btn-secondary flex-1 text-xs justify-center">
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {scanState === 'processing' && (
            <div className="text-center py-10">
              <LoadingSpinner size="lg" />
              <p className="text-sm mt-4 font-medium" style={{ color: '#f4eee7' }}>Memproses check-in…</p>
              <p className="text-xs mt-1" style={{ color: '#7a6a5a' }}>Mohon tunggu sebentar</p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {scanState === 'success' && (
            <div className="text-center py-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.30)' }}
              >
                <CheckCircle size={26} style={{ color: '#4ade80' }} />
              </div>
              <p className="font-semibold mb-1" style={{ color: '#4ade80' }}>Check-In Berhasil!</p>
              {resultMsg && (
                <p className="text-xs mt-1 whitespace-pre-line" style={{ color: '#7a6a5a' }}>{resultMsg}</p>
              )}
              <div className="flex gap-2 mt-5">
                <button onClick={handleRetry} className="btn-secondary flex-1 text-sm justify-center">
                  Scan Lagi
                </button>
                <button onClick={handleClose} className="btn-primary flex-1 text-sm justify-center">
                  Selesai
                </button>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {scanState === 'error' && (
            <div className="text-center py-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)' }}
              >
                <AlertCircle size={26} style={{ color: '#f87171' }} />
              </div>
              <p className="font-semibold mb-2" style={{ color: '#f87171' }}>Gagal</p>
              {errorMsg && (
                <p className="text-xs whitespace-pre-line leading-relaxed px-1" style={{ color: '#b8a898' }}>
                  {errorMsg}
                </p>
              )}
              <div className="flex gap-2 mt-5">
                {/* Jika error kamera → tawarkan upload sebagai alternatif */}
                {scanMode === 'camera' && (
                  <button onClick={handleSwitchToUpload} className="btn-secondary flex-1 text-xs justify-center">
                    <Upload size={12} /> Upload
                  </button>
                )}
                <button onClick={handleRetry} className="btn-secondary flex-1 text-sm justify-center">
                  Coba Lagi
                </button>
                <button onClick={handleClose} className="btn-primary flex-1 text-sm justify-center">
                  Tutup
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
