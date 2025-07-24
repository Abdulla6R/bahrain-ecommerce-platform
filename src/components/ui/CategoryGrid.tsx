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
  Center,
} from '@mantine/core';
import { 
  IconDevices, 
  IconShirt, 
  IconHome2, 
  IconRun,
  IconSparkles,
  IconBabyCarriage,
  IconBook,
  IconCar,
  IconApple,
  IconTool,
  IconChevronRight,
  IconChevronLeft
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface CategoryGridProps {
  locale: string;
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: React.ReactNode;
  color: string;
  productCount: number;
  isPopular?: boolean;
  isTrending?: boolean;
}

export function CategoryGrid({ locale }: CategoryGridProps) {
  const t = useTranslations('Categories');
  const router = useRouter();
  const isRTL = locale === 'ar';

  const categories: Category[] = [
    {
      id: 'electronics',
      nameAr: 'الإلكترونيات',
      nameEn: 'Electronics',
      descriptionAr: 'هواتف، حاسوب، أجهزة ذكية',
      descriptionEn: 'Phones, Computers, Smart Devices',
      icon: <IconDevices size={28} />,
      color: 'blue',
      productCount: 15420,
      isPopular: true,
    },
    {
      id: 'fashion',
      nameAr: 'الأزياء والموضة',
      nameEn: 'Fashion & Style',
      descriptionAr: 'ملابس، أحذية، إكسسوارات',
      descriptionEn: 'Clothing, Shoes, Accessories',
      icon: <IconShirt size={28} />,
      color: 'pink',
      productCount: 23850,
      isTrending: true,
    },
    {
      id: 'home-garden',
      nameAr: 'المنزل والحديقة',
      nameEn: 'Home & Garden',
      descriptionAr: 'أثاث، ديكور، أدوات منزلية',
      descriptionEn: 'Furniture, Décor, Home Tools',
      icon: <IconHome2 size={28} />,
      color: 'green',
      productCount: 8930,
    },
    {
      id: 'sports',
      nameAr: 'الرياضة واللياقة',
      nameEn: 'Sports & Fitness',
      descriptionAr: 'معدات رياضية، ملابس رياضية',
      descriptionEn: 'Sports Equipment, Athletic Wear',
      icon: <IconRun size={28} />,
      color: 'orange',
      productCount: 5670,
      isPopular: true,
    },
    {
      id: 'beauty',
      nameAr: 'الجمال والعناية',
      nameEn: 'Beauty & Care',
      descriptionAr: 'مكياج، عناية بالبشرة، عطور',
      descriptionEn: 'Makeup, Skincare, Perfumes',
      icon: <IconSparkles size={28} />,
      color: 'violet',
      productCount: 12340,
      isTrending: true,
    },
    {
      id: 'baby-kids',
      nameAr: 'الأطفال والرضع',
      nameEn: 'Baby & Kids',
      descriptionAr: 'ألعاب، ملابس أطفال، مستلزمات',
      descriptionEn: 'Toys, Kids Clothing, Supplies',
      icon: <IconBabyCarriage size={28} />,
      color: 'yellow',
      productCount: 7820,
    },
    {
      id: 'books',
      nameAr: 'الكتب والقرطاسية',
      nameEn: 'Books & Stationery',
      descriptionAr: 'كتب، قرطاسية، أدوات مكتبية',
      descriptionEn: 'Books, Stationery, Office Supplies',
      icon: <IconBook size={28} />,
      color: 'indigo',
      productCount: 4210,
    },
    {
      id: 'automotive',
      nameAr: 'السيارات والدراجات',
      nameEn: 'Automotive & Bikes',
      descriptionAr: 'قطع غيار، إكسسوارات سيارات',
      descriptionEn: 'Auto Parts, Car Accessories',
      icon: <IconCar size={28} />,
      color: 'gray',
      productCount: 3580,
    },
    {
      id: 'food',
      nameAr: 'الطعام والمشروبات',
      nameEn: 'Food & Beverages',
      descriptionAr: 'أطعمة صحية، مشروبات، حلويات',
      descriptionEn: 'Healthy Food, Drinks, Sweets',
      icon: <IconApple size={28} />,
      color: 'red',
      productCount: 6750,
      isPopular: true,
    },
    {
      id: 'tools',
      nameAr: 'الأدوات والمعدات',
      nameEn: 'Tools & Equipment',
      descriptionAr: 'أدوات كهربائية، معدات صناعية',
      descriptionEn: 'Power Tools, Industrial Equipment',
      icon: <IconTool size={28} />,
      color: 'dark',
      productCount: 2190,
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/${locale}/categories/${categoryId}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Stack gap="lg">
      {/* Section Header */}
      <Group justify="space-between" align="center">
        <Stack gap="xs">
          <Title order={2} className="text-2xl font-bold text-gray-900">
            {t('browseCategories')}
          </Title>
          <Text c="dimmed" size="sm">
            {t('browseCategoriesDesc')}
          </Text>
        </Stack>
        
        <UnstyledButton
          onClick={() => router.push(`/${locale}/categories`)}
          className="flex items-center gap-2 text-tendzd-orange-600 hover:text-tendzd-orange-700 transition-colors"
        >
          <Text fw={500} size="sm">
            {t('viewAll')}
          </Text>
          {isRTL ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
        </UnstyledButton>
      </Group>

      {/* Categories Grid */}
      <SimpleGrid
        cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 5 }}
        spacing="md"
        verticalSpacing="lg"
      >
        {categories.map((category) => (
          <UnstyledButton
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="group"
          >
            <Card
              padding="lg"
              radius="xl"
              className={`
                h-full transition-all duration-200 border-2 border-transparent
                hover:border-tendzd-orange-200 hover:shadow-lg hover:scale-105
                group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50
              `}
            >
              <Stack align="center" gap="sm">
                {/* Icon with background */}
                <Box
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    bg-gradient-to-br transition-all duration-200
                    group-hover:scale-110 group-hover:shadow-md
                  `}
                  style={{
                    background: `linear-gradient(135deg, var(--mantine-color-${category.color}-1), var(--mantine-color-${category.color}-2))`,
                    color: `var(--mantine-color-${category.color}-7)`,
                  }}
                >
                  {category.icon}
                </Box>

                {/* Category Name */}
                <Text
                  size="sm"
                  fw={600}
                  ta="center"
                  lineClamp={2}
                  className="text-gray-900 group-hover:text-tendzd-orange-700 transition-colors"
                >
                  {isRTL ? category.nameAr : category.nameEn}
                </Text>

                {/* Product Count */}
                <Text size="xs" c="dimmed" ta="center">
                  {formatNumber(category.productCount)} {t('products')}
                </Text>

                {/* Badges */}
                <Group gap="xs" justify="center">
                  {category.isPopular && (
                    <Badge
                      size="xs"
                      variant="light"
                      color="orange"
                      className="animate-pulse"
                    >
                      {t('popular')}
                    </Badge>
                  )}
                  {category.isTrending && (
                    <Badge
                      size="xs"
                      variant="light"
                      color="green"
                      className="animate-pulse"
                    >
                      {t('trending')}
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Card>
          </UnstyledButton>
        ))}
      </SimpleGrid>

      {/* Quick Access Buttons */}
      <Group justify="center" gap="md" className="mt-4">
        <UnstyledButton
          onClick={() => router.push(`/${locale}/deals`)}
          className="px-6 py-3 bg-gradient-to-r from-tendzd-orange-500 to-tendzd-yellow-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Group gap="xs">
            <IconSparkles size={18} />
            <Text size="sm">
              {t('todaysDeals')}
            </Text>
          </Group>
        </UnstyledButton>

        <UnstyledButton
          onClick={() => router.push(`/${locale}/new-arrivals`)}
          className="px-6 py-3 bg-white border-2 border-tendzd-orange-200 text-tendzd-orange-700 rounded-full font-semibold hover:bg-tendzd-orange-50 hover:border-tendzd-orange-300 transition-all duration-200 hover:scale-105"
        >
          <Group gap="xs">
            <Text size="sm">
              {t('newArrivals')}
            </Text>
            {isRTL ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
          </Group>
        </UnstyledButton>
      </Group>
    </Stack>
  );
}