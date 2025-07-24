'use client';

import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Button,
  Badge,
  Progress,
  Stack,
  Box,
  Image,
  ActionIcon,
  Divider
} from '@mantine/core';
import {
  IconFlame,
  IconClock,
  IconArrowRight,
  IconArrowLeft,
  IconShoppingCart,
  IconEye
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Deal {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  sold: number;
  total: number;
  endTime: Date;
  vendor: string;
  isFlashDeal?: boolean;
  isHot?: boolean;
}

interface DealsSectionProps {
  locale: string;
}

export function DealsSection({ locale }: DealsSectionProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals: Deal[] = [
    {
      id: '1',
      nameAr: 'سماعات لاسلكية عالية الجودة',
      nameEn: 'Premium Wireless Headphones',
      image: '/api/placeholder/300/200',
      originalPrice: 85.000,
      salePrice: 59.500,
      sold: 87,
      total: 100,
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      vendor: 'AudioTech BH',
      isFlashDeal: true,
      isHot: true
    },
    {
      id: '2',
      nameAr: 'حقيبة ظهر ذكية',
      nameEn: 'Smart Backpack',
      image: '/api/placeholder/300/200',
      originalPrice: 45.000,
      salePrice: 31.500,
      sold: 34,
      total: 50,
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      vendor: 'Urban Gear',
      isFlashDeal: true
    },
    {
      id: '3',
      nameAr: 'جهاز تابلت 10 بوصة',
      nameEn: '10-inch Tablet',
      image: '/api/placeholder/300/200',
      originalPrice: 180.000,
      salePrice: 129.000,
      sold: 23,
      total: 40,
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      vendor: 'Tech Solutions'
    },
    {
      id: '4',
      nameAr: 'ساعة رياضية ذكية',
      nameEn: 'Smart Sports Watch',
      image: '/api/placeholder/300/200',
      originalPrice: 120.000,
      salePrice: 84.000,
      sold: 67,
      total: 80,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      vendor: 'FitTech Bahrain',
      isHot: true
    }
  ];

  const formatCountdown = (endTime: Date) => {
    const diff = endTime.getTime() - currentTime.getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    const countdown = formatCountdown(deal.endTime);
    const discountPercentage = Math.round(((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100);
    const progressPercentage = (deal.sold / deal.total) * 100;
    const vatIncludedPrice = deal.salePrice * 1.1; // 10% VAT

    return (
      <Card 
        shadow="sm" 
        padding="md" 
        radius="md" 
        withBorder
        className="h-full hover:shadow-lg transition-all duration-300 relative overflow-hidden"
      >
        {/* Flash Deal Indicator */}
        {deal.isFlashDeal && (
          <Box className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-bl-lg z-10">
            <Group gap={4} align="center">
              <IconFlame size={12} />
              <Text size="xs" fw={700}>
                {isRTL ? 'عرض البرق' : 'FLASH'}
              </Text>
            </Group>
          </Box>
        )}

        <Stack gap="sm">
          {/* Image */}
          <div className="relative">
            <Image
              src={deal.image}
              alt={isRTL ? deal.nameAr : deal.nameEn}
              height={160}
              radius="sm"
              fit="cover"
            />
            
            {/* Discount Badge */}
            <Badge
              color="red"
              size="lg"
              variant="filled"
              className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} font-bold`}
            >
              -{discountPercentage}%
            </Badge>

            {/* Hot Badge */}
            {deal.isHot && (
              <Badge
                color="orange"
                size="sm"
                variant="filled"
                className={`absolute bottom-2 ${isRTL ? 'right-2' : 'left-2'} animate-pulse`}
              >
                🔥 {isRTL ? 'مميز' : 'HOT'}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Text size="xs" c="dimmed" mb={4}>
              {deal.vendor}
            </Text>
            <Text fw={500} size="sm" lineClamp={2} className="min-h-[40px]">
              {isRTL ? deal.nameAr : deal.nameEn}
            </Text>
          </div>

          {/* Price */}
          <Group justify="space-between" align="baseline">
            <div>
              <Text fw={700} size="lg" c="orange">
                {vatIncludedPrice.toFixed(3)} {isRTL ? 'د.ب' : 'BD'}
              </Text>
              <Text size="sm" td="line-through" c="dimmed">
                {(deal.originalPrice * 1.1).toFixed(3)} {isRTL ? 'د.ب' : 'BD'}
              </Text>
            </div>
            <Text size="xs" c="green" fw={500}>
              {isRTL ? `وفر ${(deal.originalPrice - deal.salePrice).toFixed(3)} د.ب` : `Save ${(deal.originalPrice - deal.salePrice).toFixed(3)} BD`}
            </Text>
          </Group>

          {/* Progress Bar */}
          <div>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">
                {isRTL ? 'تم بيع' : 'Sold'}: {deal.sold}/{deal.total}
              </Text>
              <Text size="xs" c="dimmed">
                {Math.round(progressPercentage)}%
              </Text>
            </Group>
            <Progress 
              value={progressPercentage} 
              color="orange" 
              size="sm" 
              radius="xl"
              className="mb-2"
            />
          </div>

          {/* Countdown Timer */}
          <Card className="bg-red-50 border-red-200" padding="xs">
            <Group justify="space-between" align="center">
              <Group gap={4}>
                <IconClock size={16} className="text-red-600" />
                <Text size="xs" c="red" fw={500}>
                  {isRTL ? 'ينتهي خلال:' : 'Ends in:'}
                </Text>
              </Group>
              <Group gap={4}>
                <Text size="sm" fw={700} c="red">
                  {String(countdown.hours).padStart(2, '0')}:
                  {String(countdown.minutes).padStart(2, '0')}:
                  {String(countdown.seconds).padStart(2, '0')}
                </Text>
              </Group>
            </Group>
          </Card>

          {/* Action Buttons */}
          <Group grow>
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              className="flex-1"
            >
              <IconEye size={18} />
            </ActionIcon>
            <Button
              color="orange"
              leftSection={<IconShoppingCart size={16} />}
              size="sm"
              className="flex-3"
            >
              {isRTL ? 'أضف للسلة' : 'Add to Cart'}
            </Button>
          </Group>
        </Stack>
      </Card>
    );
  };

  return (
    <Container size="xl" py="xl">
      {/* Section Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Group gap="sm" align="center" mb="xs">
            <IconFlame size={32} className="text-red-500" />
            <Title order={2} className="text-2xl font-bold">
              {isRTL ? 'عروض البرق اليومية' : 'Daily Flash Deals'}
            </Title>
            <Badge color="red" variant="filled" size="lg" className="animate-pulse">
              {isRTL ? 'محدود الوقت' : 'LIMITED TIME'}
            </Badge>
          </Group>
          <Text c="dimmed" size="sm">
            {isRTL ? 'عروض حصرية تنتهي قريباً - لا تفوتها!' : 'Exclusive deals ending soon - Don\'t miss out!'}
          </Text>
        </div>

        <Button
          variant="outline"
          color="orange"
          rightSection={isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
        >
          {isRTL ? 'عرض جميع العروض' : 'View All Deals'}
        </Button>
      </Group>

      {/* Deals Grid */}
      <Grid>
        {deals.map((deal) => (
          <Grid.Col key={deal.id} span={{ base: 12, xs: 6, md: 3 }}>
            <DealCard deal={deal} />
          </Grid.Col>
        ))}
      </Grid>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white mt-xl" padding="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={3} className="text-white mb-2">
              {isRTL ? 'لا تفوت العروض القادمة!' : 'Don\'t Miss Upcoming Deals!'}
            </Title>
            <Text className="text-orange-100">
              {isRTL ? 'اشترك في التنبيهات واحصل على إشعار بالعروض الجديدة' : 'Subscribe to alerts and get notified about new deals'}
            </Text>
          </div>
          <Button variant="white" color="dark" size="lg">
            {isRTL ? 'اشترك في التنبيهات' : 'Subscribe to Alerts'}
          </Button>
        </Group>
      </Card>
    </Container>
  );
}