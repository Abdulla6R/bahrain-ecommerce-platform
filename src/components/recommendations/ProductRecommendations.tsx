'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Badge,
  ActionIcon,
  Divider,
  Avatar,
  ScrollArea,
  Tabs,
  Alert,
  Progress,
  Paper,
  Center,
  Loader
} from '@mantine/core';
import {
  IconHeart,
  IconShoppingCart,
  IconEye,
  IconStar,
  IconTrendingUp,
  IconUsers,
  IconClock,
  IconSparkles,
  IconTarget,
  IconHistory,
  IconThumbUp,
  IconChevronRight,
  IconChevronLeft,
  IconRefresh,
  IconShare
} from '@tabler/icons-react';

interface ProductRecommendationsProps {
  locale: string;
  userId?: string;
  currentProductId?: string;
  context?: 'homepage' | 'product_page' | 'cart' | 'checkout' | 'user_profile';
}

interface RecommendedProduct {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  vendorAr: string;
  rating: number;
  reviewCount: number;
  category: string;
  categoryAr: string;
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  discount?: number;
  reasonType: 'viewed' | 'purchased' | 'similar' | 'trending' | 'personalized' | 'seasonal' | 'frequently_bought';
  reason: string;
  reasonAr: string;
  confidence: number;
}

interface RecommendationSection {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  algorithm: string;
  products: RecommendedProduct[];
  priority: number;
}

export function ProductRecommendations({ 
  locale, 
  userId, 
  currentProductId, 
  context = 'homepage' 
}: ProductRecommendationsProps) {
  const isRTL = locale === 'ar';
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  // Mock recommendation data with comprehensive Arabic support
  const mockRecommendations: RecommendationSection[] = [
    {
      id: 'personalized',
      title: 'Recommended for You',
      titleAr: 'موصى لك',
      description: 'Based on your browsing and purchase history',
      descriptionAr: 'بناءً على تاريخ التصفح والشراء الخاص بك',
      algorithm: 'collaborative_filtering',
      priority: 1,
      products: [
        {
          id: '1',
          name: 'iPhone 15 Pro Max 512GB',
          nameAr: 'آيفون 15 برو ماكس 512 جيجا',
          price: 649.900,
          originalPrice: 699.900,
          image: '/api/placeholder/250/250',
          vendor: 'TechStore Bahrain',
          vendorAr: 'متجر التكنولوجيا البحرين',
          rating: 4.8,
          reviewCount: 234,
          category: 'Electronics',
          categoryAr: 'إلكترونيات',
          inStock: true,
          isNew: true,
          discount: 7,
          reasonType: 'personalized',
          reason: 'You viewed similar smartphones',
          reasonAr: 'شاهدت هواتف ذكية مشابهة',
          confidence: 0.92
        },
        {
          id: '2',
          name: 'AirPods Pro 3rd Gen',
          nameAr: 'إير بودز برو الجيل الثالث',
          price: 149.900,
          image: '/api/placeholder/250/250',
          vendor: 'Apple Store Bahrain',
          vendorAr: 'متجر أبل البحرين',
          rating: 4.7,
          reviewCount: 189,
          category: 'Audio',
          categoryAr: 'الصوتيات',
          inStock: true,
          reasonType: 'frequently_bought',
          reason: 'Often bought with iPhones',
          reasonAr: 'يُشترى عادة مع الآيفون',
          confidence: 0.88
        }
      ]
    },
    {
      id: 'trending',
      title: 'Trending Now',
      titleAr: 'الأكثر رواجاً الآن',
      description: 'Most popular products this week',
      descriptionAr: 'المنتجات الأكثر شعبية هذا الأسبوع',
      algorithm: 'trending_algorithm',
      priority: 2,
      products: [
        {
          id: '3',
          name: 'Samsung Galaxy S24 Ultra',
          nameAr: 'سامسونج جالاكسي إس 24 ألترا',
          price: 449.900,
          image: '/api/placeholder/250/250',
          vendor: 'Electronics Plus',
          vendorAr: 'إلكترونيكس بلس',
          rating: 4.6,
          reviewCount: 156,
          category: 'Electronics',
          categoryAr: 'إلكترونيات',
          inStock: true,
          isTrending: true,
          reasonType: 'trending',
          reason: '127% increase in views this week',
          reasonAr: 'زيادة 127% في المشاهدات هذا الأسبوع',
          confidence: 0.85
        },
        {
          id: '4',
          name: 'MacBook Air M3',
          nameAr: 'ماك بوك إير إم 3',
          price: 699.000,
          image: '/api/placeholder/250/250',
          vendor: 'Apple Store Bahrain',
          vendorAr: 'متجر أبل البحرين',
          rating: 4.9,
          reviewCount: 98,
          category: 'Computers',
          categoryAr: 'أجهزة كمبيوتر',
          inStock: true,
          isNew: true,
          isTrending: true,
          reasonType: 'trending',
          reason: 'Top seller in laptops category',
          reasonAr: 'الأكثر مبيعاً في فئة اللابتوب',
          confidence: 0.91
        }
      ]
    },
    {
      id: 'recently_viewed',
      title: 'Based on Your Recent Views',
      titleAr: 'بناءً على المشاهدات الأخيرة',
      description: 'Products similar to what you recently viewed',
      descriptionAr: 'منتجات مشابهة لما شاهدته مؤخراً',
      algorithm: 'content_based_filtering',
      priority: 3,
      products: [
        {
          id: '5',
          name: 'iPad Pro 12.9" M4',
          nameAr: 'آيباد برو 12.9 بوصة إم 4',
          price: 549.900,
          originalPrice: 599.900,
          image: '/api/placeholder/250/250',
          vendor: 'TechStore Bahrain',
          vendorAr: 'متجر التكنولوجيا البحرين',
          rating: 4.8,
          reviewCount: 145,
          category: 'Tablets',
          categoryAr: 'أجهزة لوحية',
          inStock: true,
          discount: 8,
          reasonType: 'viewed',
          reason: 'You viewed similar tablets',
          reasonAr: 'شاهدت أجهزة لوحية مشابهة',
          confidence: 0.76
        },
        {
          id: '6',
          name: 'Apple Pencil Pro',
          nameAr: 'قلم أبل برو',
          price: 89.900,
          image: '/api/placeholder/250/250',
          vendor: 'Apple Store Bahrain',
          vendorAr: 'متجر أبل البحرين',
          rating: 4.5,
          reviewCount: 87,
          category: 'Accessories',
          categoryAr: 'إكسسوارات',
          inStock: true,
          reasonType: 'frequently_bought',
          reason: 'Perfect companion for iPad Pro',
          reasonAr: 'رفيق مثالي لآيباد برو',
          confidence: 0.82
        }
      ]
    },
    {
      id: 'seasonal',
      title: 'Ramadan Special Offers',
      titleAr: 'عروض رمضان المميزة',
      description: 'Special deals for the holy month',
      descriptionAr: 'عروض خاصة للشهر الكريم',
      algorithm: 'seasonal_recommendations',
      priority: 4,
      products: [
        {
          id: '7',
          name: 'Premium Dates Gift Box',
          nameAr: 'علبة تمر فاخرة',
          price: 45.500,
          originalPrice: 65.000,
          image: '/api/placeholder/250/250',
          vendor: 'Gourmet Bahrain',
          vendorAr: 'جورميه البحرين',
          rating: 4.9,
          reviewCount: 234,
          category: 'Food & Beverages',
          categoryAr: 'الأطعمة والمشروبات',
          inStock: true,
          discount: 30,
          reasonType: 'seasonal',
          reason: 'Perfect for Ramadan gifting',
          reasonAr: 'مثالي لهدايا رمضان',
          confidence: 0.94
        },
        {
          id: '8',
          name: 'Islamic Calendar 2025',
          nameAr: 'التقويم الإسلامي 2025',
          price: 12.900,
          image: '/api/placeholder/250/250',
          vendor: 'Islamic Books Store',
          vendorAr: 'متجر الكتب الإسلامية',
          rating: 4.7,
          reviewCount: 78,
          category: 'Books & Stationery',
          categoryAr: 'الكتب والقرطاسية',
          inStock: true,
          reasonType: 'seasonal',
          reason: 'Popular during Ramadan',
          reasonAr: 'شائع خلال رمضان',
          confidence: 0.88
        }
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-BH' : 'en-BH', {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3
    }).format(amount);
  };

  const getReasonIcon = (reasonType: string) => {
    switch (reasonType) {
      case 'viewed': return <IconEye size={14} />;
      case 'purchased': return <IconShoppingCart size={14} />;
      case 'similar': return <IconTarget size={14} />;
      case 'trending': return <IconTrendingUp size={14} />;
      case 'personalized': return <IconSparkles size={14} />;
      case 'seasonal': return <IconSparkles size={14} />;
      case 'frequently_bought': return <IconUsers size={14} />;
      default: return <IconThumbUp size={14} />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'green';
    if (confidence >= 0.8) return 'orange';
    if (confidence >= 0.7) return 'yellow';
    return 'gray';
  };

  // Simulate API call for recommendations
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay and context-aware filtering
    setTimeout(() => {
      let filteredRecommendations = [...mockRecommendations];
      
      // Filter based on context
      if (context === 'product_page') {
        // Focus on similar and frequently bought together
        filteredRecommendations = filteredRecommendations.filter(section => 
          ['personalized', 'recently_viewed'].includes(section.id)
        );
      } else if (context === 'cart') {
        // Focus on frequently bought together
        filteredRecommendations = filteredRecommendations.filter(section => 
          section.id === 'personalized'
        );
      } else if (context === 'user_profile') {
        // Show personalized and trending
        filteredRecommendations = filteredRecommendations.filter(section => 
          ['personalized', 'trending'].includes(section.id)
        );
      }
      
      // Sort by priority
      filteredRecommendations.sort((a, b) => a.priority - b.priority);
      
      setRecommendations(filteredRecommendations);
      setLoading(false);
    }, 800);
  }, [context, userId, currentProductId]);

  const refreshRecommendations = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Card withBorder padding="xl">
        <Center>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>
              {isRTL ? 'جاري تحميل التوصيات...' : 'Loading recommendations...'}
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card withBorder padding="xl">
        <Center>
          <Stack align="center" gap="md">
            <IconSparkles size={48} className="text-gray-400" />
            <Text size="lg" c="dimmed">
              {isRTL ? 'لا توجد توصيات متاحة' : 'No recommendations available'}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {isRTL 
                ? 'تصفح المزيد من المنتجات للحصول على توصيات شخصية'
                : 'Browse more products to get personalized recommendations'
              }
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      
      {recommendations.map((section, sectionIndex) => (
        <Card key={section.id} withBorder padding="lg">
          
          {/* Section Header */}
          <Group justify="space-between" mb="md">
            <div>
              <Group gap="sm">
                <Title order={4}>
                  {isRTL ? section.titleAr : section.title}
                </Title>
                <Badge variant="light" color="orange">
                  {section.products.length}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {isRTL ? section.descriptionAr : section.description}
              </Text>
            </div>
            
            <Group gap="sm">
              <ActionIcon 
                variant="outline" 
                onClick={refreshRecommendations}
                loading={loading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
              <ActionIcon variant="outline">
                <IconShare size={16} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Algorithm Info */}
          <Alert color="blue" variant="light" mb="md">
            <Group gap="sm">
              <IconSparkles size={16} />
              <Text size="sm">
                {isRTL 
                  ? 'توصيات مدعومة بالذكاء الاصطناعي بناءً على سلوكك وتفضيلاتك'
                  : 'AI-powered recommendations based on your behavior and preferences'
                }
              </Text>
            </Group>
          </Alert>

          {/* Products Grid */}
          <ScrollArea>
            <Group gap="lg" wrap="nowrap" pb="sm">
              {section.products.map((product) => (
                <Card 
                  key={product.id} 
                  withBorder 
                  padding="md" 
                  className="hover:shadow-lg transition-shadow flex-shrink-0"
                  style={{ minWidth: 280 }}
                >
                  <Card.Section>
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={isRTL ? product.nameAr : product.name}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <Badge color="blue" variant="filled" size="sm">
                            {isRTL ? 'جديد' : 'New'}
                          </Badge>
                        )}
                        {product.isTrending && (
                          <Badge color="orange" variant="filled" size="sm">
                            <IconTrendingUp size={12} />
                          </Badge>
                        )}
                        {product.discount && (
                          <Badge color="red" variant="filled" size="sm">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <ActionIcon color="red" variant="filled" size="sm">
                          <IconHeart size={14} />
                        </ActionIcon>
                        <ActionIcon color="blue" variant="filled" size="sm">
                          <IconEye size={14} />
                        </ActionIcon>
                      </div>
                    </div>
                  </Card.Section>

                  <Stack gap="sm" mt="md">
                    
                    {/* Product Info */}
                    <div>
                      <Text fw={500} lineClamp={2} size="sm">
                        {isRTL ? product.nameAr : product.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {isRTL ? product.vendorAr : product.vendor}
                      </Text>
                    </div>
                    
                    {/* Price and Rating */}
                    <Group justify="space-between">
                      <div>
                        <Text fw={600} c="orange">
                          {formatCurrency(product.price)}
                        </Text>
                        {product.originalPrice && (
                          <Text size="xs" td="line-through" c="dimmed">
                            {formatCurrency(product.originalPrice)}
                          </Text>
                        )}
                      </div>
                      <Group gap={4}>
                        <IconStar size={14} className="text-yellow-400" fill="currentColor" />
                        <Text size="sm">{product.rating}</Text>
                        <Text size="sm" c="dimmed">({product.reviewCount})</Text>
                      </Group>
                    </Group>
                    
                    {/* Recommendation Reason */}
                    <Paper withBorder p="xs" bg="gray.0">
                      <Group gap="xs">
                        {getReasonIcon(product.reasonType)}
                        <Text size="xs" c="dimmed">
                          {isRTL ? product.reasonAr : product.reason}
                        </Text>
                      </Group>
                      
                      {/* Confidence Score */}
                      <Group gap="xs" mt="xs">
                        <Text size="xs" c="dimmed">
                          {isRTL ? 'دقة التوصية:' : 'Match:'}
                        </Text>
                        <Progress 
                          value={product.confidence * 100} 
                          color={getConfidenceColor(product.confidence)}
                          size="xs" 
                          flex={1}
                        />
                        <Text size="xs" fw={500} c={getConfidenceColor(product.confidence)}>
                          {Math.round(product.confidence * 100)}%
                        </Text>
                      </Group>
                    </Paper>
                    
                    {/* Category Badge */}
                    <Badge variant="light" size="xs" fullWidth>
                      {isRTL ? product.categoryAr : product.category}
                    </Badge>
                    
                    {/* Action Button */}
                    <Button 
                      fullWidth 
                      size="sm"
                      disabled={!product.inStock}
                      leftSection={<IconShoppingCart size={16} />}
                    >
                      {product.inStock 
                        ? (isRTL ? 'إضافة للسلة' : 'Add to Cart')
                        : (isRTL ? 'نفد المخزون' : 'Out of Stock')
                      }
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Group>
          </ScrollArea>

          {/* View All Button */}
          {section.products.length > 4 && (
            <Group justify="center" mt="md">
              <Button 
                variant="outline" 
                rightSection={isRTL ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
              >
                {isRTL ? 'عرض المزيد' : 'View More'}
              </Button>
            </Group>
          )}

        </Card>
      ))}

      {/* Recommendation Quality Feedback */}
      <Card withBorder padding="md">
        <Group justify="space-between">
          <div>
            <Text fw={500} size="sm">
              {isRTL ? 'كيف كانت جودة التوصيات؟' : 'How were the recommendations?'}
            </Text>
            <Text size="xs" c="dimmed">
              {isRTL 
                ? 'ملاحظاتك تساعدنا في تحسين التوصيات'
                : 'Your feedback helps us improve recommendations'
              }
            </Text>
          </div>
          <Group gap="xs">
            <ActionIcon variant="outline" color="red">
              <IconThumbUp size={16} style={{ transform: 'scaleX(-1)' }} />
            </ActionIcon>
            <ActionIcon variant="outline" color="green">
              <IconThumbUp size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Card>

    </Stack>
  );
}