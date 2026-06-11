'use client';

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';
import { formatRupiah, formatDateTime, getStatusLabel, getStatusColor, getOrderNumber } from '@/lib/utils';
import api from '@/lib/api';
import type { Order } from '@/types';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-surface-bright border border-oat-milk rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-sm text-on-surface-variant mb-0.5">{label}</p>
      <p className="font-sans font-bold text-xl text-on-surface">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.getAll().then(setOrders).catch(console.error).finally(() => setLoading(false));
    api.members.getAll().then(m => setMemberCount(m.length)).catch(() => setMemberCount(0));
  }, []);

  const totalRevenue = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + Number(o.grandTotal), 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce((s, o) => s + (o.orderItems?.length || 0), 0);
  const recentOrders = orders.slice(0, 10);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold text-2xl text-on-surface">Dashboard</h1>
        <p className="text-sm text-on-surface-variant">Ringkasan aktivitas toko</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Pendapatan" value={loading ? '...' : formatRupiah(totalRevenue)} color="bg-success-green/10 text-success-green" />
        <StatCard icon={ShoppingBag} label="Total Pesanan" value={loading ? '...' : String(totalOrders)} color="bg-info-blue/10 text-info-blue" />
        <StatCard icon={Package} label="Item Terjual" value={loading ? '...' : String(totalItems)} color="bg-warning-amber/10 text-warning-amber" />
        <StatCard icon={Users} label="Member" value={memberCount === null ? '...' : String(memberCount)} color="bg-soft-lavender/10 text-soft-lavender" />
      </div>

      {/* Recent Orders */}
      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-oat-milk">
          <h2 className="font-sans font-semibold text-base">Pesanan Terbaru</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant animate-pulse">Memuat...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">Belum ada pesanan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-vanilla-mist">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">No.</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{getOrderNumber(o.id)}</td>
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
