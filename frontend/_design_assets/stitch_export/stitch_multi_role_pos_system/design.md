# Solaria's CoffeeShop — Frontend Design System

## Brand Identity

**Brand Name:** Solaria's CoffeeShop
**Tagline:** "Your Cozy Corner for Great Coffee"
**Brand Personality:** Warm, inviting, modern, clean, and effortlessly elegant.
**Design Philosophy:** Minimalist cafe aesthetic — the UI should feel like stepping into a well-designed, airy coffee shop with natural light, clean surfaces, and subtle warmth.

---

## Color Palette

A milky white, warm neutral palette with coffee-inspired accent tones. Nothing harsh or flashy — every color should feel soft and inviting.

### Primary Colors
- **Cream White** (Background): `#FDFBF7` — warm off-white, like steamed milk
- **Latte Beige** (Surface/Card): `#F5F0E8` — soft latte foam tone
- **Espresso Brown** (Primary Action): `#6B4F3E` — rich coffee brown for buttons & key actions
- **Mocha Dark** (Text Primary): `#3D2B1F` — deep brown-black for headings & body text

### Secondary Colors
- **Caramel Gold** (Accent/Highlight): `#C8956C` — warm caramel for tags, badges, selected states
- **Oat Milk** (Hover/Subtle BG): `#EDE6D8` — slightly darker cream for hover & dividers
- **Vanilla Mist** (Input BG): `#FAF8F4` — barely-there warm white for input fields

### Semantic Colors
- **Success Green** (Confirmed): `#5D9B6B` — muted sage green
- **Warning Amber** (Waiting): `#D4A04A` — soft amber
- **Error Rose** (Cancelled/Alert): `#C07070` — dusty rose red
- **Info Blue** (Links/Info): `#7A9BB5` — muted steel blue

### Admin Dashboard Accent
- **Slate** (Admin Sidebar): `#4A4A52` — dark charcoal gray for admin navigation
- **Soft Lavender** (Admin Highlight): `#8E8BA8` — gentle purple accent for admin stats

---

## Typography

Clean, modern sans-serif fonts that are highly readable.

- **Heading Font:** `Plus Jakarta Sans` — modern, geometric, premium feel
- **Body Font:** `Inter` — highly legible, clean for data-heavy screens
- **Mono Font:** `JetBrains Mono` — for order numbers, prices, IDs

### Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Display (Hero) | 36px | 700 (Bold) | 1.2 |
| H1 (Page Title) | 28px | 700 (Bold) | 1.3 |
| H2 (Section Title) | 22px | 600 (Semibold) | 1.3 |
| H3 (Card Title) | 18px | 600 (Semibold) | 1.4 |
| Body Large | 16px | 400 (Regular) | 1.6 |
| Body | 14px | 400 (Regular) | 1.6 |
| Caption/Small | 12px | 500 (Medium) | 1.5 |
| Price | 20px | 700 (Bold) | 1.2 |

---

## Shape & Spacing

- **Border Radius:**
  - Cards & Modals: `16px` — soft, friendly
  - Buttons: `12px` — rounded but not pill-shaped
  - Input Fields: `10px`
  - Tags & Badges: `20px` (pill)
  - Avatar/Profile: `50%` (circle)

- **Spacing Scale:** 4px base unit
  - `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px

- **Shadows:** Extremely subtle — barely visible
  - Card shadow: `0 1px 3px rgba(61, 43, 31, 0.06)`
  - Elevated: `0 4px 12px rgba(61, 43, 31, 0.08)`
  - Modal overlay: `0 8px 24px rgba(61, 43, 31, 0.12)`

---

## Component Design

### Buttons
- **Primary:** BG `#6B4F3E`, text `#FDFBF7`, hover darken to `#5A3F30`
- **Secondary:** BG `transparent`, border `#6B4F3E`, text `#6B4F3E`, hover BG `#F5F0E8`
- **Ghost:** No border, text `#6B4F3E`, hover BG `#EDE6D8`
- **Danger:** BG `#C07070`, text `#FDFBF7`
- Padding: `12px 24px`, min-height `44px` (touch-friendly)
- Transition: `all 0.2s ease`

### Cards (Menu Item, Order, etc.)
- Background: `#FDFBF7`
- Border: `1px solid #EDE6D8`
- Border-radius: `16px`
- Padding: `20px`
- Hover: lift with shadow `0 4px 12px rgba(61, 43, 31, 0.08)`

### Input Fields
- Background: `#FAF8F4`
- Border: `1px solid #EDE6D8`
- Focus border: `#6B4F3E`
- Border-radius: `10px`
- Padding: `12px 16px`
- Placeholder color: `#B5A99A`

### Navigation
- Background: `#FDFBF7` with bottom border `#EDE6D8`
- Active link: text `#6B4F3E`, bottom border `2px solid #6B4F3E`
- Inactive link: text `#8A7E74`
- Mobile: bottom tab bar with icons

### Badges & Tags
- **Status Waiting:** BG `#FFF5E0`, text `#D4A04A`, border `#D4A04A`
- **Status Confirmed:** BG `#E8F5EC`, text `#5D9B6B`, border `#5D9B6B`
- **Status Cancelled:** BG `#FDE8E8`, text `#C07070`, border `#C07070`
- **Category Tag:** BG `#F5F0E8`, text `#6B4F3E`
- **Discount Badge:** BG `#C8956C`, text `#FDFBF7`

---

## Animation & Micro-interactions

All animations should be smooth and subtle — never flashy or distracting.

- **Page transitions:** Fade in, `0.3s ease`
- **Card hover:** Translate Y `-2px` + shadow, `0.2s ease`
- **Button press:** Scale `0.97`, `0.1s ease`
- **Order notification:** Gentle slide-in from right, `0.4s ease-out`
- **Loading:** Skeleton placeholders with soft shimmer animation (cream to oat milk gradient)
- **Toast notifications:** Slide up from bottom, auto-dismiss after 3s
- **Cart badge count:** Gentle bounce when item added

---

## Iconography

Use **Lucide React** icons — clean, minimal, consistent 1.5px stroke weight.
Icon size default: `20px`, touch targets: `24px`

---

## Screen Designs

---

### 🙋 PELANGGAN (Customer) — Responsive Website (Mobile-Friendly)

The customer experience is a **responsive website** accessed via mobile browser after scanning a QR code at the table. It is NOT a native mobile app — it's a Next.js web page that is optimized for mobile screens first, but also looks great on tablet and desktop. Clean, image-forward, easy browsing.

#### Screen 1: Landing / QR Scan Entry
- Full-screen warm welcome with Solaria's logo centered
- "Selamat Datang di Solaria's CoffeeShop" heading
- Table number badge displayed (e.g., "Meja 5")
- Optional "Login as Member" text link (subtle, not prominent)
- CTA button: "Lihat Menu" (Espresso Brown)
- Soft gradient background: cream to latte beige

#### Screen 2: Menu Browsing
- Top: search bar with filter icon
- Horizontal scrollable category chips: Coffee, Non-Coffee, Pastry, Snack, Main Course
- Active chip: filled Espresso Brown, inactive: outlined
- Menu grid (2 columns on mobile):
  - Menu card: image top (rounded 12px), name, short description (1 line), price
  - If discount active & user is member: show original price strikethrough + discounted price in Caramel Gold
  - "Tambah" button on each card (+ icon)
- Sticky bottom: floating cart bar showing item count + total price + "Lihat Keranjang" button

#### Screen 3: Menu Item Detail (Bottom Sheet)
- Slide-up bottom sheet (60% screen height)
- Large image at top
- Item name (H2), description, price
- Quantity selector: minus / number / plus (inline, rounded)
- Optional notes input field
- "Tambah ke Keranjang" CTA button (full-width)

#### Screen 4: Cart / Keranjang
- List of ordered items: name, qty, unit price, subtotal
- Swipe to delete or edit qty
- Divider line
- Subtotal, discount (if member + active event), Grand Total
- "Pesan Sekarang" CTA button

#### Screen 5: Payment Selection
- Order summary card (collapsed)
- Payment method selection:
  - QRIS: show simulated QR code image
  - Transfer Bank: show simulated bank details
  - Cash: "Bayar di Kasir" label
- Each method as a selectable radio card
- "Konfirmasi Pembayaran" CTA button

#### Screen 6: Order Success
- Checkmark animation (green circle with check)
- "Pesanan Berhasil!" heading
- Order number displayed prominently
- "Pesanan Anda sedang diproses oleh kasir"
- Table number reminder
- "Pesan Lagi" secondary button

#### Screen 7: Member Login (Optional Modal)
- Clean modal overlay
- Email + password inputs
- "Login" primary button
- "Belum punya akun? Daftar" text link
- "Lanjut tanpa login" ghost button
- After login: show member badge on menu screen + auto-apply discounts

---

### 🧾 KASIR (Cashier) — Tablet/Desktop Optimized

The cashier view is a real-time operations dashboard. Focus on clarity, speed, and at-a-glance status.

#### Screen 1: Waiting List (Default View)
- Top bar: Solaria's logo (left), "Dashboard Kasir" title, profile avatar (right)
- Two-tab navigation: **Pesanan Masuk** (active) | **History**
- Realtime order cards stacked vertically:
  - Header: Order number + Table number badge (e.g., "Meja 3") + timestamp
  - Body: list of items (name × qty)
  - Footer: Grand total (bold) + payment method badge
  - Status badge: "Menunggu" (amber)
  - Two action buttons: "Konfirmasi" (green) | "Tolak" (outlined red)
- Empty state: coffee cup illustration + "Belum ada pesanan masuk"
- Subtle pulse animation on new order card when it arrives

#### Screen 2: Order Detail Modal
- Triggered by tapping an order card
- Full item breakdown: name, qty, unit price, discount, subtotal per item
- Customer info: member name (if logged in) or "Guest"
- Table number prominently displayed
- Payment details: method + status
- Action buttons: Konfirmasi / Tolak

#### Screen 3: History Tab
- Filtered list: today's confirmed orders (default)
- Date picker to browse past orders
- Order cards (compact): order number, table, total, time, status "Dikonfirmasi" (green badge)
- Search by order number
- Summary stats at top: total orders today, total revenue today

---

### 👑 ADMIN — Desktop Dashboard

The admin dashboard is data-rich but clean. Sidebar navigation, spacious layout, professional feel.

#### Layout: Sidebar + Content
- **Sidebar** (left, 260px width):
  - Background: `#4A4A52` (dark slate)
  - Logo at top (white version)
  - Nav items with Lucide icons:
    - 📊 Dashboard
    - 🍽️ Menu
    - 📂 Kategori
    - 📦 Inventori
    - 🏷️ Diskon
    - 👥 Member
    - 🧾 Pesanan
    - 💳 Pembayaran
  - Active item: left border accent `#C8956C` + lighter BG
  - Collapse to icon-only on smaller screens

- **Content Area**: cream white background, max-width `1200px`, centered

#### Screen 1: Dashboard (Home)
- Greeting: "Selamat Pagi, Admin 👋"
- Top row — 4 stat cards in a grid:
  - Pendapatan Hari Ini (Rp xxx.xxx)
  - Total Pesanan Hari Ini
  - Menu Terjual Hari Ini
  - Member Aktif
  - Each card: icon + value (large number) + label + small trend indicator
- Revenue chart: line/bar chart showing daily revenue (last 7 days)
- Recent orders table (5 most recent): order number, table, total, status, time
- Low stock alerts: list of menu items with stock < 10

#### Screen 2: Menu Management
- Top: "Manajemen Menu" title + "Tambah Menu" primary button
- Filter: category dropdown + search input
- Table/grid view toggle
- Menu table: image thumbnail, name, category, price, stock, status toggle (available/unavailable), actions (edit/delete)
- Add/Edit Modal:
  - Image upload dropzone
  - Name, description, price, category dropdown, stock number
  - Toggle: is available
  - Save / Cancel buttons

#### Screen 3: Kategori Management
- Simple list with drag-to-reorder
- Each row: category name, description, item count badge, edit/delete actions
- Add category: inline form or modal

#### Screen 4: Inventori (Stock Management)
- Table: menu item name, current stock, status indicator (green/amber/red based on level)
- Low stock items highlighted with amber background
- "Adjust Stok" button per item → modal:
  - Select: Tambah / Kurangi
  - Quantity input
  - Reason text field
  - Submit button
- Stock history log below: timestamp, item, change, reason, admin name

#### Screen 5: Diskon Events
- Top: "Event Diskon" title + "Buat Event" button
- Event cards:
  - Event name, type (percentage/fixed), value
  - Date range (start - end)
  - Status badge: Active (green) / Expired (gray) / Upcoming (blue)
  - Applied to: "Semua menu" or list of specific items
  - Edit / Delete actions
- Create/Edit modal:
  - Name, type dropdown, value input
  - Date range picker
  - Toggle: applies to all menu
  - If not all: multi-select menu items
  - Save button

#### Screen 6: Member Management
- Table: name, email, join date, total orders, total spent, points
- Search by name/email
- Click row → member detail:
  - Profile info
  - Order history list
  - Total lifetime spend
  - Points balance

#### Screen 7: Pesanan (All Orders)
- Table: order number, table, customer, items count, total, status, payment method, date
- Filter by: status (waiting/confirmed/cancelled), date range
- Click row → full order detail modal

#### Screen 8: Pembayaran
- Table: payment ID, order number, method, amount, status, timestamp
- Filter by method (QRIS/Transfer/Cash), status (pending/paid)

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Customer (primary) |
| Tablet | 640px - 1024px | Kasir |
| Desktop | > 1024px | Admin |

---

## Accessibility

- All interactive elements have minimum `44px` touch target
- Color contrast ratio minimum `4.5:1` for text
- Focus visible outlines on all focusable elements
- Alt text on all images
- Semantic HTML: proper heading hierarchy, landmarks, ARIA labels
- Keyboard navigation support throughout

---

## Loading & Empty States

- **Loading:** Skeleton screens with shimmer effect (cream to oat milk gradient pulse)
- **Empty menu:** Coffee bean illustration + "Menu sedang diperbarui"
- **Empty cart:** Shopping bag illustration + "Keranjang masih kosong"
- **Empty orders (kasir):** Coffee cup illustration + "Belum ada pesanan masuk"
- **Error state:** Gentle error card with retry button

---

## Dark Mode (Optional / Future)

Not in scope for initial release. The warm white palette is the primary and only theme for now, aligning with the cozy cafe ambiance.
