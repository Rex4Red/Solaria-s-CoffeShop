'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Discount } from '@/types';
import { formatDate, cn } from '@/lib/utils';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.discounts.getAll().then(setDiscounts).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl mb-6">Event Diskon</h1>
      {loading ? <div className="animate-pulse text-center py-20">Memuat...</div> : discounts.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">Belum ada event diskon</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map(d => (
            <div key={d.id} className="bg-surface-bright border border-oat-milk rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-sans font-semibold">{d.name}</h3>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', d.isActive ? 'bg-success-green/15 text-success-green' : 'bg-surface-variant text-on-surface-variant')}>{d.isActive ? 'Aktif' : 'Nonaktif'}</span>
              </div>
              {d.description && <p className="text-sm text-on-surface-variant mb-3">{d.description}</p>}
              <p className="font-mono font-bold text-xl text-primary mb-2">{d.percentage}%</p>
              <p className="text-xs text-outline">{formatDate(d.startDate)} — {formatDate(d.endDate)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
