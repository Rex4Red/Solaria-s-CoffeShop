'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

function OrderRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const qrToken = searchParams.get('table');
    if (!qrToken) {
      setError('QR code tidak valid — parameter meja tidak ditemukan.');
      return;
    }

    api.tables.verify(qrToken)
      .then((table) => {
        // Redirect to welcome page with table number and qrToken
        router.replace(`/welcome?table=${table.tableNumber}&token=${qrToken}`);
      })
      .catch(() => {
        setError('QR code tidak valid atau meja sudah tidak aktif.');
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-oat-milk text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-error-rose/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={32} className="text-error-rose" />
          </div>
          <h1 className="font-sans font-bold text-xl text-primary mb-2">Oops!</h1>
          <p className="text-sm text-on-surface-variant mb-6">{error}</p>
          <p className="text-xs text-outline">Minta bantuan kasir untuk QR code meja yang baru.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
        <p className="font-sans font-semibold text-primary">Memverifikasi meja...</p>
        <p className="text-xs text-on-surface-variant mt-1">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-sans font-semibold">Memuat...</div>
      </div>
    }>
      <OrderRedirect />
    </Suspense>
  );
}
