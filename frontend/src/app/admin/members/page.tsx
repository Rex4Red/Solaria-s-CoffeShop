'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Member } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.members.getAll().then(setMembers).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="font-sans font-bold text-2xl mb-1">Member</h1>
      <p className="text-sm text-on-surface-variant mb-6">{members.length} member terdaftar</p>
      <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center animate-pulse">Memuat...</div> : members.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">Belum ada member</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-vanilla-mist">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Poin</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant hidden md:table-cell">Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className="border-t border-oat-milk hover:bg-vanilla-mist/50">
                    <td className="px-4 py-3 font-semibold">{m.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{m.email}</td>
                    <td className="px-4 py-3 font-mono hidden md:table-cell">{m.points}</td>
                    <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">{formatDate(m.createdAt)}</td>
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
