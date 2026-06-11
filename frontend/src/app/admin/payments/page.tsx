'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatRupiah, formatDateTime, getPaymentMethodLabel } from '@/lib/utils';
import type { Payment } from '@/types';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.payments.getAll().then(setPayments).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl mb-1">Pembayaran</h1>
      <p className="text-sm text-on-surface-variant mb-6">{payments.length} transaksi</p>
      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center animate-pulse">Memuat...</div> : payments.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">Belum ada pembayaran</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-vanilla-mist">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Metode</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Jumlah</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{p.order?.orderNumber || p.orderId.slice(0, 8)}</td>
                    <td className="px-4 py-3">{getPaymentMethodLabel(p.method)}</td>
                    <td className="px-4 py-3 font-mono">{formatRupiah(p.amount)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'PAID' ? 'bg-success-green/15 text-success-green' : 'bg-warning-amber/15 text-warning-amber'}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">{formatDateTime(p.createdAt)}</td>
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
