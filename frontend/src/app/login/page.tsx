'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password }) as { user: { id: string; email: string; name: string; role: string }; session: { access_token: string } };
      const role = res.user.role.toUpperCase() as 'ADMIN' | 'KASIR' | 'MEMBER';
      const user = { id: res.user.id, email: res.user.email, name: res.user.name, role };
      login(user, res.session.access_token);
      toast.success(`Selamat datang, ${user.name}!`);
      router.push(role === 'ADMIN' ? '/admin' : role === 'KASIR' ? '/kasir' : '/welcome');
    } catch { toast.error('Email atau password salah'); } finally { setLoading(false); }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_8px_24px_rgba(61,43,31,0.08)] border border-oat-milk animate-scale-in">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="mb-4 rounded-full bg-latte-beige p-2" />
          <h1 className="font-sans font-bold text-xl text-primary">Masuk</h1>
          <p className="text-sm text-on-surface-variant">Panel Admin & Kasir</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="admin@solaria.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary font-sans font-semibold py-3.5 rounded-xl hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin" />Memproses...</> : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
