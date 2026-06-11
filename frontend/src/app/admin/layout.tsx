'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Coffee, Layers, Package, Tag, Users, ClipboardList, CreditCard, QrCode, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/menu', icon: Coffee, label: 'Menu' },
  { href: '/admin/categories', icon: Layers, label: 'Kategori' },
  { href: '/admin/inventory', icon: Package, label: 'Inventori' },
  { href: '/admin/orders', icon: ClipboardList, label: 'Pesanan' },
  { href: '/admin/tables', icon: QrCode, label: 'Meja & QR' },
  { href: '/admin/discounts', icon: Tag, label: 'Diskon' },
  { href: '/admin/members', icon: Users, label: 'Member' },
  { href: '/admin/payments', icon: CreditCard, label: 'Pembayaran' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-mocha-dark text-white flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full bg-white/10 object-contain" />
            <div><h1 className="font-sans font-bold">Solaria&apos;s</h1><p className="text-xs text-white/50">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium', active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/80')}>
                <Icon size={18} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/5 hover:text-white/80 transition-all w-full text-sm">
            <LogOut size={18} />Keluar
          </button>
        </div>
      </aside>
      {/* Mobile nav */}
      <div className="flex-grow flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-mocha-dark text-white overflow-x-auto">
          <h1 className="font-sans font-bold shrink-0 mr-4">Admin</h1>
          <div className="flex gap-1 overflow-x-auto hide-scrollbar">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (<Link key={item.href} href={item.href} className={cn('p-2 rounded-lg shrink-0', active ? 'bg-white/15' : 'text-white/60')}><Icon size={18} /></Link>);
            })}
          </div>
        </header>
        <main className="flex-grow p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
