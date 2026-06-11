'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import type { MenuItem } from '@/types';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.menu.getAll().then(setItems).catch(console.error).finally(() => setLoading(false)); }, []);

  const lowStock = items.filter(i => i.stock <= 5);

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl mb-1">Inventori</h1>
      <p className="text-sm text-on-surface-variant mb-6">Kelola stok menu</p>

      {lowStock.length > 0 && (
        <div className="bg-warning-amber/10 border border-warning-amber/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle size={20} className="text-warning-amber shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-warning-amber">Stok Rendah!</p>
            <p className="text-xs text-on-surface-variant mt-1">{lowStock.map(i => i.name).join(', ')}</p>
          </div>
        </div>
      )}

      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center animate-pulse">Memuat...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-vanilla-mist">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Item</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Harga</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Stok</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50">
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 font-mono">{formatRupiah(item.price)}</td>
                    <td className="px-4 py-3 font-mono">{item.stock}</td>
                    <td className="px-4 py-3">
                      {item.stock <= 0 ? <span className="px-2 py-0.5 rounded-full bg-error-rose/15 text-error-rose text-xs font-semibold">Habis</span>
                        : item.stock <= 5 ? <span className="px-2 py-0.5 rounded-full bg-warning-amber/15 text-warning-amber text-xs font-semibold">Rendah</span>
                        : <span className="px-2 py-0.5 rounded-full bg-success-green/15 text-success-green text-xs font-semibold">Tersedia</span>}
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
