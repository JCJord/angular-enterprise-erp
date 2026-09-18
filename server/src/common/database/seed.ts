import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { User } from '../../features/auth/entities/user.entity';
import { JewelryCategory, JewelryItem, MetalType } from '../../features/inventory/entities/jewelry-item.entity';
import { Customer } from '../../features/customers/entities/customer.entity';
import { JewelryOrder, OrderStatus } from '../../features/orders/entities/jewelry-order.entity';

export async function seedDatabase(): Promise<void> {
  const userRepo = AppDataSource.getRepository(User);
  const jewelryRepo = AppDataSource.getRepository(JewelryItem);
  const customerRepo = AppDataSource.getRepository(Customer);
  const orderRepo = AppDataSource.getRepository(JewelryOrder);

  // 1. Seed Admin User
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
    console.log('[Seed] Admin user created: admin@enterprise.com / admin123');
  }

  // 2. Seed Jewelry Items (Domínio Capta ERP)
  const jewelryCount = await jewelryRepo.count();
  if (jewelryCount === 0) {
    const jewelryItemsData: Partial<JewelryItem>[] = [
      {
        sku: 'JOI-AL-001',
        name: 'Aliança Tradicional Anatômica 6mm',
        category: JewelryCategory.WEDDING_RING,
        metal_type: MetalType.GOLD_18K_YELLOW,
        weight_grams: 6.500,
        stock_quantity: 8,
        min_stock_alert: 3,
        gold_quotation_ref: 420.50,
        base_price: 3850.00,
        photo_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-AN-002',
        name: 'Anel Solitário Brilhante Supreme 0.50ct',
        category: JewelryCategory.RING,
        metal_type: MetalType.GOLD_18K_WHITE,
        weight_grams: 4.200,
        stock_quantity: 4,
        min_stock_alert: 2,
        gold_quotation_ref: 425.00,
        base_price: 7900.00,
        photo_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-CL-003',
        name: 'Colar Ponto de Luz Veneziana 45cm',
        category: JewelryCategory.NECKLACE,
        metal_type: MetalType.GOLD_18K_YELLOW,
        weight_grams: 3.100,
        stock_quantity: 12,
        min_stock_alert: 4,
        gold_quotation_ref: 420.50,
        base_price: 2450.00,
        photo_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-PL-004',
        name: 'Pulseira Riviera Cravejada Zircônias',
        category: JewelryCategory.BRACELET,
        metal_type: MetalType.SILVER_925,
        weight_grams: 12.800,
        stock_quantity: 15,
        min_stock_alert: 5,
        gold_quotation_ref: 5.80,
        base_price: 890.00,
        photo_url: 'https://images.unsplash.com/photo-1611591475816-43510f715e21?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-BR-005',
        name: 'Brinco Argola Diamantada 20mm',
        category: JewelryCategory.EARRING,
        metal_type: MetalType.GOLD_18K_YELLOW,
        weight_grams: 2.750,
        stock_quantity: 6,
        min_stock_alert: 2,
        gold_quotation_ref: 420.50,
        base_price: 1950.00,
        photo_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-AN-006',
        name: 'Anel Pavê Safiras Azuis e Diamantes',
        category: JewelryCategory.RING,
        metal_type: MetalType.PLATINUM,
        weight_grams: 8.400,
        stock_quantity: 1, // Estoque crítico!
        min_stock_alert: 2,
        gold_quotation_ref: 480.00,
        base_price: 14500.00,
        photo_url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-CR-007',
        name: 'Corrente Grumet Dupla Masculina 60cm',
        category: JewelryCategory.NECKLACE,
        metal_type: MetalType.SILVER_925,
        weight_grams: 35.000,
        stock_quantity: 9,
        min_stock_alert: 3,
        gold_quotation_ref: 5.80,
        base_price: 1250.00,
        photo_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-AN-008',
        name: 'Anel Chuveiro Vintage Ouro Amarelo',
        category: JewelryCategory.RING,
        metal_type: MetalType.GOLD_18K_YELLOW,
        weight_grams: 5.100,
        stock_quantity: 1, // Estoque crítico!
        min_stock_alert: 3,
        gold_quotation_ref: 420.50,
        base_price: 4200.00,
        photo_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-CL-009',
        name: 'Colar Choker Elos Portugueses Pesados',
        category: JewelryCategory.NECKLACE,
        metal_type: MetalType.GOLD_18K_YELLOW,
        weight_grams: 18.500,
        stock_quantity: 2, // Estoque crítico!
        min_stock_alert: 2,
        gold_quotation_ref: 420.50,
        base_price: 12800.00,
        photo_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
      },
      {
        sku: 'JOI-AL-010',
        name: 'Aliança Prata 925 com Filete Ouro 18k',
        category: JewelryCategory.WEDDING_RING,
        metal_type: MetalType.SILVER_925,
        weight_grams: 5.200,
        stock_quantity: 14,
        min_stock_alert: 4,
        gold_quotation_ref: 5.80,
        base_price: 780.00,
        photo_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=60'
      }
    ];

    await jewelryRepo.save(jewelryRepo.create(jewelryItemsData));
    console.log(`[Seed] Seeded ${jewelryItemsData.length} jewelry items with realistic metrics.`);
  }

  // 3. Seed Customers
  const customerCount = await customerRepo.count();
  if (customerCount === 0) {
    const customersData: Partial<Customer>[] = [
      {
        name: 'Mariana Silveira Ramos',
        document: '428.192.839-44',
        phone: '(11) 98765-4321',
        email: 'mariana.ramos@email.com',
        credit_limit: 25000.00
      },
      {
        name: 'Carlos Eduardo Guimarães',
        document: '312.984.721-09',
        phone: '(11) 97123-8899',
        email: 'carlos.guimaraes@email.com',
        credit_limit: 40000.00
      },
      {
        name: 'Joalheria & Atelier Vivace LTDA',
        document: '18.421.902/0001-55',
        phone: '(11) 3221-4400',
        email: 'compras@vivacejoias.com.br',
        credit_limit: 150000.00
      }
    ];

    const savedCustomers = await customerRepo.save(customerRepo.create(customersData));
    console.log(`[Seed] Seeded ${savedCustomers.length} customers.`);

    // 4. Seed Jewelry Orders (PCP)
    const items = await jewelryRepo.find();
    if (items.length > 0) {
      const ordersData: Partial<JewelryOrder>[] = [
        {
          order_number: 'PCP-2026-001',
          customer: savedCustomers[0],
          jewelry_item: items[0],
          metal_type: MetalType.GOLD_18K_YELLOW,
          weight_grams: 7.200,
          daily_metal_quotation: 420.50,
          stones_count: 0,
          stone_unit_price: 0,
          artisan_labor_fee: 450.00,
          finishing_fee: 80.00,
          total_price: 3557.60,
          status: OrderStatus.BENCH, // Na bancada do ourives
          deadline: '2026-09-25'
        },
        {
          order_number: 'PCP-2026-002',
          customer: savedCustomers[1],
          jewelry_item: items[1],
          metal_type: MetalType.GOLD_18K_WHITE,
          weight_grams: 4.500,
          daily_metal_quotation: 425.00,
          stones_count: 1,
          stone_unit_price: 4500.00,
          artisan_labor_fee: 800.00,
          finishing_fee: 150.00,
          total_price: 7362.50,
          status: OrderStatus.SETTING, // Na cravação de pedras
          deadline: '2026-09-30'
        }
      ];

      await orderRepo.save(orderRepo.create(ordersData));
      console.log(`[Seed] Seeded ${ordersData.length} PCP jewelry orders.`);
    }
  }
}
