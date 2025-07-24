'use client';

import { Container, Grid, Stack, Group, Title, Text, Button, Pagination } from '@mantine/core';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from '../product/FilterSidebar';
import { useState } from 'react';

interface Product {
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
}

interface ProductCatalogProps {
  locale: string;
  initialProducts?: Product[];
  category?: string;
  searchQuery?: string;
}

export function ProductCatalog({ 
  locale, 
  initialProducts = [], 
  category, 
  searchQuery 
}: ProductCatalogProps) {
  const isRTL = locale === 'ar';
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock products for demonstration
  const mockProducts: Product[] = Array.from({ length: 24 }, (_, index) => ({
    id: `product-${index}`,
    nameAr: `منتج رائع رقم ${index + 1}`,
    nameEn: `Amazing Product ${index + 1}`,
    price: 25.500 + (index * 8.750),
    originalPrice: index % 3 === 0 ? 35.000 + (index * 8.750) : undefined,
    image: '/api/placeholder/300/300',
    vendor: {
      name: `متجر البحرين ${(index % 5) + 1}`,
      rating: 4.2 + ((index % 8) * 0.1)
    },
    rating: 4.0 + ((index % 10) * 0.1),
    reviewCount: 15 + (index * 3),
    discount: index % 3 === 0 ? 20 + (index % 4 * 5) : undefined,
    badges: index % 4 === 0 ? [
      { textAr: 'عرض محدود', textEn: 'Limited Offer', color: 'red' }
    ] : undefined,
    freeShipping: index % 2 === 0,
    hasWarranty: index % 3 !== 0,
    stock: index === 7 ? 3 : 15 + index
  }));

  const products = initialProducts.length > 0 ? initialProducts : mockProducts;
  const productsPerPage = 12;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  const handleToggleWishlist = (productId: string) => {
    console.log('Toggle wishlist:', productId);
  };

  const handleQuickView = (productId: string) => {
    console.log('Quick view:', productId);
  };

  const handleFiltersChange = (filters: Record<string, unknown>) => {
    console.log('Filters changed:', filters);
  };

  const sortOptions = [
    { value: 'relevance', label: isRTL ? 'الأكثر صلة' : 'Most Relevant' },
    { value: 'price_asc', label: isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { value: 'price_desc', label: isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
    { value: 'name_asc', label: isRTL ? 'الاسم: أ - ي' : 'Name: A - Z' },
    { value: 'rating', label: isRTL ? 'الأعلى تقييماً' : 'Highest Rated' },
    { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
  ];

  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">
        
        {/* Filter Sidebar */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterSidebar 
            locale={locale} 
            onFiltersChange={handleFiltersChange}
          />
        </Grid.Col>

        {/* Product Grid */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack gap="md">
            
            {/* Header */}
            <Group justify="space-between" align="center">
              <div>
                <Title order={2} size="h3">
                  {category 
                    ? (isRTL ? `منتجات ${category}` : `${category} Products`)
                    : (isRTL ? 'جميع المنتجات' : 'All Products')
                  }
                </Title>
                {searchQuery && (
                  <Text c="dimmed" size="sm" mt="xs">
                    {isRTL 
                      ? `نتائج البحث عن "${searchQuery}"` 
                      : `Search results for "${searchQuery}"`
                    }
                  </Text>
                )}
                <Text c="dimmed" size="sm" mt="xs">
                  {isRTL 
                    ? `${products.length} منتج موجود`
                    : `${products.length} products found`
                  }
                </Text>
              </div>

              {/* Sort and View Controls */}
              <Group gap="sm">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <Group gap="xs">
                  <Button
                    variant={viewMode === 'grid' ? 'filled' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    color="orange"
                  >
                    {isRTL ? 'شبكة' : 'Grid'}
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'filled' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    color="orange"
                  >
                    {isRTL ? 'قائمة' : 'List'}
                  </Button>
                </Group>
              </Group>
            </Group>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      locale={locale}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      onQuickView={handleQuickView}
                      isInWishlist={Math.random() > 0.7} // Random for demo
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Group justify="center" mt="xl">
                    <Pagination
                      value={currentPage}
                      onChange={setCurrentPage}
                      total={totalPages}
                      color="orange"
                      size="md"
                      withEdges
                      siblings={1}
                      boundaries={1}
                    />
                  </Group>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Title order={3} c="dimmed" mb="md">
                  {isRTL ? 'لم يتم العثور على منتجات' : 'No Products Found'}
                </Title>
                <Text c="dimmed" mb="lg">
                  {isRTL 
                    ? 'جرب تعديل فلاتر البحث أو تصفح الفئات المختلفة'
                    : 'Try adjusting your search filters or browse different categories'
                  }
                </Text>
                <Button color="orange" onClick={() => window.location.reload()}>
                  {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                </Button>
              </div>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}