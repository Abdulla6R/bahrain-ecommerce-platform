'use client';

import { Carousel } from '@mantine/carousel';
import { 
  Box, 
  Container, 
  Text, 
  Title, 
  Button, 
  Group, 
  Stack,
  Badge,
  Image,
  Overlay
} from '@mantine/core';
import { IconArrowRight, IconArrowLeft, IconStar } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface HeroCarouselProps {
  locale: string;
}

interface CarouselSlide {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  ctaAr: string;
  ctaEn: string;
  image: string;
  backgroundColor: string;
  badge?: {
    textAr: string;
    textEn: string;
    color: string;
  };
  vendor?: {
    name: string;
    rating: number;
  };
  discount?: string;
}

export function HeroCarousel({ locale }: HeroCarouselProps) {
  const t = useTranslations();
  const isRTL = locale === 'ar';

  const slides: CarouselSlide[] = [
    {
      id: '1',
      titleAr: 'أحدث الهواتف الذكية',
      titleEn: 'Latest Smartphones',
      subtitleAr: 'اكتشف أحدث التقنيات مع أفضل الأسعار في البحرين',
      subtitleEn: 'Discover the latest technology with the best prices in Bahrain',
      ctaAr: 'تسوق الآن',
      ctaEn: 'Shop Now',
      image: '/api/placeholder/800/400',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      badge: {
        textAr: 'خصم يصل إلى 30%',
        textEn: 'Up to 30% OFF',
        color: 'red'
      },
      vendor: {
        name: 'TechStore Bahrain',
        rating: 4.8
      },
      discount: '30%'
    },
    {
      id: '2',
      titleAr: 'أزياء عصرية للجميع',
      titleEn: 'Trendy Fashion for Everyone',
      subtitleAr: 'كوليكشن جديد من أفضل الماركات العالمية',
      subtitleEn: 'New collection from the world\'s best brands',
      ctaAr: 'اكتشف المجموعة',
      ctaEn: 'Explore Collection',
      image: '/api/placeholder/800/400',
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      badge: {
        textAr: 'وصل حديثاً',
        textEn: 'New Arrivals',
        color: 'green'
      },
      vendor: {
        name: 'Fashion Boutique',
        rating: 4.6
      }
    },
    {
      id: '3',
      titleAr: 'أجهزة منزلية ذكية',
      titleEn: 'Smart Home Appliances',
      subtitleAr: 'حول منزلك إلى منزل ذكي مع أحدث التقنيات',
      subtitleEn: 'Transform your home into a smart home with the latest technology',
      ctaAr: 'ابدأ التحويل',
      ctaEn: 'Start Transformation',
      image: '/api/placeholder/800/400',
      backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      badge: {
        textAr: 'توصيل مجاني',
        textEn: 'Free Delivery',
        color: 'blue'
      },
      vendor: {
        name: 'Smart Home BH',
        rating: 4.9
      }
    }
  ];

  return (
    <Box className="relative">
      <Carousel
        height={450}
        slideSize="100%"
        slideGap="md"
        withIndicators
        withControls
        classNames={{
          control: 'bg-white/90 border-0 text-orange-600 hover:bg-white hover:text-orange-700 w-12 h-12',
          indicator: 'bg-white/60 hover:bg-white data-[active]:bg-orange-500',
          indicators: 'gap-2'
        }}
        styles={{
          controls: {
            zIndex: 10
          }
        }}
      >
        {slides.map((slide) => (
          <Carousel.Slide key={slide.id}>
            <Box
              className="relative h-full rounded-lg overflow-hidden"
              style={{
                background: slide.backgroundColor
              }}
            >
              {/* Background Pattern */}
              <Box 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0), radial-gradient(circle at 75px 75px, white 2px, transparent 0)',
                  backgroundSize: '100px 100px'
                }}
              />
              
              <Container size="xl" className="relative h-full">
                <div className={`flex items-center h-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Content */}
                  <div className={`flex-1 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                    <Stack gap="md">
                      
                      {/* Badge */}
                      {slide.badge && (
                        <Badge
                          size="lg"
                          color={slide.badge.color}
                          variant="filled"
                          className="w-fit animate-pulse"
                        >
                          {isRTL ? slide.badge.textAr : slide.badge.textEn}
                        </Badge>
                      )}

                      {/* Title */}
                      <Title 
                        order={1} 
                        size="3.5rem"
                        fw={700}
                        className="leading-tight font-amiri"
                        style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {isRTL ? slide.titleAr : slide.titleEn}
                      </Title>

                      {/* Subtitle */}
                      <Text 
                        size="xl" 
                        className="leading-relaxed max-w-lg opacity-90"
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        {isRTL ? slide.subtitleAr : slide.subtitleEn}
                      </Text>

                      {/* Vendor Info */}
                      {slide.vendor && (
                        <Group gap="md" className="opacity-90">
                          <Text size="sm">
                            {isRTL ? 'بواسطة' : 'by'} <span className="font-semibold">{slide.vendor.name}</span>
                          </Text>
                          <Group gap="xs">
                            <IconStar size={16} className="text-yellow-300" fill="currentColor" />
                            <Text size="sm" fw={500}>
                              {slide.vendor.rating}
                            </Text>
                          </Group>
                        </Group>
                      )}

                      {/* CTA Button */}
                      <Group gap="md" className="mt-4">
                        <Button
                          size="lg"
                          variant="white"
                          color="dark"
                          className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          rightSection={
                            isRTL ? 
                              <IconArrowLeft size={18} /> : 
                              <IconArrowRight size={18} />
                          }
                        >
                          {isRTL ? slide.ctaAr : slide.ctaEn}
                        </Button>

                        {slide.discount && (
                          <Text size="lg" fw={700} className="text-yellow-300">
                            {isRTL ? `خصم ${slide.discount}` : `${slide.discount} OFF`}
                          </Text>
                        )}
                      </Group>

                    </Stack>
                  </div>

                  {/* Image/Visual Element */}
                  <div className="flex-1 relative hidden lg:block">
                    <Box className="relative h-80 w-full">
                      {/* Placeholder for product image */}
                      <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                        <Text size="xl" c="white" className="opacity-60">
                          {isRTL ? 'صورة المنتج' : 'Product Image'}
                        </Text>
                      </div>
                      
                      {/* Decorative elements */}
                      <Box 
                        className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-30 animate-bounce"
                        style={{ animationDelay: '0.5s', animationDuration: '3s' }}
                      />
                      <Box 
                        className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300 rounded-full opacity-30 animate-bounce"
                        style={{ animationDelay: '1s', animationDuration: '3s' }}
                      />
                    </Box>
                  </div>

                </div>
              </Container>
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}