// ═══════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════

/**
 * Format number as Indonesian Rupiah
 */
export function formatRupiah(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safe);
}

/**
 * Build a short, human-friendly order number from a UUID
 */
export function getOrderNumber(id?: string): string {
  if (!id) return '-';
  return `#${id.slice(0, 8).toUpperCase()}`;
}

/**
 * Hitung diskon member berdasarkan event diskon aktif.
 * Mereplikasi logika backend: per item, event yang cocok terakhir menang.
 */
export interface DiscountForCalc {
  isActive: boolean;
  startAt: string;
  endAt: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesToAll: boolean;
  items?: { menuItemId: string }[];
}

export function computeMemberDiscount(
  cart: { menuItem: { id: string; price: number }; quantity: number }[],
  discounts: DiscountForCalc[],
): { subtotal: number; discountTotal: number; grandTotal: number } {
  const now = Date.now();
  const active = discounts.filter(
    (d) =>
      d.isActive &&
      new Date(d.startAt).getTime() <= now &&
      new Date(d.endAt).getTime() >= now,
  );

  const map = new Map<string, { type: string; value: number }>();
  for (const d of active) {
    if (d.appliesToAll) {
      for (const c of cart) map.set(c.menuItem.id, { type: d.type, value: Number(d.value) });
    } else {
      for (const it of d.items || []) map.set(it.menuItemId, { type: d.type, value: Number(d.value) });
    }
  }

  let subtotal = 0;
  let discountTotal = 0;
  for (const c of cart) {
    const price = Number(c.menuItem.price);
    const itemSubtotal = price * c.quantity;
    subtotal += itemSubtotal;
    const disc = map.get(c.menuItem.id);
    if (disc) {
      discountTotal += disc.type === 'percentage'
        ? (itemSubtotal * disc.value) / 100
        : disc.value * c.quantity;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountTotal);
  return { subtotal, discountTotal, grandTotal };
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 menit lalu")
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return formatDate(dateString);
}

/**
 * Classnames utility (minimal clsx alternative)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get order status label in Indonesian
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    waiting: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
  };
  return map[status] || status;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    waiting: 'bg-warning-amber/15 text-warning-amber',
    confirmed: 'bg-success-green/15 text-success-green',
    cancelled: 'bg-error-rose/15 text-error-rose',
  };
  return map[status] || 'bg-surface-variant text-on-surface-variant';
}

/**
 * Get payment method label
 */
export function getPaymentMethodLabel(method: string): string {
  const map: Record<string, string> = {
    qris: 'QRIS',
    transfer_bank: 'Transfer Bank',
    cash: 'Tunai',
  };
  return map[method] || method;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
