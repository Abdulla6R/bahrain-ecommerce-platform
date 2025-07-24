import { Container, Stack, Skeleton } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { CategoryGrid } from '@/components/ui/CategoryGrid';
import { DealsSection } from '@/components/ui/DealsSection';
import { FeaturedProducts } from '@/components/ui/FeaturedProducts';
import { VendorShowcase } from '@/components/ui/VendorShowcase';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="xl" px="md" py="lg">
        <Stack gap="xl">
          {/* Hero Section */}
          <HeroCarousel locale={locale} />
          
          {/* Quick Categories */}
          <CategoryGrid locale={locale} />
          
          {/* Flash Deals Section */}
          <DealsSection locale={locale} />
          
          {/* Featured Products */}
          <FeaturedProducts 
            title={t('featuredProducts')}
            subtitle={t('featuredProductsSubtitle')}
            locale={locale} 
          />
          
          {/* Vendor Showcase */}
          <VendorShowcase locale={locale} />
          
          {/* New Arrivals */}
          <FeaturedProducts 
            title={t('newArrivals')}
            subtitle={t('newArrivalsSubtitle')}
            filter="new_arrivals"
            locale={locale} 
          />
          
          {/* Made in Bahrain Section */}
          <FeaturedProducts 
            title={t('madeInBahrain')}
            subtitle={t('madeInBahrainSubtitle')}
            filter="made_in_bahrain"
            locale={locale}
            bgColor="tendzd-yellow.0"
          />
        </Stack>
      </Container>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: `/og-home-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
  };
}