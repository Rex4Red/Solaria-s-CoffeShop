'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Loader2, LogIn, UserPlus } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

type AuthResponse = {
  user: { id: string; email: string; name: string; role: string };
  session: { access_token: string };
};

function MemberAuthContent() {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const tableNumber = useCartStore((s) => s.tableNumber);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const backToMenu = () => router.push(tableNumber ? `/menu?table=${tableNumber}` : '/menu');

  const handleSubmit = async () => {
    if (!email.trim() || !password) { toast.error('Email dan password wajib diisi'); return; }
    if (mode === 'register' && !name.trim()) { toast.error('Nama wajib diisi'); return; }
    if (password.length < 6) { toast.error('Password minimal 6 karakter'); return; }

    setLoading(true);
    try {
      const res = (mode === 'register'
        ? await api.auth.register({ email: email.trim(), password, name: name.trim() })
        : await api.auth.login({ email: email.trim(), password })) as unknown as AuthResponse;

      const token = res.session?.access_token;
      if (!token) throw new Error('Token tidak diterima dari server');

      const role = (res.user.role || 'member').toUpperCase() as 'ADMIN' | 'KASIR' | 'MEMBER';
      loginStore({ id: res.user.id, email: res.user.email, name: res.user.name, role }, token);

      toast.success(mode === 'register' ? `Selamat bergabung, ${res.user.name}!` : `Selamat datang, ${res.user.name}!`);

      // Admin/Kasir tetap diarahkan ke panel masing-masing
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'KASIR') router.push('/kasir');
      else backToMenu();
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : 'Gagal memproses';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface/85 backdrop-blur-md rounded-2xl p-7 shadow-[0_8px_24px_rgba(61,43,31,0.1)] border border-oat-milk animate-scale-in">
        <button onClick={backToMenu} className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary mb-4">
          <ArrowLeft size={16} />Kembali ke menu
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-latte-beige flex items-center justify-center mb-3 overflow-hidden">
            <Image src="/logo.png" alt="Solaria's CoffeeShop" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="font-sans font-bold text-xl text-primary">
            {mode === 'login' ? 'Masuk Member' : 'Daftar Member'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Jadi member untuk dapat potongan harga saat ada promo
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-vanilla-mist rounded-xl p-1 mb-5">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
          >
            Masuk
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
          >
            Daftar
          </button>
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Nama</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="Minimal 6 karakter" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 bg-primary text-on-primary font-sans font-semibold py-3.5 rounded-xl hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
        </button>
      </div>
    </div>
  );
}

export default function MemberAuthPage() {
  return (
    <Suspense fallback={<div className="gradient-bg min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary font-semibold">Memuat...</div></div>}>
      <MemberAuthContent />
    </Suspense>
  );
}
