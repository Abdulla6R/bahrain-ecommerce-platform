'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Stack,
  Title,
  Card,
  Text,
  Button,
  Group,
  Badge,
  Tabs,
  ActionIcon,
  Alert,
  Divider,
  Modal,
  Image
} from '@mantine/core';
import {
  IconLanguage,
  IconShoppingCart,
  IconCreditCard,
  IconUser,
  IconBuilding,
  IconTestPipe,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconStar,
  IconTruck,
  IconShield,
  IconHeart
} from '@tabler/icons-react';

import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { BenefitPayButton } from '@/components/payments/BenefitPayButton';
import { ApplePayButton } from '@/components/payments/ApplePayButton';
import { BankTransferCard } from '@/components/payments/BankTransferCard';

export default function DemoPage() {
  const [locale, setLocale] = useState('en');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const isRTL = locale === 'ar';

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    
    // Update HTML attributes
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  // Mock data for demos
  const mockProducts = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      nameAr: 'آيفون 15 برو ماكس',
      price: 450.500,
      image: '/api/placeholder/200/200',
      vendor: 'TechStore BH',
      vendorAr: 'متجر التكنولوجيا البحرين',
      rating: 4.8,
      reviews: 234
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونج جالاكسي إس 24 ألترا',
      price: 380.750,
      image: '/api/placeholder/200/200',
      vendor: 'Mobile World',
      vendorAr: 'عالم الموبايل',
      rating: 4.6,
      reviews: 156
    },
    {
      id: '3',
      name: 'MacBook Pro M3',
      nameAr: 'ماك بوك برو إم 3',
      price: 650.000,
      image: '/api/placeholder/200/200',
      vendor: 'Apple Store BH',
      vendorAr: 'متجر آبل البحرين',
      rating: 4.9,
      reviews: 89
    }
  ];

  const mockCartItems = [
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
    }
  ];

  const merchantInfo = {
    merchantId: 'merchant.com.tendzd.demo',
    merchantName: 'Tendzd Demo Store',
    countryCode: 'BH'
  };

  const handlePaymentSuccess = (data: any) => {
    console.log('Payment successful:', data);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const demoFeatures = [
    {
      id: 'rtl_support',
      titleEn: 'RTL & Arabic Support',
      titleAr: 'دعم العربية والكتابة من اليمين لليسار',
      descriptionEn: 'Complete right-to-left layout with Arabic typography',
      descriptionAr: 'تخطيط كامل من اليمين إلى اليسار مع الطباعة العربية',
      icon: IconLanguage,
      color: 'blue'
    },
    {
      id: 'multi_vendor',
      titleEn: 'Multi-Vendor Cart',
      titleAr: 'سلة متعددة البائعين',
      descriptionEn: 'Organize cart items by vendor with separate shipping',
      descriptionAr: 'تنظيم عناصر السلة حسب البائع مع شحن منفصل',
      icon: IconBuilding,
      color: 'green'
    },
    {
      id: 'bahrain_payments',
      titleEn: 'Bahrain Payment Methods',
      titleAr: 'طرق الدفع البحرينية',
      descriptionEn: 'BenefitPay, Apple Pay, and local bank transfers',
      descriptionAr: 'بنفت باي وآبل باي والتحويلات البنكية المحلية',
      icon: IconCreditCard,
      color: 'orange'
    },
    {
      id: 'vat_compliance',
      titleEn: 'VAT Compliance',
      titleAr: 'امتثال ضريبة القيمة المضافة',
      descriptionEn: '10% Bahrain VAT calculation and display',
      descriptionAr: 'حساب وعرض ضريبة القيمة المضافة البحرينية 10%',
      icon: IconShield,
      color: 'teal'
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        
        {/* Header */}
        <Card withBorder padding="lg" className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} className="text-white">
                {isRTL ? 'عرض توضيحي تفاعلي - تندز' : 'Tendzd Interactive Demo'}
              </Title>
              <Text size="lg" className="text-white/90" mt="xs">
                {isRTL 
                  ? 'استكشف جميع ميزات منصة التجارة الإلكترونية البحرينية'
                  : 'Explore all features of the Bahraini e-commerce platform'
                }
              </Text>
            </div>
            
            <Group gap="md">
              <Button
                variant="white"
                leftSection={<IconLanguage size={16} />}
                onClick={toggleLocale}
              >
                {isRTL ? 'English' : 'العربية'}
              </Button>
              <Badge size="xl" color="white" c="orange">
                {isRTL ? 'البحرين' : 'Bahrain'}
              </Badge>
            </Group>
          </Group>
        </Card>

        {/* Demo Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')} color="orange">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconTestPipe size={16} />}>
              {isRTL ? 'نظرة عامة' : 'Overview'}
            </Tabs.Tab>
            <Tabs.Tab value="products" leftSection={<IconBuilding size={16} />}>
              {isRTL ? 'المنتجات' : 'Products'}
            </Tabs.Tab>
            <Tabs.Tab value="cart" leftSection={<IconShoppingCart size={16} />}>
              {isRTL ? 'السلة' : 'Cart'}
            </Tabs.Tab>
            <Tabs.Tab value="payments" leftSection={<IconCreditCard size={16} />}>
              {isRTL ? 'المدفوعات' : 'Payments'}
            </Tabs.Tab>
            <Tabs.Tab value="auth" leftSection={<IconUser size={16} />}>
              {isRTL ? 'المصادقة' : 'Authentication'}
            </Tabs.Tab>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Panel value="overview">
            <Stack gap="lg" mt="lg">
              
              <Alert
                icon={<IconCheck size={16} />}
                title={isRTL ? 'جاهز للاختبار' : 'Ready for Testing'}
                color="green"
                variant="light"
              >
                <Text size="sm">
                  {isRTL 
                    ? 'جميع الميزات مُفعلة ومتاحة للاختبار. استخدم القوائم أعلاه لاستكشاف الوظائف المختلفة.'
                    : 'All features are enabled and ready for testing. Use the tabs above to explore different functionalities.'
                  }
                </Text>
              </Alert>

              <Grid gutter="lg">
                {demoFeatures.map((feature) => (
                  <Grid.Col key={feature.id} span={{ base: 12, md: 6 }}>
                    <Card 
                      withBorder 
                      padding="lg" 
                      className="h-full cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedDemo(feature.id)}
                    >
                      <Group gap="md" mb="md">
                        <ActionIcon size="xl" color={feature.color} variant="light">
                          <feature.icon size={24} />
                        </ActionIcon>
                        <div>
                          <Text fw={600} size="lg">
                            {isRTL ? feature.titleAr : feature.titleEn}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {isRTL ? feature.descriptionAr : feature.descriptionEn}
                          </Text>
                        </div>
                      </Group>
                      <Button 
                        variant="light" 
                        color={feature.color}
                        rightSection={isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
                        fullWidth
                      >
                        {isRTL ? 'تجربة الميزة' : 'Try Feature'}
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>

              {/* Quick Stats */}
              <Card withBorder padding="lg">
                <Title order={3} mb="md" ta="center">
                  {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
                </Title>
                <Grid gutter="lg">
                  <Grid.Col span={3}>
                    <div className="text-center">
                      <Text size="2rem" fw={700} c="orange">15+</Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'طرق دفع' : 'Payment Methods'}
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <div className="text-center">
                      <Text size="2rem" fw={700} c="blue">2</Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'لغات' : 'Languages'}
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <div className="text-center">
                      <Text size="2rem" fw={700} c="green">100%</Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'متوافق مع RTL' : 'RTL Compatible'}
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <div className="text-center">
                      <Text size="2rem" fw={700} c="teal">10%</Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'ضريبة القيمة المضافة' : 'VAT Rate'}
                      </Text>
                    </div>
                  </Grid.Col>
                </Grid>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Products Tab */}
          <Tabs.Panel value="products">
            <Stack gap="lg" mt="lg">
              
              <Title order={2}>
                {isRTL ? 'عرض المنتجات' : 'Product Showcase'}
              </Title>

              <Grid gutter="lg">
                {mockProducts.map((product) => (
                  <Grid.Col key={product.id} span={{ base: 12, md: 4 }}>
                    <Card withBorder padding="lg" className="h-full">
                      <Card.Section>
                        <Image
                          src={product.image}
                          alt={isRTL ? product.nameAr : product.name}
                          height={200}
                        />
                      </Card.Section>
                      
                      <Stack gap="sm" mt="md">
                        <div>
                          <Text fw={600} size="lg" lineClamp={1}>
                            {isRTL ? product.nameAr : product.name}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {isRTL ? product.vendorAr : product.vendor}
                          </Text>
                        </div>
                        
                        <Group justify="space-between" align="center">
                          <Group gap="xs">
                            <IconStar size={16} className="text-yellow-500" />
                            <Text size="sm" fw={500}>{product.rating}</Text>
                            <Text size="sm" c="dimmed">({product.reviews})</Text>
                          </Group>
                          <ActionIcon variant="outline" color="red">
                            <IconHeart size={16} />
                          </ActionIcon>
                        </Group>
                        
                        <Group justify="space-between" align="center">
                          <Text size="xl" fw={700} c="orange">
                            {product.price.toFixed(3)} BHD
                          </Text>
                          <Button size="sm" rightSection={<IconShoppingCart size={16} />}>
                            {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>

            </Stack>
          </Tabs.Panel>

          {/* Cart Tab */}
          <Tabs.Panel value="cart">
            <Stack gap="lg" mt="lg">
              
              <Title order={2}>
                {isRTL ? 'سلة المشتريات متعددة البائعين' : 'Multi-Vendor Shopping Cart'}
              </Title>

              <ShoppingCart
                locale={locale}
                initialItems={mockCartItems}
              />

            </Stack>
          </Tabs.Panel>

          {/* Payments Tab */}
          <Tabs.Panel value="payments">
            <Stack gap="lg" mt="lg">
              
              <Title order={2}>
                {isRTL ? 'طرق الدفع البحرينية' : 'Bahraini Payment Methods'}
              </Title>

              <Alert
                icon={<IconShield size={16} />}
                title={isRTL ? 'بيئة اختبار آمنة' : 'Safe Testing Environment'}
                color="blue"
                variant="light"
              >
                <Text size="sm">
                  {isRTL 
                    ? 'هذه بيئة تجريبية آمنة. لن يتم تحصيل أي رسوم حقيقية.'
                    : 'This is a safe testing environment. No real charges will be made.'
                  }
                </Text>
              </Alert>

              <Grid gutter="lg">
                
                {/* BenefitPay */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg">
                    <Title order={4} mb="md">
                      {isRTL ? 'بنفت باي' : 'BenefitPay'}
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                      {isRTL 
                        ? 'نظام الدفع الرسمي للبنوك البحرينية'
                        : 'Official payment system for Bahraini banks'
                      }
                    </Text>
                    <BenefitPayButton
                      amount={50.000}
                      currency="BHD"
                      orderItems={mockCartItems}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      locale={locale}
                    />
                  </Card>
                </Grid.Col>

                {/* Apple Pay */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg">
                    <Title order={4} mb="md">
                      {isRTL ? 'آبل باي' : 'Apple Pay'}
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                      {isRTL 
                        ? 'للأجهزة المتوافقة مع آبل باي'
                        : 'For Apple Pay compatible devices'
                      }
                    </Text>
                    <ApplePayButton
                      amount={75.250}
                      currency="BHD"
                      orderItems={mockCartItems}
                      merchantInfo={merchantInfo}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      locale={locale}
                    />
                  </Card>
                </Grid.Col>

                {/* Bank Transfer */}
                <Grid.Col span={12}>
                  <Card withBorder padding="lg">
                    <Title order={4} mb="md">
                      {isRTL ? 'التحويل البنكي' : 'Bank Transfer'}
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                      {isRTL 
                        ? 'تحويل مباشر من البنوك البحرينية الرئيسية'
                        : 'Direct transfer from major Bahraini banks'
                      }
                    </Text>
                    <BankTransferCard
                      amount={125.750}
                      currency="BHD"
                      orderReference={`DEMO_${Date.now()}`}
                      onConfirmTransfer={handlePaymentSuccess}
                      locale={locale}
                    />
                  </Card>
                </Grid.Col>

              </Grid>

            </Stack>
          </Tabs.Panel>

          {/* Authentication Tab */}
          <Tabs.Panel value="auth">
            <Stack gap="lg" mt="lg">
              
              <Title order={2}>
                {isRTL ? 'المصادقة والتسجيل' : 'Authentication & Registration'}
              </Title>

              <Grid gutter="lg">
                
                <Grid.Col span={6}>
                  <Card withBorder padding="lg" className="text-center">
                    <IconUser size={48} className="text-blue-600 mx-auto mb-4" />
                    <Title order={4} mb="md">
                      {isRTL ? 'تسجيل حساب جديد' : 'Create New Account'}
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                      {isRTL 
                        ? 'نموذج تسجيل كامل مع التحقق من الهاتف'
                        : 'Complete registration form with phone verification'
                      }
                    </Text>
                    <Button fullWidth onClick={() => window.open('/auth/register', '_blank')}>
                      {isRTL ? 'فتح التسجيل' : 'Open Registration'}
                    </Button>
                  </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Card withBorder padding="lg" className="text-center">
                    <IconTestPipe size={48} className="text-orange-600 mx-auto mb-4" />
                    <Title order={4} mb="md">
                      {isRTL ? 'صفحة الاختبار الشاملة' : 'Comprehensive Testing'}
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                      {isRTL 
                        ? 'اختبار جميع الميزات والوظائف'
                        : 'Test all features and functionalities'
                      }
                    </Text>
                    <Button fullWidth onClick={() => window.open('/test', '_blank')}>
                      {isRTL ? 'فتح الاختبارات' : 'Open Testing'}
                    </Button>
                  </Card>
                </Grid.Col>

              </Grid>

              {/* Features List */}
              <Card withBorder padding="lg">
                <Title order={4} mb="md">
                  {isRTL ? 'ميزات المصادقة' : 'Authentication Features'}
                </Title>
                <Stack gap="sm">
                  <Group gap="sm">
                    <IconCheck size={16} className="text-green-600" />
                    <Text size="sm">
                      {isRTL ? 'التحقق من رقم الهاتف البحريني' : 'Bahrain phone number verification'}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    <IconCheck size={16} className="text-green-600" />
                    <Text size="sm">
                      {isRTL ? 'موافقة قانون حماية البيانات الشخصية (PDPL)' : 'PDPL consent compliance'}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    <IconCheck size={16} className="text-green-600" />
                    <Text size="sm">
                      {isRTL ? 'تحديد الموقع بالمحافظات البحرينية' : 'Bahrain governorate selection'}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    <IconCheck size={16} className="text-green-600" />
                    <Text size="sm">
                      {isRTL ? 'تشفير كلمات المرور ومقياس القوة' : 'Password encryption and strength meter'}
                    </Text>
                  </Group>
                </Stack>
              </Card>

            </Stack>
          </Tabs.Panel>

        </Tabs>

        {/* Action Buttons */}
        <Card withBorder padding="lg">
          <Group justify="center" gap="md">
            <Button
              size="lg"
              variant="outline"
              leftSection={<IconShoppingCart size={20} />}
              onClick={() => window.open('/checkout', '_blank')}
            >
              {isRTL ? 'تجربة الشراء الكاملة' : 'Try Full Checkout'}
            </Button>
            <Button
              size="lg"
              leftSection={<IconTestPipe size={20} />}
              onClick={() => window.open('/test', '_blank')}
            >
              {isRTL ? 'تشغيل الاختبارات' : 'Run Tests'}
            </Button>
          </Group>
        </Card>

      </Stack>
    </Container>
  );
}