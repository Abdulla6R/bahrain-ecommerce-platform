'use client';

import { useState } from 'react';
import {
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Badge,
  Table,
  Modal,
  Alert,
  TextInput,
  Textarea,
  Select,
  Switch,
  ActionIcon,
  Divider,
  Timeline,
  Progress,
  Tabs
} from '@mantine/core';
import {
  IconShield,
  IconDownload,
  IconEye,
  IconTrash,
  IconEdit,
  IconClock,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconDatabase,
  IconFileText,
  IconMail,
  IconUser,
  IconLock,
  IconSearch,
  IconCalendar,
  IconShieldCheck
} from '@tabler/icons-react';

interface PDPLComplianceProps {
  locale: string;
}

interface DataRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  requestType: 'access' | 'deletion' | 'correction' | 'portability';
  requestDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  description: string;
  responseDate?: string;
  notes?: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actionAr: string;
  user: string;
  dataSubject: string;
  dataType: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

interface ConsentRecord {
  id: string;
  customerEmail: string;
  customerName: string;
  consentType: string;
  consentTypeAr: string;
  status: 'active' | 'withdrawn' | 'expired';
  grantedDate: string;
  expiryDate?: string;
  withdrawnDate?: string;
  purpose: string;
  purposeAr: string;
}

interface PrivacyPolicy {
  id: string;
  version: string;
  language: 'en' | 'ar';
  title: string;
  content: string;
  publishDate: string;
  status: 'draft' | 'published' | 'archived';
  lastModified: string;
}

export function PDPLCompliance({ locale }: PDPLComplianceProps) {
  const isRTL = locale === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const dataRequests: DataRequest[] = [
    {
      id: 'REQ-001',
      customerName: 'Ahmed Al-Mahmood',
      customerEmail: 'ahmed.mahmood@email.com',
      requestType: 'access',
      requestDate: '2025-01-18',
      status: 'pending',
      description: 'Request for all personal data stored in the system'
    },
    {
      id: 'REQ-002',
      customerName: 'Fatima Al-Zahra',
      customerEmail: 'fatima.zahra@email.com',
      requestType: 'deletion',
      requestDate: '2025-01-15',
      status: 'completed',
      description: 'Request to delete all personal data',
      responseDate: '2025-01-17',
      notes: 'Data deleted as requested, retention period expired'
    },
    {
      id: 'REQ-003',
      customerName: 'Mohammad Al-Khalifa',
      customerEmail: 'mohammad.khalifa@email.com',
      requestType: 'correction',
      requestDate: '2025-01-12',
      status: 'in_progress',
      description: 'Correction of address information'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-001',
      timestamp: '2025-01-20 14:30:15',
      action: 'Data Access',
      actionAr: 'الوصول للبيانات',
      user: 'vendor@techstore.bh',
      dataSubject: 'ahmed.mahmood@email.com',
      dataType: 'Customer Profile',
      details: 'Viewed customer order history',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: 'LOG-002',
      timestamp: '2025-01-20 13:45:22',
      action: 'Data Modification',
      actionAr: 'تعديل البيانات',
      user: 'vendor@techstore.bh',
      dataSubject: 'fatima.zahra@email.com',
      dataType: 'Shipping Address',
      details: 'Updated delivery address',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: 'LOG-003',
      timestamp: '2025-01-20 12:15:08',
      action: 'Data Deletion',
      actionAr: 'حذف البيانات',
      user: 'admin@tendzd.com',
      dataSubject: 'old.customer@email.com',
      dataType: 'Complete Profile',
      details: 'Deleted inactive customer data (7-year retention)',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  ];

  const consentRecords: ConsentRecord[] = [
    {
      id: 'CON-001',
      customerEmail: 'ahmed.mahmood@email.com',
      customerName: 'Ahmed Al-Mahmood',
      consentType: 'Marketing Communications',
      consentTypeAr: 'التواصل التسويقي',
      status: 'active',
      grantedDate: '2025-01-10',
      purpose: 'Product updates and promotional offers',
      purposeAr: 'تحديثات المنتجات والعروض الترويجية'
    },
    {
      id: 'CON-002',
      customerEmail: 'fatima.zahra@email.com',
      customerName: 'Fatima Al-Zahra',
      consentType: 'Data Processing',
      consentTypeAr: 'معالجة البيانات',
      status: 'withdrawn',
      grantedDate: '2024-12-15',
      withdrawnDate: '2025-01-08',
      purpose: 'Order processing and delivery',
      purposeAr: 'معالجة الطلبات والتوصيل'
    },
    {
      id: 'CON-003',
      customerEmail: 'mohammad.khalifa@email.com',
      customerName: 'Mohammad Al-Khalifa',
      consentType: 'Analytics and Tracking',
      consentTypeAr: 'التحليلات والتتبع',
      status: 'active',
      grantedDate: '2025-01-05',
      expiryDate: '2026-01-05',
      purpose: 'Website analytics and user experience improvement',
      purposeAr: 'تحليلات الموقع وتحسين تجربة المستخدم'
    }
  ];

  const privacyPolicies: PrivacyPolicy[] = [
    {
      id: 'PP-001',
      version: '2.1',
      language: 'en',
      title: 'Privacy Policy - TechStore Bahrain',
      content: 'This privacy policy describes how we collect, use, and protect your personal data...',
      publishDate: '2025-01-15',
      status: 'published',
      lastModified: '2025-01-15 10:30:00'
    },
    {
      id: 'PP-002',
      version: '2.1',
      language: 'ar',
      title: 'سياسة الخصوصية - متجر التكنولوجيا البحرين',
      content: 'توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية بياناتك الشخصية...',
      publishDate: '2025-01-15',
      status: 'published',
      lastModified: '2025-01-15 10:30:00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'active': case 'published': return 'green';
      case 'pending': case 'draft': return 'yellow';
      case 'in_progress': return 'blue';
      case 'rejected': case 'withdrawn': case 'expired': case 'archived': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string, type: 'request' | 'consent' | 'policy' = 'request') => {
    const statusMaps = {
      request: {
        en: {
          pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', rejected: 'Rejected'
        },
        ar: {
          pending: 'في الانتظار', in_progress: 'قيد المعالجة', completed: 'مكتمل', rejected: 'مرفوض'
        }
      },
      consent: {
        en: {
          active: 'Active', withdrawn: 'Withdrawn', expired: 'Expired'
        },
        ar: {
          active: 'نشط', withdrawn: 'سحب', expired: 'منتهي الصلاحية'
        }
      },
      policy: {
        en: {
          draft: 'Draft', published: 'Published', archived: 'Archived'
        },
        ar: {
          draft: 'مسودة', published: 'منشور', archived: 'مؤرشف'
        }
      }
    };

    return statusMaps[type][locale as keyof typeof statusMaps.request][status as keyof typeof statusMaps.request.en] || status;
  };

  const getRequestTypeText = (type: string) => {
    const types = {
      en: {
        access: 'Data Access', deletion: 'Data Deletion', correction: 'Data Correction', portability: 'Data Portability'
      },
      ar: {
        access: 'الوصول للبيانات', deletion: 'حذف البيانات', correction: 'تصحيح البيانات', portability: 'نقل البيانات'
      }
    };
    return types[locale as keyof typeof types][type as keyof typeof types.en] || type;
  };

  const exportAuditLog = () => {
    console.log('Exporting audit log...');
    alert(isRTL ? 'جاري تصدير سجل التدقيق...' : 'Exporting audit log...');
  };

  const complianceScore = 92; // Mock compliance score

  return (
    <Stack gap="lg">
      
      {/* Compliance Overview */}
      <Card withBorder padding="lg">
        <Group justify="space-between" align="center" mb="md">
          <Group gap="sm">
            <IconShieldCheck size={32} className="text-green-600" />
            <div>
              <Title order={3}>
                {isRTL ? 'امتثال قانون حماية البيانات الشخصية' : 'PDPL Compliance Dashboard'}
              </Title>
              <Text c="dimmed">
                {isRTL ? 'متوافق مع قانون حماية البيانات الشخصية البحريني' : 'Bahrain Personal Data Protection Law Compliance'}
              </Text>
            </div>
          </Group>
          
          <Group gap="md">
            <div className="text-center">
              <Text size="2rem" fw={700} c="green">
                {complianceScore}%
              </Text>
              <Text size="sm" c="dimmed">
                {isRTL ? 'درجة الامتثال' : 'Compliance Score'}
              </Text>
            </div>
            <Badge size="xl" color="green">
              {isRTL ? 'متوافق' : 'Compliant'}
            </Badge>
          </Group>
        </Group>
        
        <Progress value={complianceScore} color="green" size="lg" />
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} color="orange">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconShield size={16} />}>
            {isRTL ? 'نظرة عامة' : 'Overview'}
          </Tabs.Tab>
          <Tabs.Tab value="requests" leftSection={<IconFileText size={16} />}>
            {isRTL ? 'طلبات البيانات' : 'Data Requests'}
          </Tabs.Tab>
          <Tabs.Tab value="consent" leftSection={<IconCheck size={16} />}>
            {isRTL ? 'الموافقات' : 'Consent Management'}
          </Tabs.Tab>
          <Tabs.Tab value="audit" leftSection={<IconDatabase size={16} />}>
            {isRTL ? 'سجل التدقيق' : 'Audit Logs'}
          </Tabs.Tab>
          <Tabs.Tab value="policies" leftSection={<IconLock size={16} />}>
            {isRTL ? 'السياسات' : 'Privacy Policies'}
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Stack gap="lg" mt="lg">
            
            <Alert
              icon={<IconShieldCheck size={16} />}
              title={isRTL ? 'حالة الامتثال' : 'Compliance Status'}
              color="green"
              variant="light"
            >
              <Text size="sm">
                {isRTL 
                  ? 'متجرك متوافق مع جميع متطلبات قانون حماية البيانات الشخصية البحريني. آخر تدقيق: 20 يناير 2025'
                  : 'Your store is compliant with all Bahrain PDPL requirements. Last audit: January 20, 2025'
                }
              </Text>
            </Alert>

            <SimpleGrid cols={{ base: 1, md: 3 }}>
              <Card withBorder padding="md">
                <Group gap="sm" mb="md">
                  <IconFileText className="text-blue-600" size={24} />
                  <Text fw={600}>
                    {isRTL ? 'طلبات البيانات' : 'Data Requests'}
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="blue">
                  {dataRequests.length}
                </Text>
                <Text size="sm" c="dimmed">
                  {isRTL ? 'طلبات نشطة' : 'Active requests'}
                </Text>
                <Group gap="xs" mt="xs">
                  <Text size="xs" c="green">
                    {dataRequests.filter(r => r.status === 'completed').length} {isRTL ? 'مكتمل' : 'completed'}
                  </Text>
                  <Text size="xs" c="orange">
                    {dataRequests.filter(r => r.status === 'pending').length} {isRTL ? 'في الانتظار' : 'pending'}
                  </Text>
                </Group>
              </Card>

              <Card withBorder padding="md">
                <Group gap="sm" mb="md">
                  <IconCheck className="text-green-600" size={24} />
                  <Text fw={600}>
                    {isRTL ? 'الموافقات النشطة' : 'Active Consents'}
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="green">
                  {consentRecords.filter(c => c.status === 'active').length}
                </Text>
                <Text size="sm" c="dimmed">
                  {isRTL ? 'من أصل' : 'out of'} {consentRecords.length}
                </Text>
                <Progress 
                  value={(consentRecords.filter(c => c.status === 'active').length / consentRecords.length) * 100} 
                  color="green" 
                  size="sm" 
                  mt="xs" 
                />
              </Card>

              <Card withBorder padding="md">
                <Group gap="sm" mb="md">
                  <IconDatabase className="text-orange-600" size={24} />
                  <Text fw={600}>
                    {isRTL ? 'أنشطة التدقيق' : 'Audit Activities'}
                  </Text>
                </Group>
                <Text size="2rem" fw={700} c="orange">
                  {auditLogs.length}
                </Text>
                <Text size="sm" c="dimmed">
                  {isRTL ? 'هذا الأسبوع' : 'This week'}
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  {isRTL ? 'آخر نشاط: اليوم' : 'Last activity: Today'}
                </Text>
              </Card>
            </SimpleGrid>

            <Card withBorder padding="lg">
              <Title order={4} mb="md">
                {isRTL ? 'الامتثال السريع' : 'Quick Compliance Check'}
              </Title>
              
              <Stack gap="md">
                <Group justify="space-between">
                  <Group gap="sm">
                    <IconCheck className="text-green-500" size={20} />
                    <Text>
                      {isRTL ? 'سياسة خصوصية محدثة' : 'Updated Privacy Policy'}
                    </Text>
                  </Group>
                  <Badge color="green" variant="light">
                    {isRTL ? 'مكتمل' : 'Complete'}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Group gap="sm">
                    <IconCheck className="text-green-500" size={20} />
                    <Text>
                      {isRTL ? 'نظام إدارة الموافقات' : 'Consent Management System'}
                    </Text>
                  </Group>
                  <Badge color="green" variant="light">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Group gap="sm">
                    <IconCheck className="text-green-500" size={20} />
                    <Text>
                      {isRTL ? 'سجل تدقيق البيانات' : 'Data Audit Logging'}
                    </Text>
                  </Group>
                  <Badge color="green" variant="light">
                    {isRTL ? 'مفعل' : 'Enabled'}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Group gap="sm">
                    <IconAlertTriangle className="text-orange-500" size={20} />
                    <Text>
                      {isRTL ? 'مراجعة بيانات قديمة' : 'Legacy Data Review'}
                    </Text>
                  </Group>
                  <Badge color="orange" variant="light">
                    {isRTL ? 'مطلوب' : 'Required'}
                  </Badge>
                </Group>
              </Stack>
            </Card>

          </Stack>
        </Tabs.Panel>

        {/* Data Requests Tab */}
        <Tabs.Panel value="requests">
          <Stack gap="lg" mt="lg">
            
            <Group justify="space-between">
              <Title order={4}>
                {isRTL ? 'طلبات البيانات الشخصية' : 'Personal Data Requests'}
              </Title>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={() => exportAuditLog()}
              >
                {isRTL ? 'تصدير التقرير' : 'Export Report'}
              </Button>
            </Group>

            <TextInput
              placeholder={isRTL ? 'البحث في الطلبات...' : 'Search requests...'}
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Card withBorder padding="lg">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{isRTL ? 'رقم الطلب' : 'Request ID'}</Table.Th>
                    <Table.Th>{isRTL ? 'العميل' : 'Customer'}</Table.Th>
                    <Table.Th>{isRTL ? 'نوع الطلب' : 'Request Type'}</Table.Th>
                    <Table.Th>{isRTL ? 'التاريخ' : 'Date'}</Table.Th>
                    <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                    <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {dataRequests.map((request) => (
                    <Table.Tr key={request.id}>
                      <Table.Td>
                        <Text ff="monospace" fw={500}>{request.id}</Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{request.customerName}</Text>
                          <Text size="xs" c="dimmed">{request.customerEmail}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">
                          {getRequestTypeText(request.requestType)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{request.requestDate}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(request.status)} variant="light">
                          {getStatusText(request.status, 'request')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="outline"
                            color="blue"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRequestModal(true);
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

        {/* Consent Management Tab */}
        <Tabs.Panel value="consent">
          <Stack gap="lg" mt="lg">
            
            <Title order={4}>
              {isRTL ? 'إدارة الموافقات' : 'Consent Management'}
            </Title>

            <Card withBorder padding="lg">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{isRTL ? 'العميل' : 'Customer'}</Table.Th>
                    <Table.Th>{isRTL ? 'نوع الموافقة' : 'Consent Type'}</Table.Th>
                    <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                    <Table.Th>{isRTL ? 'تاريخ المنح' : 'Granted Date'}</Table.Th>
                    <Table.Th>{isRTL ? 'الغرض' : 'Purpose'}</Table.Th>
                    <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {consentRecords.map((consent) => (
                    <Table.Tr key={consent.id}>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{consent.customerName}</Text>
                          <Text size="xs" c="dimmed">{consent.customerEmail}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {isRTL ? consent.consentTypeAr : consent.consentType}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(consent.status)} variant="light">
                          {getStatusText(consent.status, 'consent')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{consent.grantedDate}</Text>
                        {consent.withdrawnDate && (
                          <Text size="xs" c="red">
                            {isRTL ? 'سحب في:' : 'Withdrawn:'} {consent.withdrawnDate}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={2}>
                          {isRTL ? consent.purposeAr : consent.purpose}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="outline" color="blue" size="sm">
                            <IconEye size={14} />
                          </ActionIcon>
                          {consent.status === 'active' && (
                            <ActionIcon variant="outline" color="red" size="sm">
                              <IconX size={14} />
                            </ActionIcon>
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

        {/* Audit Logs Tab */}
        <Tabs.Panel value="audit">
          <Stack gap="lg" mt="lg">
            
            <Group justify="space-between">
              <Title order={4}>
                {isRTL ? 'سجل تدقيق البيانات' : 'Data Audit Trail'}
              </Title>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={exportAuditLog}
              >
                {isRTL ? 'تصدير السجل' : 'Export Log'}
              </Button>
            </Group>

            <Card withBorder padding="lg">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{isRTL ? 'الوقت' : 'Timestamp'}</Table.Th>
                    <Table.Th>{isRTL ? 'الإجراء' : 'Action'}</Table.Th>
                    <Table.Th>{isRTL ? 'المستخدم' : 'User'}</Table.Th>
                    <Table.Th>{isRTL ? 'صاحب البيانات' : 'Data Subject'}</Table.Th>
                    <Table.Th>{isRTL ? 'نوع البيانات' : 'Data Type'}</Table.Th>
                    <Table.Th>{isRTL ? 'التفاصيل' : 'Details'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {auditLogs.map((log) => (
                    <Table.Tr key={log.id}>
                      <Table.Td>
                        <Text size="xs" ff="monospace">{log.timestamp}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">
                          {isRTL ? log.actionAr : log.action}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{log.user}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{log.dataSubject}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{log.dataType}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={1}>{log.details}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>

          </Stack>
        </Tabs.Panel>

        {/* Privacy Policies Tab */}
        <Tabs.Panel value="policies">
          <Stack gap="lg" mt="lg">
            
            <Group justify="space-between">
              <Title order={4}>
                {isRTL ? 'سياسات الخصوصية' : 'Privacy Policies'}
              </Title>
              <Button
                leftSection={<IconFileText size={16} />}
                onClick={() => setShowPolicyModal(true)}
              >
                {isRTL ? 'إضافة سياسة' : 'Add Policy'}
              </Button>
            </Group>

            <Card withBorder padding="lg">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{isRTL ? 'العنوان' : 'Title'}</Table.Th>
                    <Table.Th>{isRTL ? 'الإصدار' : 'Version'}</Table.Th>
                    <Table.Th>{isRTL ? 'اللغة' : 'Language'}</Table.Th>
                    <Table.Th>{isRTL ? 'تاريخ النشر' : 'Publish Date'}</Table.Th>
                    <Table.Th>{isRTL ? 'الحالة' : 'Status'}</Table.Th>
                    <Table.Th>{isRTL ? 'الإجراءات' : 'Actions'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {privacyPolicies.map((policy) => (
                    <Table.Tr key={policy.id}>
                      <Table.Td>
                        <Text fw={500}>{policy.title}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">{policy.version}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text>{policy.language.toUpperCase()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{policy.publishDate}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(policy.status)} variant="light">
                          {getStatusText(policy.status, 'policy')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="outline" color="blue" size="sm">
                            <IconEye size={14} />
                          </ActionIcon>
                          <ActionIcon variant="outline" color="orange" size="sm">
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

      </Tabs>

      {/* Request Details Modal */}
      <Modal
        opened={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSelectedRequest(null);
        }}
        title={isRTL ? 'تفاصيل طلب البيانات' : 'Data Request Details'}
        size="lg"
        centered
      >
        {selectedRequest && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600}>{isRTL ? 'رقم الطلب:' : 'Request ID:'}</Text>
              <Text ff="monospace">{selectedRequest.id}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={600}>{isRTL ? 'نوع الطلب:' : 'Request Type:'}</Text>
              <Badge>{getRequestTypeText(selectedRequest.requestType)}</Badge>
            </Group>
            
            <Group justify="space-between">
              <Text fw={600}>{isRTL ? 'الحالة:' : 'Status:'}</Text>
              <Badge color={getStatusColor(selectedRequest.status)}>
                {getStatusText(selectedRequest.status, 'request')}
              </Badge>
            </Group>
            
            <Divider />
            
            <div>
              <Text fw={600} mb="xs">{isRTL ? 'وصف الطلب:' : 'Request Description:'}</Text>
              <Text size="sm">{selectedRequest.description}</Text>
            </div>
            
            {selectedRequest.notes && (
              <div>
                <Text fw={600} mb="xs">{isRTL ? 'الملاحظات:' : 'Notes:'}</Text>
                <Text size="sm">{selectedRequest.notes}</Text>
              </div>
            )}
            
            <Group justify="flex-end" mt="md">
              <Button variant="outline">
                {isRTL ? 'تحديث الحالة' : 'Update Status'}
              </Button>
              <Button>
                {isRTL ? 'إرسال رد' : 'Send Response'}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

    </Stack>
  );
}