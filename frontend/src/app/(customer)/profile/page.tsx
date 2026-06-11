'use client';

import { User, LogIn } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen safe-bottom-padding">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-lg shadow-[0_1px_3px_rgba(61,43,31,0.06)] md:hidden">
        <div className="px-4 py-3"><h1 className="font-sans font-bold text-xl text-primary">Profil</h1></div>
      </header>
      <div className="max-w-lg mx-auto px-4 pt-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-latte-beige flex items-center justify-center mb-4">
          <User size={40} className="text-outline-variant" />
        </div>
        <h2 className="font-sans font-bold text-lg text-on-surface mb-1">Tamu</h2>
        <p className="text-sm text-on-surface-variant mb-8">Masuk untuk mendapatkan poin member</p>
        <button className="w-full max-w-xs bg-primary text-on-primary font-sans font-semibold py-3.5 rounded-xl hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2">
          <LogIn size={18} />Login / Daftar Member
        </button>
      </div>
    </div>
  );
}
