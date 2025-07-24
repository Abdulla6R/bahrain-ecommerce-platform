'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  AppShell,
  Container,
  Group,
  TextInput,
  Button,
  Menu,
  ActionIcon,
  Badge,
  Avatar,
  Indicator,
  UnstyledButton,
  Text,
  Tooltip,
  Burger,
  Drawer,
  Stack,
  Divider,
  Image,
  Autocomplete,
  Box,
  Flex,
  Select,
} from '@mantine/core';
import { useDisclosure, useHotkeys, useLocalStorage } from '@mantine/hooks';
import { spotlight, SpotlightActionData } from '@mantine/spotlight';
import {
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconLanguage,
  IconHeart,
  IconBell,
  IconMapPin,
  IconPhone,
  IconMenu2,
  IconHome,
  IconTags,
  IconGift,
  IconHelp,
  IconLogout,
  IconSettings,
  IconPackage,
  IconStar,
  IconCrown,
  IconWorld,
  IconChevronDown,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

// Types
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
}

interface HeaderProps {
  user?: User | null;
  cartItems?: CartItem[];
  wishlistCount?: number;
  notificationCount?: number;
}

export function Header({
  user,
  cartItems = [],
  wishlistCount = 0,
  notificationCount = 0,
}: HeaderProps) {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = locale === 'ar';
  
  const [opened, { toggle, close }] = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>({
    key: 'recent-searches',
    defaultValue: [],
  });
  
  const isLoggedIn = !!user;

  // Calculate cart totals
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Membership tier colors
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'grape';
      case 'gold': return 'yellow';
      case 'silver': return 'gray';
      default: return 'orange';
    }
  };

  // Mock categories for dropdown
  const categories = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'electronics', label: isRTL ? 'الإلكترونيات' : 'Electronics' },
    { value: 'fashion', label: isRTL ? 'الأزياء' : 'Fashion' },
    { value: 'home', label: isRTL ? 'المنزل والحديقة' : 'Home & Garden' },
    { value: 'sports', label: isRTL ? 'الرياضة' : 'Sports' },
    { value: 'beauty', label: isRTL ? 'الجمال والعناية' : 'Beauty & Care' }
  ];

  // Language switcher
  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const currentPath = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPath}`);
  };

  // Search functionality
  const handleSearch = async (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedRecent);
      
      // Navigate to search results
      router.push(`/${locale}/search?q=${encodeURIComponent(query)}&category=${selectedCategory}`);
      setSearchQuery('');
    }
  };

  // Search suggestions API call
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
          const suggestions = await response.json();
          setSearchSuggestions(suggestions.slice(0, 8));
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      } else {
        setSearchSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, locale]);

  // Spotlight search actions
  const spotlightActions: SpotlightActionData[] = [
    {
      id: 'home',
      label: t('navigation.home'),
      description: t('navigation.homeDesc'),
      onClick: () => router.push(`/${locale}`),
      leftSection: <IconHome size={18} />,
    },
    {
      id: 'categories',
      label: t('navigation.categories'),
      description: t('navigation.categoriesDesc'),
      onClick: () => router.push(`/${locale}/categories`),
      leftSection: <IconTags size={18} />,
    },
    {
      id: 'deals',
      label: t('navigation.deals'),
      description: t('navigation.dealsDesc'),
      onClick: () => router.push(`/${locale}/deals`),
      leftSection: <IconGift size={18} />,
    },
  ];

  // Hotkeys
  useHotkeys([
    ['mod+K', () => spotlight.open()],
    ['mod+/', () => document.getElementById('search-input')?.focus()],
  ]);

  return (
    <header className="bg-white border-b-2 border-orange-100 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-orange-50 border-b">
        <Container size="xl" py={4}>
          <Group justify="space-between" align="center">
            <Group gap="md">
              <Group gap="xs">
                <IconMapPin size={16} className="text-orange-600" />
                <Text size="sm" c="dimmed">
                  {isRTL ? 'توصيل إلى البحرين' : 'Deliver to Bahrain'}
                </Text>
              </Group>
            </Group>
            
            <Group gap="md">
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconWorld size={14} />}
                onClick={switchLanguage}
                className="text-orange-700 hover:bg-orange-100"
              >
                {locale === 'ar' ? 'English' : 'العربية'}
              </Button>
              
              {isLoggedIn ? (
                <Group gap="sm">
                  <Text size="sm" c="dimmed">
                    {isRTL ? `مرحباً، ${user?.name}` : `Hello, ${user?.name}`}
                  </Text>
                </Group>
              ) : (
                <Group gap="sm">
                  <Button variant="subtle" size="xs" className="text-orange-700">
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </Button>
                  <Divider orientation="vertical" />
                  <Button variant="subtle" size="xs" className="text-orange-700">
                    {isRTL ? 'إنشاء حساب' : 'Register'}
                  </Button>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </div>

      {/* Main Header */}
      <Container size="xl" py="md">
        <Group justify="space-between" align="center" h={50}>
          
          {/* Mobile Menu Button + Logo */}
          <Group gap="xs" className="flex-shrink-0">
            <Burger 
              opened={opened} 
              onClick={toggle} 
              size="sm" 
              className="md:hidden"
              aria-label={t('openMenu')}
            />
            <UnstyledButton onClick={() => router.push(`/${locale}`)}>
              <Group gap="xs">
                <Box className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-md">
                  <Text 
                    size="xl" 
                    fw={700} 
                    c="white"
                    className="font-amiri"
                  >
                    {isRTL ? 'تندز' : 'Tendzd'}
                  </Text>
                </Box>
                <Text size="xs" c="dimmed" className="hidden md:block">
                  .bh
                </Text>
              </Group>
            </UnstyledButton>
          </Group>

          {/* Search Bar */}
          <Flex 
            className="flex-1 max-w-2xl mx-4" 
            align="stretch"
            direction={isRTL ? 'row-reverse' : 'row'}
          >
            <Select
              data={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder={isRTL ? 'الفئات' : 'Categories'}
              className="w-40"
              styles={{
                input: {
                  borderRadius: isRTL ? '0 6px 6px 0' : '6px 0 0 6px',
                  borderRight: isRTL ? '1px solid #dee2e6' : 'none',
                  borderLeft: isRTL ? 'none' : '1px solid #dee2e6',
                  backgroundColor: '#fff8e1',
                  fontSize: '14px'
                }
              }}
            />
            
            <Autocomplete
              id="search-input"
              data={[...recentSearches, ...searchSuggestions]}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={isRTL ? 'ابحث في تندز...' : 'Search Tendzd...'}
              className="flex-1"
              styles={{
                input: {
                  borderRadius: '0',
                  borderLeft: isRTL ? '1px solid #dee2e6' : 'none',
                  borderRight: isRTL ? 'none' : '1px solid #dee2e6',
                  fontSize: '16px',
                  padding: '0 12px'
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              dir={isRTL ? 'rtl' : 'ltr'}
              maxDropdownHeight={300}
            />
            
            <ActionIcon
              size={42}
              color="orange"
              onClick={() => handleSearch(searchQuery)}
              className={isRTL ? 'rounded-l-md rounded-r-none' : 'rounded-r-md rounded-l-none'}
              style={{
                borderRadius: isRTL ? '6px 0 0 6px' : '0 6px 6px 0',
              }}
            >
              <IconSearch size={18} />
            </ActionIcon>
          </Flex>

          {/* Right Actions */}
          <Group gap="md" className="flex-shrink-0">
            
            {/* Notifications */}
            {user && (
              <Tooltip label={t('notifications')}>
                <Indicator label={notificationCount} size={16} disabled={notificationCount === 0}>
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={() => router.push(`/${locale}/notifications`)}
                    className="hidden md:flex text-gray-700 hover:bg-orange-50"
                  >
                    <IconBell size={20} />
                  </ActionIcon>
                </Indicator>
              </Tooltip>
            )}

            {/* Wishlist */}
            <Tooltip label={t('wishlist')}>
              <Indicator label={wishlistCount} size={16} disabled={wishlistCount === 0}>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  onClick={() => router.push(`/${locale}/wishlist`)}
                  className="hidden md:flex text-gray-700 hover:bg-orange-50"
                >
                  <IconHeart size={20} />
                </ActionIcon>
              </Indicator>
            </Tooltip>

            {/* Shopping Cart */}
            <Tooltip label={`${t('cart')} • ${cartTotal.toFixed(3)} ${t('currency')}`}>
              <UnstyledButton 
                className="relative"
                onClick={() => router.push(`/${locale}/cart`)}
              >
                <Group gap="xs" className="hover:bg-orange-50 p-2 rounded-md">
                  <div className="relative">
                    <IconShoppingCart size={24} className="text-gray-700" />
                    {cartCount > 0 && (
                      <Badge
                        size="sm"
                        color="orange"
                        className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </Badge>
                    )}
                  </div>
                  <div className="hidden md:block text-right">
                    <Text size="xs" c="dimmed">
                      {isRTL ? 'السلة' : 'Cart'}
                    </Text>
                    <Text size="sm" fw={500}>
                      {cartCount} {isRTL ? 'عنصر' : 'items'}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Tooltip>

            {/* User Menu */}
            <Menu position="bottom-end" width={250}>
              <Menu.Target>
                <UnstyledButton className="hover:bg-orange-50 p-2 rounded-md">
                  <Group gap="xs">
                    {user ? (
                      <Avatar 
                        size="sm" 
                        src={user.avatar} 
                        alt={user.name}
                        className="border-2 border-orange-200"
                      >
                        <IconUser size={16} />
                      </Avatar>
                    ) : (
                      <Avatar size="sm" className="bg-orange-100 text-orange-700">
                        <IconUser size={16} />
                      </Avatar>
                    )}
                    <div className="hidden md:block text-right">
                      <Text size="xs" c="dimmed">
                        {isRTL ? 'مرحباً' : 'Hello'}
                      </Text>
                      <Group gap={4}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {user ? user.name : (isRTL ? 'تسجيل دخول' : 'Sign in')}
                        </Text>
                        {user && (
                          <IconCrown size={12} color={getTierColor(user.membershipTier)} />
                        )}
                        <IconChevronDown size={14} />
                      </Group>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                {user ? (
                  <>
                    <Menu.Item
                      leftSection={<IconUser size={16} />}
                      onClick={() => router.push(`/${locale}/account`)}
                    >
                      {t('myAccount')}
                    </Menu.Item>
                    
                    <Menu.Item
                      leftSection={<IconPackage size={16} />}
                      onClick={() => router.push(`/${locale}/orders`)}
                    >
                      {t('myOrders')}
                    </Menu.Item>
                    
                    <Menu.Item
                      leftSection={<IconStar size={16} />}
                      rightSection={
                        <Badge size="xs" variant="light" color={getTierColor(user.membershipTier)}>
                          {user.loyaltyPoints}
                        </Badge>
                      }
                      onClick={() => router.push(`/${locale}/loyalty`)}
                    >
                      {t('loyaltyPoints')}
                    </Menu.Item>
                    
                    <Menu.Item
                      leftSection={<IconHeart size={16} />}
                      rightSection={
                        wishlistCount > 0 ? (
                          <Badge size="xs" variant="light">
                            {wishlistCount}
                          </Badge>
                        ) : undefined
                      }
                      onClick={() => router.push(`/${locale}/wishlist`)}
                    >
                      {t('wishlist')}
                    </Menu.Item>
                    
                    <Menu.Item
                      leftSection={<IconSettings size={16} />}
                      onClick={() => router.push(`/${locale}/settings`)}
                    >
                      {t('settings')}
                    </Menu.Item>
                    
                    <Menu.Divider />
                    
                    <Menu.Item
                      leftSection={<IconHelp size={16} />}
                      onClick={() => router.push(`/${locale}/help`)}
                    >
                      {t('help')}
                    </Menu.Item>
                    
                    <Menu.Item
                      leftSection={<IconLogout size={16} />}
                      color="red"
                      onClick={() => {
                        // Handle logout
                        notifications.show({
                          title: t('loggedOut'),
                          message: t('loggedOutMessage'),
                          color: 'blue'
                        });
                        router.push(`/${locale}/auth/login`);
                      }}
                    >
                      {t('logout')}
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item className="p-3">
                      <Text size="sm" fw={500} mb="xs">
                        {t('signInPrompt')}
                      </Text>
                      <Button 
                        fullWidth 
                        color="orange"
                        size="sm"
                        onClick={() => router.push(`/${locale}/auth/login`)}
                      >
                        {t('login')}
                      </Button>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick={() => router.push(`/${locale}/auth/register`)}>
                      {t('register')}
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>

          </Group>
        </Group>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        position={isRTL ? 'right' : 'left'}
        size="sm"
        padding="md"
        title={
          <Group>
            <Box className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-md">
              <Text 
                size="lg" 
                fw={700} 
                c="white"
                className="font-amiri"
              >
                {isRTL ? 'تندز' : 'Tendzd'}
              </Text>
            </Box>
          </Group>
        }
      >
        <Stack gap="md">
          {/* Mobile Search */}
          <Autocomplete
            placeholder={t('searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            data={[...recentSearches, ...searchSuggestions]}
            value={searchQuery}
            onChange={setSearchQuery}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />

          <Divider />

          {/* Navigation Links */}
          <UnstyledButton
            onClick={() => {
              router.push(`/${locale}`);
              close();
            }}
            className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Group>
              <IconHome size={20} />
              <Text>{t('navigation.home')}</Text>
            </Group>
          </UnstyledButton>

          <UnstyledButton
            onClick={() => {
              router.push(`/${locale}/categories`);
              close();
            }}
            className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Group>
              <IconTags size={20} />
              <Text>{t('navigation.categories')}</Text>
            </Group>
          </UnstyledButton>

          <UnstyledButton
            onClick={() => {
              router.push(`/${locale}/deals`);
              close();
            }}
            className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Group>
              <IconGift size={20} />
              <Text>{t('navigation.deals')}</Text>
            </Group>
          </UnstyledButton>

          <Divider />

          {/* Language Toggle */}
          <UnstyledButton
            onClick={() => {
              switchLanguage();
              close();
            }}
            className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Group>
              <IconLanguage size={20} />
              <Text>{locale === 'ar' ? 'English' : 'العربية'}</Text>
            </Group>
          </UnstyledButton>

          {/* Location */}
          <UnstyledButton className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Group>
              <IconMapPin size={20} />
              <Stack gap={0}>
                <Text size="sm">{t('deliverTo')}</Text>
                <Text size="xs" c="dimmed">
                  {t('bahrain')}
                </Text>
              </Stack>
            </Group>
          </UnstyledButton>

          {/* Contact */}
          <UnstyledButton className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Group>
              <IconPhone size={20} />
              <Stack gap={0}>
                <Text size="sm">{t('customerService')}</Text>
                <Text size="xs" c="dimmed" dir="ltr">
                  +973 1234 5678
                </Text>
              </Stack>
            </Group>
          </UnstyledButton>
        </Stack>
      </Drawer>

      {/* Spotlight Search */}
      <Spotlight
        actions={spotlightActions}
        nothingFound={t('noResults')}
        highlightQuery
        searchProps={{
          placeholder: t('spotlightPlaceholder'),
          leftSection: <IconSearch size={16} />,
        }}
      />
    </header>
  );
}