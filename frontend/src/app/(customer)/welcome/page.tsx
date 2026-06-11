'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { UtensilsCrossed, QrCode, ScanLine, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Suspense, useEffect, useState } from 'react';
import api from '@/lib/api';
import QRCodeLib from 'qrcode';

// ─────────────────────────────────────────────
// Tampilan ketika SUDAH scan QR (punya sesi meja)
// ─────────────────────────────────────────────
function WelcomeCard({ tableNumber, qrToken }: { tableNumber: string; qrToken: string }) {
  const router = useRouter();
  const setTable = useCartStore((s) => s.setTable);

  const handleViewMenu = () => {
    setTable(qrToken, parseInt(tableNumber || '0', 10));
    router.push(`/menu?table=${tableNumber}`);
  };

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_24px_rgba(61,43,31,0.08)] border border-oat-milk flex flex-col items-center text-center animate-scale-in">
        <div className="mb-6 w-24 h-24 rounded-full bg-latte-beige flex items-center justify-center shadow-[0_4px_12px_rgba(61,43,31,0.06)] overflow-hidden">
          <Image src="/logo.png" alt="Solaria's CoffeeShop" width={80} height={80} className="object-contain" />
        </div>

        <h1 className="font-sans font-bold text-2xl md:text-[28px] text-primary mb-2 leading-tight">
          Selamat Datang di
        </h1>
        <p className="font-sans font-semibold text-lg text-on-surface-variant mb-8">
          Solaria&apos;s CoffeeShop
        </p>

        <div className="bg-vanilla-mist border border-oat-milk rounded-xl py-4 px-8 mb-8 w-full">
          <p className="font-body text-xs text-on-surface-variant mb-1 uppercase tracking-widest">
            Nomor Meja
          </p>
          <p className="font-sans font-bold text-4xl text-mocha-dark">
            Meja {tableNumber}
          </p>
        </div>

        <button
          onClick={handleViewMenu}
          className="w-full bg-primary-container text-on-primary font-sans font-semibold text-lg py-4 px-6 rounded-xl shadow-[0_4px_12px_rgba(61,43,31,0.12)] hover:bg-primary transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-3"
        >
          <UtensilsCrossed size={22} />
          Lihat Menu
        </button>

        <p className="mt-6 text-xs text-outline flex items-center gap-1.5">
          <QrCode size={14} />
          Pindai QR code lain jika nomor meja tidak sesuai
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tampilan default: BELUM scan QR → wajib scan,
// menampilkan 10 QR meja yang bisa dipindai
// ─────────────────────────────────────────────
function ScanRequired() {
  const [qrs, setQrs] = useState<{ tableNumber: number; qrDataUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    api.tables
      .getAll()
      .then(async (tables) => {
        const sorted = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);
        const generated = await Promise.all(
          sorted.map(async (t) => ({
            tableNumber: t.tableNumber,
            qrDataUrl: await QRCodeLib.toDataURL(`${origin}/order?table=${t.qrToken}`, {
              margin: 2,
              width: 300,
              color: { dark: '#3D2B1F', light: '#FFFFFF' },
            }),
          }))
        );
        setQrs(generated);
      })
      .catch(() => setQrs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl flex flex-col items-center text-center pt-8 md:pt-12">
        <div className="mb-5 w-20 h-20 rounded-full bg-latte-beige flex items-center justify-center shadow-[0_4px_12px_rgba(61,43,31,0.06)] overflow-hidden">
          <Image src="/logo.png" alt="Solaria's CoffeeShop" width={64} height={64} className="object-contain" />
        </div>

        <h1 className="font-sans font-bold text-2xl md:text-3xl text-primary mb-2 leading-tight">
          Solaria&apos;s CoffeeShop
        </h1>

        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <ScanLine size={18} className="text-primary" />
          <p className="font-sans font-semibold text-base">Scan QR di meja Anda untuk memesan</p>
        </div>
        <p className="text-sm text-outline max-w-md mb-8">
          Buka kamera HP Anda, arahkan ke QR code yang tersedia di meja, lalu pilih menu dan pesan langsung. Belum bisa memesan sebelum memindai QR meja.
        </p>

        <div className="w-full bg-surface/80 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-oat-milk shadow-[0_8px_24px_rgba(61,43,31,0.08)]">
          <p className="font-sans font-semibold text-sm text-primary mb-4 text-left">QR Code Meja</p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="text-primary animate-spin mb-3" />
              <p className="text-sm text-on-surface-variant">Memuat QR code meja...</p>
            </div>
          ) : qrs.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-10">Belum ada data meja tersedia.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {qrs.map((q) => (
                <div
                  key={q.tableNumber}
                  className="bg-surface-bright border border-oat-milk rounded-xl p-3 flex flex-col items-center"
                >
                  <img
                    src={q.qrDataUrl}
                    alt={`QR Meja ${q.tableNumber}`}
                    className="w-full max-w-[140px] aspect-square rounded-lg"
                  />
                  <p className="font-sans font-bold text-sm text-primary mt-2">Meja {q.tableNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-outline flex items-center gap-1.5 mb-8">
          <QrCode size={14} />
          Minta bantuan kasir jika QR code tidak bisa dipindai
        </p>
      </div>
    </div>
  );
}

function WelcomeContent() {
  const searchParams = useSearchParams();
  const storeToken = useCartStore((s) => s.tableToken);
  const storeNumber = useCartStore((s) => s.tableNumber);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const urlTable = searchParams.get('table');
  const urlToken = searchParams.get('token');

  // Sesi meja valid jika ada token dari hasil scan (URL) atau sesi tersimpan
  const qrToken = urlToken || (mounted ? storeToken : null) || '';
  const tableNumber = urlTable || (mounted && storeNumber != null ? String(storeNumber) : '');

  // Hindari mismatch hidrasi: tunggu mounted sebelum memutuskan dari store
  if (!mounted && !urlToken) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-sans font-semibold">Memuat...</div>
      </div>
    );
  }

  if (qrToken) {
    return <WelcomeCard tableNumber={tableNumber || '-'} qrToken={qrToken} />;
  }

  return <ScanRequired />;
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="gradient-bg min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-primary font-sans font-semibold">Memuat...</div>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
