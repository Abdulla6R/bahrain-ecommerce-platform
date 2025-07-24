'use client';

import {
  Container,
  Group,
  Button,
  Menu,
  Text,
  Grid,
  Card,
  UnstyledButton,
  Box,
  Divider
} from '@mantine/core';
import {
  IconMenu2,
  IconChevronDown,
  IconDeviceMobile,
  IconShirt,
  IconHome,
  IconBallBasketball,
  IconSparkles,
  IconCar,
  IconBook,
  IconUsers
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface CategoryNavProps {
  locale: string;
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: React.ReactNode;
  subcategories?: {
    id: string;
    nameAr: string;
    nameEn: string;
  }[];
}

export function CategoryNav({ locale }: CategoryNavProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';

  const categories: Category[] = [
    {
      id: 'electronics',
      nameAr: 'الإلكترونيات',
      nameEn: 'Electronics',
      icon: <IconDeviceMobile size={18} />,
      subcategories: [
        { id: 'smartphones', nameAr: 'الهواتف الذكية', nameEn: 'Smartphones' },
        { id: 'laptops', nameAr: 'أجهزة الكمبيوتر المحمولة', nameEn: 'Laptops' },
        { id: 'tablets', nameAr: 'الأجهزة اللوحية', nameEn: 'Tablets' },
        { id: 'accessories', nameAr: 'الإكسسوارات', nameEn: 'Accessories' }
      ]
    },
    {
      id: 'fashion',
      nameAr: 'الأزياء',
      nameEn: 'Fashion',
      icon: <IconShirt size={18} />,
      subcategories: [
        { id: 'men', nameAr: 'أزياء رجالية', nameEn: 'Men\'s Fashion' },
        { id: 'women', nameAr: 'أزياء نسائية', nameEn: 'Women\'s Fashion' },
        { id: 'shoes', nameAr: 'الأحذية', nameEn: 'Shoes' },
        { id: 'bags', nameAr: 'الحقائب', nameEn: 'Bags' }
      ]
    },
    {
      id: 'home',
      nameAr: 'المنزل والحديقة',
      nameEn: 'Home & Garden',
      icon: <IconHome size={18} />,
      subcategories: [
        { id: 'furniture', nameAr: 'الأثاث', nameEn: 'Furniture' },
        { id: 'appliances', nameAr: 'الأجهزة المنزلية', nameEn: 'Home Appliances' },
        { id: 'garden', nameAr: 'أدوات الحديقة', nameEn: 'Garden Tools' },
        { id: 'decor', nameAr: 'الديكور', nameEn: 'Home Decor' }
      ]
    },
    {
      id: 'sports',
      nameAr: 'الرياضة واللياقة',
      nameEn: 'Sports & Fitness',
      icon: <IconBallBasketball size={18} />,
      subcategories: [
        { id: 'fitness', nameAr: 'معدات اللياقة', nameEn: 'Fitness Equipment' },
        { id: 'outdoor', nameAr: 'الرياضات الخارجية', nameEn: 'Outdoor Sports' },
        { id: 'team-sports', nameAr: 'الألعاب الجماعية', nameEn: 'Team Sports' }
      ]
    },
    {
      id: 'beauty',
      nameAr: 'الجمال والعناية',
      nameEn: 'Beauty & Personal Care',
      icon: <IconSparkles size={18} />,
      subcategories: [
        { id: 'makeup', nameAr: 'المكياج', nameEn: 'Makeup' },
        { id: 'skincare', nameAr: 'العناية بالبشرة', nameEn: 'Skincare' },
        { id: 'fragrance', nameAr: 'العطور', nameEn: 'Fragrances' },
        { id: 'haircare', nameAr: 'العناية بالشعر', nameEn: 'Hair Care' }
      ]
    },
    {
      id: 'automotive',
      nameAr: 'السيارات',
      nameEn: 'Automotive',
      icon: <IconCar size={18} />
    },
    {
      id: 'books',
      nameAr: 'الكتب',
      nameEn: 'Books',
      icon: <IconBook size={18} />
    },
    {
      id: 'baby',
      nameAr: 'الأطفال والرضع',
      nameEn: 'Baby & Kids',
      icon: <IconUsers size={18} />
    }
  ];

  const quickLinks = [
    { nameAr: 'أفضل البائعين', nameEn: 'Best Sellers' },
    { nameAr: 'العروض اليومية', nameEn: 'Today\'s Deals' },
    { nameAr: 'المنتجات الجديدة', nameEn: 'New Arrivals' },
    { nameAr: 'أصبح بائعاً', nameEn: 'Become a Seller' }
  ];

  return (
    <div className="bg-orange-600 text-white shadow-md">
      <Container size="xl">
        <Group gap="md" py="sm">
          
          {/* All Categories Menu */}
          <Menu 
            width={600} 
            position="bottom-start"
            offset={0}
          >
            <Menu.Target>
              <Button
                leftSection={<IconMenu2 size={18} />}
                rightSection={<IconChevronDown size={16} />}
                variant="white"
                color="orange"
                size="sm"
                className="font-medium"
              >
                {isRTL ? 'جميع الفئات' : 'All Categories'}
              </Button>
            </Menu.Target>

            <Menu.Dropdown className="p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <Grid gutter={0}>
                {categories.map((category) => (
                  <Grid.Col key={category.id} span={6}>
                    <UnstyledButton 
                      className="w-full p-3 hover:bg-orange-50 transition-colors border-r border-b border-gray-100"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <Group gap="sm" align="flex-start">
                        <Box className="text-orange-600 mt-1">
                          {category.icon}
                        </Box>
                        <div className="flex-1">
                          <Text size="sm" fw={500} c="dark" mb="xs">
                            {isRTL ? category.nameAr : category.nameEn}
                          </Text>
                          {category.subcategories && (
                            <div className="space-y-1">
                              {category.subcategories.slice(0, 4).map((sub) => (
                                <Text 
                                  key={sub.id}
                                  size="xs" 
                                  c="dimmed"
                                  className="hover:text-orange-600 cursor-pointer block"
                                >
                                  {isRTL ? sub.nameAr : sub.nameEn}
                                </Text>
                              ))}
                            </div>
                          )}
                        </div>
                      </Group>
                    </UnstyledButton>
                  </Grid.Col>
                ))}
              </Grid>
            </Menu.Dropdown>
          </Menu>

          <Divider orientation="vertical" color="orange.4" />

          {/* Quick Category Links */}
          <Group gap="lg" className="flex-1 hidden md:flex">
            {quickLinks.map((link, index) => (
              <UnstyledButton 
                key={index}
                className="text-white hover:text-yellow-200 transition-colors font-medium text-sm"
              >
                {isRTL ? link.nameAr : link.nameEn}
              </UnstyledButton>
            ))}
          </Group>

          {/* Promotional Badge */}
          <Box className="hidden lg:block">
            <Button 
              variant="gradient" 
              gradient={{ from: 'yellow.4', to: 'yellow.6' }}
              size="sm"
              className="text-orange-800 font-bold animate-pulse"
            >
              {isRTL ? '🎉 خصم يصل إلى 50%' : '🎉 Up to 50% OFF'}
            </Button>
          </Box>

        </Group>
      </Container>
    </div>
  );
}