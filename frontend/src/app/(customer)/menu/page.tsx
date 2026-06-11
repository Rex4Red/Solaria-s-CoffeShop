'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import MenuCard from '@/components/customer/MenuCard';
import CategoryChips from '@/components/customer/CategoryChips';
import { useCartStore } from '@/store/cartStore';
import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';
import type { MenuItem } from '@/types';

type SimpleCategory = { id: string; name: string; description?: string };

function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const tableNumber = searchParams.get('table') || '1';

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuData, catData] = await Promise.all([
          api.menu.getAll(),
          api.categories.getAll(),
        ]);
        setMenuItems(menuData);
        setCategories(catData);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = !activeCategory || item.categoryId === activeCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <div className="safe-bottom-padding">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-4 py-3 bg-surface sticky top-0 z-40 shadow-[0_1px_3px_rgba(61,43,31,0.06)]">
        <div>
          <h1 className="font-sans font-bold text-xl text-primary">Menu</h1>
          <p className="text-xs text-on-surface-variant">Meja {tableNumber}</p>
        </div>
        <button 
          onClick={() => setSearchQuery(searchQuery ? '' : ' ')}
          className="text-primary p-2 active:scale-95 transition-transform rounded-lg hover:bg-latte-beige"
        >
          <Search size={20} />
        </button>
      </header>

      <div className="max-w-[1200px] w-full mx-auto px-4 md:px-8 pt-4 md:pt-8">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery === ' ' ? '' : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-vanilla-mist border border-oat-milk rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline-variant/60 transition-colors"
            />
          </div>
        </div>

        {/* Category Chips */}
        <CategoryChips
          categories={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface-container-low rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-surface-variant" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-surface-variant rounded w-3/4" />
                  <div className="h-3 bg-surface-variant rounded w-1/2" />
                  <div className="h-4 bg-surface-variant rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">☕</p>
            <p className="text-on-surface-variant font-sans font-semibold">Menu tidak ditemukan</p>
            <p className="text-outline text-sm mt-1">Coba kata kunci atau kategori lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredItems.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 50}ms` }}>
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-40 px-4 md:px-0 md:flex md:justify-end md:right-8 md:left-auto animate-slide-up">
          <button
            onClick={() => router.push('/cart')}
            className="w-full md:w-auto bg-primary text-on-primary px-6 py-3.5 rounded-2xl shadow-[0_8px_24px_rgba(61,43,31,0.18)] flex items-center justify-between md:justify-center gap-4 active:scale-[0.97] transition-transform hover:bg-mocha-dark"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} />
              <span className="font-sans font-semibold">
                Keranjang ({totalItems})
              </span>
            </div>
            <span className="font-mono font-bold">
              {formatRupiah(getSubtotal())}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-sans font-semibold">Memuat menu...</div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
