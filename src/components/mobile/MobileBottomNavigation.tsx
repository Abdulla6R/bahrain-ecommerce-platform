'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Group,
  Stack,
  Text,
  ActionIcon,
  Badge,
  UnstyledButton,
  Indicator,
  Transition,
  Box,
  Tooltip
} from '@mantine/core';
import {
  IconHome,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconHeart,
  IconBell,
  IconCategory,
  IconTrendingUp,
  IconGift,
  IconMapPin
} from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationItem {
  id: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  label: string;
  labelAr: string;
  href: string;
  color: string;
  badge?: number;
  isMain?: boolean;
  description?: string;
  descriptionAr?: string;
}

interface MobileBottomNavigationProps {
  locale: string;
  cartCount?: number;
  wishlistCount?: number;
  notificationCount?: number;
  currentUserId?: string;
  userRole?: 'customer' | 'vendor' | 'admin';
}

export function MobileBottomNavigation({
  locale,
  cartCount = 0,
  wishlistCount = 0,
  notificationCount = 0,
  currentUserId,
  userRole = 'customer'
}: MobileBottomNavigationProps) {
  const isRTL = locale === 'ar';
  const router = useRouter();
  const pathname = usePathname();
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expandedMode, setExpandedMode] = useState(false);

  // Main navigation items (always visible)
  const mainNavigationItems: NavigationItem[] = [
    {
      id: 'home',
      icon: IconHome,
      label: 'Home',
      labelAr: 'الرئيسية',
      href: '/',
      color: 'orange',
      isMain: true,
      description: 'Browse latest products',
      descriptionAr: 'تصفح أحدث المنتجات'
    },
    {
      id: 'categories',
      icon: IconCategory,
      label: 'Categories',
      labelAr: 'التصنيفات',
      href: '/categories',
      color: 'blue',
      isMain: true,
      description: 'Shop by category',
      descriptionAr: 'تسوق حسب التصنيف'
    },
    {
      id: 'search',
      icon: IconSearch,
      label: 'Search',
      labelAr: 'البحث',
      href: '/search',
      color: 'teal',
      isMain: true,
      description: 'Find products',
      descriptionAr: 'البحث عن المنتجات'
    },
    {
      id: 'cart',
      icon: IconShoppingCart,
      label: 'Cart',
      labelAr: 'السلة',
      href: '/cart',
      color: 'green',
      badge: cartCount,
      isMain: true,
      description: 'Review items',
      descriptionAr: 'مراجعة العناصر'
    },
    {
      id: 'account',
      icon: IconUser,
      label: 'Account',
      labelAr: 'حسابي',
      href: '/account',
      color: 'purple',
      isMain: true,
      description: 'Manage profile',
      descriptionAr: 'إدارة الملف الشخصي'
    }
  ];

  // Additional quick access items (expandable menu)
  const quickAccessItems: NavigationItem[] = [
    {
      id: 'wishlist',
      icon: IconHeart,
      label: 'Wishlist',
      labelAr: 'المفضلة',
      href: '/wishlist',
      color: 'red',
      badge: wishlistCount,
      description: 'Saved items',
      descriptionAr: 'العناصر المحفوظة'
    },
    {
      id: 'notifications',
      icon: IconBell,
      label: 'Notifications',
      labelAr: 'الإشعارات',
      href: '/notifications',
      color: 'yellow',
      badge: notificationCount,
      description: 'Latest updates',
      descriptionAr: 'آخر التحديثات'
    },
    {
      id: 'trending',
      icon: IconTrendingUp,
      label: 'Trending',
      labelAr: 'الأكثر رواجًا',
      href: '/trending',
      color: 'pink',
      description: 'Popular products',
      descriptionAr: 'المنتجات الرائجة'
    },
    {
      id: 'offers',
      icon: IconGift,
      label: 'Offers',
      labelAr: 'العروض',
      href: '/offers',
      color: 'indigo',
      description: 'Special deals',
      descriptionAr: 'العروض الخاصة'
    },
    {
      id: 'stores',
      icon: IconMapPin,
      label: 'Local Stores',
      labelAr: 'المتاجر المحلية',
      href: '/stores',
      color: 'cyan',
      description: 'Nearby vendors',
      descriptionAr: 'البائعون القريبون'
    }
  ];

  // Handle scroll-based hide/show
  useEffect(() => {
    const controlNavigation = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Show navigation when scrolling up or at top
        if (currentScrollY < lastScrollY || currentScrollY < 10) {
          setIsVisible(true);
        } 
        // Hide when scrolling down (but not if expanded)
        else if (currentScrollY > lastScrollY && currentScrollY > 100 && !expandedMode) {
          setIsVisible(false);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    const throttleControl = throttle(controlNavigation, 100);
    window.addEventListener('scroll', throttleControl);
    
    return () => window.removeEventListener('scroll', throttleControl);
  }, [lastScrollY, expandedMode]);

  // Haptic feedback for supported devices
  const triggerHapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [5],
        medium: [10],
        heavy: [15, 5, 15]
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  // Handle navigation with haptic feedback and analytics
  const handleNavigate = useCallback((item: NavigationItem) => {
    triggerHapticFeedback('light');
    
    // Track navigation analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'navigation_click', {
        item_id: item.id,
        item_name: item.label,
        user_role: userRole,
        locale: locale
      });
    }
    
    // Close expanded mode when navigating
    setExpandedMode(false);
    
    // Navigate to the route
    router.push(item.href);
  }, [router, userRole, locale, triggerHapticFeedback]);

  // Check if current route matches navigation item
  const isActiveRoute = useCallback((href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  }, [pathname]);

  // Toggle expanded mode
  const toggleExpandedMode = useCallback(() => {
    setExpandedMode(!expandedMode);
    triggerHapticFeedback('medium');
  }, [expandedMode, triggerHapticFeedback]);

  // Get current label text
  const getCurrentLabel = useCallback((item: NavigationItem) => {
    return isRTL ? item.labelAr : item.label;
  }, [isRTL]);

  // Get current description text
  const getCurrentDescription = useCallback((item: NavigationItem) => {
    return isRTL ? (item.descriptionAr || item.labelAr) : (item.description || item.label);
  }, [isRTL]);

  return (
    <Transition
      mounted={isVisible}
      transition="slide-up"
      duration={200}
      timingFunction="ease-out"
    >
      {(styles) => (
        <Box
          style={{
            ...styles,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
          className="sm:hidden"
        >
          {/* Expanded Menu Overlay */}
          <Transition
            mounted={expandedMode}
            transition="slide-up"
            duration={300}
          >
            {(overlayStyles) => (
              <Paper
                style={{
                  ...overlayStyles,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(16px)',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px'
                }}
                shadow="xl"
                p="lg"
                className="border-t"
              >
                <Stack gap="sm">
                  <Text
                    fw={600}
                    size="lg"
                    ta="center"
                    c="dimmed"
                    mb="xs"
                  >
                    {isRTL ? 'الوصول السريع' : 'Quick Access'}
                  </Text>
                  
                  <Group justify="space-around" gap="xs">
                    {quickAccessItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.href);
                      
                      return (
                        <Tooltip
                          key={item.id}
                          label={getCurrentDescription(item)}
                          position="top"
                          withArrow
                          color={item.color}
                        >
                          <UnstyledButton
                            onClick={() => handleNavigate(item)}
                            className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 touch-manipulation"
                            style={{
                              backgroundColor: isActive 
                                ? `var(--mantine-color-${item.color}-1)` 
                                : 'transparent',
                              transform: isActive ? 'scale(1.05)' : 'scale(1)',
                              minWidth: '56px'
                            }}
                          >
                            <Indicator
                              color={item.color}
                              disabled={!item.badge || item.badge === 0}
                              label={item.badge}
                              size={16}
                              offset={8}
                            >
                              <Icon
                                size={20}
                                stroke={1.5}
                                color={isActive 
                                  ? `var(--mantine-color-${item.color}-6)` 
                                  : 'var(--mantine-color-gray-6)'
                                }
                              />
                            </Indicator>
                            <Text
                              size="xs"
                              fw={isActive ? 600 : 400}
                              c={isActive ? `${item.color}.6` : 'gray.6'}
                              mt={4}
                              ta="center"
                              lineClamp={1}
                            >
                              {getCurrentLabel(item)}
                            </Text>
                          </UnstyledButton>
                        </Tooltip>
                      );
                    })}
                  </Group>
                </Stack>
              </Paper>
            )}
          </Transition>

          {/* Main Navigation Bar */}
          <Paper
            shadow="xl"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--mantine-color-gray-2)'
            }}
            p={0}
          >
            <Group justify="space-around" gap="xs" p="xs">
              {mainNavigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Tooltip
                    key={item.id}
                    label={getCurrentDescription(item)}
                    position="top"
                    withArrow
                    color={item.color}
                    disabled={isActive}
                  >
                    <UnstyledButton
                      onClick={() => handleNavigate(item)}
                      className="flex flex-col items-center p-2 rounded-xl transition-all duration-200 touch-manipulation"
                      style={{
                        backgroundColor: isActive 
                          ? `var(--mantine-color-${item.color}-0)` 
                          : 'transparent',
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                        minWidth: '60px',
                        position: 'relative'
                      }}
                      aria-label={getCurrentLabel(item)}
                      role="tab"
                      aria-selected={isActive}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <Box
                          style={{
                            position: 'absolute',
                            top: -2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '24px',
                            height: '3px',
                            backgroundColor: `var(--mantine-color-${item.color}-6)`,
                            borderRadius: '2px'
                          }}
                        />
                      )}
                      
                      <Indicator
                        color={item.color}
                        disabled={!item.badge || item.badge === 0}
                        label={item.badge > 99 ? '99+' : item.badge}
                        size={18}
                        offset={7}
                      >
                        <Icon
                          size={24}
                          stroke={1.5}
                          color={isActive 
                            ? `var(--mantine-color-${item.color}-6)` 
                            : 'var(--mantine-color-gray-6)'
                          }
                        />
                      </Indicator>
                      
                      <Text
                        size="xs"
                        fw={isActive ? 700 : 500}
                        c={isActive ? `${item.color}.6` : 'gray.6'}
                        mt={4}
                        ta="center"
                        lineClamp={1}
                        style={{
                          fontSize: '11px',
                          letterSpacing: isActive ? '0.5px' : 'normal'
                        }}
                      >
                        {getCurrentLabel(item)}
                      </Text>
                    </UnstyledButton>
                  </Tooltip>
                );
              })}
              
              {/* Quick Access Toggle Button */}
              <Tooltip
                label={isRTL ? 'المزيد من الخيارات' : 'More Options'}
                position="top"
                withArrow
                color="gray"
              >
                <ActionIcon
                  onClick={toggleExpandedMode}
                  size={48}
                  variant="light"
                  color="gray"
                  radius="xl"
                  className="touch-manipulation"
                  style={{
                    transform: expandedMode ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                  aria-label={isRTL ? 'المزيد' : 'More'}
                >
                  <Stack gap={1} align="center">
                    <Box w={3} h={3} bg="gray.6" style={{ borderRadius: '50%' }} />
                    <Box w={3} h={3} bg="gray.6" style={{ borderRadius: '50%' }} />
                    <Box w={3} h={3} bg="gray.6" style={{ borderRadius: '50%' }} />
                  </Stack>
                </ActionIcon>
              </Tooltip>
            </Group>
          </Paper>

          {/* Accessibility Enhancement */}
          <div
            role="navigation"
            aria-label={isRTL ? 'التنقل الرئيسي للموقع' : 'Main site navigation'}
            className="sr-only"
          >
            <ul>
              {mainNavigationItems.map((item) => (
                <li key={item.id}>
                  <a href={item.href} aria-current={isActiveRoute(item.href) ? 'page' : undefined}>
                    {getCurrentLabel(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Box>
      )}
    </Transition>
  );
}

// Utility function for throttling scroll events
function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

// Enhanced version with custom hook for better performance
export function useMobileNavigation(locale: string) {
  const [navigationState, setNavigationState] = useState({
    isVisible: true,
    expandedMode: false,
    lastScrollY: 0
  });

  const updateNavigationVisibility = useCallback((visible: boolean) => {
    setNavigationState(prev => ({ ...prev, isVisible: visible }));
  }, []);

  const toggleExpandedMode = useCallback(() => {
    setNavigationState(prev => ({ 
      ...prev, 
      expandedMode: !prev.expandedMode 
    }));
  }, []);

  return {
    ...navigationState,
    updateNavigationVisibility,
    toggleExpandedMode
  };
}