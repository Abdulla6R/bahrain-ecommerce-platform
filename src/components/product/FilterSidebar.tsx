'use client';

import {
  Stack,
  Title,
  Text,
  Checkbox,
  RangeSlider,
  TextInput,
  Button,
  Divider,
  Group,
  Badge,
  Rating,
  Collapse,
  UnstyledButton,
  Box,
  ActionIcon,
  NumberInput
} from '@mantine/core';
import {
  IconSearch,
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconX,
  IconRefresh
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';


interface FilterSidebarProps {
  locale: string;
  onFiltersChange: (filters: Record<string, unknown>) => void;
  activeFilters?: Record<string, unknown>;
}

export function FilterSidebar({ locale, onFiltersChange }: FilterSidebarProps) {
  const isRTL = locale === 'ar';

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brand: true,
    rating: true,
    features: true,
    vendors: false
  });

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [brandSearch, setBrandSearch] = useState('');

  // Mock data - in real app this would come from API
  const categories = [
    { label: isRTL ? 'الإلكترونيات' : 'Electronics', value: 'electronics', count: 1234 },
    { label: isRTL ? 'الأزياء' : 'Fashion', value: 'fashion', count: 856 },
    { label: isRTL ? 'المنزل والحديقة' : 'Home & Garden', value: 'home', count: 567 },
    { label: isRTL ? 'الرياضة' : 'Sports', value: 'sports', count: 432 },
    { label: isRTL ? 'الجمال والعناية' : 'Beauty & Care', value: 'beauty', count: 321 },
    { label: isRTL ? 'السيارات' : 'Automotive', value: 'automotive', count: 189 },
    { label: isRTL ? 'الكتب' : 'Books', value: 'books', count: 145 }
  ];

  const brands = [
    { label: 'Apple', value: 'apple', count: 156 },
    { label: 'Samsung', value: 'samsung', count: 143 },
    { label: 'Nike', value: 'nike', count: 98 },
    { label: 'Adidas', value: 'adidas', count: 87 },
    { label: 'Sony', value: 'sony', count: 76 },
    { label: 'LG', value: 'lg', count: 65 },
    { label: 'Philips', value: 'philips', count: 54 },
    { label: 'HP', value: 'hp', count: 43 }
  ];

  const vendors = [
    { label: 'TechStore Bahrain', value: 'techstore', count: 234 },
    { label: 'Fashion Boutique', value: 'fashion-boutique', count: 187 },
    { label: 'Home Essentials', value: 'home-essentials', count: 156 },
    { label: 'Sports World BH', value: 'sports-world', count: 123 },
    { label: 'Beauty Corner', value: 'beauty-corner', count: 98 }
  ];

  const features = [
    { label: isRTL ? 'توصيل مجاني' : 'Free Shipping', value: 'free-shipping', count: 567 },
    { label: isRTL ? 'ضمان شامل' : 'Full Warranty', value: 'warranty', count: 432 },
    { label: isRTL ? 'متوفر للشحن السريع' : 'Fast Shipping', value: 'fast-shipping', count: 321 },
    { label: isRTL ? 'منتج محلي' : 'Made in Bahrain', value: 'local-product', count: 156 },
    { label: isRTL ? 'صديق للبيئة' : 'Eco-Friendly', value: 'eco-friendly', count: 87 }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (value: string) => {
    const newCategories = selectedCategories.includes(value)
      ? selectedCategories.filter(c => c !== value)
      : [...selectedCategories, value];
    setSelectedCategories(newCategories);
  };

  const handleBrandChange = (value: string) => {
    const newBrands = selectedBrands.includes(value)
      ? selectedBrands.filter(b => b !== value)
      : [...selectedBrands, value];
    setSelectedBrands(newBrands);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedVendors([]);
    setSelectedFeatures([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedBrands.length + 
    selectedVendors.length + 
    selectedFeatures.length + 
    (minRating > 0 ? 1 : 0);

  const filteredBrands = brands.filter(brand => 
    brand.label.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode 
  }) => (
    <>
      <UnstyledButton 
        onClick={() => toggleSection(sectionKey)}
        className="w-full"
      >
        <Group justify="space-between" className="w-full">
          <Text fw={500} size="sm">{title}</Text>
          {expandedSections[sectionKey] ? 
            <IconChevronUp size={16} /> : 
            <IconChevronDown size={16} />
          }
        </Group>
      </UnstyledButton>
      <Collapse in={expandedSections[sectionKey]}>
        <Box pt="sm">
          {children}
        </Box>
      </Collapse>
      <Divider my="md" />
    </>
  );

  return (
    <div className="bg-white p-4 rounded-lg border h-fit">
      
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconFilter size={20} className="text-orange-600" />
          <Title order={4}>{isRTL ? 'تصفية النتائج' : 'Filter Results'}</Title>
          {activeFiltersCount > 0 && (
            <Badge color="orange" size="sm" circle>
              {activeFiltersCount}
            </Badge>
          )}
        </Group>
        {activeFiltersCount > 0 && (
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="sm"
            onClick={clearAllFilters}
          >
            <IconRefresh size={16} />
          </ActionIcon>
        )}
      </Group>

      <Stack gap="sm">
        
        {/* Categories */}
        <FilterSection 
          title={isRTL ? 'الفئات' : 'Categories'} 
          sectionKey="categories"
        >
          <Stack gap="xs">
            {categories.map((category) => (
              <Checkbox
                key={category.value}
                label={
                  <Group justify="space-between" className="w-full">
                    <Text size="sm">{category.label}</Text>
                    <Text size="xs" c="dimmed">({category.count})</Text>
                  </Group>
                }
                checked={selectedCategories.includes(category.value)}
                onChange={() => handleCategoryChange(category.value)}
                size="sm"
                color="orange"
              />
            ))}
          </Stack>
        </FilterSection>

        {/* Price Range */}
        <FilterSection 
          title={isRTL ? 'نطاق الأسعار' : 'Price Range'} 
          sectionKey="price"
        >
          <Stack gap="md">
            <RangeSlider
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              color="orange"
              size="sm"
              className="mt-4"
            />
            <Group grow>
              <NumberInput
                label={isRTL ? 'من' : 'From'}
                value={priceRange[0]}
                onChange={(val) => setPriceRange([Number(val) || 0, priceRange[1]])}
                min={0}
                max={priceRange[1]}
                size="xs"
                rightSection={<Text size="xs" c="dimmed">{isRTL ? 'د.ب' : 'BD'}</Text>}
              />
              <NumberInput
                label={isRTL ? 'إلى' : 'To'}
                value={priceRange[1]}
                onChange={(val) => setPriceRange([priceRange[0], Number(val) || 1000])}
                min={priceRange[0]}
                max={1000}
                size="xs"
                rightSection={<Text size="xs" c="dimmed">{isRTL ? 'د.ب' : 'BD'}</Text>}
              />
            </Group>
          </Stack>
        </FilterSection>

        {/* Brands */}
        <FilterSection 
          title={isRTL ? 'العلامات التجارية' : 'Brands'} 
          sectionKey="brand"
        >
          <Stack gap="sm">
            <TextInput
              placeholder={isRTL ? 'البحث في العلامات التجارية...' : 'Search brands...'}
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              size="xs"
              leftSection={<IconSearch size={14} />}
            />
            <div className="max-h-48 overflow-y-auto">
              <Stack gap="xs">
                {filteredBrands.map((brand) => (
                  <Checkbox
                    key={brand.value}
                    label={
                      <Group justify="space-between" className="w-full">
                        <Text size="sm">{brand.label}</Text>
                        <Text size="xs" c="dimmed">({brand.count})</Text>
                      </Group>
                    }
                    checked={selectedBrands.includes(brand.value)}
                    onChange={() => handleBrandChange(brand.value)}
                    size="sm"
                    color="orange"
                  />
                ))}
              </Stack>
            </div>
          </Stack>
        </FilterSection>

        {/* Rating */}
        <FilterSection 
          title={isRTL ? 'التقييم' : 'Customer Rating'} 
          sectionKey="rating"
        >
          <Stack gap="xs">
            {[4, 3, 2, 1].map((rating) => (
              <UnstyledButton
                key={rating}
                onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                className={`p-2 rounded hover:bg-gray-50 ${minRating === rating ? 'bg-orange-50' : ''}`}
              >
                <Group gap="sm">
                  <Rating value={rating} readOnly size="sm" color="yellow" />
                  <Text size="sm">{isRTL ? 'وأكثر' : '& Up'}</Text>
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
        </FilterSection>

        {/* Features */}
        <FilterSection 
          title={isRTL ? 'المميزات' : 'Features'} 
          sectionKey="features"
        >
          <Stack gap="xs">
            {features.map((feature) => (
              <Checkbox
                key={feature.value}
                label={
                  <Group justify="space-between" className="w-full">
                    <Text size="sm">{feature.label}</Text>
                    <Text size="xs" c="dimmed">({feature.count})</Text>
                  </Group>
                }
                checked={selectedFeatures.includes(feature.value)}
                onChange={() => {
                  const newFeatures = selectedFeatures.includes(feature.value)
                    ? selectedFeatures.filter(f => f !== feature.value)
                    : [...selectedFeatures, feature.value];
                  setSelectedFeatures(newFeatures);
                }}
                size="sm"
                color="orange"
              />
            ))}
          </Stack>
        </FilterSection>

        {/* Vendors */}
        <FilterSection 
          title={isRTL ? 'المتاجر' : 'Vendors'} 
          sectionKey="vendors"
        >
          <Stack gap="xs">
            {vendors.map((vendor) => (
              <Checkbox
                key={vendor.value}
                label={
                  <Group justify="space-between" className="w-full">
                    <Text size="sm">{vendor.label}</Text>
                    <Text size="xs" c="dimmed">({vendor.count})</Text>
                  </Group>
                }
                checked={selectedVendors.includes(vendor.value)}
                onChange={() => {
                  const newVendors = selectedVendors.includes(vendor.value)
                    ? selectedVendors.filter(v => v !== vendor.value)
                    : [...selectedVendors, vendor.value];
                  setSelectedVendors(newVendors);
                }}
                size="sm"
                color="orange"
              />
            ))}
          </Stack>
        </FilterSection>

        {/* Apply Filters Button */}
        <Button
          color="orange"
          fullWidth
          size="sm"
          onClick={() => onFiltersChange({
            categories: selectedCategories,
            brands: selectedBrands,
            vendors: selectedVendors,
            features: selectedFeatures,
            priceRange,
            minRating
          })}
        >
          {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="subtle"
            color="gray"
            fullWidth
            size="sm"
            onClick={clearAllFilters}
            leftSection={<IconX size={14} />}
          >
            {isRTL ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
          </Button>
        )}

      </Stack>
    </div>
  );
}