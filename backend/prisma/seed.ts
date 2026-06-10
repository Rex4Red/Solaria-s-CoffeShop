import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // 1. SEED TABLES (10 meja)
  // ============================================
  console.log('📋 Creating 10 tables...');
  const tables = [];
  for (let i = 1; i <= 10; i++) {
    const table = await prisma.table.upsert({
      where: { tableNumber: i },
      update: {},
      create: {
        tableNumber: i,
        isActive: true,
      },
    });
    tables.push(table);
  }
  console.log(`   ✅ ${tables.length} tables created\n`);

  // ============================================
  // 2. SEED CATEGORIES
  // ============================================
  console.log('📂 Creating categories...');
  const categoriesData = [
    { name: 'Coffee', description: 'Hot & iced coffee beverages', sortOrder: 1 },
    { name: 'Non-Coffee', description: 'Tea, chocolate, and other drinks', sortOrder: 2 },
    { name: 'Pastry', description: 'Cakes, croissants, and baked goods', sortOrder: 3 },
    { name: 'Snack', description: 'Light bites and finger food', sortOrder: 4 },
    { name: 'Main Course', description: 'Rice bowls, pasta, and heavy meals', sortOrder: 5 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categories[cat.name] = category;
  }
  console.log(`   ✅ ${Object.keys(categories).length} categories created\n`);

  // ============================================
  // 3. SEED MENU ITEMS
  // ============================================
  console.log('☕ Creating menu items...');
  const menuItemsData = [
    // Coffee
    { name: 'Espresso', description: 'Strong single shot espresso', price: 18000, categoryName: 'Coffee', stock: 100 },
    { name: 'Americano', description: 'Espresso with hot water', price: 22000, categoryName: 'Coffee', stock: 100 },
    { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 28000, categoryName: 'Coffee', stock: 80 },
    { name: 'Cafe Latte', description: 'Espresso with smooth steamed milk', price: 28000, categoryName: 'Coffee', stock: 80 },
    { name: 'Caramel Macchiato', description: 'Vanilla latte with caramel drizzle', price: 32000, categoryName: 'Coffee', stock: 60 },
    { name: 'Mocha Latte', description: 'Espresso with chocolate and milk', price: 30000, categoryName: 'Coffee', stock: 60 },
    { name: 'Iced Coffee Latte', description: 'Chilled espresso with cold milk', price: 26000, categoryName: 'Coffee', stock: 90 },
    { name: 'Affogato', description: 'Espresso poured over vanilla ice cream', price: 35000, categoryName: 'Coffee', stock: 40 },

    // Non-Coffee
    { name: 'Matcha Latte', description: 'Japanese green tea with steamed milk', price: 28000, categoryName: 'Non-Coffee', stock: 50 },
    { name: 'Hot Chocolate', description: 'Rich Belgian chocolate drink', price: 25000, categoryName: 'Non-Coffee', stock: 60 },
    { name: 'Earl Grey Tea', description: 'Classic bergamot-infused black tea', price: 20000, categoryName: 'Non-Coffee', stock: 70 },
    { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 22000, categoryName: 'Non-Coffee', stock: 40 },
    { name: 'Strawberry Smoothie', description: 'Blended strawberry with yogurt', price: 30000, categoryName: 'Non-Coffee', stock: 30 },

    // Pastry
    { name: 'Butter Croissant', description: 'Flaky French-style croissant', price: 18000, categoryName: 'Pastry', stock: 25 },
    { name: 'Chocolate Muffin', description: 'Moist chocolate chip muffin', price: 15000, categoryName: 'Pastry', stock: 30 },
    { name: 'Cinnamon Roll', description: 'Warm cinnamon roll with cream cheese glaze', price: 22000, categoryName: 'Pastry', stock: 20 },
    { name: 'Red Velvet Cake', description: 'Slice of red velvet with cream cheese frosting', price: 35000, categoryName: 'Pastry', stock: 15 },

    // Snack
    { name: 'French Fries', description: 'Crispy golden fries with dipping sauce', price: 20000, categoryName: 'Snack', stock: 50 },
    { name: 'Chicken Wings', description: '6 pcs spicy buffalo chicken wings', price: 35000, categoryName: 'Snack', stock: 30 },
    { name: 'Toast & Jam', description: 'Grilled bread with butter and strawberry jam', price: 15000, categoryName: 'Snack', stock: 40 },

    // Main Course
    { name: 'Chicken Rice Bowl', description: 'Grilled chicken with teriyaki sauce and rice', price: 38000, categoryName: 'Main Course', stock: 25 },
    { name: 'Aglio Olio Pasta', description: 'Spaghetti with garlic, chili, and olive oil', price: 35000, categoryName: 'Main Course', stock: 20 },
    { name: 'Club Sandwich', description: 'Triple-decker sandwich with fries', price: 40000, categoryName: 'Main Course', stock: 20 },
  ];

  let menuCount = 0;
  for (const item of menuItemsData) {
    const category = categories[item.categoryName];
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: category.id,
        stock: item.stock,
        isAvailable: true,
      },
    });
    menuCount++;
  }
  console.log(`   ✅ ${menuCount} menu items created\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('═══════════════════════════════════════');
  console.log('🎉 Seed completed successfully!');
  console.log('═══════════════════════════════════════');
  console.log(`   Tables:     ${tables.length}`);
  console.log(`   Categories: ${Object.keys(categories).length}`);
  console.log(`   Menu Items: ${menuCount}`);
  console.log('═══════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
