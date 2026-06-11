// ═══════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════

/**
 * Format number as Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
    PENDING: 'Menunggu',
    CONFIRMED: 'Dikonfirmasi',
    PREPARING: 'Diproses',
    READY: 'Siap',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return map[status] || status;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'bg-warning-amber/15 text-warning-amber',
    CONFIRMED: 'bg-info-blue/15 text-info-blue',
    PREPARING: 'bg-info-blue/15 text-info-blue',
    READY: 'bg-success-green/15 text-success-green',
    COMPLETED: 'bg-success-green/15 text-success-green',
    CANCELLED: 'bg-error-rose/15 text-error-rose',
  };
  return map[status] || 'bg-surface-variant text-on-surface-variant';
}

/**
 * Get payment method label
 */
export function getPaymentMethodLabel(method: string): string {
  const map: Record<string, string> = {
    QRIS: 'QRIS',
    BANK_TRANSFER: 'Transfer Bank',
    CASH: 'Tunai',
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
