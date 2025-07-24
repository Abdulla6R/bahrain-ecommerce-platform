'use client';

import { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  Autocomplete,
  Group,
  Text,
  Card,
  Stack,
  Badge,
  ActionIcon,
  Divider,
  Button,
  Select,
  RangeSlider,
  Checkbox,
  Paper,
  Title,
  SimpleGrid,
  Avatar,
  Highlight,
  Loader,
  Modal,
  ScrollArea
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconX,
  IconStar,
  IconHeart,
  IconShoppingCart,
  IconEye,
  IconAdjustments,
  IconCategory,
  IconCurrencyDollar,
  IconTrendingUp,
  IconClock,
  IconMapPin,
  IconLanguage
} from '@tabler/icons-react';

interface SearchEngineProps {
  locale: string;
  onSearch?: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  vendor?: string;
  rating?: number;
  inStock?: boolean;
  location?: string;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popular';
}

interface SearchResult {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  vendorAr: string;
  category: string;
  categoryAr: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  location: string;
  locationAr: string;
  tags: string[];
  tagsAr: string[];
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'vendor' | 'recent';
  text: string;
  textAr: string;
  icon?: string;
  count?: number;
}

export function SearchEngine({ locale, onSearch }: SearchEngineProps) {
  const isRTL = locale === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance',
    priceRange: [0, 1000]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mock search suggestions with Arabic support
  const mockSuggestions: SearchSuggestion[] = [
    {
      type: 'recent',
      text: 'iPhone 15 Pro',
      textAr: 'آيفون 15 برو',
      icon: '📱'
    },
    {
      type: 'category',
      text: 'Electronics',
      textAr: 'إلكترونيات',
      count: 2847,
      icon: '💻'
    },
    {
      type: 'vendor',
      text: 'TechStore Bahrain',
      textAr: 'متجر التكنولوجيا البحرين',
      count: 156,
      icon: '🏪'
    },
    {
      type: 'product',
      text: 'Samsung Galaxy S24',
      textAr: 'سامسونج جالاكسي إس 24',
      icon: '📱'
    },
    {
      type: 'category',
      text: 'Fashion & Clothing',
      textAr: 'الأزياء والملابس',
      count: 1234,
      icon: '👕'
    },
    {
      type: 'product',
      text: 'MacBook Pro M3',
      textAr: 'ماك بوك برو إم 3',
      icon: '💻'
    }
  ];

  // Mock search results with comprehensive Arabic data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      nameAr: 'آيفون 15 برو ماكس 256 جيجا',
      description: 'Latest iPhone with titanium design and advanced camera system',
      descriptionAr: 'أحدث آيفون بتصميم التيتانيوم ونظام كاميرا متطور',
      price: 499.900,
      originalPrice: 549.900,
      image: '/api/placeholder/300/300',
      vendor: 'TechStore Bahrain',
      vendorAr: 'متجر التكنولوجيا البحرين',
      category: 'Electronics',
      categoryAr: 'إلكترونيات',
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      isNew: true,
      isTrending: true,
      location: 'Manama',
      locationAr: 'المنامة',
      tags: ['smartphone', 'apple', 'ios', 'camera'],
      tagsAr: ['هاتف ذكي', 'أبل', 'iOS', 'كاميرا']
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونج جالاكسي إس 24 ألترا',
      description: 'Premium Android smartphone with S Pen and exceptional camera',
      descriptionAr: 'هاتف أندرويد متطور مع قلم S وكاميرا استثنائية',
      price: 389.900,
      image: '/api/placeholder/300/300',
      vendor: 'Electronics Plus',
      vendorAr: 'إلكترونيكس بلس',
      category: 'Electronics',
      categoryAr: 'إلكترونيات',
      rating: 4.6,
      reviewCount: 98,
      inStock: true,
      isTrending: true,
      location: 'Riffa',
      locationAr: 'الرفاع',
      tags: ['smartphone', 'samsung', 'android', 's-pen'],
      tagsAr: ['هاتف ذكي', 'سامسونج', 'أندرويد', 'قلم-S']
    },
    {
      id: '3',
      name: 'MacBook Pro M3 14-inch',
      nameAr: 'ماك بوك برو إم 3 14 بوصة',
      description: 'Professional laptop with M3 chip for creative professionals',
      descriptionAr: 'لابتوب احترافي بمعالج إم 3 للمبدعين المحترفين',
      price: 899.000,
      image: '/api/placeholder/300/300',
      vendor: 'Apple Store Bahrain',
      vendorAr: 'متجر أبل البحرين',
      category: 'Computers',
      categoryAr: 'أجهزة كمبيوتر',
      rating: 4.9,
      reviewCount: 156,
      inStock: false,
      isNew: true,
      location: 'Seef',
      locationAr: 'السيف',
      tags: ['laptop', 'apple', 'm3', 'professional'],
      tagsAr: ['لابتوب', 'أبل', 'إم3', 'احترافي']
    },
    {
      id: '4',
      name: 'AirPods Pro 3rd Generation',
      nameAr: 'إير بودز برو الجيل الثالث',
      description: 'Advanced wireless earbuds with active noise cancellation',
      descriptionAr: 'سماعات لاسلكية متطورة مع إلغاء الضوضاء النشط',
      price: 149.900,
      originalPrice: 179.900,
      image: '/api/placeholder/300/300',
      vendor: 'TechStore Bahrain',
      vendorAr: 'متجر التكنولوجيا البحرين',
      category: 'Audio',
      categoryAr: 'الصوتيات',
      rating: 4.7,
      reviewCount: 234,
      inStock: true,
      location: 'Manama',
      locationAr: 'المنامة',
      tags: ['earbuds', 'apple', 'wireless', 'noise-cancelling'],
      tagsAr: ['سماعات أذن', 'أبل', 'لاسلكي', 'إلغاء-الضوضاء']
    }
  ];

  // Advanced Arabic text processing
  const normalizeArabicText = (text: string): string => {
    return text
      .replace(/[أإآا]/g, 'ا') // Normalize Alif variations
      .replace(/[ىي]/g, 'ي') // Normalize Yaa variations  
      .replace(/[ة]/g, 'ه') // Normalize Taa Marbouta
      .replace(/[ؤئء]/g, 'ء') // Normalize Hamza variations
      .replace(/[ـ]/g, '') // Remove Tatweel
      .replace(/[\u064B-\u065F]/g, '') // Remove diacritics
      .toLowerCase()
      .trim();
  };

  const searchProducts = (query: string, searchFilters: SearchFilters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const normalizedQuery = isRTL ? normalizeArabicText(query) : query.toLowerCase();
      
      let results = mockResults.filter(product => {
        // Text matching with Arabic support
        const nameMatch = isRTL ? 
          normalizeArabicText(product.nameAr).includes(normalizedQuery) :
          product.name.toLowerCase().includes(normalizedQuery);
          
        const descMatch = isRTL ?
          normalizeArabicText(product.descriptionAr).includes(normalizedQuery) :
          product.description.toLowerCase().includes(normalizedQuery);
          
        const vendorMatch = isRTL ?
          normalizeArabicText(product.vendorAr).includes(normalizedQuery) :
          product.vendor.toLowerCase().includes(normalizedQuery);
          
        const categoryMatch = isRTL ?
          normalizeArabicText(product.categoryAr).includes(normalizedQuery) :
          product.category.toLowerCase().includes(normalizedQuery);
          
        const tagsMatch = isRTL ?
          product.tagsAr.some(tag => normalizeArabicText(tag).includes(normalizedQuery)) :
          product.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));

        return nameMatch || descMatch || vendorMatch || categoryMatch || tagsMatch;
      });

      // Apply filters
      if (searchFilters.category) {
        results = results.filter(p => p.category === searchFilters.category);
      }
      
      if (searchFilters.vendor) {
        results = results.filter(p => p.vendor === searchFilters.vendor);
      }
      
      if (searchFilters.rating) {
        results = results.filter(p => p.rating >= searchFilters.rating);
      }
      
      if (searchFilters.inStock !== undefined) {
        results = results.filter(p => p.inStock === searchFilters.inStock);
      }
      
      if (searchFilters.priceRange) {
        results = results.filter(p => 
          p.price >= searchFilters.priceRange![0] && 
          p.price <= searchFilters.priceRange![1]
        );
      }

      // Apply sorting
      switch (searchFilters.sortBy) {
        case 'price_low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'popular':
          results.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default: // relevance
          // Keep original order as it's already relevance-based
          break;
      }

      setSearchResults(results);
      setIsSearching(false);
      setShowResults(true);
      
      if (onSearch) {
        onSearch(query, searchFilters);
      }
    }, 300);
  };

  const getSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = isRTL ? normalizeArabicText(query) : query.toLowerCase();
    
    const filtered = mockSuggestions.filter(suggestion => {
      const text = isRTL ? normalizeArabicText(suggestion.textAr) : suggestion.text.toLowerCase();
      return text.includes(normalizedQuery);
    });

    setSuggestions(filtered.slice(0, 6));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query, filters);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (searchQuery.trim()) {
      searchProducts(searchQuery, updatedFilters);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-BH' : 'en-BH', {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3
    }).format(amount);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSuggestions([]);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  useEffect(() => {
    getSuggestions(searchQuery);
  }, [searchQuery, isRTL]);

  return (
    <Stack gap="lg">
      
      {/* Search Input */}
      <Card withBorder padding="lg">
        <Group gap="md">
          <Autocomplete
            ref={searchRef}
            placeholder={isRTL ? 'ابحث عن المنتجات، البائعين، الفئات...' : 'Search for products, vendors, categories...'}
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            data={suggestions.map(s => ({
              value: isRTL ? s.textAr : s.text,
              label: isRTL ? s.textAr : s.text
            }))}
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchQuery && (
                <ActionIcon variant="subtle" onClick={clearSearch}>
                  <IconX size={16} />
                </ActionIcon>
              )
            }
            size="md"
            flex={1}
            dropdownProps={{
              maxHeight: 300,
              withScrollbars: true
            }}
            renderOption={({ option }) => {
              const suggestion = suggestions.find(s => 
                (isRTL ? s.textAr : s.text) === option.value
              );
              
              if (!suggestion) return option.label;
              
              return (
                <Group gap="sm" p="xs">
                  <Text span>{suggestion.icon}</Text>
                  <div>
                    <Text size="sm">
                      <Highlight highlight={searchQuery}>
                        {isRTL ? suggestion.textAr : suggestion.text}
                      </Highlight>
                    </Text>
                    {suggestion.count && (
                      <Text size="xs" c="dimmed">
                        {suggestion.count.toLocaleString()} {isRTL ? 'نتيجة' : 'results'}
                      </Text>
                    )}
                  </div>
                  <Badge size="xs" variant="light">
                    {suggestion.type === 'product' ? (isRTL ? 'منتج' : 'Product') :
                     suggestion.type === 'category' ? (isRTL ? 'فئة' : 'Category') :
                     suggestion.type === 'vendor' ? (isRTL ? 'بائع' : 'Vendor') :
                     (isRTL ? 'حديث' : 'Recent')}
                  </Badge>
                </Group>
              );
            }}
          />
          
          <Button
            onClick={() => handleSearch(searchQuery)}
            loading={isSearching}
            leftSection={<IconSearch size={16} />}
          >
            {isRTL ? 'بحث' : 'Search'}
          </Button>
          
          <ActionIcon
            variant="outline"
            size="lg"
            onClick={() => setShowFilters(true)}
          >
            <IconFilter size={18} />
          </ActionIcon>
        </Group>

        {/* Quick Filters */}
        <Group gap="sm" mt="md">
          <Text size="sm" c="dimmed">
            {isRTL ? 'بحث سريع:' : 'Quick search:'}
          </Text>
          {['iPhone', 'Samsung', 'MacBook', 'AirPods'].map((term) => (
            <Button
              key={term}
              variant="light"
              size="xs"
              onClick={() => handleSearch(term)}
            >
              {term}
            </Button>
          ))}
        </Group>
      </Card>

      {/* Active Filters */}
      {(filters.category || filters.vendor || filters.rating || filters.inStock !== undefined) && (
        <Card withBorder padding="md">
          <Group justify="space-between" mb="sm">
            <Text fw={500} size="sm">
              {isRTL ? 'الفلاتر النشطة' : 'Active Filters'}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              onClick={() => {
                setFilters({ sortBy: 'relevance', priceRange: [0, 1000] });
                if (searchQuery) searchProducts(searchQuery, { sortBy: 'relevance', priceRange: [0, 1000] });
              }}
            >
              {isRTL ? 'مسح الكل' : 'Clear All'}
            </Button>
          </Group>
          
          <Group gap="xs">
            {filters.category && (
              <Badge variant="light" rightSection={
                <ActionIcon size="xs" onClick={() => handleFilterChange({ category: undefined })}>
                  <IconX size={10} />
                </ActionIcon>
              }>
                {filters.category}
              </Badge>
            )}
            
            {filters.vendor && (
              <Badge variant="light" rightSection={
                <ActionIcon size="xs" onClick={() => handleFilterChange({ vendor: undefined })}>
                  <IconX size={10} />
                </ActionIcon>
              }>
                {filters.vendor}
              </Badge>
            )}
            
            {filters.rating && (
              <Badge variant="light" rightSection={
                <ActionIcon size="xs" onClick={() => handleFilterChange({ rating: undefined })}>
                  <IconX size={10} />
                </ActionIcon>
              }>
                ⭐ {filters.rating}+
              </Badge>
            )}
            
            {filters.inStock !== undefined && (
              <Badge variant="light" rightSection={
                <ActionIcon size="xs" onClick={() => handleFilterChange({ inStock: undefined })}>
                  <IconX size={10} />
                </ActionIcon>
              }>
                {filters.inStock ? (isRTL ? 'متوفر' : 'In Stock') : (isRTL ? 'غير متوفر' : 'Out of Stock')}
              </Badge>
            )}
          </Group>
        </Card>
      )}

      {/* Search Results */}
      {showResults && (
        <Card withBorder padding="lg">
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={600} size="lg">
                {isRTL ? 'نتائج البحث' : 'Search Results'}
              </Text>
              <Text size="sm" c="dimmed">
                {searchResults.length.toLocaleString()} {isRTL ? 'نتيجة لـ' : 'results for'} "{searchQuery}"
              </Text>
            </div>
            
            <Select
              value={filters.sortBy}
              onChange={(value) => handleFilterChange({ sortBy: value as any })}
              data={[
                { value: 'relevance', label: isRTL ? 'الأكثر صلة' : 'Most Relevant' },
                { value: 'price_low', label: isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
                { value: 'price_high', label: isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
                { value: 'rating', label: isRTL ? 'التقييم الأعلى' : 'Highest Rated' },
                { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
                { value: 'popular', label: isRTL ? 'الأكثر شعبية' : 'Most Popular' }
              ]}
              w={200}
            />
          </Group>

          {isSearching ? (
            <Group justify="center" py="xl">
              <Loader size="md" />
              <Text>{isRTL ? 'جاري البحث...' : 'Searching...'}</Text>
            </Group>
          ) : searchResults.length === 0 ? (
            <Stack align="center" py="xl" gap="md">
              <Text size="lg" c="dimmed">
                {isRTL ? 'لم يتم العثور على نتائج' : 'No results found'}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                {isRTL 
                  ? 'جرب البحث بكلمات مختلفة أو تعديل الفلاتر'
                  : 'Try searching with different keywords or adjusting your filters'
                }
              </Text>
              <Button variant="outline" onClick={clearSearch}>
                {isRTL ? 'مسح البحث' : 'Clear Search'}
              </Button>
            </Stack>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {searchResults.map((product) => (
                <Card key={product.id} withBorder padding="md" className="hover:shadow-lg transition-shadow">
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
                        {!product.inStock && (
                          <Badge color="red" variant="filled" size="sm">
                            {isRTL ? 'نفد المخزون' : 'Out of Stock'}
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
                    <div>
                      <Text fw={500} lineClamp={2} size="sm">
                        <Highlight highlight={searchQuery}>
                          {isRTL ? product.nameAr : product.name}
                        </Highlight>
                      </Text>
                      <Text size="xs" c="dimmed">
                        {isRTL ? product.vendorAr : product.vendor}
                      </Text>
                    </div>
                    
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
                    
                    <Group gap="xs">
                      <Badge variant="light" size="xs">
                        {isRTL ? product.categoryAr : product.category}
                      </Badge>
                      <Badge variant="light" size="xs" color="gray">
                        <IconMapPin size={10} />
                        {isRTL ? product.locationAr : product.location}
                      </Badge>
                    </Group>
                    
                    <Button 
                      fullWidth 
                      size="sm"
                      disabled={!product.inStock}
                      leftSection={<IconShoppingCart size={16} />}
                    >
                      {isRTL ? 'إضافة للسلة' : 'Add to Cart'}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Card>
      )}

      {/* Advanced Filters Modal */}
      <Modal
        opened={showFilters}
        onClose={() => setShowFilters(false)}
        title={isRTL ? 'فلاتر البحث المتقدمة' : 'Advanced Search Filters'}
        size="md"
        centered
      >
        <Stack gap="lg">
          
          {/* Category Filter */}
          <div>
            <Text fw={500} mb="sm">
              {isRTL ? 'الفئة' : 'Category'}
            </Text>
            <Select
              placeholder={isRTL ? 'اختر الفئة' : 'Select category'}
              value={filters.category}
              onChange={(value) => handleFilterChange({ category: value || undefined })}
              data={[
                { value: 'Electronics', label: isRTL ? 'إلكترونيات' : 'Electronics' },
                { value: 'Fashion', label: isRTL ? 'أزياء' : 'Fashion' },
                { value: 'Home', label: isRTL ? 'منزل' : 'Home & Garden' },
                { value: 'Sports', label: isRTL ? 'رياضة' : 'Sports' },
                { value: 'Books', label: isRTL ? 'كتب' : 'Books' }
              ]}
              clearable
            />
          </div>

          {/* Price Range */}
          <div>
            <Text fw={500} mb="sm">
              {isRTL ? 'نطاق السعر (د.ب)' : 'Price Range (BHD)'}
            </Text>
            <RangeSlider
              value={filters.priceRange || [0, 1000]}
              onChange={(value) => handleFilterChange({ priceRange: value })}
              min={0}
              max={1000}
              step={10}
              marks={[
                { value: 0, label: '0' },
                { value: 250, label: '250' },
                { value: 500, label: '500' },
                { value: 750, label: '750' },
                { value: 1000, label: '1000+' }
              ]}
              mb="md"
            />
            <Group justify="space-between">
              <Text size="sm">
                {formatCurrency(filters.priceRange?.[0] || 0)}
              </Text>
              <Text size="sm">
                {formatCurrency(filters.priceRange?.[1] || 1000)}
              </Text>
            </Group>
          </div>

          {/* Vendor Filter */}
          <div>
            <Text fw={500} mb="sm">
              {isRTL ? 'البائع' : 'Vendor'}
            </Text>
            <Select
              placeholder={isRTL ? 'اختر البائع' : 'Select vendor'}
              value={filters.vendor}
              onChange={(value) => handleFilterChange({ vendor: value || undefined })}
              data={[
                { value: 'TechStore Bahrain', label: isRTL ? 'متجر التكنولوجيا البحرين' : 'TechStore Bahrain' },
                { value: 'Electronics Plus', label: isRTL ? 'إلكترونيكس بلس' : 'Electronics Plus' },
                { value: 'Apple Store Bahrain', label: isRTL ? 'متجر أبل البحرين' : 'Apple Store Bahrain' },
                { value: 'Fashion Hub', label: isRTL ? 'مركز الأزياء' : 'Fashion Hub' }
              ]}
              clearable
            />
          </div>

          {/* Rating Filter */}
          <div>
            <Text fw={500} mb="sm">
              {isRTL ? 'التقييم الأدنى' : 'Minimum Rating'}
            </Text>
            <Group gap="sm">
              {[4, 4.5, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? 'filled' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange({ 
                    rating: filters.rating === rating ? undefined : rating 
                  })}
                  leftSection={<IconStar size={14} />}
                >
                  {rating}+
                </Button>
              ))}
            </Group>
          </div>

          {/* Stock Filter */}
          <div>
            <Checkbox
              label={isRTL ? 'المنتجات المتوفرة فقط' : 'In stock items only'}
              checked={filters.inStock === true}
              onChange={(event) => handleFilterChange({ 
                inStock: event.currentTarget.checked ? true : undefined 
              })}
            />
          </div>

          <Divider />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ sortBy: 'relevance', priceRange: [0, 1000] });
                setShowFilters(false);
              }}
            >
              {isRTL ? 'إعادة تعيين' : 'Reset'}
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
            </Button>
          </Group>

        </Stack>
      </Modal>

    </Stack>
  );
}