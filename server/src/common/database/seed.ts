import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { User } from '../../features/auth/entities/user.entity';
import { JewelryItem } from '../../features/inventory/entities/jewelry-item.entity';
import { ProductionOrder } from '../../features/orders/entities/production-order.entity';

export async function seedDatabase(): Promise<void> {
  const userRepo = AppDataSource.getRepository(User);
  const itemRepo = AppDataSource.getRepository(JewelryItem);
  const orderRepo = AppDataSource.getRepository(ProductionOrder);

  // 1. Seed Default Admin User
  const existingUser = await userRepo.findOne({ where: { email: 'admin@enterprise.com' } });
  if (!existingUser) {
    const password_hash = await bcrypt.hash('admin123', 10);
    const adminUser = userRepo.create({
      email: 'admin@enterprise.com',
      password_hash,
      full_name: 'Júlio César Jordão',
      role: 'ADMIN'
    });
    await userRepo.save(adminUser);
    console.log('[Seed] Default user created: admin@enterprise.com / admin123');
  }

  // 2. Seed Initial Inventory Catalog
  const itemCount = await itemRepo.count();
  if (itemCount === 0) {
    const initialItems = [
      {
        sku: 'RNG-18K-SOL',
        name: 'Solitaire Diamond Ring 18K Gold',
        category: 'Rings',
        material: 'Gold',
        gold_karat: 18,
        weight_grams: 5.40,
        diamond_karats: 1.20,
        labor_cost_usd: 180.00,
        stock_quantity: 14,
        image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'
      },
      {
        sku: 'NCK-18K-CHV',
        name: 'Chevron Royal Gold Necklace 18K',
        category: 'Necklaces',
        material: 'Gold',
        gold_karat: 18,
        weight_grams: 18.20,
        diamond_karats: 0.50,
        labor_cost_usd: 320.00,
        stock_quantity: 8,
        image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
      },
      {
        sku: 'BRC-PLT-TNS',
        name: 'Platinum Riviera Tennis Bracelet',
        category: 'Bracelets',
        material: 'Platinum',
        gold_karat: 24,
        weight_grams: 14.80,
        diamond_karats: 3.50,
        labor_cost_usd: 480.00,
        stock_quantity: 4,
        image_url: 'https://images.unsplash.com/photo-1611591475841-45601a4db437?w=500'
      },
      {
        sku: 'EAR-18K-DRP',
        name: 'Emerald Cut Diamond Drop Earrings',
        category: 'Earrings',
        material: 'White Gold',
        gold_karat: 18,
        weight_grams: 6.80,
        diamond_karats: 2.10,
        labor_cost_usd: 240.00,
        stock_quantity: 2, // Low stock demo
        image_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500'
      },
      {
        sku: 'RNG-24K-SIG',
        name: '24K Pure Gold Artisan Signet Ring',
        category: 'Rings',
        material: 'Gold',
        gold_karat: 24,
        weight_grams: 12.50,
        diamond_karats: 0.00,
        labor_cost_usd: 210.00,
        stock_quantity: 11,
        image_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500'
      }
    ];

    const savedItems = await itemRepo.save(initialItems);
    console.log(`[Seed] Created ${savedItems.length} inventory items.`);

    // 3. Seed Production Orders
    const initialOrders = [
      {
        order_number: 'ORD-2026-1042-819',
        client_name: 'Tiffany & Partners Boutique',
        item_id: savedItems[0].id,
        item: savedItems[0],
        quantity: 3,
        gold_spot_price_at_order: 2450.00,
        calculated_unit_price: 2480.50,
        total_price: 7441.50,
        status: 'IN_PRODUCTION',
        delivery_date: '2026-09-25'
      },
      {
        order_number: 'ORD-2026-1055-392',
        client_name: 'Aurum Luxury Atelier',
        item_id: savedItems[1].id,
        item: savedItems[1],
        quantity: 2,
        gold_spot_price_at_order: 2450.00,
        calculated_unit_price: 3120.00,
        total_price: 6240.00,
        status: 'QUALITY_CHECK',
        delivery_date: '2026-09-18'
      },
      {
        order_number: 'ORD-2026-1089-114',
        client_name: 'Geneva Diamond Gallery',
        item_id: savedItems[2].id,
        item: savedItems[2],
        quantity: 1,
        gold_spot_price_at_order: 2450.00,
        calculated_unit_price: 5850.00,
        total_price: 5850.00,
        status: 'COMPLETED',
        delivery_date: '2026-09-10'
      }
    ];

    await orderRepo.save(initialOrders);
    console.log(`[Seed] Created ${initialOrders.length} initial production orders.`);
  }
}
