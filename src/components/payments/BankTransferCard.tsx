'use client';

import { useState } from 'react';
import { 
  Card, 
  Stack, 
  Text, 
  Button, 
  Group, 
  Divider, 
  Alert, 
  Badge,
  Collapse,
  CopyButton,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconBuildingBank, 
  IconCopy, 
  IconCheck, 
  IconInfoCircle,
  IconChevronDown,
  IconChevronUp,
  IconClock
} from '@tabler/icons-react';

interface BankTransferCardProps {
  amount: number;
  currency?: string;
  orderReference: string;
  onConfirmTransfer: (bankDetails: any) => void;
  locale: string;
}

interface BankAccount {
  bankName: string;
  bankNameAr: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  accountHolder: string;
  accountHolderAr: string;
  logo?: string;
}

const bahrainiBanks: BankAccount[] = [
  {
    bankName: 'National Bank of Bahrain (NBB)',
    bankNameAr: 'بنك البحرين الوطني',
    accountNumber: '001234567890',
    iban: 'BH67NBOB00001234567890',
    swiftCode: 'NBOBBJR0',
    accountHolder: 'Tendzd E-commerce Ltd',
    accountHolderAr: 'شركة تندز للتجارة الإلكترونية المحدودة'
  },
  {
    bankName: 'Bahrain Islamic Bank (BisB)',
    bankNameAr: 'بنك البحرين الإسلامي',
    accountNumber: '002345678901',
    iban: 'BH89BISB00002345678901',
    swiftCode: 'BISBBJR0',
    accountHolder: 'Tendzd E-commerce Ltd',
    accountHolderAr: 'شركة تندز للتجارة الإلكترونية المحدودة'
  },
  {
    bankName: 'Bank of Bahrain and Kuwait (BBK)',
    bankNameAr: 'بنك البحرين والكويت',
    accountNumber: '003456789012',
    iban: 'BH12BBKS00003456789012',
    swiftCode: 'BBKSBHJR',
    accountHolder: 'Tendzd E-commerce Ltd',
    accountHolderAr: 'شركة تندز للتجارة الإلكترونية المحدودة'
  }
];

export function BankTransferCard({
  amount,
  currency = 'BHD',
  orderReference,
  onConfirmTransfer,
  locale
}: BankTransferCardProps) {
  const isRTL = locale === 'ar';
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const handleConfirmTransfer = () => {
    if (!selectedBank) return;

    setTransferConfirmed(true);
    onConfirmTransfer({
      bank: selectedBank,
      amount: amount,
      currency: currency,
      reference: orderReference,
      transferredAt: new Date().toISOString()
    });
  };

  const toggleBankDetails = (bankName: string) => {
    setExpandedBank(expandedBank === bankName ? null : bankName);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        
        {/* Header */}
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconBuildingBank size={24} className="text-blue-600" />
            <Text size="lg" fw={600}>
              {isRTL ? 'التحويل البنكي' : 'Bank Transfer'}
            </Text>
          </Group>
          <Badge color="blue" variant="light">
            {isRTL ? 'آمن' : 'Secure'}
          </Badge>
        </Group>

        {/* Amount Display */}
        <Card withBorder padding="md" bg="blue.0">
          <Group justify="space-between">
            <Text size="md" fw={500}>
              {isRTL ? 'المبلغ المطلوب تحويله:' : 'Amount to Transfer:'}
            </Text>
            <Text size="xl" fw={700} c="blue">
              {amount.toFixed(3)} {currency}
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mt="xs">
            {isRTL ? `رقم المرجع: ${orderReference}` : `Reference: ${orderReference}`}
          </Text>
        </Card>

        {/* Instructions */}
        <Alert
          icon={<IconInfoCircle size={16} />}
          title={isRTL ? 'تعليمات التحويل' : 'Transfer Instructions'}
          color="blue"
          variant="light"
        >
          <Text size="sm">
            {isRTL 
              ? 'اختر البنك المناسب وقم بنسخ تفاصيل الحساب لإجراء التحويل. تأكد من إدراج رقم المرجع في وصف التحويل.'
              : 'Select your preferred bank and copy the account details to make the transfer. Make sure to include the reference number in the transfer description.'
            }
          </Text>
        </Alert>

        {/* Bank Selection */}
        <div>
          <Text fw={600} mb="sm">
            {isRTL ? 'اختر البنك:' : 'Select Bank:'}
          </Text>
          
          <Stack gap="sm">
            {bahrainiBanks.map((bank) => (
              <Card 
                key={bank.bankName} 
                withBorder 
                padding="md"
                className={`cursor-pointer transition-colors ${
                  selectedBank?.bankName === bank.bankName 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedBank(bank)}
              >
                <Group justify="space-between" align="center">
                  <div>
                    <Text fw={600} size="md">
                      {isRTL ? bank.bankNameAr : bank.bankName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'انقر لعرض تفاصيل الحساب' : 'Click to view account details'}
                    </Text>
                  </div>
                  
                  <Group gap="xs">
                    {selectedBank?.bankName === bank.bankName && (
                      <Badge color="blue" size="sm">
                        {isRTL ? 'مختار' : 'Selected'}
                      </Badge>
                    )}
                    <ActionIcon
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBankDetails(bank.bankName);
                      }}
                    >
                      {expandedBank === bank.bankName ? 
                        <IconChevronUp size={16} /> : 
                        <IconChevronDown size={16} />
                      }
                    </ActionIcon>
                  </Group>
                </Group>

                {/* Bank Details */}
                <Collapse in={expandedBank === bank.bankName}>
                  <Divider my="md" />
                  <Stack gap="sm">
                    
                    {/* Account Holder */}
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {isRTL ? 'اسم صاحب الحساب:' : 'Account Holder:'}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" ff="monospace">
                          {isRTL ? bank.accountHolderAr : bank.accountHolder}
                        </Text>
                        <CopyButton value={isRTL ? bank.accountHolderAr : bank.accountHolder}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ' : 'Copy')}>
                              <ActionIcon 
                                color={copied ? 'teal' : 'gray'} 
                                variant="subtle" 
                                onClick={copy}
                                size="sm"
                              >
                                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Group>

                    {/* Account Number */}
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {isRTL ? 'رقم الحساب:' : 'Account Number:'}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" ff="monospace">{bank.accountNumber}</Text>
                        <CopyButton value={bank.accountNumber}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ' : 'Copy')}>
                              <ActionIcon 
                                color={copied ? 'teal' : 'gray'} 
                                variant="subtle" 
                                onClick={copy}
                                size="sm"
                              >
                                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Group>

                    {/* IBAN */}
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {isRTL ? 'رقم الآيبان:' : 'IBAN:'}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" ff="monospace">{bank.iban}</Text>
                        <CopyButton value={bank.iban}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ' : 'Copy')}>
                              <ActionIcon 
                                color={copied ? 'teal' : 'gray'} 
                                variant="subtle" 
                                onClick={copy}
                                size="sm"
                              >
                                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Group>

                    {/* SWIFT Code */}
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {isRTL ? 'رمز السويفت:' : 'SWIFT Code:'}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" ff="monospace">{bank.swiftCode}</Text>
                        <CopyButton value={bank.swiftCode}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ' : 'Copy')}>
                              <ActionIcon 
                                color={copied ? 'teal' : 'gray'} 
                                variant="subtle" 
                                onClick={copy}
                                size="sm"
                              >
                                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Group>

                    {/* Reference Number */}
                    <Group justify="space-between">
                      <Text size="sm" fw={500} c="red">
                        {isRTL ? 'رقم المرجع (مطلوب):' : 'Reference (Required):'}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" ff="monospace" c="red" fw={600}>
                          {orderReference}
                        </Text>
                        <CopyButton value={orderReference}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ' : 'Copy')}>
                              <ActionIcon 
                                color={copied ? 'teal' : 'red'} 
                                variant="subtle" 
                                onClick={copy}
                                size="sm"
                              >
                                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Group>

                  </Stack>
                </Collapse>
              </Card>
            ))}
          </Stack>
        </div>

        {/* Processing Time */}
        <Alert
          icon={<IconClock size={16} />}
          title={isRTL ? 'وقت المعالجة' : 'Processing Time'}
          color="orange"
          variant="light"
        >
          <Text size="sm">
            {isRTL 
              ? 'عادة ما يستغرق التحويل البنكي 1-3 أيام عمل للمعالجة. سيتم تأكيد طلبك عند استلام الدفعة.'
              : 'Bank transfers usually take 1-3 business days to process. Your order will be confirmed once payment is received.'
            }
          </Text>
        </Alert>

        {/* Confirmation Button */}
        <Button
          size="lg"
          fullWidth
          color="blue"
          disabled={!selectedBank || transferConfirmed}
          onClick={handleConfirmTransfer}
          leftSection={transferConfirmed ? <IconCheck size={20} /> : <IconBuildingBank size={20} />}
        >
          {transferConfirmed 
            ? (isRTL ? 'تم تأكيد التحويل' : 'Transfer Confirmed')
            : (isRTL ? 'أكد التحويل البنكي' : 'Confirm Bank Transfer')
          }
        </Button>

        {transferConfirmed && (
          <Alert
            icon={<IconCheck size={16} />}
            title={isRTL ? 'تم التأكيد' : 'Confirmed'}
            color="green"
            variant="light"
          >
            <Text size="sm">
              {isRTL 
                ? 'شكراً لك! سنقوم بمعالجة طلبك عند استلام التحويل البنكي.'
                : 'Thank you! We will process your order once the bank transfer is received.'
              }
            </Text>
          </Alert>
        )}

      </Stack>
    </Card>
  );
}