'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateNotes = useCartStore((s) => s.updateNotes);

  return (
    <div className="flex gap-3 bg-surface-bright border border-oat-milk rounded-xl p-3 animate-fade-in">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low shrink-0">
        {item.menuItem.imageUrl ? (
          <Image
            src={item.menuItem.imageUrl}
            alt={item.menuItem.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant text-2xl">
            ☕
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-sans font-semibold text-sm text-on-surface truncate pr-2">
            {item.menuItem.name}
          </h3>
          <button
            onClick={() => removeItem(item.menuItem.id)}
            className="text-error-rose hover:text-error shrink-0 p-0.5 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <p className="font-mono text-xs text-primary font-bold mb-2">
          {formatRupiah(item.menuItem.price)}
        </p>

        {/* Notes input */}
        <input
          type="text"
          placeholder="Catatan (opsional)..."
          value={item.notes || ''}
          onChange={(e) => updateNotes(item.menuItem.id, e.target.value)}
          className="w-full text-xs bg-vanilla-mist border border-oat-milk rounded-lg px-2.5 py-1.5 mb-2 focus:outline-none focus:border-primary/40 placeholder:text-outline-variant/60 transition-colors"
        />

        {/* Quantity controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5 bg-vanilla-mist rounded-full px-1 py-0.5 border border-oat-milk">
            <button
              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-primary hover:bg-oat-milk active:scale-90 transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="font-mono font-bold text-sm min-w-[20px] text-center text-on-surface">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
              disabled={item.quantity >= item.menuItem.stock}
              className="w-7 h-7 rounded-full flex items-center justify-center text-primary hover:bg-oat-milk active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-mono font-bold text-sm text-mocha-dark">
            {formatRupiah(item.menuItem.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
