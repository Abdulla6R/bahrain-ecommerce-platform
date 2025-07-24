'use client';

import {
  Modal,
  Image,
  Text,
  Group,
  Button,
  Stack,
  Rating,
  Badge,
  Divider,
  NumberInput,
  ActionIcon,
  Avatar,
  Card,
  Grid,
  Box,
  Tabs,
  Title,
  List,
  SimpleGrid
} from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconShoppingCart,
  IconShare,
  IconStar,
  IconTruck,
  IconShield,
  IconCheck,
  IconX,
  IconMinus,
  IconPlus
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  images: string[];
  price: number;
  originalPrice?: number;
  vendor: {
    id: string;
    name: string;
    rating: number;
    logo: string;
  };
  rating: number;
  reviewCount: number;
  stock: number;
  features: Array<{
    nameAr: string;
    nameEn: string;
  }>;
  specifications: Array<{
    nameAr: string;
    nameEn: string;
    valueAr: string;
    valueEn: string;
  }>;
  variants?: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    options: string[];
  }>;
}

interface QuickViewModalProps {
  locale: string;
  product: Product | null;
  opened: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string, quantity: number) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function QuickViewModal({
  locale,
  product,
  opened,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false
}: QuickViewModalProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) return null;

  const vatAmount = product.price * 0.10;
  const priceIncludingVat = product.price + vatAmount;
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={
        <Group gap="sm">
          <Text fw={600}>{isRTL ? 'عرض سريع' : 'Quick View'}</Text>
          <Badge color="orange" variant="light">
            {isRTL ? product.nameAr : product.nameEn}
          </Badge>
        </Group>
      }
      centered
    >
      <Grid gutter="md">
        
        {/* Product Images */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="sm">
            <div className="relative">
              <Image
                src={product.images[0] || '/api/placeholder/400/400'}
                alt={isRTL ? product.nameAr : product.nameEn}
                height={350}
                radius="md"
                fit="cover"
              />
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <Badge
                  color="red"
                  size="lg"
                  variant="filled"
                  className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} font-bold`}
                >
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Stock Status */}
              {isOutOfStock && (
                <Box className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                  <Text c="white" fw={700} size="lg">
                    {isRTL ? 'نفد من المخزون' : 'Out of Stock'}
                  </Text>
                </Box>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <Group gap="xs">
                {product.images.slice(1, 5).map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt=""
                    width={60}
                    height={60}
                    radius="sm"
                    fit="cover"
                    className="cursor-pointer border hover:border-orange-300"
                  />
                ))}
                {product.images.length > 5 && (
                  <div className="w-15 h-15 bg-gray-100 rounded-sm flex items-center justify-center cursor-pointer">
                    <Text size="xs" c="dimmed">+{product.images.length - 5}</Text>
                  </div>
                )}
              </Group>
            )}
          </Stack>
        </Grid.Col>

        {/* Product Details */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            
            {/* Vendor Info */}
            <Group gap="sm">
              <Avatar src={product.vendor.logo} size="sm" />
              <div>
                <Text size="sm" fw={500}>{product.vendor.name}</Text>
                <Group gap={4}>
                  <IconStar size={12} className="text-yellow-400" fill="currentColor" />
                  <Text size="xs" c="dimmed">{product.vendor.rating}</Text>
                </Group>
              </div>
            </Group>

            {/* Product Name */}
            <Title order={3} className="leading-tight">
              {isRTL ? product.nameAr : product.nameEn}
            </Title>

            {/* Rating */}
            <Group gap="sm">
              <Rating value={product.rating} fractions={2} size="sm" readOnly color="yellow" />
              <Text size="sm" c="dimmed">
                ({product.reviewCount} {isRTL ? 'تقييم' : 'reviews'})
              </Text>
            </Group>

            {/* Price */}
            <Group gap="sm" align="baseline">
              <Text fw={700} size="xl" c="orange">
                {priceIncludingVat.toFixed(3)} {isRTL ? 'د.ب' : 'BD'}
              </Text>
              {product.originalPrice && (
                <Text size="lg" td="line-through" c="dimmed">
                  {(product.originalPrice * 1.1).toFixed(3)} {isRTL ? 'د.ب' : 'BD'}
                </Text>
              )}
              {discountPercentage > 0 && (
                <Badge color="red" variant="filled" size="sm">
                  {isRTL ? `وفر ${((product.originalPrice! - product.price) * 1.1).toFixed(3)} د.ب` : `Save ${((product.originalPrice! - product.price) * 1.1).toFixed(3)} BD`}
                </Badge>
              )}
            </Group>

            {/* VAT Notice */}
            <Text size="xs" c="dimmed">
              {isRTL ? 'شامل ضريبة القيمة المضافة 10%' : 'VAT 10% included'}
            </Text>

            {/* Stock Status */}
            {isLowStock && !isOutOfStock && (
              <Text size="sm" c="red" fw={500}>
                ⚠️ {isRTL ? `متبقي ${product.stock} قطع فقط` : `Only ${product.stock} left in stock`}
              </Text>
            )}

            {/* Product Variants */}
            {product.variants && product.variants.map((variant) => (
              <div key={variant.id}>
                <Text size="sm" fw={500} mb="xs">
                  {isRTL ? variant.nameAr : variant.nameEn}:
                </Text>
                <Group gap="xs">
                  {variant.options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedVariants[variant.id] === option ? "filled" : "outline"}
                      color="orange"
                      size="sm"
                      onClick={() => setSelectedVariants(prev => ({
                        ...prev,
                        [variant.id]: option
                      }))}
                    >
                      {option}
                    </Button>
                  ))}
                </Group>
              </div>
            ))}

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <Group gap="sm" align="center">
                <Text size="sm" fw={500}>
                  {isRTL ? 'الكمية:' : 'Quantity:'}
                </Text>
                <Group gap={0}>
                  <ActionIcon
                    variant="outline"
                    color="orange"
                    size="lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none border-r-0"
                  >
                    <IconMinus size={16} />
                  </ActionIcon>
                  <NumberInput
                    value={quantity}
                    onChange={(val) => setQuantity(Number(val) || 1)}
                    min={1}
                    max={product.stock}
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
                    color="orange"
                    size="lg"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="rounded-l-none border-l-0"
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            )}

            {/* Features */}
            <Stack gap="xs">
              {product.features.map((feature, index) => (
                <Group key={index} gap="sm">
                  <IconCheck size={16} className="text-green-600" />
                  <Text size="sm">{isRTL ? feature.nameAr : feature.nameEn}</Text>
                </Group>
              ))}
            </Stack>

            {/* Action Buttons */}
            <Group grow>
              <Button
                leftSection={<IconShoppingCart size={18} />}
                color="orange"
                size="md"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock 
                  ? (isRTL ? 'نفد من المخزون' : 'Out of Stock')
                  : (isRTL ? 'أضف للسلة' : 'Add to Cart')
                }
              </Button>
              <ActionIcon
                variant="outline"
                color="red"
                size="xl"
                onClick={() => onToggleWishlist?.(product.id)}
              >
                {isInWishlist ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
              </ActionIcon>
              <ActionIcon variant="outline" color="blue" size="xl">
                <IconShare size={20} />
              </ActionIcon>
            </Group>

            {/* Additional Info */}
            <Card className="bg-gray-50" padding="sm">
              <SimpleGrid cols={2} spacing="xs">
                <Group gap="xs">
                  <IconTruck size={16} className="text-green-600" />
                  <Text size="xs">{isRTL ? 'توصيل مجاني' : 'Free Delivery'}</Text>
                </Group>
                <Group gap="xs">
                  <IconShield size={16} className="text-blue-600" />
                  <Text size="xs">{isRTL ? 'ضمان سنة' : '1 Year Warranty'}</Text>
                </Group>
              </SimpleGrid>
            </Card>

          </Stack>
        </Grid.Col>
      </Grid>

      {/* Product Tabs */}
      <Tabs defaultValue="description" mt="xl">
        <Tabs.List grow>
          <Tabs.Tab value="description">
            {isRTL ? 'الوصف' : 'Description'}
          </Tabs.Tab>
          <Tabs.Tab value="specifications">
            {isRTL ? 'المواصفات' : 'Specifications'}
          </Tabs.Tab>
          <Tabs.Tab value="reviews">
            {isRTL ? 'التقييمات' : 'Reviews'} ({product.reviewCount})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description" pt="md">
          <Text size="sm" className="leading-relaxed">
            {isRTL ? product.descriptionAr : product.descriptionEn}
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="specifications" pt="md">
          <Stack gap="xs">
            {product.specifications.map((spec, index) => (
              <Group key={index} justify="space-between">
                <Text size="sm" fw={500}>
                  {isRTL ? spec.nameAr : spec.nameEn}:
                </Text>
                <Text size="sm" c="dimmed">
                  {isRTL ? spec.valueAr : spec.valueEn}
                </Text>
              </Group>
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="reviews" pt="md">
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {isRTL ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
          </Text>
        </Tabs.Panel>
      </Tabs>

    </Modal>
  );
}