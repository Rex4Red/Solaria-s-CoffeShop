// ═══════════════════════════════════════════
// Cart Store — Zustand
// ═══════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  tableNumber: number | null;
  tableToken: string | null;

  // Actions
  setTable: (token: string, number: number) => void;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,
      tableToken: null,

      setTable: (token, number) => set({ tableToken: token, tableNumber: number }),

      addItem: (menuItem) => {
        const existing = get().items.find((item) => item.menuItem.id === menuItem.id);
        const maxStock = menuItem.stock ?? Infinity;
        if (existing) {
          if (existing.quantity >= maxStock) return; // sudah mencapai batas stok
          set({
            items: get().items.map((item) =>
              item.menuItem.id === menuItem.id
                ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
                : item
            ),
          });
        } else {
          if (maxStock <= 0) return;
          set({ items: [...get().items, { menuItem, quantity: 1 }] });
        }
      },

      removeItem: (menuItemId) => {
        set({ items: get().items.filter((item) => item.menuItem.id !== menuItemId) });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((item) => {
            if (item.menuItem.id !== menuItemId) return item;
            const maxStock = item.menuItem.stock ?? Infinity;
            return { ...item, quantity: Math.min(quantity, maxStock) };
          }),
        });
      },

      updateNotes: (menuItemId, notes) => {
        set({
          items: get().items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, notes } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    }),
    {
      name: 'solaria-cart',
    }
  )
);
