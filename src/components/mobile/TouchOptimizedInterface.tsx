'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppShell,
  Container,
  Group,
  Stack,
  Text,
  ActionIcon,
  Badge,
  Card,
  Button,
  TextInput,
  Drawer,
  ScrollArea,
  Avatar,
  Divider,
  UnstyledButton,
  Indicator,
  Transition,
  Paper,
  Overlay
} from '@mantine/core';
import {
  IconHome,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconMenu2,
  IconHeart,
  IconBell,
  IconChevronUp,
  IconFilter,
  IconShare,
  IconPhone,
  IconMail,
  IconMapPin,
  IconLanguage,
  IconMoon,
  IconSun
} from '@tabler/icons-react';

interface TouchOptimizedInterfaceProps {
  locale: string;
  children: React.ReactNode;
  cartCount?: number;
  wishlistCount?: number;
  notificationCount?: number;
}

interface TouchGesture {
  startX: number;
  startY: number;
  startTime: number;
  element: HTMLElement | null;
}

export function TouchOptimizedInterface({
  locale,
  children,
  cartCount = 0,
  wishlistCount = 0,
  notificationCount = 0
}: TouchOptimizedInterfaceProps) {
  const isRTL = locale === 'ar';
  const [activeTab, setActiveTab] = useState('home');
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Touch gesture handling
  const [currentGesture, setCurrentGesture] = useState<TouchGesture | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile-optimized navigation items
  const navigationItems = [
    {
      id: 'home',
      icon: IconHome,
      label: isRTL ? 'الرئيسية' : 'Home',
      href: '/',
      color: 'orange'
    },
    {
      id: 'search',
      icon: IconSearch,
      label: isRTL ? 'البحث' : 'Search',
      href: '/search',
      color: 'blue'
    },
    {
      id: 'cart',
      icon: IconShoppingCart,
      label: isRTL ? 'السلة' : 'Cart',
      href: '/cart',
      color: 'green',
      badge: cartCount
    },
    {
      id: 'account',
      icon: IconUser,
      label: isRTL ? 'حسابي' : 'Account',
      href: '/account',
      color: 'purple'
    }
  ];

  // Quick actions for floating menu
  const quickActions = [
    {
      id: 'wishlist',
      icon: IconHeart,
      label: isRTL ? 'المفضلة' : 'Wishlist',
      href: '/wishlist',
      color: 'red',
      badge: wishlistCount
    },
    {
      id: 'notifications',
      icon: IconBell,
      label: isRTL ? 'الإشعارات' : 'Notifications',
      href: '/notifications',
      color: 'yellow',
      badge: notificationCount
    },
    {
      id: 'support',
      icon: IconPhone,
      label: isRTL ? 'الدعم' : 'Support',
      href: '/support',
      color: 'teal'
    }
  ];

  // Touch gesture detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setCurrentGesture({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      element: e.currentTarget as HTMLElement
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!currentGesture) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - currentGesture.startX;
    const deltaY = touch.clientY - currentGesture.startY;
    const deltaTime = Date.now() - currentGesture.startTime;

    // Swipe detection parameters
    const minDistance = 50;
    const maxTime = 300;
    const maxVerticalDeviation = 100;

    // Horizontal swipe detection
    if (Math.abs(deltaX) > minDistance && 
        Math.abs(deltaY) < maxVerticalDeviation && 
        deltaTime < maxTime) {
      
      const direction = deltaX > 0 ? 'right' : 'left';
      handleSwipeGesture(direction, currentGesture.element);
    }

    // Vertical swipe for drawer
    if (Math.abs(deltaY) > minDistance && 
        Math.abs(deltaX) < maxVerticalDeviation && 
        deltaTime < maxTime) {
      
      const direction = deltaY > 0 ? 'down' : 'up';
      if (direction === 'up' && window.scrollY < 100) {
        setDrawerOpened(true);
      }
    }

    setCurrentGesture(null);
  }, [currentGesture]);

  const handleSwipeGesture = (direction: 'left' | 'right', element: HTMLElement | null) => {
    console.log(`Swipe ${direction} detected`);
    
    // Navigate between tabs based on swipe direction
    const currentIndex = navigationItems.findIndex(item => item.id === activeTab);
    let newIndex;
    
    if (direction === 'right' && !isRTL) {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'left' && !isRTL) {
      newIndex = Math.min(navigationItems.length - 1, currentIndex + 1);
    } else if (direction === 'left' && isRTL) {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'right' && isRTL) {
      newIndex = Math.min(navigationItems.length - 1, currentIndex + 1);
    } else {
      return;
    }
    
    setActiveTab(navigationItems[newIndex].id);
  };

  // Scroll handling for floating button
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 300);
      
      // Auto-hide after scrolling stops
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowFloatingButton(false);
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Haptic feedback for supported devices
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    triggerHapticFeedback('light');
  };

  return (
    <AppShell
      padding={0}
      navbar={{
        width: 0,
        breakpoint: 'never'
      }}
      footer={{
        height: { base: 70, sm: 0 }
      }}
    >
      {/* Main Content */}
      <AppShell.Main>
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="min-h-screen pb-20 sm:pb-0"
        >
          {/* Mobile Search Bar */}
          <Container size="xl" className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b sm:hidden">
            <Group gap="sm" py="sm">
              <ActionIcon 
                variant="subtle" 
                size="lg"
                onClick={() => setDrawerOpened(true)}
                className="touch-manipulation"
              >
                <IconMenu2 size={20} />
              </ActionIcon>
              
              <TextInput
                placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search products...'}
                size="md"
                flex={1}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon variant="subtle" size="sm">
                    <IconFilter size={16} />
                  </ActionIcon>
                }
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="touch-manipulation"
                styles={{
                  input: {
                    fontSize: '16px', // Prevents zoom on iOS
                    borderRadius: '12px'
                  }
                }}
              />

              <ActionIcon 
                variant="subtle" 
                size="lg"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="touch-manipulation"
              >
                {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Group>
          </Container>

          {children}
        </div>
      </AppShell.Main>

      {/* Mobile Bottom Navigation */}
      <AppShell.Footer className="sm:hidden" p={0}>
        <Paper
          shadow="xl"
          className="border-t"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <Group justify="space-around" p="xs">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <UnstyledButton
                  key={item.id}
                  onClick={() => handleTabPress(item.id)}
                  className="flex flex-col items-center p-2 rounded-xl transition-all duration-200 touch-manipulation min-w-[60px]"
                  style={{
                    backgroundColor: isActive ? `var(--mantine-color-${item.color}-0)` : 'transparent',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <Indicator
                    color={item.color}
                    disabled={!item.badge || item.badge === 0}
                    label={item.badge}
                    size={16}
                    offset={7}
                  >
                    <Icon
                      size={24}
                      color={isActive ? `var(--mantine-color-${item.color}-6)` : 'var(--mantine-color-gray-6)'}
                    />
                  </Indicator>
                  <Text
                    size="xs"
                    fw={isActive ? 600 : 400}
                    c={isActive ? `${item.color}.6` : 'gray.6'}
                    mt={2}
                  >
                    {item.label}
                  </Text>
                </UnstyledButton>
              );
            })}
          </Group>
        </Paper>
      </AppShell.Footer>

      {/* Mobile Menu Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position={isRTL ? 'right' : 'left'}
        size="80%"
        title={
          <Group gap="sm">
            <Avatar size="md" />
            <div>
              <Text fw={600}>{isRTL ? 'أهلاً وسهلاً' : 'Welcome'}</Text>
              <Text size="sm" c="dimmed">{isRTL ? 'احمد المحمود' : 'Ahmed Al-Mahmood'}</Text>
            </div>
          </Group>
        }
        className="touch-manipulation"
      >
        <ScrollArea>
          <Stack gap="xs">
            
            {/* Quick Actions */}
            <Text fw={600} size="sm" c="dimmed" mb="xs">
              {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
            </Text>
            
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <UnstyledButton
                  key={action.id}
                  className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                  onClick={() => {
                    setDrawerOpened(false);
                    triggerHapticFeedback('medium');
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="md">
                      <Icon size={20} color={`var(--mantine-color-${action.color}-6)`} />
                      <Text>{action.label}</Text>
                    </Group>
                    {action.badge && action.badge > 0 && (
                      <Badge color={action.color} size="sm" variant="light">
                        {action.badge}
                      </Badge>
                    )}
                  </Group>
                </UnstyledButton>
              );
            })}

            <Divider my="md" />

            {/* Settings and Preferences */}
            <Text fw={600} size="sm" c="dimmed" mb="xs">
              {isRTL ? 'الإعدادات' : 'Settings'}
            </Text>

            <UnstyledButton className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
              <Group>
                <IconLanguage size={20} color="var(--mantine-color-blue-6)" />
                <Text>{isRTL ? 'اللغة: العربية' : 'Language: English'}</Text>
              </Group>
            </UnstyledButton>

            <UnstyledButton className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
              <Group>
                <IconMapPin size={20} color="var(--mantine-color-green-6)" />
                <Text>{isRTL ? 'الموقع: البحرين' : 'Location: Bahrain'}</Text>
              </Group>
            </UnstyledButton>

            <Divider my="md" />

            {/* Contact Information */}
            <Text fw={600} size="sm" c="dimmed" mb="xs">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Text>

            <UnstyledButton className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
              <Group>
                <IconPhone size={20} color="var(--mantine-color-teal-6)" />
                <Text>+973 1234 5678</Text>
              </Group>
            </UnstyledButton>

            <UnstyledButton className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
              <Group>
                <IconMail size={20} color="var(--mantine-color-orange-6)" />
                <Text>support@tendzd.com</Text>
              </Group>
            </UnstyledButton>

          </Stack>
        </ScrollArea>
      </Drawer>

      {/* Floating Action Button */}
      <Transition
        mounted={showFloatingButton}
        transition="slide-up"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <ActionIcon
            style={{
              ...styles,
              position: 'fixed',
              bottom: '90px',
              right: isRTL ? 'auto' : '20px',
              left: isRTL ? '20px' : 'auto',
              zIndex: 1000
            }}
            size={56}
            radius="xl"
            variant="filled"
            color="orange"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              triggerHapticFeedback('medium');
            }}
            className="shadow-lg touch-manipulation"
          >
            <IconChevronUp size={24} />
          </ActionIcon>
        )}
      </Transition>

      {/* Search Overlay for Mobile */}
      <Transition
        mounted={searchFocused}
        transition="fade"
        duration={200}
      >
        {(styles) => (
          <Overlay
            style={styles}
            className="sm:hidden"
            onClick={() => setSearchFocused(false)}
          />
        )}
      </Transition>

      {/* PWA Install Prompt (Mobile) */}
      <style jsx global>{`
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* iOS Safari specific */
        input[type="search"] {
          -webkit-appearance: none;
          font-size: 16px !important;
        }

        /* Android Chrome specific */
        .android input {
          font-size: 16px !important;
        }

        /* Smooth scrolling for better UX */
        html {
          scroll-behavior: smooth;
        }

        /* Better touch target sizes */
        button, a, input {
          min-height: 44px;
          min-width: 44px;
        }

        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }

        /* Custom scrollbar for better mobile experience */
        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 165, 0, 0.3);
          border-radius: 2px;
        }

        /* RTL adjustments */
        [dir="rtl"] {
          text-align: right;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          button, input {
            border: 2px solid currentColor;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </AppShell>
  );
}