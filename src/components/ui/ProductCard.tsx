'use client';

import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  Rating,
  Stack,
  Overlay,
  Box,
  Indicator,
  Tooltip
} from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconShoppingCart,
  IconEye,
  IconStar,
  IconTruck,
  IconShield
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  locale: string;
  product: {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;
    originalPrice?: number;
    image: string;
    vendor: {
      name: string;
      rating: number;
    };
    rating: number;
    reviewCount: number;
    discount?: number;
    badges?: Array<{
      textAr: string;
      textEn: string;
      color: string;
    }>;
    freeShipping?: boolean;
    hasWarranty?: boolean;
    stock: number;
  };
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  isInWishlist?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({
  locale,
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false,
  viewMode = 'grid'
}: ProductCardProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  const vatAmount = product.price * 0.10; // 10% Bahrain VAT
  const priceIncludingVat = product.price + vatAmount;

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Card
      shadow={isHovered ? "lg" : "sm"}
      padding="md"
      radius="md"
      withBorder
      className={`transition-all duration-300 transform ${isHovered ? 'scale-105' : ''} cursor-pointer relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <Card.Section className="relative">
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          <Image
            src={product.image || '/api/placeholder/300/200'}
            alt={isRTL ? product.nameAr : product.nameEn}
            fit="cover"
            className="transition-transform duration-300 hover:scale-110"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge
              color="red"
              variant="filled"
              size="lg"
              className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} font-bold`}
            >
              -{discountPercentage}%
            </Badge>
          )}

          {/* Product Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} flex flex-col gap-1`}>
              {product.badges.map((badge, index) => (
                <Badge
                  key={index}
                  color={badge.color}
                  variant="filled"
                  size="sm"
                >
                  {isRTL ? badge.textAr : badge.textEn}
                </Badge>
              ))}
            </div>
          )}

          {/* Stock Status */}
          {isOutOfStock && (
            <>
              <Overlay color="#000" backgroundOpacity={0.6} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Text c="white" fw={700} size="lg">
                  {isRTL ? 'نفد من المخزون' : 'Out of Stock'}
                </Text>
              </div>
            </>
          )}

          {/* Hover Actions */}
          {isHovered && !isOutOfStock && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Group gap="xs">
                <Tooltip label={isRTL ? 'إضافة للسلة' : 'Add to Cart'}>
                  <ActionIcon
                    color="orange"
                    size="lg"
                    variant="filled"
                    onClick={() => onAddToCart?.(product.id)}
                    className="shadow-lg"
                  >
                    <IconShoppingCart size={18} />
                  </ActionIcon>
                </Tooltip>
                
                <Tooltip label={isRTL ? 'عرض سريع' : 'Quick View'}>
                  <ActionIcon
                    color="blue"
                    size="lg"
                    variant="filled"
                    onClick={() => onQuickView?.(product.id)}
                    className="shadow-lg"
                  >
                    <IconEye size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          )}

          {/* Wishlist Button */}
          <ActionIcon
            color="red"
            variant={isInWishlist ? "filled" : "subtle"}
            size="md"
            className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-white/90 hover:bg-white`}
            onClick={() => onToggleWishlist?.(product.id)}
          >
            {isInWishlist ? (
              <IconHeartFilled size={16} />
            ) : (
              <IconHeart size={16} />
            )}
          </ActionIcon>
        </div>
      </Card.Section>

      {/* Product Info */}
      <Stack gap="xs" mt="md">
        
        {/* Vendor */}
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            {product.vendor.name}
          </Text>
          <Group gap={4}>
            <IconStar size={12} className="text-yellow-400" fill="currentColor" />
            <Text size="xs" c="dimmed">
              {product.vendor.rating}
            </Text>
          </Group>
        </Group>

        {/* Product Name */}
        <Text 
          fw={500} 
          size="sm" 
          lineClamp={2}
          className="leading-tight min-h-[40px]"
          title={isRTL ? product.nameAr : product.nameEn}
        >
          {isRTL ? product.nameAr : product.nameEn}
        </Text>

        {/* Rating */}
        <Group gap="xs" align="center">
          <Rating 
            value={product.rating} 
            fractions={2} 
            size="xs" 
            readOnly 
            color="yellow"
          />
          <Text size="xs" c="dimmed">
            ({product.reviewCount})
          </Text>
        </Group>

        {/* Price */}
        <Group gap="xs" align="baseline">
          <Text fw={700} size="lg" c="orange">
            {priceIncludingVat.toFixed(3)} {isRTL ? 'د.ب' : 'BD'}
          </Text>
          {product.originalPrice && (
            <Text size="sm" td="line-through" c="dimmed">
              {(product.originalPrice * 1.1).toFixed(3)} {isRTL ? 'د.ب' : 'BD'}
            </Text>
          )}
        </Group>

        {/* VAT Notice */}
        <Text size="xs" c="dimmed">
          {isRTL ? 'شامل ضريبة القيمة المضافة 10%' : 'VAT 10% included'}
        </Text>

        {/* Stock Status */}
        {isLowStock && !isOutOfStock && (
          <Text size="xs" c="red" fw={500}>
            {isRTL ? `متبقي ${product.stock} قطع فقط` : `Only ${product.stock} left in stock`}
          </Text>
        )}

        {/* Features */}
        <Group gap="xs">
          {product.freeShipping && (
            <Group gap={4}>
              <IconTruck size={14} className="text-green-600" />
              <Text size="xs" c="green">
                {isRTL ? 'توصيل مجاني' : 'Free Shipping'}
              </Text>
            </Group>
          )}
          {product.hasWarranty && (
            <Group gap={4}>
              <IconShield size={14} className="text-blue-600" />
              <Text size="xs" c="blue">
                {isRTL ? 'ضمان' : 'Warranty'}
              </Text>
            </Group>
          )}
        </Group>

        {/* Add to Cart Button */}
        <Button
          color="orange"
          fullWidth
          size="sm"
          leftSection={<IconShoppingCart size={16} />}
          onClick={() => onAddToCart?.(product.id)}
          disabled={isOutOfStock}
          className="mt-2"
        >
          {isOutOfStock 
            ? (isRTL ? 'نفد من المخزون' : 'Out of Stock')
            : (isRTL ? 'أضف للسلة' : 'Add to Cart')
          }
        </Button>
      </Stack>
    </Card>
  );
}