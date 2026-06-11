'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatRupiah, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils';
import type { Order } from '@/types';

export default function KasirHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.getAll().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  const confirmed = orders.filter(o => o.status !== 'waiting');

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl text-on-surface mb-1">Riwayat Pesanan</h1>
      <p className="text-sm text-on-surface-variant mb-6">{confirmed.length} pesanan</p>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-surface-container-low rounded-xl animate-pulse" />)}</div>
      ) : confirmed.length === 0 ? (
        <p className="text-center text-on-surface-variant py-20">Belum ada riwayat pesanan</p>
      ) : (
        <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-vanilla-mist">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">No. Pesanan</th>
                <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Meja</th>
                <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {confirmed.map((o) => (
                <tr key={o.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{o.orderNumber}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{o.table?.number || '-'}</td>
                  <td className="px-4 py-3 font-mono">{formatRupiah(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>{getStatusLabel(o.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">{formatDateTime(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
