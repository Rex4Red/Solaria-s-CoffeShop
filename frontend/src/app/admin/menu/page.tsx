'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Upload, Image as ImageIcon, Coffee } from 'lucide-react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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
    setImageFile(null);
    setImagePreview('');
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
    setImageFile(null);
    setImagePreview(item.imageUrl || '');
    setShowModal(true);
  };

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('File harus berupa gambar'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran gambar maksimal 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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
      let targetId = editing?.id;
      if (editing) {
        await api.menu.update(editing.id, payload);
      } else {
        const created = await api.menu.create(payload);
        targetId = created.id;
      }
      // Upload foto jika ada file baru dipilih
      if (imageFile && targetId) {
        await api.menu.uploadImage(targetId, imageFile);
      }
      toast.success(editing ? 'Menu diperbarui' : 'Menu ditambahkan');
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
    try {
      await api.menu.delete(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Menu dihapus');
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : 'Gagal menghapus';
      toast.error(msg);
    }
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

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-56 bg-surface-container-low rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">Menu tidak ditemukan</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-square relative bg-surface-container-low">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline-variant"><Coffee size={36} /></div>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-surface/60 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-error-rose/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Nonaktif</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-sans font-semibold text-sm leading-snug line-clamp-1">{item.name}</h3>
                <p className="text-xs text-on-surface-variant mb-1">{getCategoryName(item.categoryId)}</p>
                <p className="font-mono font-bold text-primary text-sm">{formatRupiah(item.price)}</p>
                <p className="text-xs text-on-surface-variant mb-3">Stok: {item.stock}</p>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-oat-milk">
                  <button onClick={() => handleToggle(item)} title={item.isAvailable ? 'Nonaktifkan' : 'Aktifkan'} className={`relative w-10 h-5 rounded-full transition-colors ${item.isAvailable ? 'bg-success-green' : 'bg-surface-variant'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.isAvailable ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-latte-beige text-on-surface-variant"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-error-container text-error-rose"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <label className="block text-sm font-medium mb-1.5">Foto Menu</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border border-oat-milk bg-vanilla-mist overflow-hidden flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-outline-variant" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-oat-milk text-sm font-medium text-primary hover:bg-latte-beige cursor-pointer">
                      <Upload size={15} />
                      {imagePreview ? 'Ganti Foto' : 'Pilih Foto'}
                      <input type="file" accept="image/*" onChange={handlePickImage} className="hidden" />
                    </label>
                    <p className="text-xs text-outline mt-1.5">JPG/PNG/WebP, maks 5MB</p>
                  </div>
                </div>
              </div>
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
