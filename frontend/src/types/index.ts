// ═══════════════════════════════════════════
// Solaria's CoffeeShop — TypeScript Types
// ═══════════════════════════════════════════

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  isAvailable: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Table {
  id: string;
  number: number;
  qrCode?: string;
  isActive: boolean;
}

export type OrderStatus =
  | 'waiting'
  | 'confirmed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed';

export type PaymentMethod =
  | 'qris'
  | 'transfer_bank'
  | 'cash';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: { id: string; name: string; imageUrl?: string; price?: number };
  qty: number;
  unitPrice: number;
  discountAmount: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  table?: { tableNumber: number };
  memberId?: string;
  member?: { id: string; name: string };
  status: OrderStatus;
  orderItems: OrderItem[];
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  payments?: { id: string; method: PaymentMethod; status: PaymentStatus }[];
}

export interface Payment {
  id: string;
  orderId: string;
  order?: Order;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  points: number;
  createdAt: string;
}

export interface Discount {
  id: string;
  name: string;
  description?: string;
  percentage: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  totalMembers: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
