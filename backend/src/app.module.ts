import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { CategoriesModule } from './categories/categories.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { MembersModule } from './members/members.module';
import { DiscountsModule } from './discounts/discounts.module';
import { PaymentsModule } from './payments/payments.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    MenuModule,
    CategoriesModule,
    TablesModule,
    OrdersModule,
    InventoryModule,
    MembersModule,
    DiscountsModule,
    PaymentsModule,
    StatsModule,
  ],
})
export class AppModule {}
