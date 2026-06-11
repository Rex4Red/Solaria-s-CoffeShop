'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';
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

  // Modal tambah/edit
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    isAvailable: true,
  });

  useEffect(() => {
    Promise.all([api.menu.getAll(), api.categories.getAll()])
      .then(([m, c]) => { setItems(m); setCategories(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => api.menu.getAll().then(setItems).catch(console.error);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', stock: '', isAvailable: true });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price ?? ''),
      categoryId: item.categoryId || '',
      stock: String(item.stock ?? ''),
      isAvailable: item.isAvailable,
    });
    setShowModal(true);
  };

  const closeModal = () => { if (!saving) setShowModal(false); };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Nama menu wajib diisi'); return; }
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) { toast.error('Harga tidak valid'); return; }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      categoryId: form.categoryId || undefined,
      stock: form.stock === '' ? undefined : Number(form.stock),
      isAvailable: form.isAvailable,
    };

    setSaving(true);
    try {
      if (editing) {
        await api.menu.update(editing.id, payload);
        toast.success('Menu diperbarui');
      } else {
        await api.menu.create(payload);
        toast.success('Menu ditambahkan');
      }
      await refresh();
      setShowModal(false);
    } catch {
      toast.error(editing ? 'Gagal memperbarui menu' : 'Gagal menambah menu');
    } finally {
      setSaving(false);
    }
  };

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
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-mocha-dark active:scale-95 transition-all">
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
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-latte-beige text-on-surface-variant"><Edit2 size={14} /></button>
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

      {/* Modal Tambah/Edit Menu */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={closeModal}>
          <div className="w-full max-w-md bg-surface-bright rounded-2xl shadow-xl border border-oat-milk max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-oat-milk flex items-center justify-between">
              <h2 className="font-sans font-bold text-lg">{editing ? 'Edit Menu' : 'Tambah Menu'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-latte-beige text-on-surface-variant"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Menu *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Contoh: Cappuccino" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi singkat..." className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm resize-none h-20 focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Harga (Rp) *</label>
                  <input type="number" inputMode="numeric" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="25000" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Stok</label>
                  <input type="number" inputMode="numeric" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="100" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Kategori</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
                  <option value="">— Tanpa kategori —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setForm(f => ({ ...f, isAvailable: !f.isAvailable }))} className={`relative w-10 h-5 rounded-full transition-colors ${form.isAvailable ? 'bg-success-green' : 'bg-surface-variant'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAvailable ? 'left-5.5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm">Tersedia untuk dipesan</span>
              </label>
            </div>
            <div className="px-5 py-4 border-t border-oat-milk flex justify-end gap-2">
              <button onClick={closeModal} disabled={saving} className="px-4 py-2.5 rounded-xl border border-oat-milk text-on-surface-variant text-sm font-medium hover:bg-latte-beige disabled:opacity-60">Batal</button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-mocha-dark active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" />Menyimpan...</> : (editing ? 'Simpan' : 'Tambah')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
