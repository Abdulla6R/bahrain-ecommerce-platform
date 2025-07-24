'use client';

import { useState } from 'react';
import {
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Select,
  Badge,
  Progress,
  Table,
  ActionIcon,
  Divider,
  Alert,
  NumberFormatter
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconDownload,
  IconFilter,
  IconCalendar,
  IconCoin,
  IconShoppingCart,
  IconUsers,
  IconEye,
  IconHeart,
  IconRefresh,
  IconChartBar,
  IconFileSpreadsheet,
  IconFileDescription
} from '@tabler/icons-react';

interface VendorAnalyticsProps {
  locale: string;
}

interface AnalyticsData {
  period: string;
  sales: number;
  orders: number;
  revenue: number;
  commission: number;
  visitors: number;
  conversionRate: number;
  averageOrderValue: number;
  returnCustomers: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  nameAr: string;
  views: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  stock: number;
  trend: 'up' | 'down' | 'stable';
}

interface CustomerDemographic {
  segment: string;
  segmentAr: string;
  percentage: number;
  revenue: number;
  growth: number;
}

export function VendorAnalytics({ locale }: VendorAnalyticsProps) {
  const isRTL = locale === 'ar';
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const analyticsData: AnalyticsData[] = [
    {
      period: '7 days',
      sales: 12450.750,
      orders: 45,
      revenue: 12450.750,
      commission: 1867.612,
      visitors: 2340,
      conversionRate: 1.92,
      averageOrderValue: 276.683,
      returnCustomers: 23
    },
    {
      period: '30 days',
      sales: 48920.250,
      orders: 176,
      revenue: 48920.250,
      commission: 7338.037,
      visitors: 8760,
      conversionRate: 2.01,
      averageOrderValue: 278.183,
      returnCustomers: 89
    },
    {
      period: '90 days',
      sales: 142380.500,
      orders: 521,
      revenue: 142380.500,
      commission: 21357.075,
      visitors: 25430,
      conversionRate: 2.05,
      averageOrderValue: 273.283,
      returnCustomers: 267
    }
  ];

  const topProducts: ProductPerformance[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      nameAr: 'آيفون 15 برو ماكس',
      views: 2340,
      orders: 23,
      revenue: 10361.500,
      conversionRate: 0.98,
      stock: 15,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      nameAr: 'سامسونج جالاكسي إس 24 ألترا',
      views: 1890,
      orders: 18,
      revenue: 6853.500,
      conversionRate: 0.95,
      stock: 8,
      trend: 'up'
    },
    {
      id: '3',
      name: 'MacBook Pro M3',
      nameAr: 'ماك بوك برو إم 3',
      views: 1456,
      orders: 5,
      revenue: 3250.000,
      conversionRate: 0.34,
      stock: 0,
      trend: 'down'
    },
    {
      id: '4',
      name: 'iPad Air M2',
      nameAr: 'آيباد إير إم 2',
      views: 1234,
      orders: 12,
      revenue: 4680.000,
      conversionRate: 0.97,
      stock: 22,
      trend: 'stable'
    }
  ];

  const customerDemographics: CustomerDemographic[] = [
    {
      segment: 'Young Professionals (25-35)',
      segmentAr: 'المهنيون الشباب (25-35)',
      percentage: 42,
      revenue: 20567.320,
      growth: 15.2
    },
    {
      segment: 'Tech Enthusiasts (18-30)',
      segmentAr: 'عشاق التكنولوجيا (18-30)',
      percentage: 28,
      revenue: 13698.180,
      growth: 8.7
    },
    {
      segment: 'Business Executives (35-50)',
      segmentAr: 'المديرين التنفيذيين (35-50)',
      percentage: 22,
      revenue: 10762.550,
      growth: 12.3
    },
    {
      segment: 'Students (18-25)',
      segmentAr: 'الطلاب (18-25)',
      percentage: 8,
      revenue: 3892.200,
      growth: -2.1
    }
  ];

  const currentData = analyticsData.find(data => data.period.includes(selectedPeriod)) || analyticsData[1];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <IconTrendingUp size={16} className="text-green-500" />;
      case 'down': return <IconTrendingDown size={16} className="text-red-500" />;
      default: return <IconTrendingUp size={16} className="text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-BH' : 'en-BH', {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3
    }).format(amount);
  };

  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting analytics data as ${format}`);
    alert(isRTL 
      ? `جاري تصدير البيانات بصيغة ${format.toUpperCase()}...`
      : `Exporting data as ${format.toUpperCase()}...`
    );
  };

  return (
    <Stack gap="lg">
      
      {/* Controls */}
      <Group justify="space-between">
        <Group gap="md">
          <Select
            placeholder={isRTL ? 'اختر الفترة' : 'Select period'}
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value || '30')}
            data={[
              { value: '7', label: isRTL ? 'آخر 7 أيام' : 'Last 7 days' },
              { value: '30', label: isRTL ? 'آخر 30 يوم' : 'Last 30 days' },
              { value: '90', label: isRTL ? 'آخر 90 يوم' : 'Last 90 days' }
            ]}
            leftSection={<IconCalendar size={16} />}
            w={180}
          />
          
          <ActionIcon variant="outline" size="lg">
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
        
        <Group gap="sm">
          <Button
            variant="outline"
            leftSection={<IconFileDescription size={16} />}
            onClick={() => exportData('pdf')}
          >
            PDF
          </Button>
          <Button
            variant="outline"
            leftSection={<IconFileSpreadsheet size={16} />}
            onClick={() => exportData('excel')}
          >
            Excel
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={() => exportData('csv')}
          >
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </Group>
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        <Card withBorder padding="lg" className="text-center">
          <IconCoin size={32} className="text-green-600 mx-auto mb-2" />
          <Text size="2rem" fw={700} c="green">
            {formatCurrency(currentData.revenue)}
          </Text>
          <Text size="sm" c="dimmed">
            {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
          </Text>
          <Group justify="center" gap={4} mt="xs">
            <IconTrendingUp size={14} className="text-green-500" />
            <Text size="xs" c="green" fw={600}>+12.5%</Text>
          </Group>
        </Card>
        
        <Card withBorder padding="lg" className="text-center">
          <IconShoppingCart size={32} className="text-blue-600 mx-auto mb-2" />
          <Text size="2rem" fw={700} c="blue">
            {currentData.orders}
          </Text>
          <Text size="sm" c="dimmed">
            {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
          </Text>
          <Group justify="center" gap={4} mt="xs">
            <IconTrendingUp size={14} className="text-green-500" />
            <Text size="xs" c="green" fw={600}>+8.3%</Text>
          </Group>
        </Card>
        
        <Card withBorder padding="lg" className="text-center">
          <IconUsers size={32} className="text-orange-600 mx-auto mb-2" />
          <Text size="2rem" fw={700} c="orange">
            {currentData.visitors.toLocaleString()}
          </Text>
          <Text size="sm" c="dimmed">
            {isRTL ? 'الزوار' : 'Visitors'}
          </Text>
          <Group justify="center" gap={4} mt="xs">
            <IconTrendingUp size={14} className="text-green-500" />
            <Text size="xs" c="green" fw={600}>+15.7%</Text>
          </Group>
        </Card>
        
        <Card withBorder padding="lg" className="text-center">
          <IconChartBar size={32} className="text-teal-600 mx-auto mb-2" />
          <Text size="2rem" fw={700} c="teal">
            {currentData.conversionRate}%
          </Text>
          <Text size="sm" c="dimmed">
            {isRTL ? 'معدل التحويل' : 'Conversion Rate'}
          </Text>
          <Group justify="center" gap={4} mt="xs">
            <IconTrendingUp size={14} className="text-green-500" />
            <Text size="xs" c="green" fw={600}>+2.1%</Text>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Secondary Metrics */}
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Card withBorder padding="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              {isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
            </Text>
            <Text size="lg" fw={700} c="orange">
              {formatCurrency(currentData.averageOrderValue)}
            </Text>
          </Group>
          <Progress value={73} color="orange" size="sm" />
          <Text size="xs" c="dimmed" mt="xs">
            {isRTL ? 'مقارنة بالهدف الشهري' : 'Compared to monthly target'}
          </Text>
        </Card>
        
        <Card withBorder padding="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              {isRTL ? 'العمولة المكتسبة' : 'Commission Earned'}
            </Text>
            <Text size="lg" fw={700} c="green">
              {formatCurrency(currentData.commission)}
            </Text>
          </Group>
          <Progress value={68} color="green" size="sm" />
          <Text size="xs" c="dimmed" mt="xs">
            {isRTL ? '15% من إجمالي المبيعات' : '15% of total sales'}
          </Text>
        </Card>
        
        <Card withBorder padding="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              {isRTL ? 'العملاء العائدون' : 'Returning Customers'}
            </Text>
            <Text size="lg" fw={700} c="blue">
              {currentData.returnCustomers}
            </Text>
          </Group>
          <Progress value={currentData.returnCustomers} color="blue" size="sm" />
          <Text size="xs" c="dimmed" mt="xs">
            {isRTL ? 'من إجمالي العملاء' : 'Of total customers'}
          </Text>
        </Card>
      </SimpleGrid>

      {/* Product Performance */}
      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>
            {isRTL ? 'أداء المنتجات' : 'Product Performance'}
          </Title>
          <Button variant="light" size="xs">
            {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
          </Button>
        </Group>
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{isRTL ? 'المنتج' : 'Product'}</Table.Th>
              <Table.Th>{isRTL ? 'المشاهدات' : 'Views'}</Table.Th>
              <Table.Th>{isRTL ? 'الطلبات' : 'Orders'}</Table.Th>
              <Table.Th>{isRTL ? 'الإيرادات' : 'Revenue'}</Table.Th>
              <Table.Th>{isRTL ? 'معدل التحويل' : 'Conversion'}</Table.Th>
              <Table.Th>{isRTL ? 'المخزون' : 'Stock'}</Table.Th>
              <Table.Th>{isRTL ? 'الاتجاه' : 'Trend'}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {topProducts.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Text fw={500} size="sm">
                    {isRTL ? product.nameAr : product.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconEye size={14} className="text-gray-500" />
                    <Text size="sm">{product.views.toLocaleString()}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600}>{product.orders}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600} c="green">
                    {formatCurrency(product.revenue)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{product.conversionRate}%</Text>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {product.stock}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {getTrendIcon(product.trend)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Customer Demographics */}
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder padding="lg">
          <Title order={4} mb="md">
            {isRTL ? 'التركيبة الديموغرافية للعملاء' : 'Customer Demographics'}
          </Title>
          
          <Stack gap="md">
            {customerDemographics.map((segment, index) => (
              <div key={index}>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    {isRTL ? segment.segmentAr : segment.segment}
                  </Text>
                  <Group gap="sm">
                    <Text size="sm" fw={600}>
                      {segment.percentage}%
                    </Text>
                    <Text 
                      size="xs" 
                      c={segment.growth > 0 ? 'green' : 'red'}
                      fw={600}
                    >
                      {segment.growth > 0 ? '+' : ''}{segment.growth}%
                    </Text>
                  </Group>
                </Group>
                <Progress value={segment.percentage} size="sm" mb="xs" />
                <Text size="xs" c="dimmed">
                  {isRTL ? 'إيرادات:' : 'Revenue:'} {formatCurrency(segment.revenue)}
                </Text>
              </div>
            ))}
          </Stack>
        </Card>

        <Card withBorder padding="lg">
          <Title order={4} mb="md">
            {isRTL ? 'نصائح لتحسين الأداء' : 'Performance Improvement Tips'}
          </Title>
          
          <Stack gap="sm">
            <Alert color="blue" variant="light">
              <Text size="sm" fw={500} mb="xs">
                {isRTL ? 'تحسين معدل التحويل' : 'Improve Conversion Rate'}
              </Text>
              <Text size="xs">
                {isRTL 
                  ? 'أضف المزيد من الصور عالية الجودة لمنتجاتك لزيادة معدل التحويل بنسبة 23%'
                  : 'Add more high-quality product images to increase conversion rate by 23%'
                }
              </Text>
            </Alert>
            
            <Alert color="orange" variant="light">
              <Text size="sm" fw={500} mb="xs">
                {isRTL ? 'إدارة المخزون' : 'Inventory Management'}
              </Text>
              <Text size="xs">
                {isRTL 
                  ? 'لديك 3 منتجات نفدت من المخزون. تجديد المخزون قد يزيد المبيعات بنسبة 15%'
                  : 'You have 3 out-of-stock products. Restocking could increase sales by 15%'
                }
              </Text>
            </Alert>
            
            <Alert color="green" variant="light">
              <Text size="sm" fw={500} mb="xs">
                {isRTL ? 'العملاء المتكررون' : 'Repeat Customers'}
              </Text>
              <Text size="xs">
                {isRTL 
                  ? 'معدل العملاء المتكررين جيد. فكر في برنامج ولاء لزيادة الاحتفاظ بالعملاء'
                  : 'Good repeat customer rate. Consider a loyalty program to increase retention'
                }
              </Text>
            </Alert>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Sales Forecast */}
      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>
            {isRTL ? 'توقعات المبيعات' : 'Sales Forecast'}
          </Title>
          <Badge color="blue" variant="light">
            {isRTL ? 'الشهر القادم' : 'Next Month'}
          </Badge>
        </Group>
        
        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <div className="text-center">
            <Text size="2rem" fw={700} c="blue">
              {formatCurrency(52340.125)}
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'الإيرادات المتوقعة' : 'Expected Revenue'}
            </Text>
            <Group justify="center" gap={4} mt="xs">
              <IconTrendingUp size={14} className="text-green-500" />
              <Text size="xs" c="green" fw={600}>+7.2%</Text>
            </Group>
          </div>
          
          <div className="text-center">
            <Text size="2rem" fw={700} c="orange">
              189
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'الطلبات المتوقعة' : 'Expected Orders'}
            </Text>
            <Group justify="center" gap={4} mt="xs">
              <IconTrendingUp size={14} className="text-green-500" />
              <Text size="xs" c="green" fw={600}>+5.8%</Text>
            </Group>
          </div>
          
          <div className="text-center">
            <Text size="2rem" fw={700} c="green">
              {formatCurrency(7851.018)}
            </Text>
            <Text size="sm" c="dimmed">
              {isRTL ? 'العمولة المتوقعة' : 'Expected Commission'}
            </Text>
            <Group justify="center" gap={4} mt="xs">
              <IconTrendingUp size={14} className="text-green-500" />
              <Text size="xs" c="green" fw={600}>+7.2%</Text>
            </Group>
          </div>
        </SimpleGrid>
        
        <Divider my="md" />
        
        <Text size="xs" c="dimmed" ta="center">
          {isRTL 
            ? 'التوقعات مبنية على أداء الـ 90 يوم الماضية وتحليل اتجاهات السوق'
            : 'Forecasts based on last 90 days performance and market trend analysis'
          }
        </Text>
      </Card>

    </Stack>
  );
}