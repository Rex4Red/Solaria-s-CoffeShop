---
name: Solaria's CoffeeShop
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4f453f'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#81746e'
  outline-variant: '#d3c3bb'
  surface-tint: '#755847'
  primary: '#523829'
  on-primary: '#ffffff'
  primary-container: '#6b4f3e'
  on-primary-container: '#e8c2ad'
  inverse-primary: '#e5bfa9'
  secondary: '#7f5531'
  on-secondary: '#ffffff'
  secondary-container: '#ffc69a'
  on-secondary-container: '#7a512d'
  tertiary: '#014821'
  on-tertiary: '#ffffff'
  tertiary-container: '#226036'
  on-tertiary-container: '#98d8a3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#e5bfa9'
  on-primary-fixed: '#2b1709'
  on-primary-fixed-variant: '#5b4131'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#f3bb90'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#643e1c'
  tertiary-fixed: '#b0f2bb'
  tertiary-fixed-dim: '#95d5a1'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#105229'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
  latte-beige: '#F5F0E8'
  mocha-dark: '#3D2B1F'
  oat-milk: '#EDE6D8'
  vanilla-mist: '#FAF8F4'
  success-green: '#5D9B6B'
  warning-amber: '#D4A04A'
  error-rose: '#C07070'
  info-blue: '#7A9BB5'
  slate-admin: '#4A4A52'
  soft-lavender: '#8E8BA8'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-h1-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.5'
  price-display:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.2'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The brand personality is defined as **warm, inviting, and effortlessly elegant**. It aims to evoke the sensory experience of a modern, sun-drenched café—airy and clean, yet grounded in the comforting richness of artisanal coffee.

The chosen design style is **Minimalist / Modern Corporate with Tactile Warmth**. It prioritizes heavy whitespace and a restricted, high-quality color palette to ensure the interface feels uncluttered and professional. To avoid the sterility of typical SaaS platforms, the system incorporates soft organic shapes, subtle depth through low-opacity shadows, and a "milky" color story that mimics the physical environment of a coffee shop.

**Key Stylistic Principles:**
- **Airy Composition:** Use generous padding and margins to simulate the feeling of a spacious cafe.
- **Subtle Texture:** Depth is created through tonal layering rather than heavy shadows.
- **Image-Forward:** High-quality photography of coffee and pastries should act as the primary visual driver, framed by the neutral UI.

## Colors

This design system uses a "Steamed Milk & Espresso" palette. The primary background is **Cream White**, which provides a warm, non-clinical base for the entire application.

- **Primary (Espresso Brown):** Reserved for high-priority actions, primary buttons, and active navigation states. It represents the strength and core of the brand.
- **Secondary (Caramel Gold):** Used for accents, member-only highlights, and celebratory elements like discounts.
- **Neutral (Cream White / Latte Beige):** The surface system relies on these tones to create hierarchy. Cards use **Latte Beige** or white with subtle borders to stand out against the **Cream White** background.
- **Mocha Dark:** This is the exclusive color for typography to ensure high contrast while maintaining the "coffee" aesthetic; pure black (#000000) should never be used.
- **Admin Accents:** The **Slate Admin** color provides a necessary functional shift for back-office tasks, creating a clear visual distinction between the "Front of House" (Customer) and "Back of House" (Admin) experiences.

## Typography

The typography strategy pairs the modern, geometric friendliness of **Plus Jakarta Sans** for headlines with the utilitarian clarity of **Inter** for long-form content.

- **Headlines:** Use Plus Jakarta Sans to convey a premium, contemporary café vibe. Keep tracking (letter-spacing) tight for display sizes.
- **Body:** Inter is used for all functional text and descriptions to ensure maximum legibility, especially on mobile devices under varying light conditions.
- **Data & Pricing:** **JetBrains Mono** is utilized for prices, order numbers, and IDs. This monospaced choice adds a "receipt" or "ticket" aesthetic that feels authentic to a service environment while keeping numerical data perfectly aligned.

## Layout & Spacing

The layout follows a **fluid-to-fixed grid** hybrid model:
- **Customer (Mobile-First):** A fluid, single or double-column grid system. Margins are set to 16px to maximize screen real estate for menu imagery.
- **Kasir (Tablet):** A multi-pane layout with a fixed sidebar for order status and a fluid area for order cards.
- **Admin (Desktop):** A fixed 260px sidebar with a centered content area (max-width 1200px) to prevent line lengths from becoming unreadable on wide monitors.

**Spacing Rhythm:**
A strict 4px base unit governs all dimensions. Elements should typically be separated by `md` (16px) or `lg` (24px) units to maintain the airy, minimalist aesthetic.

## Elevation & Depth

Elevation in this design system is achieved through **Tonal Layers** and **Ambient Shadows**. Because the background is a warm off-white, shadows must be tinted with the brand's brown tones to avoid looking muddy or "dirty."

- **Level 0 (Base):** Cream White (#FDFBF7) surface.
- **Level 1 (Cards):** Uses a 1px border of Oat Milk (#EDE6D8) with a very soft shadow: `0 1px 3px rgba(61, 43, 31, 0.06)`.
- **Level 2 (Hover/Elevated):** Subtle lift using `0 4px 12px rgba(61, 43, 31, 0.08)`.
- **Level 3 (Modals/Sheets):** High depth with a tinted overlay and shadow: `0 8px 24px rgba(61, 43, 31, 0.12)`.

Avoid harsh black shadows; always use the `rgba` equivalent of **Mocha Dark** with very low opacity to maintain the soft, organic feel.

## Shapes

The shape language is **Soft and Approachable**. 

- **Primary Containers:** Cards and Modals use a **16px** radius to emphasize the "cozy" and "friendly" brand personality.
- **Interactive Elements:** Buttons use a **12px** radius, while input fields use **10px**. This slight variation creates a nested harmony where smaller elements feel precisely fit within larger containers.
- **Status Elements:** Tags and Badges utilize a full **Pill** shape (20px+) to distinguish them from interactive buttons.
- **Imagery:** Menu photos should always feature 12px rounded corners to match the UI's softness.

## Components

### Buttons
- **Primary:** Espresso Brown (#6B4F3E) background with Cream White text. On hover, darken the background slightly.
- **Secondary:** Outlined with Espresso Brown, using Latte Beige as the hover state background.
- **Interaction:** Apply a `scale(0.97)` transform on active (press) states for tactile feedback.

### Input Fields
- Use **Vanilla Mist (#FAF8F4)** for the background to create a subtle recessed look. 
- The border should be **Oat Milk (#EDE6D8)**, switching to **Espresso Brown** on focus.
- Placeholder text must be in a muted brown tone (#B5A99A) to meet accessibility standards.

### Cards
- Standard cards use the Level 1 shadow and an Oat Milk border. 
- Menu cards specifically should prioritize the image (top-aligned), with typography below using generous `md` (16px) padding.

### Status Badges
- Statuses use a "soft-fill" approach: a background with 10-15% opacity of the semantic color and a 100% opacity border and text of the same color (e.g., Success Green).

### Navigation
- **Customer:** Horizontal category chips should be pill-shaped. Active chips are Espresso Brown; inactive are outlined Oat Milk.
- **Admin:** Sidebar links use a 4px left-border accent in Caramel Gold to denote the active state, paired with a subtle background shift.

### Icons
- Use **Lucide React** with a 1.5px stroke. Icons should always be tinted with the text color (Mocha Dark) or the action color (Espresso Brown), never pure black.