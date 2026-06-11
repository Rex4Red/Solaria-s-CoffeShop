'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, QrCode, Building2, Banknote, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatRupiah, cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'qris', label: 'QRIS', desc: 'Scan QR untuk bayar', icon: QrCode },
  { id: 'transfer_bank', label: 'Transfer Bank', desc: 'BCA, Mandiri, BNI', icon: Building2 },
  { id: 'cash', label: 'Tunai', desc: 'Bayar di kasir', icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const tableToken = useCartStore((s) => s.tableToken);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const total = getSubtotal();

  const handleCheckout = async () => {
    if (!tableToken) { toast.error('Meja belum terdaftar'); return; }
    setLoading(true);
    try {
      const order = await api.orders.create({
        tableToken,
        items: items.map((i) => ({ menuItemId: i.menuItem.id, qty: i.quantity, notes: i.notes })),
        notes: notes || undefined,
      });
      await api.payments.simulate({ orderId: order.id, method: selectedMethod });
      clearCart();
      router.push(`/order-success?orderId=${order.id}&table=${tableNumber}`);
      toast.success('Pesanan berhasil!');
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : 'Gagal membuat pesanan';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen safe-bottom-padding">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-lg shadow-[0_1px_3px_rgba(61,43,31,0.06)]">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-latte-beige text-primary"><ArrowLeft size={20} /></button>
          <h1 className="font-sans font-bold text-lg text-primary">Pembayaran</h1>
        </div>
      </header>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-40">
        <div className="bg-surface-bright border border-oat-milk rounded-xl p-4 mb-4">
          <h3 className="font-sans font-semibold text-sm mb-3">Detail Pesanan</h3>
          {items.map((i) => (
            <div key={i.menuItem.id} className="flex justify-between text-sm mb-1">
              <span className="text-on-surface-variant">{i.menuItem.name} x{i.quantity}</span>
              <span className="font-mono">{formatRupiah(i.menuItem.price * i.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-oat-milk my-3" />
          <div className="flex justify-between font-semibold"><span>Total</span><span className="font-mono">{formatRupiah(total)}</span></div>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan (opsional)..." className="w-full bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-3 text-sm resize-none h-20 mb-4 focus:outline-none focus:border-primary" />
        <h3 className="font-sans font-semibold text-sm mb-3">Metode Pembayaran</h3>
        <div className="space-y-2.5 mb-6">
          {paymentMethods.map((m) => {
            const Icon = m.icon; const active = selectedMethod === m.id;
            return (
              <button key={m.id} onClick={() => setSelectedMethod(m.id)} className={cn('w-full flex items-center gap-4 p-4 rounded-xl border transition-all', active ? 'border-primary bg-primary/5' : 'border-oat-milk hover:bg-vanilla-mist')}>
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', active ? 'bg-primary text-on-primary' : 'bg-latte-beige text-on-surface-variant')}><Icon size={20} /></div>
                <div className="text-left flex-grow"><p className={cn('font-semibold text-sm', active && 'text-primary')}>{m.label}</p><p className="text-xs text-on-surface-variant">{m.desc}</p></div>
                <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', active ? 'border-primary' : 'border-outline-variant')}>{active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-oat-milk p-4 z-40">
        <div className="max-w-lg mx-auto">
          <button onClick={handleCheckout} disabled={loading} className="w-full bg-primary text-on-primary font-sans font-semibold py-4 rounded-xl hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 size={20} className="animate-spin" />Memproses...</> : <>Bayar {formatRupiah(total)}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
