'use client';

import { useState } from 'react';
import {
  Container,
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Tabs,
  Avatar,
  Badge,
  SimpleGrid,
  ActionIcon,
  Divider,
  Alert,
  Progress,
  Table,
  Modal,
  TextInput,
  Select,
  Textarea,
  Switch,
  Paper,
  NumberFormatter
} from '@mantine/core';
import {
  IconUser,
  IconShoppingBag,
  IconHeart,
  IconMapPin,
  IconBell,
  IconEdit,
  IconTrash,
  IconDownload,
  IconEye,
  IconShare,
  IconStar,
  IconClock,
  IconTruck,
  IconCheck,
  IconX,
  IconPlus,
  IconCreditCard,
  IconGift,
  IconSettings,
  IconPhone,
  IconMail,
  IconCalendar,
  IconLanguage
} from '@tabler/icons-react';

interface UserAccountProps {
  locale?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemsCount: number;
  vendor: string;
  vendorAr: string;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrderItem {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  price: number;
  quantity: number;
  vendor: string;
}

interface WishlistItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  vendorAr: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  building: string;
  road: string;
  block: string;
  city: string;
  governorate: string;
  isDefault: boolean;
}

export default function UserAccount({ locale = 'en' }: UserAccountProps) {
  const isRTL = locale === 'ar';
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock user data
  const user = {
    id: 'usr_001',
    firstName: 'Ahmed',
    lastName: 'Al-Mahmood',
    email: 'ahmed.mahmood@email.com',
    phone: '+973 3333 1234',
    avatar: '/api/placeholder/120/120',
    joinDate: '2024-05-15',
    totalOrders: 47,
    totalSpent: 3847.250,
    loyaltyPoints: 2840,
    membershipTier: 'Gold',
    language: 'ar',
    currency: 'BHD'
  };

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001234',
      date: '2025-01-18',
      status: 'shipped',
      total: 459.750,
      itemsCount: 3,
      vendor: 'TechStore Bahrain',
      vendorAr: 'متجر التكنولوجيا البحرين',
      trackingNumber: 'DHL2025011800123',
      estimatedDelivery: '2025-01-20',
      items: [
        {
          id: '1',
          name: 'iPhone 15 Pro Max',
          nameAr: 'آيفون 15 برو ماكس',
          image: '/api/placeholder/80/80',
          price: 399.900,
          quantity: 1,
          vendor: 'TechStore Bahrain'
        },
        {
          id: '2',
          name: 'MagSafe Charger',
          nameAr: 'شاحن ماج سيف',
          image: '/api/placeholder/80/80',
          price: 29.900,
          quantity: 2,
          vendor: 'TechStore Bahrain'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-001189',
      date: '2025-01-15',
      status: 'delivered',
      total: 125.500,
      itemsCount: 2,
      vendor: 'Fashion Hub',
      vendorAr: 'مركز الأزياء',
      items: [
        {
          id: '3',
          name: 'Cotton T-Shirt',
          nameAr: 'تيشرت قطني',
          image: '/api/placeholder/80/80',
          price: 25.000,
          quantity: 2,
          vendor: 'Fashion Hub'
        },
        {
          id: '4',
          name: 'Jeans',
          nameAr: 'جينز',
          image: '/api/placeholder/80/80',
          price: 75.500,
          quantity: 1,
          vendor: 'Fashion Hub'
        }
      ]
    }
  ];

  // Mock wishlist data
  const wishlist: WishlistItem[] = [
    {
      id: '1',
      name: 'MacBook Pro M3',
      nameAr: 'ماك بوك برو إم 3',
      price: 899.000,
      originalPrice: 999.000,
      image: '/api/placeholder/200/200',
      vendor: 'TechStore Bahrain',
      vendorAr: 'متجر التكنولوجيا البحرين',
      rating: 4.8,
      reviewCount: 127,
      inStock: true
    },
    {
      id: '2',
      name: 'Samsung Galaxy Watch',
      nameAr: 'ساعة سامسونج جالاكسي',
      price: 199.900,
      image: '/api/placeholder/200/200',
      vendor: 'Electronics Plus',
      vendorAr: 'إلكترونيكس بلس',
      rating: 4.5,
      reviewCount: 89,
      inStock: false
    },
    {
      id: '3',
      name: 'AirPods Pro',
      nameAr: 'إير بودز برو',
      price: 149.900,
      originalPrice: 179.900,
      image: '/api/placeholder/200/200',
      vendor: 'TechStore Bahrain',
      vendorAr: 'متجر التكنولوجيا البحرين',
      rating: 4.7,
      reviewCount: 234,
      inStock: true
    }
  ];

  // Mock addresses data
  const addresses: Address[] = [
    {
      id: '1',
      type: 'home',
      name: 'Ahmed Al-Mahmood',
      phone: '+973 3333 1234',
      building: 'Building 123',
      road: 'Road 45',
      block: 'Block 567',
      city: 'Manama',
      governorate: 'Capital',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Ahmed Al-Mahmood',
      phone: '+973 3333 1234',
      building: 'Tower 456',
      road: 'Road 12',
      block: 'Block 890',
      city: 'Seef',
      governorate: 'Capital',
      isDefault: false
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-BH' : 'en-BH', {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'shipped': return 'blue';
      case 'processing': return 'orange';
      case 'confirmed': return 'teal';
      case 'cancelled': return 'red';
      default: return 'yellow';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      en: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      ar: {
        pending: 'في الانتظار',
        confirmed: 'مؤكد',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التسليم',
        cancelled: 'ملغي'
      }
    };
    return statusMap[locale as keyof typeof statusMap][status as keyof typeof statusMap.en] || status;
  };

  const getMembershipBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'yellow';
      case 'Silver': return 'gray';
      case 'Bronze': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        
        {/* Header */}
        <Card withBorder padding="lg">
          <Group justify="space-between">
            <Group gap="lg">
              <Avatar src={user.avatar} size={80} radius="md" />
              <div>
                <Group gap="md" align="center">
                  <Title order={2}>
                    {user.firstName} {user.lastName}
                  </Title>
                  <Badge 
                    color={getMembershipBadgeColor(user.membershipTier)} 
                    variant="light" 
                    size="lg"
                  >
                    {isRTL ? `عضو ${user.membershipTier}` : `${user.membershipTier} Member`}
                  </Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  {isRTL ? 'عضو منذ' : 'Member since'} {user.joinDate}
                </Text>
                <Group gap="lg" mt="xs">
                  <Text size="sm">
                    <Text span fw={600}>{user.totalOrders}</Text> {isRTL ? 'طلب' : 'orders'}
                  </Text>
                  <Text size="sm">
                    <Text span fw={600}>{formatCurrency(user.totalSpent)}</Text> {isRTL ? 'إجمالي الإنفاق' : 'total spent'}
                  </Text>
                  <Text size="sm">
                    <Text span fw={600}>{user.loyaltyPoints.toLocaleString()}</Text> {isRTL ? 'نقطة ولاء' : 'loyalty points'}
                  </Text>
                </Group>
              </div>
            </Group>
            <Button leftSection={<IconEdit size={16} />}>
              {isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            </Button>
          </Group>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'profile')} color="orange">
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
              {isRTL ? 'الملف الشخصي' : 'Profile'}
            </Tabs.Tab>
            <Tabs.Tab value="orders" leftSection={<IconShoppingBag size={16} />}>
              {isRTL ? 'الطلبات' : 'Orders'}
            </Tabs.Tab>
            <Tabs.Tab value="wishlist" leftSection={<IconHeart size={16} />}>
              {isRTL ? 'قائمة الأمنيات' : 'Wishlist'}
            </Tabs.Tab>
            <Tabs.Tab value="addresses" leftSection={<IconMapPin size={16} />}>
              {isRTL ? 'العناوين' : 'Addresses'}
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </Tabs.Tab>
          </Tabs.List>

          {/* Profile Tab */}
          <Tabs.Panel value="profile">
            <Stack gap="lg" mt="lg">
              
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {/* Personal Information */}
                <Card withBorder padding="lg">
                  <Group justify="space-between" mb="md">
                    <Title order={4}>
                      {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                    </Title>
                    <ActionIcon variant="outline" color="orange">
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <Stack gap="md">
                    <Group gap="sm">
                      <IconUser size={16} className="text-gray-500" />
                      <div>
                        <Text size="sm" c="dimmed">
                          {isRTL ? 'الاسم الكامل' : 'Full Name'}
                        </Text>
                        <Text fw={500}>{user.firstName} {user.lastName}</Text>
                      </div>
                    </Group>
                    
                    <Group gap="sm">
                      <IconMail size={16} className="text-gray-500" />
                      <div>
                        <Text size="sm" c="dimmed">
                          {isRTL ? 'البريد الإلكتروني' : 'Email'}
                        </Text>
                        <Text fw={500}>{user.email}</Text>
                      </div>
                    </Group>
                    
                    <Group gap="sm">
                      <IconPhone size={16} className="text-gray-500" />
                      <div>
                        <Text size="sm" c="dimmed">
                          {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                        </Text>
                        <Text fw={500}>{user.phone}</Text>
                      </div>
                    </Group>
                    
                    <Group gap="sm">
                      <IconLanguage size={16} className="text-gray-500" />
                      <div>
                        <Text size="sm" c="dimmed">
                          {isRTL ? 'اللغة المفضلة' : 'Preferred Language'}
                        </Text>
                        <Text fw={500}>
                          {user.language === 'ar' ? 'العربية' : 'English'}
                        </Text>
                      </div>
                    </Group>
                  </Stack>
                </Card>

                {/* Account Stats */}
                <Card withBorder padding="lg">
                  <Title order={4} mb="md">
                    {isRTL ? 'إحصائيات الحساب' : 'Account Statistics'}
                  </Title>
                  
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <IconShoppingBag size={16} className="text-blue-500" />
                        <Text size="sm">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</Text>
                      </Group>
                      <Text fw={600} c="blue">{user.totalOrders}</Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="sm">
                        <IconCreditCard size={16} className="text-green-500" />
                        <Text size="sm">{isRTL ? 'إجمالي الإنفاق' : 'Total Spent'}</Text>
                      </Group>
                      <Text fw={600} c="green">{formatCurrency(user.totalSpent)}</Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="sm">
                        <IconGift size={16} className="text-orange-500" />
                        <Text size="sm">{isRTL ? 'نقاط الولاء' : 'Loyalty Points'}</Text>
                      </Group>
                      <Text fw={600} c="orange">{user.loyaltyPoints.toLocaleString()}</Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Group gap="sm">
                        <IconCalendar size={16} className="text-teal-500" />
                        <Text size="sm">{isRTL ? 'تاريخ الانضمام' : 'Join Date'}</Text>
                      </Group>
                      <Text fw={600}>{user.joinDate}</Text>
                    </Group>
                  </Stack>
                </Card>
              </SimpleGrid>

              {/* Loyalty Progress */}
              <Card withBorder padding="lg">
                <Group justify="space-between" mb="md">
                  <Title order={4}>
                    {isRTL ? 'تقدم برنامج الولاء' : 'Loyalty Program Progress'}
                  </Title>
                  <Badge color={getMembershipBadgeColor(user.membershipTier)} variant="light">
                    {user.membershipTier}
                  </Badge>
                </Group>
                
                <Text size="sm" c="dimmed" mb="md">
                  {isRTL 
                    ? `لديك ${user.loyaltyPoints} نقطة. تحتاج 1160 نقطة أخرى للوصول إلى مستوى البلاتين`
                    : `You have ${user.loyaltyPoints} points. Need 1,160 more points to reach Platinum tier`
                  }
                </Text>
                
                <Progress value={71} color="orange" size="lg" mb="sm" />
                
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Gold (3,000)</Text>
                  <Text size="sm" fw={500}>Platinum (4,000)</Text>
                </Group>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Orders Tab */}
          <Tabs.Panel value="orders">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={4}>
                  {isRTL ? 'طلباتي' : 'My Orders'}
                </Title>
                <Button 
                  variant="outline" 
                  leftSection={<IconDownload size={16} />}
                >
                  {isRTL ? 'تصدير' : 'Export'}
                </Button>
              </Group>

              <Stack gap="md">
                {orders.map((order) => (
                  <Card key={order.id} withBorder padding="lg">
                    <Group justify="space-between" mb="md">
                      <div>
                        <Text fw={600} size="lg">{order.orderNumber}</Text>
                        <Text size="sm" c="dimmed">
                          {isRTL ? order.vendorAr : order.vendor} • {order.date}
                        </Text>
                      </div>
                      <Group gap="md">
                        <Badge color={getStatusColor(order.status)} variant="light">
                          {getStatusText(order.status)}
                        </Badge>
                        <Text fw={600} size="lg">
                          {formatCurrency(order.total)}
                        </Text>
                      </Group>
                    </Group>

                    <Group justify="space-between">
                      <Group gap="md">
                        <Text size="sm">
                          {order.itemsCount} {isRTL ? 'عنصر' : 'items'}
                        </Text>
                        {order.trackingNumber && (
                          <Text size="sm" c="blue" fw={500}>
                            {isRTL ? 'رقم التتبع:' : 'Tracking:'} {order.trackingNumber}
                          </Text>
                        )}
                        {order.estimatedDelivery && (
                          <Text size="sm" c="green">
                            {isRTL ? 'التسليم المتوقع:' : 'Est. delivery:'} {order.estimatedDelivery}
                          </Text>
                        )}
                      </Group>
                      <Group gap="sm">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        </Button>
                        {order.status === 'shipped' && (
                          <Button size="sm" leftSection={<IconTruck size={14} />}>
                            {isRTL ? 'تتبع الطلب' : 'Track Order'}
                          </Button>
                        )}
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>

            </Stack>
          </Tabs.Panel>

          {/* Wishlist Tab */}
          <Tabs.Panel value="wishlist">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={4}>
                  {isRTL ? 'قائمة الأمنيات' : 'My Wishlist'}
                </Title>
                <Group gap="sm">
                  <Button variant="outline" leftSection={<IconShare size={16} />}>
                    {isRTL ? 'مشاركة' : 'Share'}
                  </Button>
                  <Button leftSection={<IconShoppingBag size={16} />}>
                    {isRTL ? 'إضافة الكل للسلة' : 'Add All to Cart'}
                  </Button>
                </Group>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {wishlist.map((item) => (
                  <Card key={item.id} withBorder padding="md">
                    <Card.Section>
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={isRTL ? item.nameAr : item.name}
                          className="w-full h-48 object-cover"
                        />
                        {!item.inStock && (
                          <Badge 
                            color="red" 
                            variant="filled"
                            className="absolute top-2 right-2"
                          >
                            {isRTL ? 'نفد المخزون' : 'Out of Stock'}
                          </Badge>
                        )}
                        <ActionIcon 
                          color="red" 
                          variant="filled"
                          className="absolute top-2 left-2"
                          size="sm"
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </div>
                    </Card.Section>

                    <Stack gap="sm" mt="md">
                      <Text fw={500} lineClamp={2}>
                        {isRTL ? item.nameAr : item.name}
                      </Text>
                      
                      <Text size="sm" c="dimmed">
                        {isRTL ? item.vendorAr : item.vendor}
                      </Text>
                      
                      <Group justify="space-between">
                        <div>
                          <Text fw={600} c="orange">
                            {formatCurrency(item.price)}
                          </Text>
                          {item.originalPrice && (
                            <Text size="sm" td="line-through" c="dimmed">
                              {formatCurrency(item.originalPrice)}
                            </Text>
                          )}
                        </div>
                        <Group gap={4}>
                          <IconStar size={14} className="text-yellow-400" fill="currentColor" />
                          <Text size="sm">{item.rating}</Text>
                          <Text size="sm" c="dimmed">({item.reviewCount})</Text>
                        </Group>
                      </Group>
                      
                      <Button 
                        fullWidth 
                        disabled={!item.inStock}
                        leftSection={<IconShoppingBag size={16} />}
                      >
                        {isRTL ? 'إضافة للسلة' : 'Add to Cart'}
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>

            </Stack>
          </Tabs.Panel>

          {/* Addresses Tab */}
          <Tabs.Panel value="addresses">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={4}>
                  {isRTL ? 'دفتر العناوين' : 'Address Book'}
                </Title>
                <Button 
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setShowAddressModal(true)}
                >
                  {isRTL ? 'إضافة عنوان جديد' : 'Add New Address'}
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {addresses.map((address) => (
                  <Card key={address.id} withBorder padding="lg">
                    <Group justify="space-between" mb="md">
                      <Group gap="sm">
                        <Badge 
                          color={address.type === 'home' ? 'blue' : address.type === 'work' ? 'orange' : 'gray'}
                          variant="light"
                        >
                          {isRTL ? 
                            (address.type === 'home' ? 'المنزل' : address.type === 'work' ? 'العمل' : 'أخرى') :
                            address.type.charAt(0).toUpperCase() + address.type.slice(1)
                          }
                        </Badge>
                        {address.isDefault && (
                          <Badge color="green" variant="light">
                            {isRTL ? 'افتراضي' : 'Default'}
                          </Badge>
                        )}
                      </Group>
                      <Group gap="xs">
                        <ActionIcon variant="outline" color="orange" size="sm">
                          <IconEdit size={14} />
                        </ActionIcon>
                        <ActionIcon variant="outline" color="red" size="sm">
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    
                    <Stack gap="xs">
                      <Text fw={500}>{address.name}</Text>
                      <Text size="sm">{address.phone}</Text>
                      <Text size="sm" c="dimmed">
                        {address.building}, {address.road}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {address.block}, {address.city}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {address.governorate}, Bahrain
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>

            </Stack>
          </Tabs.Panel>

          {/* Notifications Tab */}
          <Tabs.Panel value="notifications">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={4}>
                  {isRTL ? 'إعدادات الإشعارات' : 'Notification Preferences'}
                </Title>
                <Button 
                  variant="outline"
                  onClick={() => setShowNotificationModal(true)}
                >
                  {isRTL ? 'إدارة الاشتراكات' : 'Manage Subscriptions'}
                </Button>
              </Group>

              <Card withBorder padding="lg">
                <Stack gap="lg">
                  
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>
                        {isRTL ? 'إشعارات الطلبات' : 'Order Notifications'}
                      </Text>
                      <Switch defaultChecked color="orange" />
                    </Group>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'إشعارات عن حالة الطلبات والشحن' : 'Notifications about order status and shipping'}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>
                        {isRTL ? 'العروض والخصومات' : 'Promotions & Discounts'}
                      </Text>
                      <Switch defaultChecked color="orange" />
                    </Group>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'إشعارات عن العروض الجديدة والخصومات' : 'Notifications about new offers and discounts'}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>
                        {isRTL ? 'منتجات قائمة الأمنيات' : 'Wishlist Products'}
                      </Text>
                      <Switch defaultChecked color="orange" />
                    </Group>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'إشعارات عند توفر منتجات قائمة الأمنيات' : 'Notifications when wishlist items are available'}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>
                        {isRTL ? 'رسائل البريد الإلكتروني' : 'Email Newsletters'}
                      </Text>
                      <Switch color="orange" />
                    </Group>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'النشرة الإخبارية الأسبوعية والعروض الخاصة' : 'Weekly newsletter and special offers'}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>
                        {isRTL ? 'الرسائل النصية' : 'SMS Notifications'}
                      </Text>
                      <Switch defaultChecked color="orange" />
                    </Group>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'رسائل نصية للطلبات الهامة فقط' : 'SMS for important order updates only'}
                    </Text>
                  </div>

                </Stack>
              </Card>

            </Stack>
          </Tabs.Panel>

        </Tabs>

        {/* Order Details Modal */}
        <Modal
          opened={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={isRTL ? 'تفاصيل الطلب' : 'Order Details'}
          size="lg"
          centered
        >
          {selectedOrder && (
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>{selectedOrder.orderNumber}</Text>
                <Badge color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Badge>
              </Group>

              <Divider />

              <div>
                <Text fw={500} mb="sm">
                  {isRTL ? 'العناصر المطلوبة' : 'Order Items'}
                </Text>
                <Stack gap="sm">
                  {selectedOrder.items.map((item) => (
                    <Group key={item.id} justify="space-between">
                      <Group gap="md">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <Text size="sm" fw={500}>
                            {isRTL ? item.nameAr : item.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {isRTL ? 'الكمية:' : 'Qty:'} {item.quantity}
                          </Text>
                        </div>
                      </Group>
                      <Text fw={600}>
                        {formatCurrency(item.price * item.quantity)}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </div>

              <Divider />

              <Group justify="space-between">
                <Text fw={600}>
                  {isRTL ? 'الإجمالي' : 'Total'}
                </Text>
                <Text fw={600} size="lg">
                  {formatCurrency(selectedOrder.total)}
                </Text>
              </Group>

              {selectedOrder.trackingNumber && (
                <Alert color="blue" variant="light">
                  <Text size="sm">
                    <Text span fw={500}>
                      {isRTL ? 'رقم التتبع:' : 'Tracking Number:'}
                    </Text>{' '}
                    {selectedOrder.trackingNumber}
                  </Text>
                </Alert>
              )}
            </Stack>
          )}
        </Modal>

      </Stack>
    </Container>
  );
}