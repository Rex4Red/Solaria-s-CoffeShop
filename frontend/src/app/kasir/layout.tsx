'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ClipboardList, History, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';

const navItems = [
  { href: '/kasir', icon: ClipboardList, label: 'Pesanan Masuk' },
  { href: '/kasir/history', icon: History, label: 'Riwayat' },
];

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <ProtectedRoute allowedRoles={['KASIR', 'ADMIN']}>
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-mocha-dark text-white flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full bg-white/10 object-contain" />
            <div>
              <h1 className="font-sans font-bold text-base">Solaria&apos;s</h1>
              <p className="text-xs text-white/50">Panel Kasir</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium', active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/80')}>
                <Icon size={18} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white/80 transition-all w-full text-sm">
            <LogOut size={18} />Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-grow flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-mocha-dark text-white">
          <h1 className="font-sans font-bold">Kasir</h1>
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={cn('p-2 rounded-lg', active ? 'bg-white/15' : 'text-white/60')}>
                  <Icon size={20} />
                </Link>
              );
            })}
          </div>
        </header>
        <main className="flex-grow p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
