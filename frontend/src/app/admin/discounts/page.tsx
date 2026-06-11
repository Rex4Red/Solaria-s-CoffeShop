'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import type { Discount, MenuItem } from '@/types';
import { formatDate, formatRupiah, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// datetime-local butuh format "YYYY-MM-DDTHH:mm"
function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const now = new Date();
  const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [form, setForm] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    startAt: toLocalInput(now),
    endAt: toLocalInput(weekLater),
    isActive: true,
    appliesToAll: true,
    menuItemIds: [] as string[],
  });

  const loadDiscounts = () => api.discounts.getAll().then(setDiscounts).catch(console.error);

  useEffect(() => {
    Promise.all([api.discounts.getAll(), api.menu.getAll()])
      .then(([d, m]) => { setDiscounts(d); setMenuItems(m); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm({
      name: '',
      type: 'percentage',
      value: '',
      startAt: toLocalInput(new Date()),
      endAt: toLocalInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      isActive: true,
      appliesToAll: true,
      menuItemIds: [],
    });
    setShowModal(true);
  };

  const closeModal = () => { if (!saving) setShowModal(false); };

  const toggleMenu = (id: string) => {
    setForm((f) => ({
      ...f,
      menuItemIds: f.menuItemIds.includes(id)
        ? f.menuItemIds.filter((x) => x !== id)
        : [...f.menuItemIds, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Nama event wajib diisi'); return; }
    if (form.value === '' || isNaN(Number(form.value)) || Number(form.value) <= 0) { toast.error('Nilai diskon tidak valid'); return; }
    if (form.type === 'percentage' && Number(form.value) > 100) { toast.error('Persentase maksimal 100'); return; }
    if (new Date(form.endAt) <= new Date(form.startAt)) { toast.error('Tanggal selesai harus setelah tanggal mulai'); return; }
    if (!form.appliesToAll && form.menuItemIds.length === 0) { toast.error('Pilih minimal satu menu, atau aktifkan "Semua menu"'); return; }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      value: Number(form.value),
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      isActive: form.isActive,
      appliesToAll: form.appliesToAll,
      menuItemIds: form.appliesToAll ? undefined : form.menuItemIds,
    };

    setSaving(true);
    try {
      await api.discounts.create(payload);
      toast.success('Event diskon dibuat');
      await loadDiscounts();
      setShowModal(false);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : 'Gagal membuat event diskon';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus event diskon ini?')) return;
    try {
      await api.discounts.delete(id);
      setDiscounts(discounts.filter((d) => d.id !== id));
      toast.success('Event diskon dihapus');
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : 'Gagal menghapus';
      toast.error(msg);
    }
  };

  const valueLabel = (d: Discount) =>
    d.type === 'percentage' ? `${d.value}%` : formatRupiah(d.value);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-sans font-bold text-2xl">Event Diskon</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-mocha-dark active:scale-95 transition-all">
          <Plus size={16} />Tambah Event Diskon
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse text-center py-20">Memuat...</div>
      ) : discounts.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">Belum ada event diskon. Klik &quot;Tambah Event Diskon&quot; untuk membuat.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map((d) => (
            <div key={d.id} className="bg-surface-bright border border-oat-milk rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-sans font-semibold">{d.name}</h3>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', d.isActive ? 'bg-success-green/15 text-success-green' : 'bg-surface-variant text-on-surface-variant')}>{d.isActive ? 'Aktif' : 'Nonaktif'}</span>
              </div>
              <p className="font-mono font-bold text-xl text-primary mb-1">{valueLabel(d)}</p>
              <p className="text-xs text-on-surface-variant mb-2">
                {d.appliesToAll ? 'Berlaku untuk semua menu' : `Berlaku untuk ${d.items?.length || 0} menu`}
              </p>
              <p className="text-xs text-outline mb-3">{formatDate(d.startAt)} — {formatDate(d.endAt)}</p>
              <button onClick={() => handleDelete(d.id)} className="text-xs text-error-rose hover:text-error font-medium flex items-center gap-1">
                <Trash2 size={13} />Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Event Diskon */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={closeModal}>
          <div className="w-full max-w-lg bg-surface-bright rounded-2xl shadow-xl border border-oat-milk max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-oat-milk flex items-center justify-between">
              <h2 className="font-sans font-bold text-lg">Tambah Event Diskon</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-latte-beige text-on-surface-variant"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Event *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Contoh: Promo Weekend" className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tipe</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'percentage' | 'fixed' }))} className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Potongan Tetap (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{form.type === 'percentage' ? 'Nilai (%)' : 'Nilai (Rp)'} *</label>
                  <input type="number" inputMode="numeric" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percentage' ? '20' : '5000'} className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mulai</label>
                  <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Selesai</label>
                  <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))} className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-success-green' : 'bg-surface-variant'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? 'left-5.5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm">Aktifkan event ini</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setForm((f) => ({ ...f, appliesToAll: !f.appliesToAll }))} className={`relative w-10 h-5 rounded-full transition-colors ${form.appliesToAll ? 'bg-success-green' : 'bg-surface-variant'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.appliesToAll ? 'left-5.5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm">Berlaku untuk semua menu</span>
              </label>

              {!form.appliesToAll && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pilih Menu ({form.menuItemIds.length} dipilih)</label>
                  <div className="max-h-44 overflow-y-auto border border-oat-milk rounded-xl divide-y divide-oat-milk">
                    {menuItems.map((m) => (
                      <label key={m.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-vanilla-mist/60">
                        <input type="checkbox" checked={form.menuItemIds.includes(m.id)} onChange={() => toggleMenu(m.id)} className="accent-primary" />
                        <span className="text-sm flex-grow">{m.name}</span>
                        <span className="text-xs font-mono text-on-surface-variant">{formatRupiah(m.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-oat-milk flex justify-end gap-2">
              <button onClick={closeModal} disabled={saving} className="px-4 py-2.5 rounded-xl border border-oat-milk text-on-surface-variant text-sm font-medium hover:bg-latte-beige disabled:opacity-60">Batal</button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-mocha-dark active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" />Menyimpan...</> : 'Buat Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
