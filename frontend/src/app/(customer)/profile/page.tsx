'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogIn, LogOut, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isMember = mounted && user?.role === 'MEMBER';

  return (
    <div className="min-h-screen safe-bottom-padding">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-lg shadow-[0_1px_3px_rgba(61,43,31,0.06)] md:hidden">
        <div className="px-4 py-3"><h1 className="font-sans font-bold text-xl text-primary">Profil</h1></div>
      </header>
      <div className="max-w-lg mx-auto px-4 pt-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-latte-beige flex items-center justify-center mb-4">
          <User size={40} className="text-outline-variant" />
        </div>

        {isMember ? (
          <>
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="font-sans font-bold text-lg text-on-surface">{user?.name}</h2>
              <BadgeCheck size={18} className="text-success-green" />
            </div>
            <p className="text-sm text-on-surface-variant mb-1">{user?.email}</p>
            <span className="px-3 py-0.5 rounded-full bg-success-green/15 text-success-green text-xs font-semibold mb-8">Member Aktif</span>
            <p className="text-xs text-outline text-center max-w-xs mb-6">
              Saat ada promo, potongan harga otomatis diterapkan untukmu di checkout.
            </p>
            <button
              onClick={() => { logout(); }}
              className="w-full max-w-xs border border-error-rose text-error-rose font-sans font-semibold py-3 rounded-xl hover:bg-error-rose/5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />Keluar
            </button>
          </>
        ) : (
          <>
            <h2 className="font-sans font-bold text-lg text-on-surface mb-1">Tamu</h2>
            <p className="text-sm text-on-surface-variant mb-8 text-center">Jadi member untuk dapat potongan harga saat ada promo</p>
            <button
              onClick={() => router.push('/member')}
              className="w-full max-w-xs bg-primary text-on-primary font-sans font-semibold py-3.5 rounded-xl hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={18} />Login / Daftar Member
            </button>
          </>
        )}
      </div>
    </div>
  );
}
