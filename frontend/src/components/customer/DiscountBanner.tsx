'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, UserPlus } from 'lucide-react';
import api from '@/lib/api';
import type { Discount } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function DiscountBanner() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState<Discount[]>([]);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    api.discounts
      .getAll()
      .then((all) => {
        const now = Date.now();
        const live = all.filter(
          (d) =>
            d.isActive &&
            new Date(d.startAt).getTime() <= now &&
            new Date(d.endAt).getTime() >= now
        );
        setActive(live);
        if (live.length > 0) {
          setDismissed(sessionStorage.getItem('discount-banner-dismissed') === '1');
        }
      })
      .catch(() => setActive([]));
  }, []);

  if (active.length === 0 || dismissed) return null;

  const isMember = user?.role === 'MEMBER';

  const handleDismiss = () => {
    sessionStorage.setItem('discount-banner-dismissed', '1');
    setDismissed(true);
  };

  const valueLabel = (d: Discount) =>
    d.type === 'percentage' ? `${d.value}%` : formatRupiah(d.value);

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-md animate-slide-up">
      <div className="bg-primary text-on-primary rounded-2xl shadow-[0_8px_24px_rgba(61,43,31,0.28)] border border-on-primary/10 overflow-hidden">
        <div className="flex items-start gap-3 p-3.5">
          <div className="w-9 h-9 rounded-full bg-on-primary/15 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-sans font-bold text-sm leading-tight">Lagi ada promo diskon! 🎉</p>
            <div className="mt-1 space-y-0.5">
              {active.slice(0, 2).map((d) => (
                <p key={d.id} className="text-xs text-on-primary/90 leading-snug">
                  <span className="font-semibold">{d.name}</span> — diskon {valueLabel(d)}{' '}
                  {d.appliesToAll ? 'untuk semua menu' : 'untuk menu tertentu'}
                </p>
              ))}
              {active.length > 2 && (
                <p className="text-xs text-on-primary/70">+{active.length - 2} promo lainnya</p>
              )}
            </div>

            {!isMember && (
              <div className="mt-2.5 flex items-center gap-2">
                <p className="text-[11px] text-on-primary/80 leading-snug flex-grow">
                  Login / daftar member dulu supaya harganya otomatis terpotong.
                </p>
                <button
                  onClick={() => router.push('/member')}
                  className="shrink-0 inline-flex items-center gap-1.5 bg-on-primary text-primary font-semibold text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                >
                  <UserPlus size={13} />
                  Jadi Member
                </button>
              </div>
            )}
            {isMember && (
              <p className="mt-2 text-[11px] text-on-primary/85">
                Kamu sudah member — potongan otomatis diterapkan saat checkout. ✨
              </p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Tutup"
            className="shrink-0 p-1 rounded-lg hover:bg-on-primary/15 text-on-primary/80"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
