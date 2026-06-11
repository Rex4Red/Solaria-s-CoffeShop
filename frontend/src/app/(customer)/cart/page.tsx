'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import CartItemComponent from '@/components/customer/CartItem';
import { useCartStore } from '@/store/cartStore';
import { formatRupiah } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const tableNumber = useCartStore((s) => s.tableNumber);

  const subtotal = getSubtotal();
  const discount = 0; // TODO: Apply discount logic
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 safe-bottom-padding">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-latte-beige flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-outline-variant" />
          </div>
          <h2 className="font-sans font-bold text-xl text-on-surface mb-2">
            Keranjang Kosong
          </h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Yuk, pilih menu favoritmu!
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-primary text-on-primary font-sans font-semibold px-8 py-3 rounded-xl active:scale-95 transition-transform hover:bg-mocha-dark"
          >
            Lihat Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-bottom-padding">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-lg shadow-[0_1px_3px_rgba(61,43,31,0.06)]">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-latte-beige active:scale-95 transition-all text-primary"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-sans font-bold text-lg text-primary">Keranjang</h1>
            <p className="text-xs text-on-surface-variant">Meja {tableNumber || '–'}</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-48">
        {/* Item Count & Clear */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-on-surface-variant">
            {items.length} item
          </span>
          <button
            onClick={clearCart}
            className="text-xs text-error-rose hover:text-error font-medium active:scale-95 transition-all"
          >
            Hapus Semua
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <CartItemComponent key={item.menuItem.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-vanilla-mist border border-oat-milk rounded-xl p-4">
          <h3 className="font-sans font-semibold text-sm text-on-surface mb-3">
            Ringkasan Pesanan
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-mono">{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success-green">
                <span>Diskon</span>
                <span className="font-mono">-{formatRupiah(discount)}</span>
              </div>
            )}
            <div className="border-t border-oat-milk my-2" />
            <div className="flex justify-between font-semibold text-mocha-dark">
              <span>Total</span>
              <span className="font-mono text-base">{formatRupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-oat-milk p-4 z-40">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-primary text-on-primary font-sans font-semibold text-base py-4 rounded-xl shadow-[0_4px_12px_rgba(61,43,31,0.12)] hover:bg-mocha-dark active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          >
            Pesan Sekarang — {formatRupiah(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
