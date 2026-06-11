'use client';

import Image from 'next/image';
import { Plus, Coffee } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { MenuItem } from '@/types';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCartQty = useCartStore((s) => s.items.find((i) => i.menuItem.id === item.id)?.quantity ?? 0);

  const handleAdd = () => {
    if (!item.isAvailable || item.stock <= 0) {
      toast.error('Item sedang tidak tersedia');
      return;
    }
    if (inCartQty >= item.stock) {
      toast.error(`Stok ${item.name} tinggal ${item.stock}`);
      return;
    }
    addItem(item);
    toast.success(`${item.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="bg-surface-bright border border-oat-milk rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(61,43,31,0.06)] hover:shadow-[0_4px_12px_rgba(61,43,31,0.08)] transition-all duration-300 group flex flex-col animate-fade-in">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-surface-container-low">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant">
            <Coffee size={40} />
          </div>
        )}
        
        {/* Out of stock overlay */}
        {(!item.isAvailable || item.stock <= 0) && (
          <div className="absolute inset-0 bg-surface/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-error-rose/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="font-sans font-semibold text-[15px] text-on-surface mb-0.5 leading-snug">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-on-surface-variant text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="flex justify-between items-center mt-auto">
          <span className="font-mono font-bold text-primary text-sm">
            {formatRupiah(item.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.isAvailable || item.stock <= 0}
            className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-all duration-150 hover:bg-mocha-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


