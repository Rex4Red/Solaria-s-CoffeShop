'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type CategoryItem = { id: string; name: string; description?: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => { api.categories.getAll().then(setCategories).catch(console.error).finally(() => setLoading(false)); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try { const cat = await api.categories.create({ name: newName.trim() }) as CategoryItem; setCategories([...categories, cat]); setNewName(''); toast.success('Kategori ditambahkan'); } catch { toast.error('Gagal menambah'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori?')) return;
    try { await api.categories.delete(id); setCategories(categories.filter(c => c.id !== id)); toast.success('Dihapus'); } catch { toast.error('Gagal menghapus'); }
  };

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl mb-6">Manajemen Kategori</h1>
      <div className="flex gap-2 mb-6 max-w-md">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Nama kategori baru..." className="flex-grow bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
        <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-mocha-dark active:scale-95 transition-all flex items-center gap-2"><Plus size={16} />Tambah</button>
      </div>
      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center animate-pulse">Memuat...</div> : (
          <div className="divide-y divide-oat-milk">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-vanilla-mist/50">
                <span className="font-medium">{c.name}</span>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-error-rose hover:text-error font-medium">Hapus</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
