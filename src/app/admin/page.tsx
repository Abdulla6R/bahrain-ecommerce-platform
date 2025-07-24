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
  Badge,
  SimpleGrid,
  ActionIcon,
  Table,
  Modal,
  TextInput,
  Select,
  Textarea,
  NumberInput,
  Switch,
  Alert,
  Progress,
  Divider,
  Avatar,
  Paper,
  Anchor,
  FileInput,
  Notification
} from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconShoppingBag,
  IconChartBar,
  IconHeadset,
  IconSettings,
  IconCheck,
  IconX,
  IconEye,
  IconEdit,
  IconDownload,
  IconUpload,
  IconSearch,
  IconFilter,
  IconPlus,
  IconTrash,
  IconBell,
  IconMail,
  IconPhone,
  IconBuilding,
  IconCoin,
  IconTrendingUp,
  IconTrendingDown,
  IconExclamationMark,
  IconShield,
  IconFlag,
  IconFileText,
  IconCalendar,
  IconClock,
  IconStar
} from '@tabler/icons-react';

interface AdminPanelProps {
  locale?: string;
}

interface PendingVendor {
  id: string;
  businessName: string;
  businessNameAr: string;
  ownerName: string;
  email: string;
  phone: string;
  crNumber: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended';
  submissionDate: string;
  category: string;
  estimatedVolume: string;
  documents: {
    crCertificate: boolean;
    businessLicense: boolean;
    vatCertificate: boolean;
    trademarkCertificate: boolean;
  };
  verificationScore: number;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  subjectAr: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'product' | 'vendor' | 'general';
  createdAt: string;
  lastResponse: string;
  assignedTo?: string;
}

interface PlatformMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeVendors: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  platformCommission: number;
  monthlyGrowth: number;
}

export default function AdminPanel({ locale = 'en' }: AdminPanelProps) {
  const isRTL = locale === 'ar';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<PendingVendor | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock platform metrics
  const metrics: PlatformMetrics = {
    totalRevenue: 234567.890,
    totalOrders: 1847,
    activeVendors: 42,
    totalCustomers: 8934,
    conversionRate: 3.2,
    averageOrderValue: 127.150,
    platformCommission: 35184.183,
    monthlyGrowth: 12.5
  };

  // Mock pending vendors
  const pendingVendors: PendingVendor[] = [
    {
      id: '1',
      businessName: 'TechZone Electronics',
      businessNameAr: 'تك زون للإلكترونيات',
      ownerName: 'Mohammed Al-Rashid',
      email: 'info@techzone.bh',
      phone: '+973 1234 5678',
      crNumber: '123456-01',
      status: 'pending_review',
      submissionDate: '2025-01-20',
      category: 'Electronics',
      estimatedVolume: '50,000-100,000 BHD',
      documents: {
        crCertificate: true,
        businessLicense: true,
        vatCertificate: true,
        trademarkCertificate: false
      },
      verificationScore: 85
    },
    {
      id: '2',
      businessName: 'Bahrain Fashion Hub',
      businessNameAr: 'مركز الأزياء البحريني',
      ownerName: 'Fatima Al-Khalifa',
      email: 'contact@fashionhub.bh',
      phone: '+973 9876 5432',
      crNumber: '789012-02',
      status: 'pending_review',
      submissionDate: '2025-01-19',
      category: 'Fashion & Clothing',
      estimatedVolume: '25,000-50,000 BHD',
      documents: {
        crCertificate: true,
        businessLicense: true,
        vatCertificate: false,
        trademarkCertificate: true
      },
      verificationScore: 78
    }
  ];

  // Mock support tickets
  const supportTickets: SupportTicket[] = [
    {
      id: '1',
      ticketNumber: 'TK-2025-001234',
      customerName: 'Ahmed Al-Mahmood',
      customerEmail: 'ahmed@email.com',
      subject: 'Payment processing issue',
      subjectAr: 'مشكلة في معالجة الدفع',
      priority: 'high',
      status: 'open',
      category: 'billing',
      createdAt: '2025-01-20 14:30',
      lastResponse: '2025-01-20 14:30'
    },
    {
      id: '2',
      ticketNumber: 'TK-2025-001233',
      customerName: 'Sarah Al-Zahra',
      customerEmail: 'sarah@email.com',
      subject: 'Product not received',
      subjectAr: 'لم يتم استلام المنتج',
      priority: 'medium',
      status: 'in_progress',
      category: 'product',
      createdAt: '2025-01-19 10:15',
      lastResponse: '2025-01-20 09:45',
      assignedTo: 'Support Agent 1'
    },
    {
      id: '3',
      ticketNumber: 'TK-2025-001232',
      customerName: 'Omar Al-Mansoori',
      customerEmail: 'omar@email.com',
      subject: 'Account verification help',
      subjectAr: 'مساعدة في تأكيد الحساب',
      priority: 'low',
      status: 'resolved',
      category: 'technical',
      createdAt: '2025-01-18 16:20',
      lastResponse: '2025-01-19 11:30',
      assignedTo: 'Support Agent 2'
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
      case 'approved': case 'resolved': case 'active': return 'green';
      case 'pending_review': case 'open': case 'in_progress': return 'yellow';
      case 'rejected': case 'suspended': case 'closed': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string, type: 'vendor' | 'ticket' = 'vendor') => {
    const statusMaps = {
      vendor: {
        en: {
          pending_review: 'Pending Review',
          approved: 'Approved',
          rejected: 'Rejected',
          suspended: 'Suspended'
        },
        ar: {
          pending_review: 'في انتظار المراجعة',
          approved: 'موافق عليه',
          rejected: 'مرفوض',
          suspended: 'معلق'
        }
      },
      ticket: {
        en: {
          open: 'Open',
          in_progress: 'In Progress',
          resolved: 'Resolved',
          closed: 'Closed'
        },
        ar: {
          open: 'مفتوح',
          in_progress: 'قيد المعالجة',
          resolved: 'تم حله',
          closed: 'مغلق'
        }
      }
    };

    const typeMap = statusMaps[type];
    const localeMap = typeMap[locale as keyof typeof typeMap];
    return (localeMap as any)[status] || status;
  };

  const approveVendor = (vendorId: string) => {
    console.log('Approving vendor:', vendorId);
    // Implementation would update vendor status
  };

  const rejectVendor = (vendorId: string) => {
    console.log('Rejecting vendor:', vendorId);
    // Implementation would update vendor status
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        
        {/* Header */}
        <Card withBorder padding="lg">
          <Group justify="space-between">
            <div>
              <Title order={2}>
                {isRTL ? 'لوحة إدارة المنصة' : 'Platform Admin Dashboard'}
              </Title>
              <Text c="dimmed">
                {isRTL ? 'إدارة البائعين والطلبات والدعم الفني' : 'Manage vendors, orders, and customer support'}
              </Text>
            </div>
            <Group gap="sm">
              <Badge color="green" variant="light" size="lg">
                {isRTL ? 'نشط' : 'Active'}
              </Badge>
              <ActionIcon variant="outline" size="lg">
                <IconBell size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'dashboard')} color="orange">
          <Tabs.List>
            <Tabs.Tab value="dashboard" leftSection={<IconDashboard size={16} />}>
              {isRTL ? 'لوحة المعلومات' : 'Dashboard'}
            </Tabs.Tab>
            <Tabs.Tab value="vendors" leftSection={<IconShoppingBag size={16} />}>
              {isRTL ? 'البائعون' : 'Vendors'}
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              {isRTL ? 'التحليلات' : 'Analytics'}
            </Tabs.Tab>
            <Tabs.Tab value="support" leftSection={<IconHeadset size={16} />}>
              {isRTL ? 'الدعم الفني' : 'Support'}
            </Tabs.Tab>
            <Tabs.Tab value="content" leftSection={<IconFileText size={16} />}>
              {isRTL ? 'إدارة المحتوى' : 'Content'}
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              {isRTL ? 'الإعدادات' : 'Settings'}
            </Tabs.Tab>
          </Tabs.List>

          {/* Dashboard Tab */}
          <Tabs.Panel value="dashboard">
            <Stack gap="lg" mt="lg">
              
              {/* Key Metrics */}
              <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
                <Card withBorder padding="lg" className="text-center">
                  <IconCoin size={32} className="text-green-600 mx-auto mb-2" />
                  <Text size="1.8rem" fw={700} c="green">
                    {formatCurrency(metrics.totalRevenue)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
                  </Text>
                  <Group justify="center" gap={4} mt="xs">
                    <IconTrendingUp size={14} className="text-green-500" />
                    <Text size="xs" c="green" fw={600}>+{metrics.monthlyGrowth}%</Text>
                  </Group>
                </Card>

                <Card withBorder padding="lg" className="text-center">
                  <IconShoppingBag size={32} className="text-blue-600 mx-auto mb-2" />
                  <Text size="1.8rem" fw={700} c="blue">
                    {metrics.activeVendors}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {isRTL ? 'البائعون النشطون' : 'Active Vendors'}
                  </Text>
                  <Group justify="center" gap={4} mt="xs">
                    <IconTrendingUp size={14} className="text-green-500" />
                    <Text size="xs" c="green" fw={600}>+8.2%</Text>
                  </Group>
                </Card>

                <Card withBorder padding="lg" className="text-center">
                  <IconUsers size={32} className="text-orange-600 mx-auto mb-2" />
                  <Text size="1.8rem" fw={700} c="orange">
                    {metrics.totalCustomers.toLocaleString()}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {isRTL ? 'إجمالي العملاء' : 'Total Customers'}
                  </Text>
                  <Group justify="center" gap={4} mt="xs">
                    <IconTrendingUp size={14} className="text-green-500" />
                    <Text size="xs" c="green" fw={600}>+15.7%</Text>
                  </Group>
                </Card>

                <Card withBorder padding="lg" className="text-center">
                  <IconChartBar size={32} className="text-teal-600 mx-auto mb-2" />
                  <Text size="1.8rem" fw={700} c="teal">
                    {metrics.conversionRate}%
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

              {/* Recent Activity */}
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Card withBorder padding="lg">
                  <Group justify="space-between" mb="md">
                    <Title order={4}>
                      {isRTL ? 'البائعون في انتظار الموافقة' : 'Pending Vendor Approvals'}
                    </Title>
                    <Badge color="orange" variant="light">
                      {pendingVendors.filter(v => v.status === 'pending_review').length}
                    </Badge>
                  </Group>
                  
                  <Stack gap="sm">
                    {pendingVendors.slice(0, 3).map((vendor) => (
                      <Paper key={vendor.id} withBorder p="sm">
                        <Group justify="space-between">
                          <div>
                            <Text fw={500} size="sm">
                              {isRTL ? vendor.businessNameAr : vendor.businessName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {vendor.ownerName} • {vendor.submissionDate}
                            </Text>
                          </div>
                          <Group gap="xs">
                            <ActionIcon color="green" variant="outline" size="sm">
                              <IconCheck size={14} />
                            </ActionIcon>
                            <ActionIcon color="red" variant="outline" size="sm">
                              <IconX size={14} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>

                <Card withBorder padding="lg">
                  <Group justify="space-between" mb="md">
                    <Title order={4}>
                      {isRTL ? 'تذاكر الدعم المفتوحة' : 'Open Support Tickets'}
                    </Title>
                    <Badge color="red" variant="light">
                      {supportTickets.filter(t => t.status === 'open').length}
                    </Badge>
                  </Group>
                  
                  <Stack gap="sm">
                    {supportTickets.filter(t => t.status === 'open').slice(0, 3).map((ticket) => (
                      <Paper key={ticket.id} withBorder p="sm">
                        <Group justify="space-between">
                          <div>
                            <Text fw={500} size="sm">
                              {isRTL ? ticket.subjectAr : ticket.subject}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {ticket.customerName} • {ticket.createdAt}
                            </Text>
                          </div>
                          <Badge color={getPriorityColor(ticket.priority)} variant="light" size="sm">
                            {ticket.priority}
                          </Badge>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              </SimpleGrid>

              {/* Commission Overview */}
              <Card withBorder padding="lg">
                <Group justify="space-between" mb="md">
                  <Title order={4}>
                    {isRTL ? 'نظرة عامة على العمولات' : 'Commission Overview'}
                  </Title>
                  <Button variant="outline" size="sm">
                    {isRTL ? 'تفاصيل أكثر' : 'View Details'}
                  </Button>
                </Group>
                
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                  <div>
                    <Text size="sm" c="dimmed" mb="xs">
                      {isRTL ? 'عمولة المنصة هذا الشهر' : 'Platform Commission (This Month)'}
                    </Text>
                    <Text size="2rem" fw={700} c="green">
                      {formatCurrency(metrics.platformCommission)}
                    </Text>
                    <Progress value={78} color="green" size="sm" mt="xs" />
                  </div>
                  
                  <div>
                    <Text size="sm" c="dimmed" mb="xs">
                      {isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
                    </Text>
                    <Text size="2rem" fw={700} c="blue">
                      {formatCurrency(metrics.averageOrderValue)}
                    </Text>
                    <Progress value={65} color="blue" size="sm" mt="xs" />
                  </div>
                  
                  <div>
                    <Text size="sm" c="dimmed" mb="xs">
                      {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                    </Text>
                    <Text size="2rem" fw={700} c="orange">
                      {metrics.totalOrders.toLocaleString()}
                    </Text>
                    <Progress value={82} color="orange" size="sm" mt="xs" />
                  </div>
                </SimpleGrid>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Vendors Tab */}
          <Tabs.Panel value="vendors">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={4}>
                  {isRTL ? 'إدارة البائعين' : 'Vendor Management'}
                </Title>
                <Group gap="sm">
                  <Select
                    placeholder={isRTL ? 'تصفية حسب الحالة' : 'Filter by status'}
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value || 'all')}
                    data={[
                      { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Status' },
                      { value: 'pending_review', label: isRTL ? 'في انتظار المراجعة' : 'Pending Review' },
                      { value: 'approved', label: isRTL ? 'موافق عليه' : 'Approved' },
                      { value: 'rejected', label: isRTL ? 'مرفوض' : 'Rejected' }
                    ]}
                    w={200}
                  />
                  <Button leftSection={<IconDownload size={16} />}>
                    {isRTL ? 'تصدير' : 'Export'}
                  </Button>
                </Group>
              </Group>

              <Card withBorder padding="lg">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{isRTL ? 'اسم الشركة' : 'Business Name'}</Table.Th>
                      <Table.Th>{isRTL ? 'المالك' : 'Owner'}</Table.Th>
                      <Table.Th>{isRTL ? 'رقم السجل التجاري' : 'CR Number'}</Table.Th>
                      <Table.Th>{isRTL ? 'تاريخ التقديم' : 'Submission Date'}</Table.Th>
                      <Table.Th>{isRTL ? 'نقاط التحقق' : 'Verification Score'}</Table.Th>
                      <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                      <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pendingVendors.map((vendor) => (
                      <Table.Tr key={vendor.id}>
                        <Table.Td>
                          <div>
                            <Text fw={500}>{isRTL ? vendor.businessNameAr : vendor.businessName}</Text>
                            <Text size="xs" c="dimmed">{vendor.category}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm">{vendor.ownerName}</Text>
                            <Text size="xs" c="dimmed">{vendor.email}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text ff="monospace">{vendor.crNumber}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{vendor.submissionDate}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Progress 
                              value={vendor.verificationScore} 
                              color={vendor.verificationScore >= 80 ? 'green' : 'orange'} 
                              w={80} 
                              size="sm" 
                            />
                            <Text size="sm" fw={500}>
                              {vendor.verificationScore}%
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(vendor.status)} variant="light">
                            {getStatusText(vendor.status, 'vendor')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon
                              variant="outline"
                              color="blue"
                              size="sm"
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setShowVendorModal(true);
                              }}
                            >
                              <IconEye size={14} />
                            </ActionIcon>
                            {vendor.status === 'pending_review' && (
                              <>
                                <ActionIcon
                                  variant="outline"
                                  color="green"
                                  size="sm"
                                  onClick={() => approveVendor(vendor.id)}
                                >
                                  <IconCheck size={14} />
                                </ActionIcon>
                                <ActionIcon
                                  variant="outline"
                                  color="red"
                                  size="sm"
                                  onClick={() => rejectVendor(vendor.id)}
                                >
                                  <IconX size={14} />
                                </ActionIcon>
                              </>
                            )}
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
              
              <Title order={4}>
                {isRTL ? 'تحليلات المنصة' : 'Platform Analytics'}
              </Title>

              {/* Financial Analytics */}
              <Card withBorder padding="lg">
                <Title order={5} mb="md">
                  {isRTL ? 'التحليلات المالية' : 'Financial Analytics'}
                </Title>
                
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                  <div className="text-center">
                    <Text size="2rem" fw={700} c="green">
                      {formatCurrency(metrics.totalRevenue)}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
                    </Text>
                    <Progress value={85} color="green" size="lg" mt="sm" />
                  </div>
                  
                  <div className="text-center">
                    <Text size="2rem" fw={700} c="orange">
                      {formatCurrency(metrics.platformCommission)}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'عمولة المنصة' : 'Platform Commission'}
                    </Text>
                    <Progress value={78} color="orange" size="lg" mt="sm" />
                  </div>
                  
                  <div className="text-center">
                    <Text size="2rem" fw={700} c="blue">
                      {formatCurrency(metrics.averageOrderValue)}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
                    </Text>
                    <Progress value={65} color="blue" size="lg" mt="sm" />
                  </div>
                </SimpleGrid>
              </Card>

              {/* Vendor Performance */}
              <Card withBorder padding="lg">
                <Title order={5} mb="md">
                  {isRTL ? 'أداء البائعين' : 'Vendor Performance'}
                </Title>
                
                <Alert color="blue" variant="light" mb="md">
                  <Text size="sm">
                    {isRTL 
                      ? 'يعرض هذا القسم تحليلات أداء البائعين النشطين على المنصة'
                      : 'This section shows performance analytics for active vendors on the platform'
                    }
                  </Text>
                </Alert>
                
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                  <div>
                    <Text fw={500} mb="sm">
                      {isRTL ? 'توزيع البائعين حسب الفئة' : 'Vendor Distribution by Category'}
                    </Text>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm">Electronics</Text>
                        <Text size="sm" fw={500}>40%</Text>
                      </Group>
                      <Progress value={40} color="blue" />
                      
                      <Group justify="space-between">
                        <Text size="sm">Fashion</Text>
                        <Text size="sm" fw={500}>25%</Text>
                      </Group>
                      <Progress value={25} color="green" />
                      
                      <Group justify="space-between">
                        <Text size="sm">Home & Garden</Text>
                        <Text size="sm" fw={500}>20%</Text>
                      </Group>
                      <Progress value={20} color="orange" />
                      
                      <Group justify="space-between">
                        <Text size="sm">Sports</Text>
                        <Text size="sm" fw={500}>15%</Text>
                      </Group>
                      <Progress value={15} color="red" />
                    </Stack>
                  </div>
                  
                  <div>
                    <Text fw={500} mb="sm">
                      {isRTL ? 'أفضل البائعين أداءً' : 'Top Performing Vendors'}
                    </Text>
                    <Stack gap="sm">
                      <Paper withBorder p="sm">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>TechStore Bahrain</Text>
                          <Text size="sm" c="green">{formatCurrency(45670.500)}</Text>
                        </Group>
                      </Paper>
                      <Paper withBorder p="sm">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>Fashion Hub</Text>
                          <Text size="sm" c="green">{formatCurrency(32440.250)}</Text>
                        </Group>
                      </Paper>
                      <Paper withBorder p="sm">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>Electronics Plus</Text>
                          <Text size="sm" c="green">{formatCurrency(28950.750)}</Text>
                        </Group>
                      </Paper>
                    </Stack>
                  </div>
                </SimpleGrid>
              </Card>

            </Stack>
          </Tabs.Panel>

          {/* Support Tab */}
          <Tabs.Panel value="support">
            <Stack gap="lg" mt="lg">
              
              <Group justify="space-between">
                <Title order={4}>
                  {isRTL ? 'إدارة الدعم الفني' : 'Support Management'}
                </Title>
                <Group gap="sm">
                  <Select
                    placeholder={isRTL ? 'تصفية حسب الحالة' : 'Filter by status'}
                    data={[
                      { value: 'all', label: isRTL ? 'جميع التذاكر' : 'All Tickets' },
                      { value: 'open', label: isRTL ? 'مفتوح' : 'Open' },
                      { value: 'in_progress', label: isRTL ? 'قيد المعالجة' : 'In Progress' },
                      { value: 'resolved', label: isRTL ? 'تم حله' : 'Resolved' }
                    ]}
                    w={180}
                  />
                  <Button leftSection={<IconPlus size={16} />}>
                    {isRTL ? 'تذكرة جديدة' : 'New Ticket'}
                  </Button>
                </Group>
              </Group>

              <Card withBorder padding="lg">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{isRTL ? 'رقم التذكرة' : 'Ticket #'}</Table.Th>
                      <Table.Th>{isRTL ? 'العميل' : 'Customer'}</Table.Th>
                      <Table.Th>{isRTL ? 'الموضوع' : 'Subject'}</Table.Th>
                      <Table.Th>{isRTL ? 'الأولوية' : 'Priority'}</Table.Th>
                      <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                      <Table.Th>{isRTL ? 'مخصص لـ' : 'Assigned To'}</Table.Th>
                      <Table.Th>{isRTL ? 'آخر رد' : 'Last Response'}</Table.Th>
                      <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {supportTickets.map((ticket) => (
                      <Table.Tr key={ticket.id}>
                        <Table.Td>
                          <Text ff="monospace" fw={500} size="sm">
                            {ticket.ticketNumber}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>{ticket.customerName}</Text>
                            <Text size="xs" c="dimmed">{ticket.customerEmail}</Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" lineClamp={2}>
                            {isRTL ? ticket.subjectAr : ticket.subject}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getPriorityColor(ticket.priority)} variant="light">
                            {ticket.priority}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(ticket.status)} variant="light">
                            {getStatusText(ticket.status, 'ticket')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{ticket.assignedTo || '-'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{ticket.lastResponse}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon
                              variant="outline"
                              color="blue"
                              size="sm"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowTicketModal(true);
                              }}
                            >
                              <IconEye size={14} />
                            </ActionIcon>
                            <ActionIcon variant="outline" color="orange" size="sm">
                              <IconEdit size={14} />
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

          {/* Content Tab */}
          <Tabs.Panel value="content">
            <Stack gap="lg" mt="lg">
              
              <Title order={4}>
                {isRTL ? 'إدارة المحتوى' : 'Content Management'}
              </Title>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Card withBorder padding="lg">
                  <Group justify="space-between" mb="md">
                    <Title order={5}>
                      {isRTL ? 'العروض والبانرات' : 'Promotions & Banners'}
                    </Title>
                    <ActionIcon variant="outline" color="orange">
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <Stack gap="sm">
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>Ramadan Sale 2025</Text>
                          <Text size="xs" c="dimmed">Valid until March 30, 2025</Text>
                        </div>
                        <Badge color="green" variant="light">Active</Badge>
                      </Group>
                    </Paper>
                    
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>Electronics Mega Sale</Text>
                          <Text size="xs" c="dimmed">Valid until February 15, 2025</Text>
                        </div>
                        <Badge color="orange" variant="light">Scheduled</Badge>
                      </Group>
                    </Paper>
                  </Stack>
                </Card>

                <Card withBorder padding="lg">
                  <Group justify="space-between" mb="md">
                    <Title order={5}>
                      {isRTL ? 'إعلانات المنصة' : 'Platform Announcements'}
                    </Title>
                    <ActionIcon variant="outline" color="orange">
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <Stack gap="sm">
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>System Maintenance</Text>
                          <Text size="xs" c="dimmed">Scheduled for January 25, 2025</Text>
                        </div>
                        <Badge color="yellow" variant="light">Scheduled</Badge>
                      </Group>
                    </Paper>
                    
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>New Payment Method</Text>
                          <Text size="xs" c="dimmed">Apple Pay now available</Text>
                        </div>
                        <Badge color="blue" variant="light">Published</Badge>
                      </Group>
                    </Paper>
                  </Stack>
                </Card>
              </SimpleGrid>

            </Stack>
          </Tabs.Panel>

          {/* Settings Tab */}
          <Tabs.Panel value="settings">
            <Stack gap="lg" mt="lg">
              
              <Title order={4}>
                {isRTL ? 'إعدادات المنصة' : 'Platform Settings'}
              </Title>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Card withBorder padding="lg">
                  <Title order={5} mb="md">
                    {isRTL ? 'إعدادات العمولة' : 'Commission Settings'}
                  </Title>
                  
                  <Stack gap="md">
                    <NumberInput
                      label={isRTL ? 'معدل العمولة الافتراضي (%)' : 'Default Commission Rate (%)'}
                      defaultValue={15}
                      min={0}
                      max={30}
                      suffix="%"
                    />
                    
                    <NumberInput
                      label={isRTL ? 'الحد الأدنى للدفع (د.ب)' : 'Minimum Payout (BHD)'}
                      defaultValue={50}
                      min={10}
                      suffix=" BHD"
                    />
                    
                    <Select
                      label={isRTL ? 'دورة الدفع' : 'Payout Cycle'}
                      defaultValue="weekly"
                      data={[
                        { value: 'weekly', label: isRTL ? 'أسبوعي' : 'Weekly' },
                        { value: 'monthly', label: isRTL ? 'شهري' : 'Monthly' },
                        { value: 'quarterly', label: isRTL ? 'ربع سنوي' : 'Quarterly' }
                      ]}
                    />
                  </Stack>
                </Card>

                <Card withBorder padding="lg">
                  <Title order={5} mb="md">
                    {isRTL ? 'إعدادات النظام' : 'System Settings'}
                  </Title>
                  
                  <Stack gap="md">
                    <Switch
                      label={isRTL ? 'تفعيل التسجيل التلقائي للبائعين' : 'Enable automatic vendor registration'}
                      defaultChecked={false}
                    />
                    
                    <Switch
                      label={isRTL ? 'تفعيل المراجعات والتقييمات' : 'Enable reviews and ratings'}
                      defaultChecked={true}
                    />
                    
                    <Switch
                      label={isRTL ? 'تفعيل الإشعارات بالبريد الإلكتروني' : 'Enable email notifications'}
                      defaultChecked={true}
                    />
                    
                    <Switch
                      label={isRTL ? 'وضع الصيانة' : 'Maintenance mode'}
                      defaultChecked={false}
                    />
                  </Stack>
                </Card>
              </SimpleGrid>

            </Stack>
          </Tabs.Panel>

        </Tabs>

        {/* Vendor Details Modal */}
        <Modal
          opened={showVendorModal}
          onClose={() => {
            setShowVendorModal(false);
            setSelectedVendor(null);
          }}
          title={isRTL ? 'تفاصيل البائع' : 'Vendor Details'}
          size="lg"
          centered
        >
          {selectedVendor && (
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600} size="lg">
                  {isRTL ? selectedVendor.businessNameAr : selectedVendor.businessName}
                </Text>
                <Badge color={getStatusColor(selectedVendor.status)}>
                  {getStatusText(selectedVendor.status, 'vendor')}
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    {isRTL ? 'اسم المالك' : 'Owner Name'}
                  </Text>
                  <Text fw={500}>{selectedVendor.ownerName}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </Text>
                  <Text fw={500}>{selectedVendor.email}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    {isRTL ? 'رقم الهاتف' : 'Phone'}
                  </Text>
                  <Text fw={500}>{selectedVendor.phone}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    {isRTL ? 'رقم السجل التجاري' : 'CR Number'}
                  </Text>
                  <Text fw={500} ff="monospace">{selectedVendor.crNumber}</Text>
                </div>
              </SimpleGrid>

              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  {isRTL ? 'الوثائق المطلوبة' : 'Required Documents'}
                </Text>
                <SimpleGrid cols={2} spacing="xs">
                  <Group gap="xs">
                    {selectedVendor.documents.crCertificate ? 
                      <IconCheck size={16} className="text-green-500" /> : 
                      <IconX size={16} className="text-red-500" />
                    }
                    <Text size="sm">
                      {isRTL ? 'شهادة السجل التجاري' : 'CR Certificate'}
                    </Text>
                  </Group>
                  
                  <Group gap="xs">
                    {selectedVendor.documents.businessLicense ? 
                      <IconCheck size={16} className="text-green-500" /> : 
                      <IconX size={16} className="text-red-500" />
                    }
                    <Text size="sm">
                      {isRTL ? 'الرخصة التجارية' : 'Business License'}
                    </Text>
                  </Group>
                </SimpleGrid>
              </div>

              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  {isRTL ? 'نقاط التحقق' : 'Verification Score'}
                </Text>
                <Group gap="md">
                  <Progress 
                    value={selectedVendor.verificationScore} 
                    color={selectedVendor.verificationScore >= 80 ? 'green' : 'orange'} 
                    w={200} 
                  />
                  <Text fw={600}>{selectedVendor.verificationScore}%</Text>
                </Group>
              </div>

              <Divider />

              <Group justify="flex-end" gap="sm">
                <Button variant="outline" color="red">
                  {isRTL ? 'رفض' : 'Reject'}
                </Button>
                <Button color="green">
                  {isRTL ? 'موافقة' : 'Approve'}
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>

        {/* Support Ticket Modal */}
        <Modal
          opened={showTicketModal}
          onClose={() => {
            setShowTicketModal(false);
            setSelectedTicket(null);
          }}
          title={isRTL ? 'تفاصيل التذكرة' : 'Ticket Details'}
          size="lg"
          centered
        >
          {selectedTicket && (
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600} ff="monospace">
                  {selectedTicket.ticketNumber}
                </Text>
                <Badge color={getStatusColor(selectedTicket.status)}>
                  {getStatusText(selectedTicket.status, 'ticket')}
                </Badge>
              </Group>

              <div>
                <Text fw={500} mb="xs">
                  {isRTL ? 'الموضوع' : 'Subject'}
                </Text>
                <Text>{isRTL ? selectedTicket.subjectAr : selectedTicket.subject}</Text>
              </div>

              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    {isRTL ? 'العميل' : 'Customer'}
                  </Text>
                  <Text fw={500}>{selectedTicket.customerName}</Text>
                  <Text size="sm" c="dimmed">{selectedTicket.customerEmail}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    {isRTL ? 'الأولوية' : 'Priority'}
                  </Text>
                  <Badge color={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
              </SimpleGrid>

              <Divider />

              <Textarea
                label={isRTL ? 'الرد' : 'Response'}
                placeholder={isRTL ? 'اكتب ردك هنا...' : 'Type your response here...'}
                rows={4}
              />

              <Group justify="flex-end" gap="sm">
                <Button variant="outline">
                  {isRTL ? 'إغلاق التذكرة' : 'Close Ticket'}
                </Button>
                <Button>
                  {isRTL ? 'إرسال الرد' : 'Send Response'}
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>

      </Stack>
    </Container>
  );
}