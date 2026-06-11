'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatRupiah, formatDateTime, getStatusLabel, getStatusColor, getOrderNumber } from '@/lib/utils';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.orders.getAll().then(setOrders).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl mb-1">Semua Pesanan</h1>
      <p className="text-sm text-on-surface-variant mb-6">{orders.length} pesanan</p>
      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center animate-pulse">Memuat...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-vanilla-mist">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">No.</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Meja</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{getOrderNumber(o.id)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{o.table?.tableNumber ?? '-'}</td>
                    <td className="px-4 py-3 font-mono">{formatRupiah(o.grandTotal)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                    <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">{formatDateTime(o.createdAt)}</td>
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
