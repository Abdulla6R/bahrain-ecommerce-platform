'use client';

import {
  Container,
  Stepper,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Card,
  Grid,
  TextInput,
  Select,
  Checkbox,
  Radio,
  Divider,
  Alert,
  Badge,
  Image,
  ActionIcon,
  Modal
} from '@mantine/core';
import {
  IconShoppingCart,
  IconTruck,
  IconCreditCard,
  IconCheck,
  IconMapPin,
  IconPhone,
  IconMail,
  IconBuilding,
  IconInfoCircle,
  IconArrowRight,
  IconArrowLeft,
  IconEdit,
  IconShield
} from '@tabler/icons-react';
import { useState } from 'react';
import { BahrainPrismaUtils } from '@/lib/prisma';

interface CheckoutFlowProps {
  locale: string;
  cartItems: any[];
  onComplete?: (orderData: any) => void;
}

interface Address {
  id?: string;
  fullName: string;
  fullNameAr?: string;
  phone: string;
  email?: string;
  governorate: string;
  city: string;
  area: string;
  addressLine1: string;
  addressLine2?: string;
  buildingNumber?: string;
  flatNumber?: string;
  landmark?: string;
  isDefault?: boolean;
}

interface BusinessDetails {
  crNumber: string;
  vatNumber?: string;
  companyName: string;
  companyNameAr?: string;
}

export function CheckoutFlow({ locale, cartItems = [], onComplete }: CheckoutFlowProps) {
  const isRTL = locale === 'ar';
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    governorate: '',
    city: '',
    area: '',
    addressLine1: ''
  });
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    governorate: '',
    city: '',
    area: '',
    addressLine1: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [isBusinessOrder, setIsBusinessOrder] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    crNumber: '',
    companyName: ''
  });

  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('benefit_pay');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [subscribedToNewsletter, setSubscedToNewsletter] = useState(false);

  // Bahrain governorates and their cities
  const bahrainLocations = {
    'capital': {
      nameEn: 'Capital Governorate',
      nameAr: 'محافظة العاصمة',
      cities: [
        { value: 'manama', labelEn: 'Manama', labelAr: 'المنامة' },
        { value: 'diplomatic', labelEn: 'Diplomatic Area', labelAr: 'المنطقة الدبلوماسية' },
        { value: 'seef', labelEn: 'Seef', labelAr: 'السيف' },
        { value: 'juffair', labelEn: 'Juffair', labelAr: 'الجفير' },
        { value: 'adliya', labelEn: 'Adliya', labelAr: 'العدلية' },
        { value: 'hoora', labelEn: 'Hoora', labelAr: 'الحورة' }
      ]
    },
    'muharraq': {
      nameEn: 'Muharraq Governorate',
      nameAr: 'محافظة المحرق',
      cities: [
        { value: 'muharraq_city', labelEn: 'Muharraq City', labelAr: 'مدينة المحرق' },
        { value: 'busaiteen', labelEn: 'Busaiteen', labelAr: 'البسيتين' },
        { value: 'hidd', labelEn: 'Hidd', labelAr: 'الحد' },
        { value: 'qalali', labelEn: 'Qalali', labelAr: 'قلالي' }
      ]
    },
    'northern': {
      nameEn: 'Northern Governorate',
      nameAr: 'المحافظة الشمالية',
      cities: [
        { value: 'hamad_town', labelEn: 'Hamad Town', labelAr: 'مدينة حمد' },
        { value: 'tubli', labelEn: 'Tubli', labelAr: 'توبلي' },
        { value: 'bilad_al_qadeem', labelEn: 'Bilad Al Qadeem', labelAr: 'بلاد القديم' },
        { value: 'janabiyah', labelEn: 'Janabiyah', labelAr: 'الجنبية' }
      ]
    },
    'southern': {
      nameEn: 'Southern Governorate',
      nameAr: 'المحافظة الجنوبية',
      cities: [
        { value: 'isa_town', labelEn: 'Isa Town', labelAr: 'مدينة عيسى' },
        { value: 'riffa', labelEn: 'Riffa', labelAr: 'الرفاع' },
        { value: 'awali', labelEn: 'Awali', labelAr: 'العوالي' },
        { value: 'zallaq', labelEn: 'Zallaq', labelAr: 'الزلاق' }
      ]
    }
  };

  const deliveryOptions = [
    {
      id: 'standard',
      nameEn: 'Standard Delivery (2-3 days)',
      nameAr: 'التوصيل العادي (2-3 أيام)',
      price: 5.000,
      description: isRTL ? 'توصيل خلال 2-3 أيام عمل' : 'Delivery within 2-3 business days'
    },
    {
      id: 'express',
      nameEn: 'Express Delivery (Next day)',
      nameAr: 'التوصيل السريع (اليوم التالي)',
      price: 10.000,
      description: isRTL ? 'توصيل في اليوم التالي' : 'Next day delivery'
    },
    {
      id: 'same_day',
      nameEn: 'Same Day Delivery',
      nameAr: 'التوصيل في نفس اليوم',
      price: 15.000,
      description: isRTL ? 'توصيل خلال 4-6 ساعات' : 'Delivery within 4-6 hours'
    }
  ];

  const paymentMethods = [
    {
      id: 'benefit_pay',
      nameEn: 'BenefitPay',
      nameAr: 'بنفت باي',
      icon: '💳',
      description: isRTL ? 'ادفع بأمان باستخدام بنفت باي' : 'Pay securely with BenefitPay',
      available: true
    },
    {
      id: 'apple_pay',
      nameEn: 'Apple Pay',
      nameAr: 'آبل باي',
      icon: '🍎',
      description: isRTL ? 'دفع سريع وآمن مع آبل باي' : 'Fast and secure payment with Apple Pay',
      available: true
    },
    {
      id: 'bank_transfer',
      nameEn: 'Bank Transfer',
      nameAr: 'تحويل بنكي',
      icon: '🏦',
      description: isRTL ? 'تحويل مباشر من حسابك البنكي' : 'Direct transfer from your bank account',
      available: true
    },
    {
      id: 'cod',
      nameEn: 'Cash on Delivery',
      nameAr: 'الدفع عند الاستلام',
      icon: '💵',
      description: isRTL ? 'ادفع نقداً عند استلام الطلب' : 'Pay cash when you receive your order',
      available: false // Disabled for this demo
    }
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatCalc = BahrainPrismaUtils.calculateVAT(subtotal, true);
  const deliveryFee = deliveryOptions.find(opt => opt.id === selectedDelivery)?.price || 0;
  const total = subtotal + deliveryFee;

  const governorateOptions = Object.entries(bahrainLocations).map(([key, location]) => ({
    value: key,
    label: isRTL ? location.nameAr : location.nameEn
  }));

  const getCityOptions = (governorate: string) => {
    const location = bahrainLocations[governorate as keyof typeof bahrainLocations];
    if (!location) return [];
    
    return location.cities.map(city => ({
      value: city.value,
      label: isRTL ? city.labelAr : city.labelEn
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Shipping Address
        return !!(shippingAddress.fullName && 
                  shippingAddress.phone && 
                  shippingAddress.governorate && 
                  shippingAddress.city && 
                  shippingAddress.addressLine1);
      case 1: // Delivery Options
        return !!selectedDelivery;
      case 2: // Payment
        return !!(selectedPayment && agreedToTerms);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const validateBahrainPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('973') && cleaned.length === 11;
  };

  const validateBahrainCR = (crNumber: string): boolean => {
    return BahrainPrismaUtils.validateBahrainCR(crNumber);
  };

  const handleCompleteOrder = async () => {
    if (!validateStep(currentStep) || !agreedToTerms) return;

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        items: cartItems,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        deliveryOption: selectedDelivery,
        paymentMethod: selectedPayment,
        businessDetails: isBusinessOrder ? businessDetails : undefined,
        totals: {
          subtotal: vatCalc.amount,
          vat: vatCalc.vatAmount,
          delivery: deliveryFee,
          total
        }
      };

      onComplete?.(orderData);
      setCurrentStep(4); // Success step
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentStep === 4) {
    // Order Success
    return (
      <Container size="md" py="xl">
        <Card shadow="lg" padding="xl" radius="md" ta="center">
          <Stack gap="xl" align="center">
            <div className="bg-green-100 rounded-full p-6">
              <IconCheck size={60} className="text-green-600" />
            </div>
            <div>
              <Title order={2} c="green" mb="md">
                {isRTL ? '🎉 تم تأكيد طلبك!' : '🎉 Order Confirmed!'}
              </Title>
              <Text size="lg" c="dimmed">
                {isRTL 
                  ? 'شكراً لك! سيتم معالجة طلبك وإرسال تفاصيل التتبع قريباً'
                  : 'Thank you! Your order is being processed and tracking details will be sent soon'
                }
              </Text>
            </div>
            <Group>
              <Button color="orange" size="lg">
                {isRTL ? 'تتبع الطلب' : 'Track Order'}
              </Button>
              <Button variant="outline" size="lg">
                {isRTL ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Group>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        
        {/* Header */}
        <div className="text-center">
          <Title order={1} mb="sm">
            {isRTL ? 'إتمام الطلب' : 'Checkout'}
          </Title>
          <Text c="dimmed" size="lg">
            {isRTL 
              ? 'أكمل معلوماتك لإتمام عملية الشراء بأمان'
              : 'Complete your information to securely finish your purchase'
            }
          </Text>
        </div>

        {/* Progress Stepper */}
        <Stepper 
          active={currentStep} 
          breakpoint="sm"
          color="orange"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <Stepper.Step 
            label={isRTL ? 'عنوان التوصيل' : 'Shipping Address'} 
            icon={<IconMapPin size={18} />}
          />
          <Stepper.Step 
            label={isRTL ? 'خيارات التوصيل' : 'Delivery Options'} 
            icon={<IconTruck size={18} />}
          />
          <Stepper.Step 
            label={isRTL ? 'الدفع' : 'Payment'} 
            icon={<IconCreditCard size={18} />}
          />
          <Stepper.Step 
            label={isRTL ? 'تأكيد' : 'Review'} 
            icon={<IconCheck size={18} />}
          />
        </Stepper>

        <Grid gutter="xl">
          
          {/* Main Content */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            
            {/* Step 0: Shipping Address */}
            {currentStep === 0 && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <Title order={3}>
                    {isRTL ? 'عنوان التوصيل' : 'Shipping Address'}
                  </Title>

                  {/* Business Order Toggle */}
                  <Checkbox
                    label={isRTL ? 'طلب تجاري (لديك سجل تجاري)' : 'Business order (I have a CR number)'}
                    checked={isBusinessOrder}
                    onChange={(e) => setIsBusinessOrder(e.currentTarget.checked)}
                    color="orange"
                  />

                  {/* Business Details */}
                  {isBusinessOrder && (
                    <Card withBorder padding="md" className="bg-orange-50">
                      <Title order={5} mb="md" c="orange">
                        {isRTL ? 'بيانات الشركة' : 'Business Details'}
                      </Title>
                      <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <TextInput
                            label={isRTL ? 'اسم الشركة' : 'Company Name'}
                            placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'}
                            value={businessDetails.companyName}
                            onChange={(e) => setBusinessDetails(prev => ({
                              ...prev,
                              companyName: e.target.value
                            }))}
                            required
                            leftSection={<IconBuilding size={16} />}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <TextInput
                            label={isRTL ? 'رقم السجل التجاري' : 'CR Number'}
                            placeholder={isRTL ? 'مثال: 123456' : 'Example: 123456'}
                            value={businessDetails.crNumber}
                            onChange={(e) => setBusinessDetails(prev => ({
                              ...prev,
                              crNumber: e.target.value
                            }))}
                            required
                            error={businessDetails.crNumber && !validateBahrainCR(businessDetails.crNumber) 
                              ? (isRTL ? 'رقم سجل تجاري غير صحيح' : 'Invalid CR number')
                              : null
                            }
                            dir="ltr"
                          />
                        </Grid.Col>
                      </Grid>
                    </Card>
                  )}

                  {/* Personal Information */}
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label={isRTL ? 'الاسم الكامل' : 'Full Name'}
                        placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          fullName: e.target.value
                        }))}
                        required
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
                        placeholder="+973 XXXX XXXX"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        required
                        leftSection={<IconPhone size={16} />}
                        error={shippingAddress.phone && !validateBahrainPhone(shippingAddress.phone) 
                          ? (isRTL ? 'رقم هاتف غير صحيح' : 'Invalid phone number')
                          : null
                        }
                        dir="ltr"
                      />
                    </Grid.Col>
                  </Grid>

                  {/* Location */}
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Select
                        label={isRTL ? 'المحافظة' : 'Governorate'}
                        placeholder={isRTL ? 'اختر المحافظة' : 'Select governorate'}
                        data={governorateOptions}
                        value={shippingAddress.governorate}
                        onChange={(value) => setShippingAddress(prev => ({
                          ...prev,
                          governorate: value || '',
                          city: '' // Reset city when governorate changes
                        }))}
                        required
                        searchable
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Select
                        label={isRTL ? 'المدينة/المنطقة' : 'City/Area'}
                        placeholder={isRTL ? 'اختر المدينة' : 'Select city'}
                        data={getCityOptions(shippingAddress.governorate)}
                        value={shippingAddress.city}
                        onChange={(value) => setShippingAddress(prev => ({
                          ...prev,
                          city: value || ''
                        }))}
                        required
                        searchable
                        disabled={!shippingAddress.governorate}
                      />
                    </Grid.Col>
                  </Grid>

                  {/* Address Details */}
                  <TextInput
                    label={isRTL ? 'العنوان التفصيلي' : 'Detailed Address'}
                    placeholder={isRTL ? 'مثال: شارع الملك فيصل، مبنى 123' : 'Example: King Faisal Street, Building 123'}
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress(prev => ({
                      ...prev,
                      addressLine1: e.target.value
                    }))}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />

                  <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label={isRTL ? 'رقم المبنى' : 'Building Number'}
                        placeholder={isRTL ? 'مثال: 123' : 'Example: 123'}
                        value={shippingAddress.buildingNumber}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          buildingNumber: e.target.value
                        }))}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label={isRTL ? 'رقم الشقة' : 'Flat/Office Number'}
                        placeholder={isRTL ? 'مثال: 4A' : 'Example: 4A'}
                        value={shippingAddress.flatNumber}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          flatNumber: e.target.value
                        }))}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label={isRTL ? 'معلم مميز' : 'Landmark'}
                        placeholder={isRTL ? 'مثال: قريب من مجمع السيف' : 'Example: Near Seef Mall'}
                        value={shippingAddress.landmark}
                        onChange={(e) => setShippingAddress(prev => ({
                          ...prev,
                          landmark: e.target.value
                        }))}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Grid.Col>
                  </Grid>

                </Stack>
              </Card>
            )}

            {/* Step 1: Delivery Options */}
            {currentStep === 1 && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <Title order={3}>
                    {isRTL ? 'خيارات التوصيل' : 'Delivery Options'}
                  </Title>

                  <Radio.Group
                    value={selectedDelivery}
                    onChange={setSelectedDelivery}
                  >
                    <Stack gap="md">
                      {deliveryOptions.map((option) => (
                        <Card key={option.id} withBorder padding="md" className={`cursor-pointer hover:bg-gray-50 ${selectedDelivery === option.id ? 'border-orange-500 bg-orange-50' : ''}`}>
                          <Group justify="space-between" align="flex-start">
                            <Radio
                              value={option.id}
                              label={
                                <div>
                                  <Text fw={600} mb="xs">
                                    {isRTL ? option.nameAr : option.nameEn}
                                  </Text>
                                  <Text size="sm" c="dimmed">
                                    {option.description}
                                  </Text>
                                </div>
                              }
                              color="orange"
                            />
                            <div className="text-right">
                              <Text fw={700} c="orange">
                                {option.price === 0 
                                  ? (isRTL ? 'مجاني' : 'FREE')
                                  : BahrainPrismaUtils.formatCurrency(option.price, isRTL ? 'ar-BH' : 'en-BH')
                                }
                              </Text>
                            </div>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </Radio.Group>

                  <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                    <Text size="sm">
                      {isRTL 
                        ? 'سيتم التواصل معك قبل التوصيل لتأكيد الموعد المناسب'
                        : 'We will contact you before delivery to confirm the suitable time'
                      }
                    </Text>
                  </Alert>

                </Stack>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <Title order={3}>
                    {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                  </Title>

                  <Radio.Group
                    value={selectedPayment}
                    onChange={setSelectedPayment}
                  >
                    <Stack gap="md">
                      {paymentMethods.map((method) => (
                        <Card 
                          key={method.id} 
                          withBorder 
                          padding="md" 
                          className={`cursor-pointer hover:bg-gray-50 ${selectedPayment === method.id ? 'border-orange-500 bg-orange-50' : ''} ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Group justify="space-between" align="center">
                            <Radio
                              value={method.id}
                              disabled={!method.available}
                              label={
                                <Group gap="sm">
                                  <Text size="lg">{method.icon}</Text>
                                  <div>
                                    <Text fw={600}>
                                      {isRTL ? method.nameAr : method.nameEn}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                      {method.description}
                                    </Text>
                                  </div>
                                </Group>
                              }
                              color="orange"
                            />
                            {method.id === 'benefit_pay' && (
                              <Badge color="green" variant="light">
                                {isRTL ? 'مُوصى به' : 'Recommended'}
                              </Badge>
                            )}
                            {!method.available && (
                              <Badge color="gray" variant="outline">
                                {isRTL ? 'غير متاح' : 'Not Available'}
                              </Badge>
                            )}
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </Radio.Group>

                  <Divider />

                  {/* Terms and Conditions */}
                  <Stack gap="md">
                    <Checkbox
                      label={
                        <Text size="sm">
                          {isRTL 
                            ? 'أوافق على الشروط والأحكام وسياسة الخصوصية'
                            : 'I agree to the Terms & Conditions and Privacy Policy'
                          }
                        </Text>
                      }
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.currentTarget.checked)}
                      color="orange"
                      required
                    />

                    <Checkbox
                      label={
                        <Text size="sm">
                          {isRTL 
                            ? 'أريد الاشتراك في النشرة الإخبارية لتلقي العروض الخاصة'
                            : 'Subscribe to newsletter for special offers and updates'
                          }
                        </Text>
                      }
                      checked={subscribedToNewsletter}
                      onChange={(e) => setSubscedToNewsletter(e.currentTarget.checked)}
                      color="orange"
                    />
                  </Stack>

                  <Alert icon={<IconShield size={16} />} color="green" variant="light">
                    <Text size="sm">
                      {isRTL 
                        ? 'جميع معاملاتك محمية بأحدث تقنيات الأمان والتشفير'
                        : 'All your transactions are protected with the latest security and encryption technologies'
                      }
                    </Text>
                  </Alert>

                </Stack>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <Title order={3}>
                    {isRTL ? 'مراجعة الطلب' : 'Review Your Order'}
                  </Title>

                  {/* Order Items */}
                  <div>
                    <Title order={5} mb="md">
                      {isRTL ? 'العناصر المطلوبة' : 'Order Items'}
                    </Title>
                    <Stack gap="sm">
                      {cartItems.map((item) => (
                        <Group key={item.id} gap="md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            radius="md"
                          />
                          <div className="flex-1">
                            <Text fw={500}>{isRTL ? item.nameAr : item.name}</Text>
                            <Text size="sm" c="dimmed">
                              {isRTL ? 'الكمية:' : 'Qty:'} {item.quantity}
                            </Text>
                          </div>
                          <Text fw={600} c="orange">
                            {BahrainPrismaUtils.formatCurrency(item.price * item.quantity, isRTL ? 'ar-BH' : 'en-BH')}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </div>

                  <Divider />

                  {/* Shipping Address Summary */}
                  <div>
                    <Group justify="space-between" mb="md">
                      <Title order={5}>
                        {isRTL ? 'عنوان التوصيل' : 'Shipping Address'}
                      </Title>
                      <ActionIcon
                        variant="outline"
                        color="orange"
                        size="sm"
                        onClick={() => setCurrentStep(0)}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Group>
                    <Text size="sm">
                      {shippingAddress.fullName}<br />
                      {shippingAddress.addressLine1}<br />
                      {shippingAddress.city}, {bahrainLocations[shippingAddress.governorate as keyof typeof bahrainLocations]?.[isRTL ? 'nameAr' : 'nameEn']}<br />
                      {BahrainPrismaUtils.formatBahrainPhone(shippingAddress.phone)}
                    </Text>
                  </div>

                  <Divider />

                  {/* Payment Method Summary */}
                  <div>
                    <Group justify="space-between" mb="md">
                      <Title order={5}>
                        {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                      </Title>
                      <ActionIcon
                        variant="outline"
                        color="orange"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Group>
                    <Text size="sm">
                      {paymentMethods.find(p => p.id === selectedPayment)?.[isRTL ? 'nameAr' : 'nameEn']}
                    </Text>
                  </div>

                </Stack>
              </Card>
            )}

            {/* Navigation Buttons */}
            <Group justify="space-between" mt="xl">
              <Button
                variant="outline"
                color="gray"
                onClick={prevStep}
                disabled={currentStep === 0}
                leftSection={isRTL ? <IconArrowRight size={16} /> : <IconArrowLeft size={16} />}
              >
                {isRTL ? 'السابق' : 'Previous'}
              </Button>

              {currentStep < 3 ? (
                <Button
                  color="orange"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  rightSection={isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
                >
                  {isRTL ? 'التالي' : 'Next'}
                </Button>
              ) : (
                <Button
                  color="orange"
                  size="lg"
                  onClick={handleCompleteOrder}
                  disabled={!validateStep(currentStep) || !agreedToTerms}
                  loading={isProcessing}
                  rightSection={<IconCheck size={18} />}
                >
                  {isProcessing 
                    ? (isRTL ? 'جاري المعالجة...' : 'Processing...')
                    : (isRTL ? 'تأكيد الطلب' : 'Complete Order')
                  }
                </Button>
              )}
            </Group>

          </Grid.Col>

          {/* Order Summary Sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card shadow="lg" padding="lg" radius="md" withBorder className="sticky top-4">
              <Stack gap="md">
                
                <Title order={4} ta="center">
                  {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                </Title>

                <Divider />

                {/* Items Count */}
                <Group justify="space-between">
                  <Text>{isRTL ? 'العناصر:' : 'Items:'}</Text>
                  <Text fw={600}>
                    {cartItems.length} {isRTL ? 'منتج' : 'items'}
                  </Text>
                </Group>

                {/* Pricing Breakdown */}
                <Group justify="space-between">
                  <Text>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</Text>
                  <Text fw={600}>
                    {BahrainPrismaUtils.formatCurrency(vatCalc.amount, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text>{isRTL ? 'ضريبة القيمة المضافة (10%):' : 'VAT (10%):'}</Text>
                  <Text fw={600}>
                    {BahrainPrismaUtils.formatCurrency(vatCalc.vatAmount, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text>{isRTL ? 'رسوم التوصيل:' : 'Delivery Fee:'}</Text>
                  <Text fw={600} className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 
                      ? (isRTL ? 'مجاني' : 'FREE')
                      : BahrainPrismaUtils.formatCurrency(deliveryFee, isRTL ? 'ar-BH' : 'en-BH')
                    }
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text size="lg" fw={700}>{isRTL ? 'المجموع الكلي:' : 'Total:'}</Text>
                  <Text size="xl" fw={700} c="orange">
                    {BahrainPrismaUtils.formatCurrency(total, isRTL ? 'ar-BH' : 'en-BH')}
                  </Text>
                </Group>

                <Text size="xs" c="dimmed" ta="center">
                  {isRTL 
                    ? 'شامل جميع الضرائب والرسوم'
                    : 'All taxes and fees included'
                  }
                </Text>

                <Divider />

                {/* Security Badges */}
                <Stack gap="xs" ta="center">
                  <Group gap="xs" justify="center">
                    <IconShield size={16} className="text-green-600" />
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'دفع آمن' : 'Secure Payment'}
                    </Text>
                  </Group>
                  <Group gap="xs" justify="center">
                    <IconTruck size={16} className="text-blue-600" />
                    <Text size="sm" c="dimmed">
                      {isRTL ? 'توصيل موثوق' : 'Reliable Delivery'}
                    </Text>
                  </Group>
                </Stack>

              </Stack>
            </Card>
          </Grid.Col>

        </Grid>
      </Stack>
    </Container>
  );
}