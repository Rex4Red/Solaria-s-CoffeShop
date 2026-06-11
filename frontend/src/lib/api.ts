// ═══════════════════════════════════════════
// API Client — Solaria's CoffeeShop
// ═══════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://rex4red2-solarias-coffeeshop-api.hf.space/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_BASE}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  // Get auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorData?.message || `API Error: ${response.statusText}`,
      errorData
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ── Public API Methods ──

export const api = {
  // Auth
  auth: {
    login: (data: { email: string; password: string }) =>
      fetchApi<{ session: { access_token: string }; user: { id: string; email: string; name: string; role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: { email: string; password: string; name: string }) =>
      fetchApi<{ access_token: string; user: unknown }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    profile: () =>
      fetchApi<unknown>('/auth/profile'),
  },

  // Categories
  categories: {
    getAll: () =>
      fetchApi<{ id: string; name: string; description?: string }[]>('/categories'),
    create: (data: { name: string; description?: string }) =>
      fetchApi('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name?: string; description?: string }) =>
      fetchApi(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi(`/categories/${id}`, { method: 'DELETE' }),
  },

  // Menu
  menu: {
    getAll: (params?: { categoryId?: string; search?: string }) =>
      fetchApi<import('@/types').MenuItem[]>('/menu', { params }),
    getById: (id: string) =>
      fetchApi<import('@/types').MenuItem>(`/menu/${id}`),
    create: (formData: FormData) =>
      fetchApi('/menu', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set multipart headers
      }),
    update: (id: string, data: unknown) =>
      fetchApi(`/menu/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi(`/menu/${id}`, { method: 'DELETE' }),
  },

  // Tables
  tables: {
    getAll: () =>
      fetchApi<{ id: string; tableNumber: number; qrToken: string; isActive: boolean }[]>('/tables'),
    getById: (id: string) =>
      fetchApi<import('@/types').Table>(`/tables/${id}`),
    verify: (qrToken: string) =>
      fetchApi<{ id: string; tableNumber: number; isActive: boolean }>(`/tables/verify/${qrToken}`),
    getQrCodes: () =>
      fetchApi<{ tableNumber: number; qrDataUrl: string }[]>('/tables/qr/all'),
  },

  // Orders
  orders: {
    getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
      const res = await fetchApi<{ data: import('@/types').Order[]; meta: unknown }>('/orders', { params });
      return res.data;
    },
    getById: (id: string) =>
      fetchApi<import('@/types').Order>(`/orders/${id}`),
    create: (data: {
      tableToken: string;
      memberId?: string;
      items: { menuItemId: string; qty: number; notes?: string }[];
      notes?: string;
    }) =>
      fetchApi<import('@/types').Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    confirm: (id: string) =>
      fetchApi(`/orders/${id}/confirm`, { method: 'PATCH' }),
    cancel: (id: string) =>
      fetchApi(`/orders/${id}/cancel`, { method: 'PATCH' }),
    updateStatus: (id: string, status: string) =>
      fetchApi(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // Payments
  payments: {
    simulate: (data: { orderId: string; method: string }) =>
      fetchApi<import('@/types').Payment>('/payments/simulate', { method: 'POST', body: JSON.stringify(data) }),
    getAll: async () => {
      const res = await fetchApi<{ data: import('@/types').Payment[] } | import('@/types').Payment[]>('/payments');
      return Array.isArray(res) ? res : res.data;
    },
  },

  // Inventory
  inventory: {
    adjust: (menuItemId: string, data: { stock: number; reason: string }) =>
      fetchApi(`/inventory/${menuItemId}/adjust`, { method: 'POST', body: JSON.stringify(data) }),
    getLogs: async (menuItemId?: string) => {
      const res = await fetchApi<{ data: import('@/types').InventoryLog[]; meta: unknown }>(`/inventory/logs`, { params: menuItemId ? { menuItemId } : undefined });
      return res.data;
    },
  },

  // Members
  members: {
    getAll: async () => {
      const res = await fetchApi<{ data: import('@/types').Member[]; meta: unknown }>('/members');
      return res.data;
    },
    getById: (id: string) =>
      fetchApi<import('@/types').Member>(`/members/${id}`),
  },

  // Discounts
  discounts: {
    getAll: () =>
      fetchApi<import('@/types').Discount[]>('/discounts'),
    create: (data: unknown) =>
      fetchApi('/discounts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchApi(`/discounts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi(`/discounts/${id}`, { method: 'DELETE' }),
  },

  // Stats
  stats: {
    dashboard: () =>
      fetchApi<import('@/types').DashboardStats>('/stats/dashboard'),
    revenue: (params?: { period?: string }) =>
      fetchApi<{ date: string; revenue: number }[]>('/stats/revenue', { params }),
    topItems: () =>
      fetchApi<{ menuItem: import('@/types').MenuItem; totalSold: number }[]>('/stats/top-items'),
  },
};

export { ApiError };
export default api;
