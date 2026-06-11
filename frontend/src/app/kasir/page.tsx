'use client';

import { useState, useEffect } from 'react';
import { Check, X, Clock, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah, formatRelativeTime, getStatusLabel, getOrderNumber, cn } from '@/lib/utils';
import type { Order } from '@/types';
import toast from 'react-hot-toast';

export default function KasirPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll({ status: 'waiting' });
      setOrders(data);
    } catch { console.error('Failed to fetch'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); const i = setInterval(fetchOrders, 10000); return () => clearInterval(i); }, []);

  const handleConfirm = async (id: string) => {
    const prev = orders;
    setOrders((cur) => cur.filter((o) => o.id !== id)); // optimistic: langsung hilang
    try {
      await api.orders.confirm(id);
      toast.success('Pesanan dikonfirmasi');
    } catch {
      toast.error('Gagal konfirmasi');
      setOrders(prev); // restore kalau gagal
    }
  };

  const handleCancel = async (id: string) => {
    const prev = orders;
    setOrders((cur) => cur.filter((o) => o.id !== id)); // optimistic: langsung hilang
    try {
      await api.orders.cancel(id);
      toast.success('Pesanan ditolak');
    } catch {
      toast.error('Gagal menolak');
      setOrders(prev); // restore kalau gagal
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans font-bold text-2xl text-on-surface">Pesanan Masuk</h1>
          <p className="text-sm text-on-surface-variant">{orders.length} pesanan menunggu</p>
        </div>
        <button onClick={() => { setLoading(true); fetchOrders(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-latte-beige text-primary font-medium text-sm hover:bg-oat-milk active:scale-95 transition-all">
          <RefreshCw size={16} />Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-surface-container-low rounded-xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Clock size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="font-sans font-semibold text-on-surface-variant">Belum ada pesanan masuk</p>
          <p className="text-sm text-outline mt-1">Pesanan baru akan muncul otomatis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-bright border border-oat-milk rounded-xl p-4 shadow-sm animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono font-bold text-sm text-primary">{getOrderNumber(order.id)}</p>
                  <p className="text-xs text-on-surface-variant">{formatRelativeTime(order.createdAt)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-warning-amber/15 text-warning-amber text-xs font-semibold">
                  {getStatusLabel(order.status)}
                </span>
              </div>
              {order.table && (
                <div className="text-xs text-on-surface-variant mb-3 flex items-center gap-1">
                  🪑 Meja {order.table.tableNumber}
                </div>
              )}
              <div className="space-y-1 mb-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.menuItem?.name || 'Item'} x{item.qty}</span>
                    <span className="font-mono text-xs">{formatRupiah(Number(item.unitPrice) * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-oat-milk pt-3 flex justify-between items-center">
                <span className="font-mono font-bold text-primary">{formatRupiah(order.grandTotal)}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleCancel(order.id)} className="px-4 py-2 rounded-lg border border-error-rose text-error-rose text-sm font-medium hover:bg-error-rose/5 active:scale-95 transition-all flex items-center gap-1.5">
                    <X size={14} />Tolak
                  </button>
                  <button onClick={() => handleConfirm(order.id)} className="px-4 py-2 rounded-lg bg-success-green text-white text-sm font-medium hover:bg-success-green/90 active:scale-95 transition-all flex items-center gap-1.5">
                    <Check size={14} />Konfirmasi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
