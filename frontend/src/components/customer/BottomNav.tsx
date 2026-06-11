'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coffee, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/welcome', icon: Home, label: 'Home' },
  { href: '/menu', icon: Coffee, label: 'Menu' },
  { href: '/cart', icon: ShoppingBag, label: 'Keranjang', showBadge: true },
  { href: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-2xl bg-surface/95 backdrop-blur-lg shadow-[0_-4px_16px_rgba(61,43,31,0.08)] pb-[env(safe-area-inset-bottom,8px)]">
      <div className="flex justify-around items-center px-4 pt-2 pb-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/menu' && pathname?.startsWith('/menu'));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-all duration-200 relative min-w-[60px]',
                isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary/70'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 mb-0.5',
                isActive && 'bg-primary-container/30'
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Cart badge */}
              {item.showBadge && totalItems > 0 && (
                <span className="absolute top-0.5 right-2 min-w-[18px] h-[18px] bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
              
              <span className={cn(
                'text-[10px] leading-tight',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
