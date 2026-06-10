-- ============================================
-- Solaria's CoffeeShop — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('admin', 'kasir', 'member');
CREATE TYPE order_status AS ENUM ('waiting', 'confirmed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('qris', 'transfer_bank', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');

-- 3. TABLES

-- Profil & Role (terhubung ke Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  phone TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meja & QR
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number INTEGER UNIQUE NOT NULL,
  qr_token TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kategori Menu
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (Pesanan)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID REFERENCES tables(id) NOT NULL,
  member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status order_status DEFAULT 'waiting',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_total DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES profiles(id)
);

-- Order Items (Detail Pesanan)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount Events
CREATE TABLE discount_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL CHECK (value > 0),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  applies_to_all BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (end_at > start_at)
);

-- Discount Event <-> Menu Items (many-to-many)
CREATE TABLE discount_event_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES discount_events(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(event_id, menu_item_id)
);

-- Inventory Logs (Stok Masuk/Keluar)
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  change_qty INTEGER NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (Simulasi)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  method payment_method NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. INDEXES (Performance)
-- ============================================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_inventory_logs_menu_item ON inventory_logs(menu_item_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_profiles_auth_user ON profiles(auth_user_id);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_event_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, self-manage
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Tables: public read
CREATE POLICY "tables_select" ON tables FOR SELECT USING (true);

-- Categories & Menu Items: public read
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);
CREATE POLICY "menu_items_select" ON menu_items FOR SELECT USING (true);

-- Orders: public insert, public read
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);

-- Order Items: linked to orders
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (true);

-- Discount Events: public read
CREATE POLICY "discount_events_select" ON discount_events FOR SELECT USING (true);
CREATE POLICY "discount_event_items_select" ON discount_event_items FOR SELECT USING (true);

-- Payments: insert & read
CREATE POLICY "payments_insert" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_select" ON payments FOR SELECT USING (true);

-- ============================================
-- 6. ENABLE REALTIME pada tabel orders
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ============================================
-- 7. STORAGE BUCKET untuk foto menu
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);

CREATE POLICY "Menu images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated users can upload menu images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
