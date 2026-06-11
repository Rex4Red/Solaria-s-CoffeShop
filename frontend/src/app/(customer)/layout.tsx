'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import BottomNav from '@/components/customer/BottomNav';
import { useCartStore } from '@/store/cartStore';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const tableToken = useCartStore((s) => s.tableToken);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const hasSession = !!tableToken;
  // Welcome boleh diakses tanpa sesi (di sana user diminta scan QR).
  // order-success juga boleh agar bisa tampil tepat setelah checkout.
  const isPublic = pathname === '/welcome' || pathname === '/order-success';

  // Redirect ke welcome jika mengakses halaman pelanggan tanpa scan QR meja
  useEffect(() => {
    if (mounted && !hasSession && !isPublic) {
      router.replace('/welcome');
    }
  }, [mounted, hasSession, isPublic, router]);

  // Selama hidrasi, tampilkan loader netral (mencegah flash & hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-primary font-sans font-semibold">Memuat...</div>
      </div>
    );
  }

  // Halaman terproteksi tanpa sesi: jangan render konten (sedang redirect)
  if (!hasSession && !isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-primary font-sans font-semibold">Mengarahkan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Desktop Header */}
      <header className="hidden md:flex w-full sticky top-0 bg-surface/80 backdrop-blur-lg shadow-[0_1px_3px_rgba(61,43,31,0.06)] z-40">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Solaria's CoffeeShop" className="h-10 w-auto" />
            <span className="font-sans font-bold text-xl text-primary">
              Solaria&apos;s CoffeeShop
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Nav — hanya tampil setelah scan QR meja */}
      {hasSession && <BottomNav />}
    </div>
  );
}
