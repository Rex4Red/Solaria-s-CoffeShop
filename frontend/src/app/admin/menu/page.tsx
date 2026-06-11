'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import type { MenuItem } from '@/types';

type SimpleCategory = { id: string; name: string; description?: string };
import toast from 'react-hot-toast';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.menu.getAll(), api.categories.getAll()])
      .then(([m, c]) => { setItems(m); setCategories(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '-';

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus menu ini?')) return;
    try { await api.menu.delete(id); setItems(items.filter(i => i.id !== id)); toast.success('Menu dihapus'); } catch { toast.error('Gagal menghapus'); }
  };

  const handleToggle = async (item: MenuItem) => {
    try {
      await api.menu.update(item.id, { isAvailable: !item.isAvailable });
      setItems(items.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i));
      toast.success(item.isAvailable ? 'Menu dinonaktifkan' : 'Menu diaktifkan');
    } catch { toast.error('Gagal mengubah status'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="font-sans font-bold text-2xl">Manajemen Menu</h1><p className="text-sm text-on-surface-variant">{items.length} item</p></div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-mocha-dark active:scale-95 transition-all">
          <Plus size={16} />Tambah Menu
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu..." className="w-full bg-vanilla-mist border border-oat-milk rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary" />
      </div>

      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center animate-pulse">Memuat...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-vanilla-mist">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Harga</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Stok</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50">
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-on-surface-variant">{getCategoryName(item.categoryId)}</td>
                    <td className="px-4 py-3 font-mono">{formatRupiah(item.price)}</td>
                    <td className="px-4 py-3 font-mono">{item.stock}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(item)} className={`relative w-10 h-5 rounded-full transition-colors ${item.isAvailable ? 'bg-success-green' : 'bg-surface-variant'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.isAvailable ? 'left-5.5' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-latte-beige text-on-surface-variant"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-error-container text-error-rose"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
