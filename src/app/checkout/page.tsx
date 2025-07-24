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
  Divider,
  Alert,
  Progress,
  Badge,
  Stepper
} from '@mantine/core';
import {
  IconShoppingCart,
  IconTruck,
  IconCreditCard,
  IconCheck,
  IconShield,
  IconInfoCircle
} from '@tabler/icons-react';

import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { BenefitPayButton } from '@/components/payments/BenefitPayButton';
import { ApplePayButton } from '@/components/payments/ApplePayButton';
import { BankTransferCard } from '@/components/payments/BankTransferCard';

interface CheckoutPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams;
  const locale = resolvedSearchParams.locale || 'en';
  const isRTL = locale === 'ar';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState<any>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Mock cart data (in production, get from Redux/Context or API)
  const mockCartItems = [
    {
      id: '1',
      productId: 'prod-1',
      name: 'iPhone 15 Pro Max 256GB',
      nameAr: 'آيفون 15 برو ماكس 256 جيجا',
      image: '/api/placeholder/100/100',
      price: 450.500,
      quantity: 1,
      maxQuantity: 5,
      vendor: {
        id: 'vendor-1',
        name: 'TechStore Bahrain',
        nameAr: 'متجر التكنولوجيا البحرين',
        rating: 4.8,
        freeShippingThreshold: 100.000
      },
      attributes: {
        color: 'Natural Titanium',
        colorAr: 'تيتانيوم طبيعي'
      }
    }
  ];

  const totalAmount = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderReference = `TENDZD_${Date.now()}`;

  const merchantInfo = {
    merchantId: process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_ID || 'merchant.com.tendzd.ecommerce',
    merchantName: 'Tendzd - Bahrain E-commerce',
    countryCode: 'BH'
  };

  const steps = [
    {
      label: isRTL ? 'مراجعة السلة' : 'Review Cart',
      icon: IconShoppingCart
    },
    {
      label: isRTL ? 'معلومات الشحن' : 'Shipping Info',
      icon: IconTruck
    },
    {
      label: isRTL ? 'طريقة الدفع' : 'Payment Method',
      icon: IconCreditCard
    },
    {
      label: isRTL ? 'تأكيد الطلب' : 'Order Confirmation',
      icon: IconCheck
    }
  ];

  const handleStepComplete = (stepData: any) => {
    setCheckoutData((prev: any) => ({ ...prev, ...stepData }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setIsProcessingPayment(false);
    setCheckoutData((prev: any) => ({ 
      ...prev, 
      payment: paymentData,
      status: 'completed',
      completedAt: new Date().toISOString()
    }));
    setCurrentStep(3); // Move to confirmation step
  };

  const handlePaymentError = (error: string) => {
    setIsProcessingPayment(false);
    console.error('Payment error:', error);
    // Show error notification
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title order={2} mb="lg">
              {isRTL ? 'مراجعة عناصر السلة' : 'Review Cart Items'}
            </Title>
            <ShoppingCart
              locale={locale}
              initialItems={mockCartItems}
            />
            <Group justify="flex-end" mt="xl">
              <Button
                size="lg"
                onClick={() => handleStepComplete({ cartReviewed: true })}
                rightSection={<IconTruck size={20} />}
              >
                {isRTL ? 'متابعة إلى الشحن' : 'Continue to Shipping'}
              </Button>
            </Group>
          </div>
        );

      case 1:
        return (
          <div>
            <Title order={2} mb="lg">
              {isRTL ? 'معلومات الشحن والفوترة' : 'Shipping & Billing Information'}
            </Title>
            <CheckoutFlow
              locale={locale}
              cartItems={mockCartItems}
              onComplete={handleStepComplete}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <Title order={2} mb="lg">
              {isRTL ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
            </Title>

            {/* Order Summary */}
            <Card withBorder padding="lg" mb="xl">
              <Group justify="space-between" mb="md">
                <Text size="lg" fw={600}>
                  {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {totalAmount.toFixed(3)} BHD
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {isRTL ? `رقم المرجع: ${orderReference}` : `Reference: ${orderReference}`}
              </Text>
            </Card>

            {/* Payment Methods */}
            <Stack gap="lg">
              
              {/* BenefitPay */}
              <Card 
                withBorder 
                padding="lg"
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === 'benefit_pay' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPaymentMethod('benefit_pay')}
              >
                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <IconCreditCard className="text-blue-600" size={24} />
                    <div>
                      <Text fw={600} size="lg">
                        {isRTL ? 'بنفت باي' : 'BenefitPay'}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'البطاقات البحرينية والمحفظة الرقمية' : 'Bahraini cards & digital wallet'}
                      </Text>
                    </div>
                  </Group>
                  {selectedPaymentMethod === 'benefit_pay' && (
                    <Badge color="blue">{isRTL ? 'مختار' : 'Selected'}</Badge>
                  )}
                </Group>
                
                {selectedPaymentMethod === 'benefit_pay' && (
                  <div className="mt-4">
                    <BenefitPayButton
                      amount={totalAmount}
                      currency="BHD"
                      orderItems={mockCartItems}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      locale={locale}
                      disabled={isProcessingPayment}
                    />
                  </div>
                )}
              </Card>

              {/* Apple Pay */}
              <Card 
                withBorder 
                padding="lg"
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === 'apple_pay' ? 'border-gray-800 bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPaymentMethod('apple_pay')}
              >
                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <IconCreditCard className="text-gray-800" size={24} />
                    <div>
                      <Text fw={600} size="lg">
                        {isRTL ? 'آبل باي' : 'Apple Pay'}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'للأجهزة المتوافقة مع آبل باي' : 'For Apple Pay compatible devices'}
                      </Text>
                    </div>
                  </Group>
                  {selectedPaymentMethod === 'apple_pay' && (
                    <Badge color="dark">{isRTL ? 'مختار' : 'Selected'}</Badge>
                  )}
                </Group>
                
                {selectedPaymentMethod === 'apple_pay' && (
                  <div className="mt-4">
                    <ApplePayButton
                      amount={totalAmount}
                      currency="BHD"
                      orderItems={mockCartItems}
                      merchantInfo={merchantInfo}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      locale={locale}
                      disabled={isProcessingPayment}
                    />
                  </div>
                )}
              </Card>

              {/* Bank Transfer */}
              <Card 
                withBorder 
                padding="lg"
                className={`cursor-pointer transition-all ${
                  selectedPaymentMethod === 'bank_transfer' ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPaymentMethod('bank_transfer')}
              >
                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <IconCreditCard className="text-green-600" size={24} />
                    <div>
                      <Text fw={600} size="lg">
                        {isRTL ? 'التحويل البنكي' : 'Bank Transfer'}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {isRTL ? 'تحويل مباشر من البنوك البحرينية' : 'Direct transfer from Bahraini banks'}
                      </Text>
                    </div>
                  </Group>
                  {selectedPaymentMethod === 'bank_transfer' && (
                    <Badge color="green">{isRTL ? 'مختار' : 'Selected'}</Badge>
                  )}
                </Group>
                
                {selectedPaymentMethod === 'bank_transfer' && (
                  <div className="mt-4">
                    <BankTransferCard
                      amount={totalAmount}
                      currency="BHD"
                      orderReference={orderReference}
                      onConfirmTransfer={handlePaymentSuccess}
                      locale={locale}
                    />
                  </div>
                )}
              </Card>

            </Stack>

            {/* Security Notice */}
            <Alert
              icon={<IconShield size={16} />}
              title={isRTL ? 'معاملة آمنة' : 'Secure Transaction'}
              color="green"
              variant="light"
              mt="xl"
            >
              <Text size="sm">
                {isRTL 
                  ? 'جميع المعاملات محمية بأحدث تقنيات التشفير ومتوافقة مع معايير الأمان البحرينية'
                  : 'All transactions are protected with the latest encryption technology and comply with Bahraini security standards'
                }
              </Text>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-8">
              <IconCheck size={80} className="text-green-600 mx-auto mb-4" />
              <Title order={1} c="green" mb="md">
                {isRTL ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
              </Title>
              <Text size="lg" c="dimmed" mb="xl">
                {isRTL 
                  ? 'شكراً لك! تم استلام طلبك وسيتم معالجته قريباً'
                  : 'Thank you! Your order has been received and will be processed soon'
                }
              </Text>
            </div>

            <Card withBorder padding="xl" className="max-w-md mx-auto">
              <Stack gap="md">
                <Group justify="space-between">
                  <Text fw={500}>{isRTL ? 'رقم الطلب:' : 'Order Number:'}</Text>
                  <Text ff="monospace" fw={600}>{orderReference}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>{isRTL ? 'المبلغ المدفوع:' : 'Amount Paid:'}</Text>
                  <Text fw={700} c="green">{totalAmount.toFixed(3)} BHD</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>{isRTL ? 'طريقة الدفع:' : 'Payment Method:'}</Text>
                  <Text fw={600}>{selectedPaymentMethod?.replace('_', ' ').toUpperCase()}</Text>
                </Group>
              </Stack>
            </Card>

            <Group justify="center" gap="md" mt="xl">
              <Button variant="outline" size="lg">
                {isRTL ? 'تتبع الطلب' : 'Track Order'}
              </Button>
              <Button size="lg" color="orange">
                {isRTL ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Group>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        
        {/* Header */}
        <div>
          <Title order={1} ta="center" mb="md">
            {isRTL ? 'إتمام الطلب' : 'Checkout'}
          </Title>
          <Text size="lg" ta="center" c="dimmed" mb="xl">
            {isRTL ? 'أكمل طلبك بخطوات سهلة وآمنة' : 'Complete your order with easy and secure steps'}
          </Text>
        </div>

        {/* Progress Stepper */}
        <Card withBorder padding="lg">
          <Stepper 
            active={currentStep} 
            color="orange"
            size="md"
          >
            {steps.map((step, index) => (
              <Stepper.Step
                key={index}
                label={step.label}
                icon={<step.icon size={18} />}
                allowStepSelect={index < currentStep}
                onClick={() => index < currentStep && setCurrentStep(index)}
              />
            ))}
          </Stepper>
        </Card>

        {/* Step Content */}
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {/* Processing Overlay */}
        {isProcessingPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card shadow="lg" padding="xl" className="text-center">
              <Stack gap="md" align="center">
                <Progress value={100} animated className="w-64" />
                <Text size="lg" fw={600}>
                  {isRTL ? 'جاري معالجة الدفعة...' : 'Processing Payment...'}
                </Text>
                <Text size="sm" c="dimmed">
                  {isRTL ? 'يرجى عدم إغلاق هذه الصفحة' : 'Please do not close this page'}
                </Text>
              </Stack>
            </Card>
          </div>
        )}

      </Stack>
    </Container>
  );
}