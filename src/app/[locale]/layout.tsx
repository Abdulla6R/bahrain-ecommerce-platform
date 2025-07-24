import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Container, AppShell } from '@mantine/core';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  // Mock user data - in production this would come from session/auth
  const mockUser = {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    avatar: '/images/avatars/user1.jpg',
    membershipTier: 'gold' as const,
    loyaltyPoints: 1250,
  };

  // Mock cart data
  const mockCartItems = [
    { id: '1', productId: 'p1', quantity: 2, price: 25.500 },
    { id: '2', productId: 'p2', quantity: 1, price: 45.750 },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppShell
        header={{ height: 80 }}
        padding={0}
        styles={{
          main: {
            paddingTop: 80,
          },
        }}
      >
        <Header
          user={mockUser}
          cartItems={mockCartItems}
          wishlistCount={5}
          notificationCount={3}
        />
        
        <AppShell.Main>
          <main id="main-content">
            {children}
          </main>
        </AppShell.Main>
        
        {/* Footer will be added here */}
      </AppShell>
    </NextIntlClientProvider>
  );
}