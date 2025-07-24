import { PrismaClient, UserRole, VendorStatus, ProductStatus, AddressType } from '@prisma/client';
import { BahrainPrismaUtils } from '../src/lib/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tendzd.bh',
      nameEn: 'Tendzd Administrator',
      nameAr: 'مدير تندز',
      phone: '+97317123456',
      passwordHash: '$2b$10$hash', // In production, use proper bcrypt hash
      role: UserRole.ADMIN,
      isVerified: true,
      pdplConsent: true,
      pdplConsentAt: new Date(),
    },
  });

  // Create vendor users
  const vendorUser1 = await prisma.user.create({
    data: {
      email: 'techstore@tendzd.bh',
      nameEn: 'Ahmed Al-Khalifa',
      nameAr: 'أحمد الخليفة',
      phone: '+97317234567',
      passwordHash: '$2b$10$hash',
      role: UserRole.VENDOR,
      isVerified: true,
      pdplConsent: true,
      pdplConsentAt: new Date(),
    },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      email: 'fashion@tendzd.bh',
      nameEn: 'Fatima Al-Mahmood',
      nameAr: 'فاطمة المحمود',
      phone: '+97317345678',
      passwordHash: '$2b$10$hash',
      role: UserRole.VENDOR,
      isVerified: true,
      pdplConsent: true,
      pdplConsentAt: new Date(),
    },
  });

  const vendorUser3 = await prisma.user.create({
    data: {
      email: 'homeessentials@tendzd.bh',
      nameEn: 'Mohammed Al-Dosari',
      nameAr: 'محمد الدوسري',
      phone: '+97317456789',
      passwordHash: '$2b$10$hash',
      role: UserRole.VENDOR,
      isVerified: true,
      pdplConsent: true,
      pdplConsentAt: new Date(),
    },
  });

  // Create customer users
  const customerUser1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      nameEn: 'Sara Al-Mansoori',
      nameAr: 'سارة المنصوري',
      phone: '+97317567890',
      passwordHash: '$2b$10$hash',
      role: UserRole.CUSTOMER,
      isVerified: true,
      pdplConsent: true,
      pdplConsentAt: new Date(),
    },
  });

  const customerUser2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      nameEn: 'Omar Al-Fadhel',
      nameAr: 'عمر الفاضل',
      phone: '+97317678901',
      passwordHash: '$2b$10$hash',
      role: UserRole.CUSTOMER,
      isVerified: true,
      pdplConsent: true,
      pdplConsentAt: new Date(),
    },
  });

  console.log('✅ Users created');

  // Create vendors
  const techStoreVendor = await prisma.vendor.create({
    data: {
      userId: vendorUser1.id,
      businessNameEn: 'TechStore Bahrain',
      businessNameAr: 'متجر التكنولوجيا البحرين',
      slug: 'techstore-bahrain',
      description: 'Leading electronics and technology retailer in Bahrain',
      descriptionAr: 'رائد في بيع الإلكترونيات والتكنولوجيا في البحرين',
      status: VendorStatus.APPROVED,
      crNumber: '123456',
      vatRegistration: 'BH123456789',
      benefitPayMerchantId: 'TECH001',
      bankAccount: '01234567890',
      bankName: 'National Bank of Bahrain',
    },
  });

  const fashionVendor = await prisma.vendor.create({
    data: {
      userId: vendorUser2.id,
      businessNameEn: 'Fashion Boutique',
      businessNameAr: 'بوتيك الأزياء',
      slug: 'fashion-boutique',
      description: 'Premium fashion and lifestyle store',
      descriptionAr: 'متجر أزياء ونمط حياة راقي',
      status: VendorStatus.APPROVED,
      crNumber: '234567',
      vatRegistration: 'BH234567890',
      benefitPayMerchantId: 'FASH001',
      bankAccount: '12345678901',
      bankName: 'Ahli United Bank',
    },
  });

  const homeVendor = await prisma.vendor.create({
    data: {
      userId: vendorUser3.id,
      businessNameEn: 'Home Essentials',
      businessNameAr: 'أساسيات المنزل',
      slug: 'home-essentials',
      description: 'Everything you need for your home and garden',
      descriptionAr: 'كل ما تحتاجه لمنزلك وحديقتك',
      status: VendorStatus.APPROVED,
      crNumber: '345678',
      vatRegistration: 'BH345678901',
      benefitPayMerchantId: 'HOME001',
      bankAccount: '23456789012',
      bankName: 'BBK Bank',
    },
  });

  console.log('✅ Vendors created');

  // Create categories
  const electronicsCategory = await prisma.category.create({
    data: {
      nameEn: 'Electronics',
      nameAr: 'الإلكترونيات',
      slug: 'electronics',
      descriptionEn: 'Latest electronics and gadgets',
      descriptionAr: 'أحدث الإلكترونيات والأجهزة',
      sortOrder: 1,
    },
  });

  const smartphonesCategory = await prisma.category.create({
    data: {
      nameEn: 'Smartphones',
      nameAr: 'الهواتف الذكية',
      slug: 'smartphones',
      descriptionEn: 'Latest smartphones and accessories',
      descriptionAr: 'أحدث الهواتف الذكية والإكسسوارات',
      parentId: electronicsCategory.id,
      sortOrder: 1,
    },
  });

  const laptopsCategory = await prisma.category.create({
    data: {
      nameEn: 'Laptops',
      nameAr: 'أجهزة الكمبيوتر المحمولة',
      slug: 'laptops',
      descriptionEn: 'Laptops and computers',
      descriptionAr: 'أجهزة الكمبيوتر المحمولة والحواسيب',
      parentId: electronicsCategory.id,
      sortOrder: 2,
    },
  });

  const fashionCategory = await prisma.category.create({
    data: {
      nameEn: 'Fashion',
      nameAr: 'الأزياء',
      slug: 'fashion',
      descriptionEn: 'Trendy fashion for all',
      descriptionAr: 'أزياء عصرية للجميع',
      sortOrder: 2,
    },
  });

  const mensCategory = await prisma.category.create({
    data: {
      nameEn: 'Men\'s Fashion',
      nameAr: 'أزياء رجالية',
      slug: 'mens-fashion',
      descriptionEn: 'Fashion for men',
      descriptionAr: 'أزياء للرجال',
      parentId: fashionCategory.id,
      sortOrder: 1,
    },
  });

  const womensCategory = await prisma.category.create({
    data: {
      nameEn: 'Women\'s Fashion',
      nameAr: 'أزياء نسائية',
      slug: 'womens-fashion',
      descriptionEn: 'Fashion for women',
      descriptionAr: 'أزياء للنساء',
      parentId: fashionCategory.id,
      sortOrder: 2,
    },
  });

  const homeCategory = await prisma.category.create({
    data: {
      nameEn: 'Home & Garden',
      nameAr: 'المنزل والحديقة',
      slug: 'home-garden',
      descriptionEn: 'Everything for your home',
      descriptionAr: 'كل شيء لمنزلك',
      sortOrder: 3,
    },
  });

  console.log('✅ Categories created');

  // Create products for TechStore
  const iphone15 = await prisma.product.create({
    data: {
      vendorId: techStoreVendor.id,
      nameEn: 'iPhone 15 Pro Max',
      nameAr: 'آيفون 15 برو ماكس',
      slug: 'iphone-15-pro-max',
      descriptionEn: 'Latest iPhone with advanced camera system and powerful A17 Pro chip',
      descriptionAr: 'أحدث آيفون مع نظام كاميرا متقدم ومعالج A17 Pro القوي',
      sku: 'TECH-IPH15-PM-256',
      price: 450.500,
      costPrice: 380.000,
      vatIncluded: true,
      weight: 0.221,
      dimensions: '159.9 x 76.7 x 8.25 mm',
      status: ProductStatus.ACTIVE,
      featured: true,
      stockQuantity: 25,
      lowStockThreshold: 5,
      metaTitleEn: 'iPhone 15 Pro Max - Buy Online in Bahrain',
      metaTitleAr: 'آيفون 15 برو ماكس - اشتر أونلاين في البحرين',
    },
  });

  const macbookPro = await prisma.product.create({
    data: {
      vendorId: techStoreVendor.id,
      nameEn: 'MacBook Pro 14-inch M3',
      nameAr: 'ماك بوك برو 14 إنش M3',
      slug: 'macbook-pro-14-m3',
      descriptionEn: 'Professional laptop with M3 chip for power users',
      descriptionAr: 'حاسوب محمول احترافي مع معالج M3 للمستخدمين المحترفين',
      sku: 'TECH-MBP-14-M3-512',
      price: 850.750,
      costPrice: 720.000,
      vatIncluded: true,
      weight: 1.55,
      dimensions: '31.26 x 22.12 x 1.55 cm',
      status: ProductStatus.ACTIVE,
      featured: true,
      stockQuantity: 12,
      lowStockThreshold: 3,
      metaTitleEn: 'MacBook Pro 14-inch M3 - Professional Laptop',
      metaTitleAr: 'ماك بوك برو 14 إنش M3 - حاسوب احترافي',
    },
  });

  const samsungS24 = await prisma.product.create({
    data: {
      vendorId: techStoreVendor.id,
      nameEn: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونغ جالاكسي S24 الترا',
      slug: 'samsung-galaxy-s24-ultra',
      descriptionEn: 'Flagship Android phone with S Pen and advanced AI features',
      descriptionAr: 'هاتف أندرويد رائد مع قلم S وميزات ذكاء اصطناعي متقدمة',
      sku: 'TECH-SAM-S24-ULT-512',
      price: 420.250,
      costPrice: 350.000,
      vatIncluded: true,
      weight: 0.232,
      dimensions: '162.3 x 79.0 x 8.6 mm',
      status: ProductStatus.ACTIVE,
      featured: false,
      stockQuantity: 18,
      lowStockThreshold: 5,
    },
  });

  // Create products for Fashion Boutique
  const mensSuit = await prisma.product.create({
    data: {
      vendorId: fashionVendor.id,
      nameEn: 'Premium Business Suit',
      nameAr: 'بدلة عمل راقية',
      slug: 'premium-business-suit',
      descriptionEn: 'Elegant wool suit perfect for business occasions',
      descriptionAr: 'بدلة صوفية أنيقة مثالية للمناسبات التجارية',
      sku: 'FASH-SUIT-MEN-XL-BLK',
      price: 180.750,
      costPrice: 120.000,
      vatIncluded: true,
      weight: 1.2,
      dimensions: '60 x 40 x 5 cm',
      status: ProductStatus.ACTIVE,
      featured: true,
      stockQuantity: 8,
      lowStockThreshold: 2,
    },
  });

  const womensDress = await prisma.product.create({
    data: {
      vendorId: fashionVendor.id,
      nameEn: 'Elegant Evening Dress',
      nameAr: 'فستان سهرة أنيق',
      slug: 'elegant-evening-dress',
      descriptionEn: 'Beautiful silk evening dress for special occasions',
      descriptionAr: 'فستان سهرة حريري جميل للمناسبات الخاصة',
      sku: 'FASH-DRESS-WOM-M-BLU',
      price: 95.500,
      costPrice: 65.000,
      vatIncluded: true,
      weight: 0.5,
      dimensions: '50 x 35 x 3 cm',
      status: ProductStatus.ACTIVE,
      featured: true,
      stockQuantity: 15,
      lowStockThreshold: 3,
    },
  });

  // Create products for Home Essentials
  const coffeeTable = await prisma.product.create({
    data: {
      vendorId: homeVendor.id,
      nameEn: 'Modern Glass Coffee Table',
      nameAr: 'طاولة قهوة زجاجية عصرية',
      slug: 'modern-glass-coffee-table',
      descriptionEn: 'Stylish glass coffee table with metal frame',
      descriptionAr: 'طاولة قهوة زجاجية أنيقة مع إطار معدني',
      sku: 'HOME-TBL-COF-GLS-120',
      price: 125.750,
      costPrice: 85.000,
      vatIncluded: true,
      weight: 15.5,
      dimensions: '120 x 60 x 45 cm',
      status: ProductStatus.ACTIVE,
      featured: false,
      stockQuantity: 6,
      lowStockThreshold: 2,
    },
  });

  const kitchenSet = await prisma.product.create({
    data: {
      vendorId: homeVendor.id,
      nameEn: 'Stainless Steel Kitchen Set',
      nameAr: 'طقم مطبخ من الستانلس ستيل',
      slug: 'stainless-steel-kitchen-set',
      descriptionEn: 'Professional grade kitchen utensils set',
      descriptionAr: 'طقم أدوات مطبخ بجودة احترافية',
      sku: 'HOME-KIT-SET-SS-12PC',
      price: 45.250,
      costPrice: 28.000,
      vatIncluded: true,
      weight: 2.3,
      dimensions: '35 x 25 x 15 cm',
      status: ProductStatus.ACTIVE,
      featured: true,
      stockQuantity: 32,
      lowStockThreshold: 10,
    },
  });

  console.log('✅ Products created');

  // Assign categories to products
  await prisma.productCategory.createMany({
    data: [
      { productId: iphone15.id, categoryId: smartphonesCategory.id },
      { productId: iphone15.id, categoryId: electronicsCategory.id },
      { productId: macbookPro.id, categoryId: laptopsCategory.id },
      { productId: macbookPro.id, categoryId: electronicsCategory.id },
      { productId: samsungS24.id, categoryId: smartphonesCategory.id },
      { productId: samsungS24.id, categoryId: electronicsCategory.id },
      { productId: mensSuit.id, categoryId: mensCategory.id },
      { productId: mensSuit.id, categoryId: fashionCategory.id },
      { productId: womensDress.id, categoryId: womensCategory.id },
      { productId: womensDress.id, categoryId: fashionCategory.id },
      { productId: coffeeTable.id, categoryId: homeCategory.id },
      { productId: kitchenSet.id, categoryId: homeCategory.id },
    ],
  });

  console.log('✅ Product categories assigned');

  // Create product images
  await prisma.productImage.createMany({
    data: [
      // iPhone 15 images
      {
        productId: iphone15.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'iPhone 15 Pro Max front view',
        altTextAr: 'آيفون 15 برو ماكس من الأمام',
        sortOrder: 0,
        isMain: true,
      },
      {
        productId: iphone15.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'iPhone 15 Pro Max back view',
        altTextAr: 'آيفون 15 برو ماكس من الخلف',
        sortOrder: 1,
      },
      // MacBook Pro images
      {
        productId: macbookPro.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'MacBook Pro 14-inch open view',
        altTextAr: 'ماك بوك برو 14 إنش مفتوح',
        sortOrder: 0,
        isMain: true,
      },
      // Samsung S24 images
      {
        productId: samsungS24.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'Samsung Galaxy S24 Ultra',
        altTextAr: 'سامسونغ جالاكسي S24 الترا',
        sortOrder: 0,
        isMain: true,
      },
      // Men's Suit images
      {
        productId: mensSuit.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'Premium Business Suit',
        altTextAr: 'بدلة عمل راقية',
        sortOrder: 0,
        isMain: true,
      },
      // Women's Dress images
      {
        productId: womensDress.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'Elegant Evening Dress',
        altTextAr: 'فستان سهرة أنيق',
        sortOrder: 0,
        isMain: true,
      },
      // Coffee Table images
      {
        productId: coffeeTable.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'Modern Glass Coffee Table',
        altTextAr: 'طاولة قهوة زجاجية عصرية',
        sortOrder: 0,
        isMain: true,
      },
      // Kitchen Set images
      {
        productId: kitchenSet.id,
        imageUrl: '/api/placeholder/600/600',
        altTextEn: 'Stainless Steel Kitchen Set',
        altTextAr: 'طقم مطبخ من الستانلس ستيل',
        sortOrder: 0,
        isMain: true,
      },
    ],
  });

  console.log('✅ Product images created');

  // Create customer addresses
  await prisma.address.createMany({
    data: [
      {
        userId: customerUser1.id,
        type: AddressType.BOTH,
        nameEn: 'Sara Al-Mansoori',
        nameAr: 'سارة المنصوري',
        phone: '+97317567890',
        addressLine1: 'Building 123, Road 456',
        addressLine2: 'Block 789, Apartment 4A',
        city: 'Manama',
        state: 'Capital Governorate',
        postalCode: '317',
        country: 'BH',
        isDefault: true,
      },
      {
        userId: customerUser2.id,
        type: AddressType.SHIPPING,
        nameEn: 'Omar Al-Fadhel',
        nameAr: 'عمر الفاضل',
        phone: '+97317678901',
        addressLine1: 'Villa 567, Road 234',
        city: 'Riffa',
        state: 'Southern Governorate',
        postalCode: '901',
        country: 'BH',
        isDefault: true,
      },
    ],
  });

  console.log('✅ Customer addresses created');

  // Create sample cart items
  await prisma.cartItem.createMany({
    data: [
      {
        userId: customerUser1.id,
        productId: iphone15.id,
        quantity: 1,
        priceAtAdd: 450.500,
      },
      {
        userId: customerUser1.id,
        productId: womensDress.id,
        quantity: 2,
        priceAtAdd: 95.500,
      },
      {
        userId: customerUser2.id,
        productId: macbookPro.id,
        quantity: 1,
        priceAtAdd: 850.750,
      },
      {
        userId: customerUser2.id,
        productId: kitchenSet.id,
        quantity: 1,
        priceAtAdd: 45.250,
      },
    ],
  });

  console.log('✅ Cart items created');

  // Create system settings
  await prisma.setting.createMany({
    data: [
      {
        key: 'site_name_en',
        value: 'Tendzd',
        type: 'STRING',
      },
      {
        key: 'site_name_ar',
        value: 'تندز',
        type: 'STRING',
      },
      {
        key: 'default_vat_rate',
        value: '0.10',
        type: 'NUMBER',
      },
      {
        key: 'default_commission_rate',
        value: '0.10',
        type: 'NUMBER',
      },
      {
        key: 'free_shipping_threshold',
        value: '50.000',
        type: 'NUMBER',
      },
      {
        key: 'currency_code',
        value: 'BHD',
        type: 'STRING',
      },
      {
        key: 'timezone',
        value: 'Asia/Bahrain',
        type: 'STRING',
      },
      {
        key: 'business_hours',
        value: JSON.stringify({
          sunday: { open: '08:00', close: '18:00' },
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { closed: true },
          saturday: { open: '08:00', close: '12:00' }
        }),
        type: 'JSON',
      },
    ],
  });

  console.log('✅ System settings created');

  // Generate sample order
  const orderNumber = BahrainPrismaUtils.generateOrderNumber();
  const sampleOrder = await prisma.order.create({
    data: {
      userId: customerUser1.id,
      orderNumber,
      totalAmount: 641.500,
      subtotalAmount: 546.000,
      vatAmount: 54.600,
      shippingAmount: 5.000,
      paymentMethod: 'BENEFIT_PAY',
      shippingAddress: JSON.stringify({
        nameEn: 'Sara Al-Mansoori',
        nameAr: 'سارة المنصوري',
        phone: '+97317567890',
        addressLine1: 'Building 123, Road 456',
        addressLine2: 'Block 789, Apartment 4A',
        city: 'Manama',
        state: 'Capital Governorate',
        postalCode: '317',
        country: 'BH',
      }),
    },
  });

  // Create order items
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: sampleOrder.id,
        productId: iphone15.id,
        vendorId: techStoreVendor.id,
        quantity: 1,
        unitPrice: 450.500,
        totalPrice: 450.500,
        productNameEn: 'iPhone 15 Pro Max',
        productNameAr: 'آيفون 15 برو ماكس',
        productSku: 'TECH-IPH15-PM-256',
        productImage: '/api/placeholder/600/600',
      },
      {
        orderId: sampleOrder.id,
        productId: womensDress.id,
        vendorId: fashionVendor.id,
        quantity: 1,
        unitPrice: 95.500,
        totalPrice: 95.500,
        productNameEn: 'Elegant Evening Dress',
        productNameAr: 'فستان سهرة أنيق',
        productSku: 'FASH-DRESS-WOM-M-BLU',
        productImage: '/api/placeholder/600/600',
      },
    ],
  });

  // Create vendor orders
  const techStoreVendorOrder = await prisma.vendorOrder.create({
    data: {
      orderId: sampleOrder.id,
      vendorId: techStoreVendor.id,
      vendorOrderNumber: BahrainPrismaUtils.generateVendorOrderNumber('techstore'),
      subtotal: 450.500,
      vatAmount: 45.050,
      commissionRate: 0.1000,
      commissionAmount: 45.050,
      vendorEarnings: 405.450,
    },
  });

  const fashionVendorOrder = await prisma.vendorOrder.create({
    data: {
      orderId: sampleOrder.id,
      vendorId: fashionVendor.id,
      vendorOrderNumber: BahrainPrismaUtils.generateVendorOrderNumber('fashion'),
      subtotal: 95.500,
      vatAmount: 9.550,
      commissionRate: 0.1000,
      commissionAmount: 9.550,
      vendorEarnings: 85.950,
    },
  });

  console.log('✅ Sample order and vendor orders created');

  console.log('🎉 Database seeded successfully!');
  console.log(`
📊 Seeded data summary:
- Users: 5 (1 admin, 3 vendors, 2 customers)
- Vendors: 3 approved vendors
- Categories: 7 categories with hierarchy
- Products: 8 products across different categories
- Product Images: 8 product images
- Addresses: 2 customer addresses
- Cart Items: 4 items in customer carts
- Orders: 1 complete order with vendor splits
- Settings: 8 system configuration settings

🏪 Test Vendors:
- TechStore Bahrain (Electronics)
- Fashion Boutique (Fashion)
- Home Essentials (Home & Garden)

💰 Pricing includes 10% Bahrain VAT
🏦 Payment methods: BenefitPay, Apple Pay, Bank Transfer
📱 Ready for Arabic/English multi-language support
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });