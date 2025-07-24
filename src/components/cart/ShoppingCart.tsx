'use client';

import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Divider,
  Card,
  Grid,
  Badge,
  ActionIcon,
  NumberInput,
  Image,
  Alert,
  Collapse,
  Avatar,
  Rating,
  Modal
} from '@mantine/core';
import {
  IconShoppingCart,
  IconTrash,
  IconHeart,
  IconPlus,
  IconMinus,
  IconTruck,
  IconShield,
  IconInfoCircle,
  IconArrowRight,
  IconArrowLeft,
  IconStar
} from '@tabler/icons-react';
import { useState } from 'react';
import { BahrainPrismaUtils } from '@/lib/prisma';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  vendor: {
    id: string;
    name: string;
    nameAr: string;
    rating: number;
    logo?: string;
    freeShippingThreshold: number;
  };
  attributes?: {
    size?: string;
    color?: string;
    colorAr?: string;
  };
}

interface CartVendorGroup {
  vendor: CartItem['vendor'];
  items: CartItem[];
  subtotal: number;
  vatAmount: number;
  shippingFee: number;
  total: number;
  qualifiesForFreeShipping: boolean;
}

interface ShoppingCartProps {
  locale: string;
  isOpen?: boolean;
  onClose?: () => void;
  initialItems?: CartItem[];
}

// Mock cart items for demonstration
const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: 'prod-1',
    name: 'iPhone 15 Pro Max 256GB',
    nameAr: 'آيفون 15 برو ماكس 256 جيجا',
    image: '/api/placeholder/100/100',
    price: 450.500,
    originalPrice: 525.000,
    quantity: 1,
    vendor: {
      id: 'vendor-1',
      name: 'TechStore Bahrain',
      nameAr: 'متجر التقنية البحرين',
      logo: '/api/placeholder/40/40',
      verified: true
    },
    attributes: {
      color: 'Space Black',
      colorAr: 'أسود فضائي',
      storage: '256GB'
    },
    inStock: true,
    shippingTime: '1-2 days',
    shippingTimeAr: '1-2 أيام'
  },
  {
    id: '2', 
    productId: 'prod-2',
    name: 'Samsung Galaxy Buds Pro',
    nameAr: 'سماعات سامسونج جالاكسي برو',
    image: '/api/placeholder/100/100',
    price: 89.750,
    originalPrice: 120.000,
    quantity: 2,
    vendor: {
      id: 'vendor-2',
      name: 'Audio Kingdom',
      nameAr: 'مملكة الصوتيات',
      logo: '/api/placeholder/40/40',
      verified: true
    },
    attributes: {
      color: 'Phantom Black',
      colorAr: 'أسود شبحي'
    },
    inStock: true,
    shippingTime: '2-3 days',  
    shippingTimeAr: '2-3 أيام'
  },
  {
    id: '3',
    productId: 'prod-3', 
    name: 'Apple Watch Series 9',
    nameAr: 'ساعة آبل السلسلة 9',
    image: '/api/placeholder/100/100',
    price: 189.000,
    quantity: 1,
    vendor: {
      id: 'vendor-1',
      name: 'TechStore Bahrain', 
      nameAr: 'متجر التقنية البحرين',
      logo: '/api/placeholder/40/40',
      verified: true
    },
    attributes: {
      size: '45mm',
      color: 'Midnight',
      colorAr: 'منتصف الليل'
    },
    inStock: false,
    shippingTime: '5-7 days',
    shippingTimeAr: '5-7 أيام'
  }
];

export function ShoppingCart({ 
  locale, 
  isOpen = false, 
  onClose, 
  initialItems = [] 
}: ShoppingCartProps) {
  const isRTL = locale === 'ar';
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems.length > 0 ? initialItems : mockCartItems);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [expandedVendors, setExpandedVendors] = useState<Record<string, boolean>>({});
    {
      id: '1',
      productId: 'prod-1',
      name: 'iPhone 15 Pro Max 256GB',
      nameAr: 'آيفون 15 برو ماكس 256 جيجا',
      image: '/api/placeholder/100/100',
      price: 450.500,
      quantity: 1,
      maxQuantity: 5,
      vendor: {
        id: 'vendor-1',
        name: 'TechStore Bahrain',
        nameAr: 'متجر التكنولوجيا البحرين',
        rating: 4.8,
        freeShippingThreshold: 100.000
      },
      attributes: {
        color: 'Natural Titanium',
        colorAr: 'تيتانيوم طبيعي'
      }
    },
    {
      id: '2',
      productId: 'prod-2',
      name: 'AirPods Pro (2nd Gen)',
      nameAr: 'إيربودز برو الجيل الثاني',
      image: '/api/placeholder/100/100',
      price: 85.750,
      quantity: 2,
      maxQuantity: 10,
      vendor: {
        id: 'vendor-1',
        name: 'TechStore Bahrain',
        nameAr: 'متجر التكنولوجيا البحرين',
        rating: 4.8,
        freeShippingThreshold: 100.000
      }
    },
    {
      id: '3',
      productId: 'prod-3',
      name: 'Premium Evening Dress',
      nameAr: 'فستان سهرة راقي',
      image: '/api/placeholder/100/100',
      price: 95.500,
      quantity: 1,
      maxQuantity: 3,
      vendor: {
        id: 'vendor-2',
        name: 'Fashion Boutique',
        nameAr: 'بوتيك الأزياء',
        rating: 4.6,
        freeShippingThreshold: 75.000
      },
      attributes: {
        size: 'M',
        color: 'Navy Blue',
        colorAr: 'أزرق كحلي'
      }
    }
  ];

  // Group cart items by vendor
  const vendorGroups: CartVendorGroup[] = cartItems.reduce((groups, item) => {
    const existingGroup = groups.find(g => g.vendor.id === item.vendor.id);
    
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groups.push({
        vendor: item.vendor,
        items: [item],
        subtotal: 0,
        vatAmount: 0,
        shippingFee: 0,
        total: 0,
        qualifiesForFreeShipping: false
      });
    }
    
    return groups;
  }, [] as CartVendorGroup[]);

  // Calculate totals for each vendor group
  vendorGroups.forEach(group => {
    const itemsTotal = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vatCalc = BahrainPrismaUtils.calculateVAT(itemsTotal, true);
    
    group.subtotal = vatCalc.amount;
    group.vatAmount = vatCalc.vatAmount;
    group.qualifiesForFreeShipping = itemsTotal >= group.vendor.freeShippingThreshold;
    group.shippingFee = group.qualifiesForFreeShipping ? 0 : 5.000; // 5 BHD shipping
    group.total = itemsTotal + group.shippingFee;
  });

  // Calculate overall totals
  const overallSubtotal = vendorGroups.reduce((sum, group) => sum + group.subtotal, 0);
  const overallVAT = vendorGroups.reduce((sum, group) => sum + group.vatAmount, 0);
  const overallShipping = vendorGroups.reduce((sum, group) => sum + group.shippingFee, 0);
  const overallTotal = vendorGroups.reduce((sum, group) => sum + group.total, 0);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, Math.min(newQuantity, item.maxQuantity)) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const saveForLater = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      setSavedForLater(prev => [...prev, item]);
      removeItem(itemId);
    }
  };

  const moveToCart = (itemId: string) => {
    const item = savedForLater.find(item => item.id === itemId);
    if (item) {
      setCartItems(prev => [...prev, item]);
      setSavedForLater(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const toggleVendorExpanded = (vendorId: string) => {
    setExpandedVendors(prev => ({
      ...prev,
      [vendorId]: !prev[vendorId]
    }));
  };

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="xl">
          <div className="text-center">
            <IconShoppingCart size={80} className="text-gray-300 mx-auto mb-4" />
            <Title order={2} c="dimmed" mb="md">
              {isRTL ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
            </Title>
            <Text c="dimmed" size="lg" mb="xl">
              {isRTL 
                ? 'ابدأ التسوق واكتشف منتجات رائعة من أفضل المتاجر في البحرين'
                : 'Start shopping and discover amazing products from the best stores in Bahrain'
              }
            </Text>
          </div>
          <Button 
            size="lg" 
            color="orange"
            leftSection={isRTL ? <IconArrowLeft size={20} /> : <IconArrowRight size={20} />}
          >
            {isRTL ? 'ابدأ التسوق' : 'Start Shopping'}
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">
        {/* Cart Items */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="xl">
            
            {/* Header */}
            <Group justify="space-between" align="center">
              <Title order={2}>
                <Group gap="sm">
                  <IconShoppingCart className="text-orange-600" />
                  <span>{isRTL ? 'سلة المشتريات' : 'Shopping Cart'}</span>
                  <Badge color="orange" size="lg" variant="light">
                    {cartItems.length}
                  </Badge>
                </Group>
              </Title>
              
              {cartItems.length > 0 && (
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => setCartItems([])}
                >
                  {isRTL ? 'مسح السلة' : 'Clear Cart'}
                </Button>
              )}
            </Group>

            {/* Vendor Groups */}
            {vendorGroups.map((group, groupIndex) => (
              <Card key={group.vendor.id} shadow="sm" padding="lg" radius="md" withBorder>
                
                {/* Vendor Header */}
                <Group justify="space-between" mb="md">
                  <Group gap="sm">
                    <Avatar src={group.vendor.logo} size="md" />
                    <div>
                      <Text fw={600} size="lg">
                        {isRTL ? group.vendor.nameAr : group.vendor.name}
                      </Text>
                      <Group gap="xs">
                        <Rating value={group.vendor.rating} fractions={2} size="xs" readOnly />
                        <Text size="xs" c="dimmed">
                          ({group.vendor.rating})
                        </Text>
                      </Group>
                    </div>
                  </Group>

                  <Group gap="sm">
                    {group.qualifiesForFreeShipping ? (
                      <Badge color="green" variant="light">
                        <Group gap={4}>
                          <IconTruck size={14} />
                          <span>{isRTL ? 'شحن مجاني' : 'Free Shipping'}</span>
                        </Group>
                      </Badge>
                    ) : (
                      <Text size="xs" c="dimmed">
                        {isRTL 
                          ? `شحن مجاني عند ${group.vendor.freeShippingThreshold.toFixed(3)} د.ب`
                          : `Free shipping over ${group.vendor.freeShippingThreshold.toFixed(3)} BD`
                        }
                      </Text>
                    )}
                  </Group>
                </Group>

                {/* Items */}
                <Stack gap="md">
                  {group.items.map((item, itemIndex) => (
                    <div key={item.id}>
                      <Group align="flex-start" gap="md">
                        
                        {/* Product Image */}
                        <Image
                          src={item.image}
                          alt={isRTL ? item.nameAr : item.name}
                          width={100}
                          height={100}
                          radius="md"
                        />

                        {/* Product Details */}
                        <div className="flex-1">
                          <Group justify="space-between" align="flex-start">
                            <div>
                              <Text fw={600} size="lg" mb="xs">
                                {isRTL ? item.nameAr : item.name}
                              </Text>
                              
                              {/* Attributes */}
                              {item.attributes && (
                                <Group gap="xs" mb="sm">
                                  {item.attributes.color && (
                                    <Text size="sm" c="dimmed">
                                      {isRTL ? 'اللون:' : 'Color:'} {' '}
                                      <span className="font-medium">
                                        {isRTL ? item.attributes.colorAr || item.attributes.color : item.attributes.color}
                                      </span>
                                    </Text>
                                  )}
                                  {item.attributes.size && (
                                    <Text size="sm" c="dimmed">
                                      {isRTL ? 'المقاس:' : 'Size:'} {' '}
                                      <span className="font-medium">{item.attributes.size}</span>
                                    </Text>
                                  )}
                                </Group>
                              )}

                              {/* Price */}
                              <Text size="xl" fw={700} c="orange">
                                {BahrainPrismaUtils.formatCurrency(item.price, isRTL ? 'ar-BH' : 'en-BH')}
                              </Text>

                              {/* Stock Status */}
                              {item.maxQuantity <= 5 && (
                                <Text size="xs" c="red" mt="xs">
                                  {isRTL 
                                    ? `متبقي ${item.maxQuantity} قطع فقط`
                                    : `Only ${item.maxQuantity} left in stock`
                                  }
                                </Text>
                              )}
                            </div>

                            {/* Actions */}
                            <Group gap="xs">
                              <ActionIcon
                                variant="outline"
                                color="orange"
                                onClick={() => saveForLater(item.id)}
                                title={isRTL ? 'حفظ لاحقاً' : 'Save for later'}
                              >
                                <IconHeart size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="outline"
                                color="red"
                                onClick={() => removeItem(item.id)}
                                title={isRTL ? 'حذف' : 'Remove'}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          </Group>

                          {/* Quantity Controls */}
                          <Group gap="sm" mt="md">
                            <Text size="sm" fw={500}>
                              {isRTL ? 'الكمية:' : 'Quantity:'}
                            </Text>
                            <Group gap={0}>
                              <ActionIcon
                                variant="outline"
                                size="lg"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <IconMinus size={16} />
                              </ActionIcon>
                              <NumberInput
                                value={item.quantity}
                                onChange={(val) => updateQuantity(item.id, Number(val) || 1)}
                                min={1}
                                max={item.maxQuantity}
                                size="lg"
                                className="w-20"
                                styles={{
                                  input: {
                                    textAlign: 'center',
                                    borderRadius: 0,
                                    borderLeft: 0,
                                    borderRight: 0
                                  }
                                }}
                                hideControls
                              />
                              <ActionIcon
                                variant="outline"
                                size="lg"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.maxQuantity}
                              >
                                <IconPlus size={16} />
                              </ActionIcon>
                            </Group>
                            
                            <Text size="sm" c="dimmed">
                              = {BahrainPrismaUtils.formatCurrency(item.price * item.quantity, isRTL ? 'ar-BH' : 'en-BH')}
                            </Text>
                          </Group>
                        </div>
                      </Group>
                      
                      {itemIndex < group.items.length - 1 && <Divider />}
                    </div>
                  ))}
                </Stack>

                {/* Vendor Summary */}
                <Divider my="md" />
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'المجموع الفرعي:' : 'Subtotal:'} {' '}
                      <span className="font-semibold">
                        {BahrainPrismaUtils.formatCurrency(group.subtotal, isRTL ? 'ar-BH' : 'en-BH')}
                      </span>
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'ضريبة القيمة المضافة (10%):' : 'VAT (10%):'} {' '}
                      <span className="font-semibold">
                        {BahrainPrismaUtils.formatCurrency(group.vatAmount, isRTL ? 'ar-BH' : 'en-BH')}
                      </span>
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'الشحن:' : 'Shipping:'} {' '}
                      <span className={`font-semibold ${group.shippingFee === 0 ? 'text-green-600' : ''}`}>
                        {group.shippingFee === 0 
                          ? (isRTL ? 'مجاني' : 'FREE')
                          : BahrainPrismaUtils.formatCurrency(group.shippingFee, isRTL ? 'ar-BH' : 'en-BH')
                        }
                      </span>
                    </Text>
                  </div>
                  <Text size="lg" fw={700} c="orange">
                    {BahrainPrismaUtils.formatCurrency(group.total, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>
              </Card>
            ))}

            {/* Saved for Later */}
            {savedForLater.length > 0 && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  <Group gap="sm">
                    <IconHeart className="text-red-500" />
                    <span>{isRTL ? 'محفوظ لاحقاً' : 'Saved for Later'}</span>
                    <Badge color="red" size="sm" variant="light">
                      {savedForLater.length}
                    </Badge>
                  </Group>
                </Title>
                
                <Stack gap="md">
                  {savedForLater.map((item) => (
                    <Group key={item.id} gap="md">
                      <Image
                        src={item.image}
                        alt={isRTL ? item.nameAr : item.name}
                        width={60}
                        height={60}
                        radius="md"
                      />
                      <div className="flex-1">
                        <Text fw={500}>
                          {isRTL ? item.nameAr : item.name}
                        </Text>
                        <Text size="sm" c="orange" fw={600}>
                          {BahrainPrismaUtils.formatCurrency(item.price, isRTL ? 'ar-BH' : 'en-BH')}
                        </Text>
                      </div>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          variant="outline"
                          color="orange"
                          onClick={() => moveToCart(item.id)}
                        >
                          {isRTL ? 'نقل للسلة' : 'Move to Cart'}
                        </Button>
                        <ActionIcon
                          variant="outline"
                          color="red"
                          size="sm"
                          onClick={() => setSavedForLater(prev => prev.filter(i => i.id !== item.id))}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}

          </Stack>
        </Grid.Col>

        {/* Order Summary */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card shadow="lg" padding="lg" radius="md" withBorder className="sticky top-4">
            <Stack gap="md">
              
              <Title order={3} ta="center">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </Title>

              <Divider />

              {/* Summary Details */}
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</Text>
                  <Text fw={600}>
                    {BahrainPrismaUtils.formatCurrency(overallSubtotal, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text>{isRTL ? 'ضريبة القيمة المضافة (10%):' : 'VAT (10%):'}</Text>
                  <Text fw={600}>
                    {BahrainPrismaUtils.formatCurrency(overallVAT, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text>{isRTL ? 'الشحن:' : 'Shipping:'}</Text>
                  <Text fw={600} className={overallShipping === 0 ? 'text-green-600' : ''}>
                    {overallShipping === 0 
                      ? (isRTL ? 'مجاني' : 'FREE')
                      : BahrainPrismaUtils.formatCurrency(overallShipping, isRTL ? 'ar-BH' : 'en-BH')
                    }
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text size="lg" fw={700}>{isRTL ? 'المجموع الكلي:' : 'Total:'}</Text>
                  <Text size="xl" fw={700} c="orange">
                    {BahrainPrismaUtils.formatCurrency(overallTotal, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>

                <Text size="xs" c="dimmed" ta="center">
                  {isRTL 
                    ? 'شامل ضريبة القيمة المضافة ورسوم الشحن'
                    : 'Including VAT and shipping fees'
                  }
                </Text>
              </Stack>

              <Divider />

              {/* Trust Badges */}
              <Stack gap="xs">
                <Group gap="xs" justify="center">
                  <IconShield size={16} className="text-green-600" />
                  <Text size="sm" c="dimmed">
                    {isRTL ? 'معاملة آمنة' : 'Secure Transaction'}
                  </Text>
                </Group>
                <Group gap="xs" justify="center">
                  <IconTruck size={16} className="text-blue-600" />
                  <Text size="sm" c="dimmed">
                    {isRTL ? 'توصيل سريع' : 'Fast Delivery'}
                  </Text>
                </Group>
              </Stack>

              {/* Checkout Button */}
              <Button
                size="lg"
                color="orange"
                fullWidth
                rightSection={isRTL ? <IconArrowLeft size={20} /> : <IconArrowRight size={20} />}
              >
                {isRTL ? 'متابعة إلى الدفع' : 'Proceed to Checkout'}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                color="gray"
                fullWidth
                size="md"
              >
                {isRTL ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>

              {/* Info Alert */}
              <Alert
                icon={<IconInfoCircle size={16} />}
                title={isRTL ? 'معلومات الدفع' : 'Payment Info'}
                color="blue"
                variant="light"
              >
                <Text size="sm">
                  {isRTL 
                    ? 'ندعم بنفت باي وآبل باي والتحويل البنكي'
                    : 'We accept BenefitPay, Apple Pay, and bank transfers'
                  }
                </Text>
              </Alert>

            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}