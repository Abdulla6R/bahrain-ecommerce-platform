'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Stack,
  Title,
  Card,
  Text,
  Button,
  Group,
  Badge,
  Tabs,
  ActionIcon,
  Progress,
  SimpleGrid,
  Table,
  Modal,
  Select,
  TextInput,
  NumberInput,
  Textarea,
  FileInput,
  Alert,
  Menu,
  Avatar,
  Anchor,
  Divider
} from '@mantine/core';
import {
  IconDashboard,
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconDownload,
  IconUpload,
  IconLanguage,
  IconBell,
  IconMail,
  IconPhone,
  IconCheck,
  IconX,
  IconClock,
  IconTrendingUp,
  IconCoin,
  IconFileText,
  IconShield
} from '@tabler/icons-react';

interface VendorDashboardProps {
  searchParams: Promise<{ locale?: string }>;
}

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  orders: number;
  revenue: number;
}

interface Order {
  id: string;
  customerName: string;
  customerNameAr: string;
  products: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  commission: number;
}

export default async function VendorDashboard({ searchParams }: VendorDashboardProps) {
  const resolvedSearchParams = await searchParams;
  const locale = resolvedSearchParams.locale || 'en';
  const isRTL = locale === 'ar';
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock vendor data
  const vendorStats = {
    totalProducts: 87,
    activeOrders: 23,
    totalRevenue: 15420.750,
    monthlyCommission: 2313.112,
    averageRating: 4.7,
    totalCustomers: 456,
    pendingPayouts: 1890.500,
    conversionRate: 12.4
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      nameAr: 'آيفون 15 برو ماكس',
      price: 450.500,
      stock: 15,
      status: 'active',
      orders: 23,
      revenue: 10361.500
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونج جالاكسي إس 24 ألترا',
      price: 380.750,
      stock: 8,
      status: 'active',
      orders: 18,
      revenue: 6853.500
    },
    {
      id: '3',
      name: 'MacBook Pro M3',
      nameAr: 'ماك بوك برو إم 3',
      price: 650.000,
      stock: 0,
      status: 'inactive',
      orders: 5,
      revenue: 3250.000
    }
  ];

  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Ahmed Al-Mahmood',
      customerNameAr: 'أحمد المحمود',
      products: ['iPhone 15 Pro Max', 'AirPods Pro'],
      total: 536.250,
      status: 'confirmed',
      date: '2025-01-20',
      commission: 80.437
    },
    {
      id: 'ORD-002',
      customerName: 'Fatima Al-Zahra',
      customerNameAr: 'فاطمة الزهراء',
      products: ['Samsung Galaxy S24'],
      total: 380.750,
      status: 'shipped',
      date: '2025-01-19',
      commission: 57.112
    },
    {
      id: 'ORD-003',
      customerName: 'Mohammad Al-Khalifa',
      customerNameAr: 'محمد الخليفة',
      products: ['MacBook Pro M3'],
      total: 650.000,
      status: 'pending',
      date: '2025-01-18',
      commission: 97.500
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'confirmed': case 'delivered': return 'green';
      case 'pending': return 'yellow';
      case 'shipped': return 'blue';
      case 'inactive': case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      en: {
        active: 'Active', inactive: 'Inactive', pending: 'Pending',
        confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      ar: {
        active: 'نشط', inactive: 'غير نشط', pending: 'في الانتظار',
        confirmed: 'مؤكد', shipped: 'مشحون', delivered: 'تم التسليم',
        cancelled: 'ملغي'
      }
    };
    return statusMap[locale as keyof typeof statusMap][status as keyof typeof statusMap.en] || status;
  };

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const url = new URL(window.location.href);
    url.searchParams.set('locale', newLocale);
    window.location.href = url.toString();
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        
        {/* Header */}
        <Card withBorder padding="lg">
          <Group justify="space-between" align="center">
            <div>
              <Group gap="sm" mb="xs">
                <Avatar size="md" color="orange">TM</Avatar>
                <div>
                  <Title order={2}>
                    {isRTL ? 'متجر التكنولوجيا البحرين' : 'TechStore Bahrain'}
                  </Title>
                  <Text c="dimmed">
                    {isRTL ? 'لوحة تحكم البائع' : 'Vendor Dashboard'}
                  </Text>
                </div>
              </Group>
            </div>
            
            <Group gap="md">
              <Button
                variant="outline"
                leftSection={<IconLanguage size={16} />}
                onClick={toggleLocale}
              >
                {isRTL ? 'English' : 'العربية'}
              </Button>
              
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="outline" size="lg">
                    <IconBell size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{isRTL ? 'الإشعارات' : 'Notifications'}</Menu.Label>
                  <Menu.Item leftSection={<IconShoppingCart size={14} />}>
                    {isRTL ? '3 طلبات جديدة' : '3 New Orders'}
                  </Menu.Item>
                  <Menu.Item leftSection={<IconCoin size={14} />}>
                    {isRTL ? 'دفعة جديدة متاحة' : 'New Payout Available'}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              
              <Badge size="lg" color="green">
                {isRTL ? 'نشط' : 'Active'}
              </Badge>
            </Group>
          </Group>
        </Card>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 2, md: 4 }}>
          <Card withBorder padding="lg" className="text-center">
            <IconPackage size={32} className="text-blue-600 mx-auto mb-2" />
            <Text size="2rem" fw={700} c="blue">
              {vendorStats.totalProducts}
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'إجمالي المنتجات' : 'Total Products'}
            </Text>
          </Card>
          
          <Card withBorder padding="lg" className="text-center">
            <IconShoppingCart size={32} className="text-orange-600 mx-auto mb-2" />
            <Text size="2rem" fw={700} c="orange">
              {vendorStats.activeOrders}
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'الطلبات النشطة' : 'Active Orders'}
            </Text>
          </Card>
          
          <Card withBorder padding="lg" className="text-center">
            <IconCoin size={32} className="text-green-600 mx-auto mb-2" />
            <Text size="2rem" fw={700} c="green">
              {vendorStats.totalRevenue.toFixed(3)}
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'الإيرادات (د.ب)' : 'Revenue (BHD)'}
            </Text>
          </Card>
          
          <Card withBorder padding="lg" className="text-center">
            <IconTrendingUp size={32} className="text-teal-600 mx-auto mb-2" />
            <Text size="2rem" fw={700} c="teal">
              {vendorStats.conversionRate}%
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'معدل التحويل' : 'Conversion Rate'}
            </Text>
          </Card>
        </SimpleGrid>

        {/* Main Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')} color="orange">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconDashboard size={16} />}>
              {isRTL ? 'نظرة عامة' : 'Overview'}
            </Tabs.Tab>
            <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
              {isRTL ? 'المنتجات' : 'Products'}
            </Tabs.Tab>
            <Tabs.Tab value="orders" leftSection={<IconShoppingCart size={16} />}>
              {isRTL ? 'الطلبات' : 'Orders'}
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              {isRTL ? 'التحليلات' : 'Analytics'}
            </Tabs.Tab>
            <Tabs.Tab value="customers" leftSection={<IconUsers size={16} />}>
              {isRTL ? 'العملاء' : 'Customers'}
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              {isRTL ? 'الإعدادات' : 'Settings'}
            </Tabs.Tab>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Panel value="overview">
            <Stack gap="lg" mt="lg">
              
              {/* Recent Activity */}
              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Card withBorder padding="lg">
                    <Group justify="space-between" mb="md">
                      <Title order={4}>
                        {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
                      </Title>
                      <Button variant="light" size="xs">
                        {isRTL ? 'عرض الكل' : 'View All'}
                      </Button>
                    </Group>
                    
                    <Stack gap="sm">
                      <Group gap="sm">
                        <IconShoppingCart size={16} className="text-green-600" />
                        <Text size="sm">
                          {isRTL 
                            ? 'طلب جديد بقيمة 450.500 د.ب من أحمد المحمود'
                            : 'New order worth 450.500 BHD from Ahmed Al-Mahmood'
                          }
                        </Text>
                        <Text size="xs" c="dimmed">2h ago</Text>
                      </Group>
                      
                      <Group gap="sm">
                        <IconPackage size={16} className="text-blue-600" />
                        <Text size="sm">
                          {isRTL 
                            ? 'تم شحن آيفون 15 برو ماكس'
                            : 'iPhone 15 Pro Max has been shipped'
                          }
                        </Text>
                        <Text size="xs" c="dimmed">4h ago</Text>
                      </Group>
                      
                      <Group gap="sm">
                        <IconCoin size={16} className="text-orange-600" />
                        <Text size="sm">
                          {isRTL 
                            ? 'تم إيداع عمولة بقيمة 234.500 د.ب'
                            : 'Commission of 234.500 BHD has been deposited'
                          }
                        </Text>
                        <Text size="xs" c="dimmed">1d ago</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg">
                    <Title order={4} mb="md">
                      {isRTL ? 'الهدف الشهري' : 'Monthly Target'}
                    </Title>
                    
                    <Stack gap="md">
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm">
                            {isRTL ? 'المبيعات' : 'Sales'}
                          </Text>
                          <Text size="sm" fw={600}>
                            68%
                          </Text>
                        </Group>
                        <Progress value={68} color="orange" />
                      </div>
                      
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm">
                            {isRTL ? 'الطلبات' : 'Orders'}
                          </Text>
                          <Text size="sm" fw={600}>
                            45%
                          </Text>
                        </Group>
                        <Progress value={45} color="blue" />
                      </div>
                      
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm">
                            {isRTL ? 'العملاء الجدد' : 'New Customers'}
                          </Text>
                          <Text size="sm" fw={600}>
                            82%
                          </Text>
                        </Group>
                        <Progress value={82} color="green" />
                      </div>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              {/* Top Products */}
              <Card withBorder padding="lg">
                <Group justify="space-between" mb="md">
                  <Title order={4}>
                    {isRTL ? 'أفضل المنتجات' : 'Top Products'}
                  </Title>
                  <Anchor size="sm">
                    {isRTL ? 'عرض التقرير الكامل' : 'View Full Report'}
                  </Anchor>
                </Group>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{isRTL ? 'المنتج' : 'Product'}</Table.Th>
                      <Table.Th>{isRTL ? 'المبيعات' : 'Sales'}</Table.Th>
                      <Table.Th>{isRTL ? 'الإيرادات' : 'Revenue'}</Table.Th>
                      <Table.Th>{isRTL ? 'المخزون' : 'Stock'}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockProducts.slice(0, 3).map((product) => (
                      <Table.Tr key={product.id}>
                        <Table.Td>
                          <Text fw={500}>
                            {isRTL ? product.nameAr : product.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>{product.orders}</Table.Td>
                        <Table.Td>
                          <Text fw={600} c="green">
                            {product.revenue.toFixed(3)} BHD
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}
                            variant="light"
                          >
                            {product.stock}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Products Tab */}
          <Tabs.Panel value="products">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={3}>
                  {isRTL ? 'إدارة المنتجات' : 'Product Management'}
                </Title>
                <Group gap="md">
                  <Button
                    leftSection={<IconUpload size={16} />}
                    variant="outline"
                  >
                    {isRTL ? 'رفع جماعي' : 'Bulk Upload'}
                  </Button>
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setShowProductModal(true)}
                  >
                    {isRTL ? 'إضافة منتج' : 'Add Product'}
                  </Button>
                </Group>
              </Group>

              <Card withBorder padding="lg">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{isRTL ? 'المنتج' : 'Product'}</Table.Th>
                      <Table.Th>{isRTL ? 'السعر' : 'Price'}</Table.Th>
                      <Table.Th>{isRTL ? 'المخزون' : 'Stock'}</Table.Th>
                      <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                      <Table.Th>{isRTL ? 'المبيعات' : 'Sales'}</Table.Th>
                      <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockProducts.map((product) => (
                      <Table.Tr key={product.id}>
                        <Table.Td>
                          <Text fw={500}>
                            {isRTL ? product.nameAr : product.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>
                            {product.price.toFixed(3)} BHD
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}
                            variant="light"
                          >
                            {product.stock}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(product.status)} variant="light">
                            {getStatusText(product.status)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{product.orders}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon variant="outline" color="blue" size="sm">
                              <IconEye size={14} />
                            </ActionIcon>
                            <ActionIcon 
                              variant="outline" 
                              color="orange" 
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductModal(true);
                              }}
                            >
                              <IconEdit size={14} />
                            </ActionIcon>
                            <ActionIcon variant="outline" color="red" size="sm">
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Orders Tab */}
          <Tabs.Panel value="orders">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={3}>
                  {isRTL ? 'إدارة الطلبات' : 'Order Management'}
                </Title>
                <Select
                  placeholder={isRTL ? 'تصفية حسب الحالة' : 'Filter by Status'}
                  data={[
                    { value: 'all', label: isRTL ? 'جميع الطلبات' : 'All Orders' },
                    { value: 'pending', label: isRTL ? 'في الانتظار' : 'Pending' },
                    { value: 'confirmed', label: isRTL ? 'مؤكد' : 'Confirmed' },
                    { value: 'shipped', label: isRTL ? 'مشحون' : 'Shipped' },
                    { value: 'delivered', label: isRTL ? 'تم التسليم' : 'Delivered' }
                  ]}
                  w={200}
                />
              </Group>

              <Card withBorder padding="lg">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{isRTL ? 'رقم الطلب' : 'Order ID'}</Table.Th>
                      <Table.Th>{isRTL ? 'العميل' : 'Customer'}</Table.Th>
                      <Table.Th>{isRTL ? 'المنتجات' : 'Products'}</Table.Th>
                      <Table.Th>{isRTL ? 'المجموع' : 'Total'}</Table.Th>
                      <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                      <Table.Th>{isRTL ? 'التاريخ' : 'Date'}</Table.Th>
                      <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockOrders.map((order) => (
                      <Table.Tr key={order.id}>
                        <Table.Td>
                          <Text fw={500} ff="monospace">
                            {order.id}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>
                            {isRTL ? order.customerNameAr : order.customerName}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" lineClamp={1}>
                            {order.products.join(', ')}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600}>
                            {order.total.toFixed(3)} BHD
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(order.status)} variant="light">
                            {getStatusText(order.status)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{order.date}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon 
                              variant="outline" 
                              color="blue" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                            >
                              <IconEye size={14} />
                            </ActionIcon>
                            <ActionIcon variant="outline" color="green" size="sm">
                              <IconCheck size={14} />
                            </ActionIcon>
                            <ActionIcon variant="outline" color="orange" size="sm">
                              <IconMail size={14} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Analytics Tab */}
          <Tabs.Panel value="analytics">
            <Stack gap="lg" mt="lg">
              
              <Title order={3}>
                {isRTL ? 'التحليلات والتقارير' : 'Analytics & Reports'}
              </Title>

              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Card withBorder padding="lg">
                  <Title order={4} mb="md">
                    {isRTL ? 'أداء المبيعات' : 'Sales Performance'}
                  </Title>
                  <Text c="dimmed" mb="lg">
                    {isRTL ? 'آخر 30 يوماً' : 'Last 30 days'}
                  </Text>
                  
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'إجمالي المبيعات' : 'Total Sales'}</Text>
                      <Text fw={600}>15,420.750 BHD</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'إجمالي العمولات' : 'Total Commissions'}</Text>
                      <Text fw={600} c="green">2,313.112 BHD</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'عدد الطلبات' : 'Orders Count'}</Text>
                      <Text fw={600}>68</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}</Text>
                      <Text fw={600}>226.775 BHD</Text>
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder padding="lg">
                  <Title order={4} mb="md">
                    {isRTL ? 'تحليل العملاء' : 'Customer Analysis'}
                  </Title>
                  <Text c="dimmed" mb="lg">
                    {isRTL ? 'البيانات الديموغرافية' : 'Demographics'}
                  </Text>
                  
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'عملاء جدد' : 'New Customers'}</Text>
                      <Text fw={600} c="green">+23</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'عملاء عائدون' : 'Returning Customers'}</Text>
                      <Text fw={600}>67%</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'معدل الرضا' : 'Satisfaction Rate'}</Text>
                      <Text fw={600} c="orange">4.7/5</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">{isRTL ? 'القيمة الإجمالية للعميل' : 'Customer Lifetime Value'}</Text>
                      <Text fw={600}>1,245.500 BHD</Text>
                    </Group>
                  </Stack>
                </Card>
              </SimpleGrid>

              <Card withBorder padding="lg">
                <Group justify="space-between" mb="md">
                  <Title order={4}>
                    {isRTL ? 'تقارير قابلة للتصدير' : 'Exportable Reports'}
                  </Title>
                  <Group gap="sm">
                    <Button variant="outline" leftSection={<IconDownload size={16} />}>
                      {isRTL ? 'تصدير PDF' : 'Export PDF'}
                    </Button>
                    <Button variant="outline" leftSection={<IconDownload size={16} />}>
                      {isRTL ? 'تصدير Excel' : 'Export Excel'}
                    </Button>
                  </Group>
                </Group>
                
                <SimpleGrid cols={{ base: 1, md: 3 }}>
                  <Card withBorder padding="md">
                    <IconFileText size={32} className="text-blue-600 mb-2" />
                    <Text fw={600} mb="xs">
                      {isRTL ? 'تقرير المبيعات الشهري' : 'Monthly Sales Report'}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'تفصيل المبيعات والعمولات' : 'Sales and commission breakdown'}
                    </Text>
                  </Card>
                  
                  <Card withBorder padding="md">
                    <IconUsers size={32} className="text-green-600 mb-2" />
                    <Text fw={600} mb="xs">
                      {isRTL ? 'تقرير العملاء' : 'Customer Report'}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'تحليل سلوك العملاء' : 'Customer behavior analysis'}
                    </Text>
                  </Card>
                  
                  <Card withBorder padding="md">
                    <IconPackage size={32} className="text-orange-600 mb-2" />
                    <Text fw={600} mb="xs">
                      {isRTL ? 'تقرير المخزون' : 'Inventory Report'}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'حالة المخزون والتوقعات' : 'Stock status and forecasts'}
                    </Text>
                  </Card>
                </SimpleGrid>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Settings Tab */}
          <Tabs.Panel value="settings">
            <Stack gap="lg" mt="lg">
              
              <Title order={3}>
                {isRTL ? 'إعدادات المتجر' : 'Store Settings'}
              </Title>

              <Alert
                icon={<IconShield size={16} />}
                title={isRTL ? 'امتثال PDPL' : 'PDPL Compliance'}
                color="blue"
                variant="light"
              >
                <Text size="sm">
                  {isRTL 
                    ? 'متجرك متوافق مع قانون حماية البيانات الشخصية البحريني. آخر تدقيق: 2025-01-20'
                    : 'Your store is compliant with Bahrain Personal Data Protection Law. Last audit: 2025-01-20'
                  }
                </Text>
              </Alert>

              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg">
                    <Title order={4} mb="md">
                      {isRTL ? 'معلومات المتجر' : 'Store Information'}
                    </Title>
                    
                    <Stack gap="md">
                      <TextInput
                        label={isRTL ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}
                        value="TechStore Bahrain"
                      />
                      <TextInput
                        label={isRTL ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}
                        value="متجر التكنولوجيا البحرين"
                      />
                      <Textarea
                        label={isRTL ? 'وصف المتجر' : 'Store Description'}
                        value={isRTL 
                          ? 'متجر متخصص في بيع أحدث الأجهزة التكنولوجية في البحرين'
                          : 'Specialized store for the latest technology devices in Bahrain'
                        }
                        rows={3}
                      />
                      <TextInput
                        label={isRTL ? 'رقم السجل التجاري' : 'CR Number'}
                        value="12345-01"
                      />
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg">
                    <Title order={4} mb="md">
                      {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
                    </Title>
                    
                    <Stack gap="md">
                      <TextInput
                        label={isRTL ? 'البريد الإلكتروني' : 'Email'}
                        value="info@techstore.bh"
                        leftSection={<IconMail size={16} />}
                      />
                      <TextInput
                        label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
                        value="+973 1234 5678"
                        leftSection={<IconPhone size={16} />}
                      />
                      <Textarea
                        label={isRTL ? 'العنوان' : 'Address'}
                        value={isRTL 
                          ? 'مجمع السيف، المنامة، البحرين'
                          : 'Seef Mall, Manama, Bahrain'
                        }
                        rows={2}
                      />
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              <Card withBorder padding="lg">
                <Title order={4} mb="md">
                  {isRTL ? 'إعدادات الدفع' : 'Payment Settings'}
                </Title>
                
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={isRTL ? 'اسم البنك' : 'Bank Name'}
                      value="National Bank of Bahrain"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={isRTL ? 'رقم الحساب' : 'Account Number'}
                      value="001234567890"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={isRTL ? 'رقم الآيبان' : 'IBAN'}
                      value="BH67NBOB00001234567890"
                    />
                  </Grid.Col>
                </Grid>
              </Card>

              <Group justify="flex-end">
                <Button variant="outline">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button>
                  {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                </Button>
              </Group>

            </Stack>
          </Tabs.Panel>

        </Tabs>

        {/* Product Modal */}
        <Modal
          opened={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct 
            ? (isRTL ? 'تعديل المنتج' : 'Edit Product')
            : (isRTL ? 'إضافة منتج جديد' : 'Add New Product')
          }
          size="lg"
          centered
        >
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  label={isRTL ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}
                  value={selectedProduct?.name || ''}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label={isRTL ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}
                  value={selectedProduct?.nameAr || ''}
                  required
                />
              </Grid.Col>
            </Grid>
            
            <Grid gutter="md">
              <Grid.Col span={6}>
                <NumberInput
                  label={isRTL ? 'السعر (د.ب)' : 'Price (BHD)'}
                  value={selectedProduct?.price || 0}
                  decimalScale={3}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label={isRTL ? 'الكمية المتاحة' : 'Stock Quantity'}
                  value={selectedProduct?.stock || 0}
                  required
                />
              </Grid.Col>
            </Grid>
            
            <Textarea
              label={isRTL ? 'وصف المنتج' : 'Product Description'}
              rows={3}
            />
            
            <FileInput
              label={isRTL ? 'صور المنتج' : 'Product Images'}
              multiple
              accept="image/*"
            />
            
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setShowProductModal(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button>
                {selectedProduct 
                  ? (isRTL ? 'تحديث' : 'Update')
                  : (isRTL ? 'إضافة' : 'Add')
                }
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Order Details Modal */}
        <Modal
          opened={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          title={isRTL ? 'تفاصيل الطلب' : 'Order Details'}
          size="md"
          centered
        >
          {selectedOrder && (
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>{isRTL ? 'رقم الطلب:' : 'Order ID:'}</Text>
                <Text ff="monospace">{selectedOrder.id}</Text>
              </Group>
              
              <Divider />
              
              <Group justify="space-between">
                <Text fw={600}>{isRTL ? 'العميل:' : 'Customer:'}</Text>
                <Text>{isRTL ? selectedOrder.customerNameAr : selectedOrder.customerName}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text fw={600}>{isRTL ? 'المجموع:' : 'Total:'}</Text>
                <Text fw={700} c="green">{selectedOrder.total.toFixed(3)} BHD</Text>
              </Group>
              
              <Group justify="space-between">
                <Text fw={600}>{isRTL ? 'العمولة:' : 'Commission:'}</Text>
                <Text fw={600} c="orange">{selectedOrder.commission.toFixed(3)} BHD</Text>
              </Group>
              
              <Group justify="space-between">
                <Text fw={600}>{isRTL ? 'الحالة:' : 'Status:'}</Text>
                <Badge color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Badge>
              </Group>
              
              <Divider />
              
              <div>
                <Text fw={600} mb="xs">{isRTL ? 'المنتجات:' : 'Products:'}</Text>
                <Stack gap="xs">
                  {selectedOrder.products.map((product, index) => (
                    <Text key={index} size="sm">• {product}</Text>
                  ))}
                </Stack>
              </div>
              
              <Group justify="flex-end" mt="md">
                <Button variant="outline">
                  {isRTL ? 'طباعة الفاتورة' : 'Print Invoice'}
                </Button>
                <Button>
                  {isRTL ? 'تحديث الحالة' : 'Update Status'}
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>

      </Stack>
    </Container>
  );
}