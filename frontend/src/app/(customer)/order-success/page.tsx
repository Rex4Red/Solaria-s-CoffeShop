'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import Image from 'next/image';

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const orderNumber = params.get('orderNumber') || '-';
  const table = params.get('table') || '-';

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_24px_rgba(61,43,31,0.08)] border border-oat-milk text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-success-green/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={44} className="text-success-green" />
        </div>
        <h1 className="font-sans font-bold text-2xl text-primary mb-2">Pesanan Berhasil!</h1>
        <p className="text-on-surface-variant text-sm mb-6">Pesananmu sedang diproses oleh kasir</p>
        <div className="bg-vanilla-mist border border-oat-milk rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">No. Pesanan</span>
            <span className="font-mono font-bold text-primary">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Meja</span>
            <span className="font-sans font-semibold">Meja {table}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => router.push('/menu')} className="w-full bg-primary text-on-primary font-sans font-semibold py-3.5 rounded-xl hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2">
            <RotateCcw size={18} />Pesan Lagi
          </button>
          <button onClick={() => router.push('/welcome')} className="w-full border border-oat-milk text-on-surface-variant font-sans font-medium py-3 rounded-xl hover:bg-latte-beige active:scale-[0.97] transition-all">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary">Memuat...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
