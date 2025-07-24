'use client';

import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Button,
  Avatar,
  Badge,
  Stack,
  Box,
  Image,
  ActionIcon,
  Rating,
  Divider,
  Progress
} from '@mantine/core';
import {
  IconStar,
  IconTruck,
  IconShield,
  IconHeart,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconShoppingCart
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface Vendor {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  yearsActive: number;
  badges: string[];
  featuredProducts: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    discount?: number;
  }>;
  stats: {
    ordersFulfilled: number;
    responseTime: string;
    customerSatisfaction: number;
  };
  isVerified: boolean;
  isFeatured: boolean;
}

interface VendorShowcaseProps {
  locale: string;
}

export function VendorShowcase({ locale }: VendorShowcaseProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';

  const vendors: Vendor[] = [
    {
      id: '1',
      nameAr: 'تقنيات المستقبل',
      nameEn: 'Future Tech Store',
      descriptionAr: 'متخصصون في أحدث التقنيات والإلكترونيات مع خدمة عملاء متميزة',
      descriptionEn: 'Specialists in latest technology and electronics with excellent customer service',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.8,
      reviewCount: 1247,
      totalProducts: 890,
      yearsActive: 5,
      badges: ['verified', 'top-seller', 'fast-shipping'],
      featuredProducts: [
        { id: '1', name: 'iPhone 15 Pro', price: 450.000, image: '/api/placeholder/100/100' },
        { id: '2', name: 'Samsung Galaxy S24', price: 380.000, image: '/api/placeholder/100/100', discount: 15 },
        { id: '3', name: 'MacBook Air M3', price: 520.000, image: '/api/placeholder/100/100' }
      ],
      stats: {
        ordersFulfilled: 5420,
        responseTime: '< 2h',
        customerSatisfaction: 96
      },
      isVerified: true,
      isFeatured: true
    },
    {
      id: '2',
      nameAr: 'أزياء البحرين العصرية',
      nameEn: 'Bahrain Modern Fashion',
      descriptionAr: 'أحدث صيحات الموضة العالمية والمحلية بأسعار منافسة',
      descriptionEn: 'Latest global and local fashion trends at competitive prices',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.6,
      reviewCount: 892,
      totalProducts: 1240,
      yearsActive: 3,
      badges: ['verified', 'trending'],
      featuredProducts: [
        { id: '4', name: 'Designer Dress', price: 85.000, image: '/api/placeholder/100/100', discount: 20 },
        { id: '5', name: 'Luxury Handbag', price: 120.000, image: '/api/placeholder/100/100' },
        { id: '6', name: 'Premium Shoes', price: 95.000, image: '/api/placeholder/100/100', discount: 10 }
      ],
      stats: {
        ordersFulfilled: 3210,
        responseTime: '< 4h',
        customerSatisfaction: 92
      },
      isVerified: true,
      isFeatured: true
    },
    {
      id: '3',
      nameAr: 'منزل الأحلام',
      nameEn: 'Dream Home Store',
      descriptionAr: 'كل ما تحتاجه لمنزل عصري ومريح من أثاث وديكور',
      descriptionEn: 'Everything you need for a modern and comfortable home',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.7,
      reviewCount: 653,
      totalProducts: 780,
      yearsActive: 4,
      badges: ['verified', 'eco-friendly', 'warranty'],
      featuredProducts: [
        { id: '7', name: 'Modern Sofa Set', price: 320.000, image: '/api/placeholder/100/100' },
        { id: '8', name: 'Smart TV 65"', price: 280.000, image: '/api/placeholder/100/100', discount: 25 },
        { id: '9', name: 'Coffee Table', price: 75.000, image: '/api/placeholder/100/100' }
      ],
      stats: {
        ordersFulfilled: 2180,
        responseTime: '< 6h',
        customerSatisfaction: 94
      },
      isVerified: true,
      isFeatured: false
    }
  ];

  const getBadgeDetails = (badge: string) => {
    const badges = {
      verified: { 
        textAr: 'موثق', 
        textEn: 'Verified', 
        color: 'blue', 
        icon: <IconCheck size={12} /> 
      },
      'top-seller': { 
        textAr: 'أفضل بائع', 
        textEn: 'Top Seller', 
        color: 'yellow', 
        icon: <IconStar size={12} /> 
      },
      'fast-shipping': { 
        textAr: 'شحن سريع', 
        textEn: 'Fast Shipping', 
        color: 'green', 
        icon: <IconTruck size={12} /> 
      },
      trending: { 
        textAr: 'شائع', 
        textEn: 'Trending', 
        color: 'pink', 
        icon: <IconHeart size={12} /> 
      },
      'eco-friendly': { 
        textAr: 'صديق للبيئة', 
        textEn: 'Eco-Friendly', 
        color: 'teal', 
        icon: <IconShield size={12} /> 
      },
      warranty: { 
        textAr: 'ضمان شامل', 
        textEn: 'Full Warranty', 
        color: 'indigo', 
        icon: <IconShield size={12} /> 
      }
    };
    return badges[badge as keyof typeof badges] || badges.verified;
  };

  const VendorCard = ({ vendor }: { vendor: Vendor }) => (
    <Card shadow="sm" padding={0} radius="md" withBorder className="overflow-hidden h-full">
      {/* Banner */}
      <div className="relative">
        <Image
          src={vendor.banner}
          alt={isRTL ? vendor.nameAr : vendor.nameEn}
          height={120}
          fit="cover"
        />
        <Box className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Vendor Logo */}
        <Avatar
          src={vendor.logo}
          size="lg"
          className={`absolute bottom-0 transform translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} border-4 border-white shadow-lg`}
        />

        {/* Featured Badge */}
        {vendor.isFeatured && (
          <Badge
            color="orange"
            variant="filled"
            size="sm"
            className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`}
          >
            ⭐ {isRTL ? 'مميز' : 'Featured'}
          </Badge>
        )}
      </div>

      <Stack gap="md" p="md" pt="xl">
        
        {/* Vendor Info */}
        <div>
          <Group justify="space-between" align="flex-start" mb="xs">
            <div className="flex-1">
              <Text fw={600} size="lg" className="leading-tight">
                {isRTL ? vendor.nameAr : vendor.nameEn}
              </Text>
              <Group gap="xs" mt={4}>
                <Rating value={vendor.rating} fractions={2} size="sm" readOnly color="yellow" />
                <Text size="xs" c="dimmed">
                  ({vendor.reviewCount})
                </Text>
              </Group>
            </div>
            <ActionIcon variant="subtle" color="gray">
              <IconHeart size={18} />
            </ActionIcon>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2} mb="sm">
            {isRTL ? vendor.descriptionAr : vendor.descriptionEn}
          </Text>

          {/* Badges */}
          <Group gap="xs" mb="sm">
            {vendor.badges.map((badge, index) => {
              const badgeInfo = getBadgeDetails(badge);
              return (
                <Badge
                  key={index}
                  color={badgeInfo.color}
                  variant="light"
                  size="xs"
                  leftSection={badgeInfo.icon}
                >
                  {isRTL ? badgeInfo.textAr : badgeInfo.textEn}
                </Badge>
              );
            })}
          </Group>
        </div>

        {/* Stats */}
        <div>
          <Text size="xs" fw={500} mb="xs" c="dimmed" tt="uppercase">
            {isRTL ? 'إحصائيات المتجر' : 'Store Stats'}
          </Text>
          <Grid gutter="xs">
            <Grid.Col span={4}>
              <Text size="xs" c="dimmed">{isRTL ? 'المنتجات' : 'Products'}</Text>
              <Text size="sm" fw={600}>{vendor.totalProducts}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xs" c="dimmed">{isRTL ? 'الطلبات' : 'Orders'}</Text>
              <Text size="sm" fw={600}>{vendor.stats.ordersFulfilled}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xs" c="dimmed">{isRTL ? 'سنوات العمل' : 'Years'}</Text>
              <Text size="sm" fw={600}>{vendor.yearsActive}</Text>
            </Grid.Col>
          </Grid>
        </div>

        {/* Performance Metrics */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed">
              {isRTL ? 'رضا العملاء' : 'Customer Satisfaction'}
            </Text>
            <Text size="xs" fw={500}>
              {vendor.stats.customerSatisfaction}%
            </Text>
          </Group>
          <Progress value={vendor.stats.customerSatisfaction} color="green" size="sm" />
        </div>

        {/* Featured Products */}
        <div>
          <Text size="xs" fw={500} mb="xs" c="dimmed" tt="uppercase">
            {isRTL ? 'منتجات مميزة' : 'Featured Products'}
          </Text>
          <Group gap="xs">
            {vendor.featuredProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={50}
                  height={50}
                  radius="sm"
                  className="border border-gray-200"
                />
                {product.discount && (
                  <Badge
                    color="red"
                    variant="filled"
                    size="xs"
                    className="absolute -top-1 -right-1"
                  >
                    -{product.discount}%
                  </Badge>
                )}
              </div>
            ))}
          </Group>
        </div>

        <Divider />

        {/* Action Buttons */}
        <Group justify="space-between">
          <Button
            variant="light"
            color="orange"
            size="sm"
            leftSection={<IconEye size={16} />}
            className="flex-1"
          >
            {isRTL ? 'زيارة المتجر' : 'Visit Store'}
          </Button>
          <ActionIcon variant="light" color="blue" size="lg">
            <IconShoppingCart size={18} />
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Container size="xl" py="xl">
      {/* Section Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} className="text-2xl font-bold mb-2">
            {isRTL ? 'أفضل المتاجر في البحرين' : 'Top Stores in Bahrain'}
          </Title>
          <Text c="dimmed" size="sm">
            {isRTL ? 'اكتشف المتاجر الموثوقة والمختارة بعناية' : 'Discover trusted and carefully selected stores'}
          </Text>
        </div>

        <Button
          variant="outline"
          color="orange"
          rightSection={isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
        >
          {isRTL ? 'جميع المتاجر' : 'All Stores'}
        </Button>
      </Group>

      {/* Vendors Grid */}
      <Grid>
        {vendors.map((vendor) => (
          <Grid.Col key={vendor.id} span={{ base: 12, md: 6, lg: 4 }}>
            <VendorCard vendor={vendor} />
          </Grid.Col>
        ))}
      </Grid>

      {/* Become a Seller CTA */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white mt-xl" padding="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={3} className="text-white mb-2">
              {isRTL ? 'هل تريد بيع منتجاتك؟' : 'Want to Sell Your Products?'}
            </Title>
            <Text className="text-orange-100 mb-4">
              {isRTL ? 'انضم إلى آلاف البائعين واعرض منتجاتك لملايين المشترين' : 'Join thousands of sellers and showcase your products to millions of buyers'}
            </Text>
            <Stack gap="xs">
              <Group gap="sm">
                <IconCheck size={16} />
                <Text size="sm">{isRTL ? 'رسوم تنافسية' : 'Competitive fees'}</Text>
              </Group>
              <Group gap="sm">
                <IconCheck size={16} />
                <Text size="sm">{isRTL ? 'دعم فني 24/7' : '24/7 technical support'}</Text>
              </Group>
              <Group gap="sm">
                <IconCheck size={16} />
                <Text size="sm">{isRTL ? 'أدوات بيع متطورة' : 'Advanced selling tools'}</Text>
              </Group>
            </Stack>
          </div>
          <div>
            <Button variant="white" color="dark" size="lg">
              {isRTL ? 'ابدأ البيع اليوم' : 'Start Selling Today'}
            </Button>
          </div>
        </Group>
      </Card>
    </Container>
  );
}