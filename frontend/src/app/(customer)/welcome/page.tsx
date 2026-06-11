'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { UtensilsCrossed, QrCode } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Suspense } from 'react';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTable = useCartStore((s) => s.setTable);

  const tableNumber = searchParams.get('table') || '1';
  const qrToken = searchParams.get('token') || '';

  const handleViewMenu = () => {
    setTable(qrToken, parseInt(tableNumber));
    router.push(`/menu?table=${tableNumber}`);
  };

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_24px_rgba(61,43,31,0.08)] border border-oat-milk flex flex-col items-center text-center animate-scale-in">
        {/* Logo */}
        <div className="mb-6 w-24 h-24 rounded-full bg-latte-beige flex items-center justify-center shadow-[0_4px_12px_rgba(61,43,31,0.06)] overflow-hidden">
          <Image
            src="/logo.png"
            alt="Solaria's CoffeeShop"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Greeting */}
        <h1 className="font-sans font-bold text-2xl md:text-[28px] text-primary mb-2 leading-tight">
          Selamat Datang di
        </h1>
        <p className="font-sans font-semibold text-lg text-on-surface-variant mb-8">
          Solaria&apos;s CoffeeShop
        </p>

        {/* Table Number */}
        <div className="bg-vanilla-mist border border-oat-milk rounded-xl py-4 px-8 mb-8 w-full">
          <p className="font-body text-xs text-on-surface-variant mb-1 uppercase tracking-widest">
            Nomor Meja
          </p>
          <p className="font-sans font-bold text-4xl text-mocha-dark">
            Meja {tableNumber}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleViewMenu}
          className="w-full bg-primary-container text-on-primary font-sans font-semibold text-lg py-4 px-6 rounded-xl shadow-[0_4px_12px_rgba(61,43,31,0.12)] hover:bg-primary transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-3"
        >
          <UtensilsCrossed size={22} />
          Lihat Menu
        </button>

        {/* Helper Text */}
        <p className="mt-6 text-xs text-outline flex items-center gap-1.5">
          <QrCode size={14} />
          Pindai QR code lain jika nomor meja tidak sesuai
        </p>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-sans font-semibold">Memuat...</div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
