'use client';

import { 
  SimpleGrid, 
  Card, 
  Text, 
  Group, 
  Stack, 
  Badge,
  UnstyledButton,
  Box,
  Title,
  Button,
  Image,
  ActionIcon,
  Tooltip,
  Rating,
} from '@mantine/core';
import { 
  IconHeart,
  IconShoppingCart,
  IconEye,
  IconChevronRight,
  IconChevronLeft,
  IconStar,
  IconTruck,
  IconCheck,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  filter?: 'featured' | 'new_arrivals' | 'made_in_bahrain' | 'best_sellers';
  locale: string;
  bgColor?: string;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  price: number;
  originalPrice?: number;
  currency: 'BHD';
  images: string[];
  rating: number;
  reviewCount: number;
  vendor: {
    id: string;
    nameAr: string;
    nameEn: string;
    rating: number;
    isVerified: boolean;
  };
  badges?: Array<{
    textAr: string;
    textEn: string;
    color: string;
    variant?: 'filled' | 'light' | 'outline';
  }>;
  isFreeShipping: boolean;
  stockCount: number;
  discountPercentage?: number;
  isMadeBahrain?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export function FeaturedProducts({ 
  title, 
  subtitle, 
  filter = 'featured', 
  locale,
  bgColor 
}: FeaturedProductsProps) {
  const t = useTranslations('Products');
  const router = useRouter();
  const isRTL = locale === 'ar';
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Mock product data - in production this would come from API
  const products: Product[] = [
    {
      id: '1',
      nameAr: 'آيفون 15 برو ماكس',
      nameEn: 'iPhone 15 Pro Max',
      shortDescriptionAr: 'أحدث هاتف من آبل بتقنية التيتانيوم',
      shortDescriptionEn: 'Latest iPhone with Titanium technology',
      price: 525.000,
      originalPrice: 575.000,
      currency: 'BHD',
      images: ['/api/placeholder/300/300'],
      rating: 4.8,
      reviewCount: 324,
      vendor: {
        id: 'v1',
        nameAr: 'متجر التقنية الذكية',
        nameEn: 'Smart Tech Store',
        rating: 4.9,
        isVerified: true,
      },
      badges: [
        { textAr: 'خصم 9%', textEn: '9% OFF', color: 'red', variant: 'filled' },
        { textAr: 'الأكثر مبيعاً', textEn: 'Best Seller', color: 'orange', variant: 'light' },
      ],
      isFreeShipping: true,
      stockCount: 15,
      discountPercentage: 9,
      isBestSeller: true,
    },
    {
      id: '2',
      nameAr: 'فستان صيفي أنيق',
      nameEn: 'Elegant Summer Dress',
      shortDescriptionAr: 'فستان صيفي مريح من القطن الطبيعي',
      shortDescriptionEn: 'Comfortable summer dress made from natural cotton',
      price: 45.500,
      currency: 'BHD',
      images: ['/api/placeholder/300/300'],
      rating: 4.6,
      reviewCount: 156,
      vendor: {
        id: 'v2',
        nameAr: 'بوتيك الأناقة',
        nameEn: 'Elegance Boutique',
        rating: 4.7,
        isVerified: true,
      },
      badges: [
        { textAr: 'وصل حديثاً', textEn: 'New Arrival', color: 'green', variant: 'filled' },
      ],
      isFreeShipping: false,
      stockCount: 8,
      isNew: true,
    },
    {
      id: '3',
      nameAr: 'عسل طبيعي بحريني',
      nameEn: 'Natural Bahraini Honey',
      shortDescriptionAr: 'عسل طبيعي 100% من مناحل البحرين',
      shortDescriptionEn: '100% Natural honey from Bahrain apiaries',
      price: 18.750,
      currency: 'BHD',
      images: ['/api/placeholder/300/300'],
      rating: 4.9,
      reviewCount: 89,
      vendor: {
        id: 'v3',
        nameAr: 'مناحل البحرين الطبيعية',
        nameEn: 'Bahrain Natural Apiaries',
        rating: 4.8,
        isVerified: true,
      },
      badges: [
        { textAr: 'منتج بحريني', textEn: 'Made in Bahrain', color: 'blue', variant: 'filled' },
        { textAr: 'عضوي', textEn: 'Organic', color: 'green', variant: 'light' },
      ],
      isFreeShipping: true,
      stockCount: 25,
      isMadeBahrain: true,
    },
    {
      id: '4',
      nameAr: 'حذاء رياضي للجري',
      nameEn: 'Running Sports Shoes',
      shortDescriptionAr: 'حذاء رياضي مريح مثالي للجري اليومي',
      shortDescriptionEn: 'Comfortable sports shoes perfect for daily running',
      price: 75.000,
      originalPrice: 95.000,
      currency: 'BHD',
      images: ['/api/placeholder/300/300'],
      rating: 4.5,
      reviewCount: 203,
      vendor: {
        id: 'v4',
        nameAr: 'متجر الرياضة النشطة',
        nameEn: 'Active Sports Store',
        rating: 4.6,
        isVerified: true,
      },
      badges: [
        { textAr: 'خصم 21%', textEn: '21% OFF', color: 'red', variant: 'filled' },
      ],
      isFreeShipping: true,
      stockCount: 12,
      discountPercentage: 21,
    },
    {
      id: '5',
      nameAr: 'كريم العناية بالوجه',
      nameEn: 'Face Care Cream',
      shortDescriptionAr: 'كريم طبيعي للعناية بالبشرة اليومية',
      shortDescriptionEn: 'Natural cream for daily skin care',
      price: 32.250,
      currency: 'BHD',
      images: ['/api/placeholder/300/300'],
      rating: 4.7,
      reviewCount: 127,
      vendor: {
        id: 'v5',
        nameAr: 'عالم الجمال الطبيعي',
        nameEn: 'Natural Beauty World',
        rating: 4.8,
        isVerified: true,
      },
      badges: [
        { textAr: 'طبيعي 100%', textEn: '100% Natural', color: 'green', variant: 'light' },
      ],
      isFreeShipping: false,
      stockCount: 20,
    },
    {
      id: '6',
      nameAr: 'لعبة تعليمية للأطفال',
      nameEn: 'Educational Toy for Kids',
      shortDescriptionAr: 'لعبة تعليمية تنمي مهارات الطفل',
      shortDescriptionEn: 'Educational toy that develops children\'s skills',
      price: 28.500,
      currency: 'BHD',
      images: ['/api/placeholder/300/300'],
      rating: 4.4,
      reviewCount: 98,
      vendor: {
        id: 'v6',
        nameAr: 'عالم الطفولة السعيدة',
        nameEn: 'Happy Childhood World',
        rating: 4.5,
        isVerified: true,
      },
      badges: [
        { textAr: 'آمن للأطفال', textEn: 'Child Safe', color: 'blue', variant: 'light' },
      ],
      isFreeShipping: true,
      stockCount: 30,
    },
  ];

  const toggleWishlist = (productId: string) => {
    setWishlist(prevWishlist => 
      prevWishlist.includes(productId) 
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  const handleProductClick = (productId: string) => {
    router.push(`/${locale}/products/${productId}`);
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle add to cart logic
    console.log('Add to cart:', productId);
  };

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle quick view logic
    console.log('Quick view:', productId);
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <Box className={bgColor ? `p-6 rounded-2xl bg-${bgColor}` : ''}>
      <Stack gap="lg">
        {/* Section Header */}
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={2} className="text-2xl font-bold text-gray-900">
              {title}
            </Title>
            {subtitle && (
              <Text c="dimmed" size="sm">
                {subtitle}
              </Text>
            )}
          </Stack>
          
          <Button
            variant="subtle"
            onClick={() => router.push(`/${locale}/products?filter=${filter}`)}
            rightSection={isRTL ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
          >
            {t('viewAll')}
          </Button>
        </Group>

        {/* Products Grid */}
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 4, lg: 6 }}
          spacing="lg"
          verticalSpacing="xl"
        >
          {products.map((product) => (
            <UnstyledButton
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="group text-start"
            >
              <Card
                padding="sm"
                radius="lg"
                className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-100"
              >
                <Stack gap="sm">
                  {/* Product Image */}
                  <Box className="relative">
                    <Image
                      src={product.images[0]}
                      alt={isRTL ? product.nameAr : product.nameEn}
                      height={200}
                      className="rounded-lg"
                      fallbackSrc="/api/placeholder/300/300"
                    />
                    
                    {/* Badges Overlay */}
                    <Stack gap="xs" className="absolute top-2 left-2 right-2">
                      {product.badges?.slice(0, 2).map((badge, index) => (
                        <Badge
                          key={index}
                          size="xs"
                          color={badge.color}
                          variant={badge.variant || 'filled'}
                          className="w-fit"
                        >
                          {isRTL ? badge.textAr : badge.textEn}
                        </Badge>
                      ))}
                    </Stack>

                    {/* Action Buttons */}
                    <Group className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip label={t('addToWishlist')}>
                        <ActionIcon
                          size="sm"
                          variant="white"
                          className={`shadow-sm ${
                            wishlist.includes(product.id) 
                              ? 'text-red-500 bg-red-50' 
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                        >
                          <IconHeart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                        </ActionIcon>
                      </Tooltip>
                      
                      <Tooltip label={t('quickView')}>
                        <ActionIcon
                          size="sm"
                          variant="white"
                          className="shadow-sm text-gray-600 hover:text-blue-500"
                          onClick={(e) => handleQuickView(product.id, e)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>

                    {/* Stock indicator */}
                    {product.stockCount <= 5 && (
                      <Badge
                        size="xs"
                        color="red"
                        variant="filled"
                        className="absolute bottom-2 left-2"
                      >
                        {t('lastItems', { count: product.stockCount })}
                      </Badge>
                    )}
                  </Box>

                  {/* Product Info */}
                  <Stack gap="xs" className="flex-1">
                    {/* Vendor */}
                    <Group gap="xs">
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {isRTL ? product.vendor.nameAr : product.vendor.nameEn}
                      </Text>
                      {product.vendor.isVerified && (
                        <Tooltip label={t('verifiedVendor')}>
                          <IconCheck size={12} className="text-blue-500" />
                        </Tooltip>
                      )}
                    </Group>

                    {/* Product Name */}
                    <Text 
                      fw={600} 
                      size="sm" 
                      lineClamp={2}
                      className="text-gray-900 group-hover:text-tendzd-orange-700 transition-colors"
                    >
                      {isRTL ? product.nameAr : product.nameEn}
                    </Text>

                    {/* Rating */}
                    <Group gap="xs">
                      <Rating value={product.rating} readOnly size="xs" />
                      <Text size="xs" c="dimmed">
                        ({product.reviewCount})
                      </Text>
                    </Group>

                    {/* Price */}
                    <Group justify="space-between" align="center">
                      <Stack gap={2}>
                        <Group gap="xs" align="baseline">
                          <Text 
                            fw={700} 
                            size="md" 
                            className="text-tendzd-orange-600 numbers-ltr"
                          >
                            {product.price.toFixed(3)} {t('currency')}
                          </Text>
                          {product.originalPrice && (
                            <Text 
                              size="xs" 
                              td="line-through" 
                              c="dimmed"
                              className="numbers-ltr"
                            >
                              {product.originalPrice.toFixed(3)}
                            </Text>
                          )}
                        </Group>
                        {product.isFreeShipping && (
                          <Group gap={4}>
                            <IconTruck size={12} className="text-green-600" />
                            <Text size="xs" className="text-green-600">
                              {t('freeShipping')}
                            </Text>
                          </Group>
                        )}
                      </Stack>
                    </Group>

                    {/* Add to Cart Button */}
                    <Button
                      size="xs"
                      variant="light"
                      color="orange"
                      leftSection={<IconShoppingCart size={14} />}
                      className="w-full mt-auto"
                      onClick={(e) => handleAddToCart(product.id, e)}
                    >
                      {t('addToCart')}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </UnstyledButton>
          ))}
        </SimpleGrid>

        {/* View All Button */}
        <Group justify="center" className="mt-4">
          <Button
            size="md"
            variant="outline"
            color="orange"
            onClick={() => router.push(`/${locale}/products?filter=${filter}`)}
            rightSection={isRTL ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
          >
            {t('exploreMore')}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}