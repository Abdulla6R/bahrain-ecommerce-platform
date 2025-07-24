'use client';

import { useState } from 'react';
import {
  Container,
  Stack,
  Title,
  Card,
  Text,
  Button,
  Group,
  Stepper,
  TextInput,
  Textarea,
  Select,
  FileInput,
  NumberInput,
  Checkbox,
  Alert,
  Progress,
  Badge,
  Modal,
  Image,
  Divider,
  ActionIcon,
  Anchor
} from '@mantine/core';
import {
  IconUser,
  IconBuilding,
  IconFileText,
  IconCreditCard,
  IconCheck,
  IconX,
  IconUpload,
  IconEye,
  IconLanguage,
  IconShield,
  IconInfoCircle,
  IconPhone,
  IconArrowLeft,
  IconArrowRight,
  IconMail,
  IconMapPin,
  IconBuildingBank,
  IconClock,
  IconUserPlus
} from '@tabler/icons-react';

interface VendorOnboardingProps {
  searchParams: Promise<{ locale?: string }>;
}

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Business Information
  businessNameEn: string;
  businessNameAr: string;
  crNumber: string;
  businessType: string;
  establishedYear: string;
  governorate: string;
  city: string;
  address: string;
  addressAr: string;
  
  // Documents
  crCertificate: File | null;
  businessLicense: File | null;
  trademarkCertificate: File | null;
  vatCertificate: File | null;
  
  // Bank Details
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  iban: string;
  
  // Store Details
  storeDescriptionEn: string;
  storeDescriptionAr: string;
  productCategories: string[];
  estimatedMonthlyVolume: string;
  
  // Agreements
  acceptTerms: boolean;
  acceptCommission: boolean;
  pdplConsent: boolean;
  marketingConsent: boolean;
}

const bahrainLocations = {
  'capital': {
    nameEn: 'Capital Governorate',
    nameAr: 'محافظة العاصمة',
    cities: [
      { value: 'manama', labelEn: 'Manama', labelAr: 'المنامة' },
      { value: 'juffair', labelEn: 'Juffair', labelAr: 'الجفير' },
      { value: 'adliya', labelEn: 'Adliya', labelAr: 'العدلية' },
      { value: 'seef', labelEn: 'Seef', labelAr: 'السيف' }
    ]
  },
  'muharraq': {
    nameEn: 'Muharraq Governorate',
    nameAr: 'محافظة المحرق',
    cities: [
      { value: 'muharraq_city', labelEn: 'Muharraq City', labelAr: 'مدينة المحرق' },
      { value: 'busaiteen', labelEn: 'Busaiteen', labelAr: 'بوسايتين' },
      { value: 'galali', labelEn: 'Galali', labelAr: 'جاليلي' }
    ]
  },
  'northern': {
    nameEn: 'Northern Governorate',
    nameAr: 'المحافظة الشمالية',
    cities: [
      { value: 'hamad_town', labelEn: 'Hamad Town', labelAr: 'مدينة حمد' },
      { value: 'sar', labelEn: 'Sar', labelAr: 'سار' },
      { value: 'budaiya', labelEn: 'Budaiya', labelAr: 'البديع' }
    ]
  },
  'southern': {
    nameEn: 'Southern Governorate',
    nameAr: 'المحافظة الجنوبية',
    cities: [
      { value: 'isa_town', labelEn: 'Isa Town', labelAr: 'مدينة عيسى' },
      { value: 'riffa', labelEn: 'Riffa', labelAr: 'الرفاع' },
      { value: 'awali', labelEn: 'Awali', labelAr: 'العوالي' }
    ]
  }
};

const businessTypes = [
  { value: 'company', labelEn: 'Company', labelAr: 'شركة' },
  { value: 'establishment', labelEn: 'Establishment', labelAr: 'مؤسسة' },
  { value: 'partnership', labelEn: 'Partnership', labelAr: 'شراكة' },
  { value: 'sole_proprietorship', labelEn: 'Sole Proprietorship', labelAr: 'مؤسسة فردية' }
];

const productCategories = [
  { value: 'electronics', labelEn: 'Electronics', labelAr: 'إلكترونيات' },
  { value: 'fashion', labelEn: 'Fashion & Clothing', labelAr: 'الأزياء والملابس' },
  { value: 'home_garden', labelEn: 'Home & Garden', labelAr: 'المنزل والحديقة' },
  { value: 'sports', labelEn: 'Sports & Fitness', labelAr: 'الرياضة واللياقة' },
  { value: 'beauty', labelEn: 'Beauty & Personal Care', labelAr: 'الجمال والعناية الشخصية' },
  { value: 'automotive', labelEn: 'Automotive', labelAr: 'السيارات' },
  { value: 'books', labelEn: 'Books & Media', labelAr: 'الكتب والإعلام' },
  { value: 'toys', labelEn: 'Toys & Games', labelAr: 'الألعاب' }
];

const bahrainiBanks = [
  { value: 'nbb', label: 'National Bank of Bahrain (NBB)', labelAr: 'بنك البحرين الوطني' },
  { value: 'bbk', label: 'Bank of Bahrain and Kuwait (BBK)', labelAr: 'بنك البحرين والكويت' },
  { value: 'bisb', label: 'Bahrain Islamic Bank (BisB)', labelAr: 'بنك البحرين الإسلامي' },
  { value: 'ahli', label: 'Ahli United Bank', labelAr: 'البنك الأهلي المتحد' },
  { value: 'ila', label: 'ila Digital Bank', labelAr: 'بنك إيلا الرقمي' }
];

export default async function VendorOnboarding({ searchParams }: VendorOnboardingProps) {
  const resolvedSearchParams = await searchParams;
  const locale = resolvedSearchParams.locale || 'en';
  const isRTL = locale === 'ar';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessNameEn: '',
    businessNameAr: '',
    crNumber: '',
    businessType: '',
    establishedYear: '',
    governorate: '',
    city: '',
    address: '',
    addressAr: '',
    crCertificate: null,
    businessLicense: null,
    trademarkCertificate: null,
    vatCertificate: null,
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    iban: '',
    storeDescriptionEn: '',
    storeDescriptionAr: '',
    productCategories: [],
    estimatedMonthlyVolume: '',
    acceptTerms: false,
    acceptCommission: false,
    pdplConsent: false,
    marketingConsent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [crValidationStatus, setCRValidationStatus] = useState<'pending' | 'valid' | 'invalid' | null>(null);

  const steps = [
    {
      label: isRTL ? 'المعلومات الشخصية' : 'Personal Information',
      description: isRTL ? 'معلومات المالك أو المدير' : 'Owner or manager details',
      icon: IconUser
    },
    {
      label: isRTL ? 'معلومات الأعمال' : 'Business Information',
      description: isRTL ? 'تفاصيل الشركة أو المؤسسة' : 'Company or establishment details',
      icon: IconBuilding
    },
    {
      label: isRTL ? 'الوثائق المطلوبة' : 'Required Documents',
      description: isRTL ? 'رفع المستندات الرسمية' : 'Upload official documents',
      icon: IconFileText
    },
    {
      label: isRTL ? 'تفاصيل البنك' : 'Banking Details',
      description: isRTL ? 'معلومات الحساب البنكي' : 'Bank account information',
      icon: IconCreditCard
    },
    {
      label: isRTL ? 'إعداد المتجر' : 'Store Setup',
      description: isRTL ? 'تخصيص متجرك' : 'Customize your store',
      icon: IconUserPlus
    }
  ];

  const validateCRNumber = async (crNumber: string) => {
    if (!crNumber || crNumber.length < 6) {
      setCRValidationStatus('invalid');
      return false;
    }

    setCRValidationStatus('pending');
    
    // Simulate API call to validate CR number
    setTimeout(() => {
      // Mock validation logic
      const isValid = /^\d{5,7}-\d{2}$/.test(crNumber);
      setCRValidationStatus(isValid ? 'valid' : 'invalid');
    }, 1500);

    return true;
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) {
          newErrors.firstName = isRTL ? 'الاسم الأول مطلوب' : 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = isRTL ? 'اسم العائلة مطلوب' : 'Last name is required';
        }
        if (!formData.email.includes('@')) {
          newErrors.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address';
        }
        if (!formData.phone.match(/^\+973[3679]\d{7}$/)) {
          newErrors.phone = isRTL ? 'رقم الهاتف البحريني غير صحيح' : 'Invalid Bahrain phone number';
        }
        break;

      case 1: // Business Information
        if (!formData.businessNameEn.trim()) {
          newErrors.businessNameEn = isRTL ? 'اسم الشركة بالإنجليزية مطلوب' : 'Business name in English is required';
        }
        if (!formData.businessNameAr.trim()) {
          newErrors.businessNameAr = isRTL ? 'اسم الشركة بالعربية مطلوب' : 'Business name in Arabic is required';
        }
        if (!formData.crNumber.trim()) {
          newErrors.crNumber = isRTL ? 'رقم السجل التجاري مطلوب' : 'CR number is required';
        }
        if (crValidationStatus !== 'valid') {
          newErrors.crNumber = isRTL ? 'رقم السجل التجاري غير صحيح' : 'Invalid CR number';
        }
        if (!formData.businessType) {
          newErrors.businessType = isRTL ? 'نوع الشركة مطلوب' : 'Business type is required';
        }
        break;

      case 2: // Documents
        if (!formData.crCertificate) {
          newErrors.crCertificate = isRTL ? 'شهادة السجل التجاري مطلوبة' : 'CR certificate is required';
        }
        if (!formData.businessLicense) {
          newErrors.businessLicense = isRTL ? 'رخصة العمل مطلوبة' : 'Business license is required';
        }
        break;

      case 3: // Banking
        if (!formData.bankName) {
          newErrors.bankName = isRTL ? 'اسم البنك مطلوب' : 'Bank name is required';
        }
        if (!formData.accountNumber.trim()) {
          newErrors.accountNumber = isRTL ? 'رقم الحساب مطلوب' : 'Account number is required';
        }
        if (!formData.iban.match(/^BH\d{2}[A-Z]{4}\d{14}$/)) {
          newErrors.iban = isRTL ? 'رقم الآيبان البحريني غير صحيح' : 'Invalid Bahrain IBAN';
        }
        break;

      case 4: // Store Setup
        if (!formData.storeDescriptionEn.trim()) {
          newErrors.storeDescriptionEn = isRTL ? 'وصف المتجر بالإنجليزية مطلوب' : 'Store description in English is required';
        }
        if (formData.productCategories.length === 0) {
          newErrors.productCategories = isRTL ? 'يجب اختيار فئة واحدة على الأقل' : 'At least one category must be selected';
        }
        if (!formData.acceptTerms) {
          newErrors.acceptTerms = isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'Terms and conditions must be accepted';
        }
        if (!formData.pdplConsent) {
          newErrors.pdplConsent = isRTL ? 'موافقة حماية البيانات مطلوبة' : 'Data protection consent is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate CR number on change
    if (field === 'crNumber' && value) {
      validateCRNumber(value);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success and redirect
      alert(isRTL ? 'تم إرسال طلبك بنجاح! سيتم مراجعته خلال 2-3 أيام عمل.' : 'Application submitted successfully! It will be reviewed within 2-3 business days.');
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const url = new URL(window.location.href);
    url.searchParams.set('locale', newLocale);
    window.location.href = url.toString();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <Stack gap="md">
            <Title order={4} mb="md">
              {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
            </Title>
            
            <Group grow>
              <TextInput
                label={isRTL ? 'الاسم الأول' : 'First Name'}
                placeholder={isRTL ? 'أدخل اسمك الأول' : 'Enter your first name'}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />
              <TextInput
                label={isRTL ? 'اسم العائلة' : 'Last Name'}
                placeholder={isRTL ? 'أدخل اسم العائلة' : 'Enter your last name'}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
            </Group>

            <Group grow>
              <TextInput
                label={isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                placeholder="name@company.com"
                leftSection={<IconMail size={16} />}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />
              <TextInput
                label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
                placeholder="+973 XXXX XXXX"
                leftSection={<IconPhone size={16} />}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                description={isRTL ? 'رقم الهاتف البحريني مطلوب' : 'Bahrain phone number required'}
                required
              />
            </Group>
          </Stack>
        );

      case 1: // Business Information
        return (
          <Stack gap="md">
            <Title order={4} mb="md">
              {isRTL ? 'معلومات الأعمال' : 'Business Information'}
            </Title>
            
            <Group grow>
              <TextInput
                label={isRTL ? 'اسم الشركة (إنجليزي)' : 'Business Name (English)'}
                placeholder={isRTL ? 'أدخل اسم شركتك بالإنجليزية' : 'Enter your business name in English'}
                value={formData.businessNameEn}
                onChange={(e) => handleInputChange('businessNameEn', e.target.value)}
                error={errors.businessNameEn}
                required
              />
              <TextInput
                label={isRTL ? 'اسم الشركة (عربي)' : 'Business Name (Arabic)'}
                placeholder={isRTL ? 'أدخل اسم شركتك بالعربية' : 'Enter your business name in Arabic'}
                value={formData.businessNameAr}
                onChange={(e) => handleInputChange('businessNameAr', e.target.value)}
                error={errors.businessNameAr}
                required
              />
            </Group>

            <Group grow>
              <TextInput
                label={isRTL ? 'رقم السجل التجاري' : 'Commercial Registration Number'}
                placeholder="12345-01"
                value={formData.crNumber}
                onChange={(e) => handleInputChange('crNumber', e.target.value)}
                error={errors.crNumber}
                rightSection={
                  crValidationStatus === 'pending' ? (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  ) : crValidationStatus === 'valid' ? (
                    <IconCheck size={16} className="text-green-500" />
                  ) : crValidationStatus === 'invalid' ? (
                    <IconX size={16} className="text-red-500" />
                  ) : null
                }
                description={isRTL ? 'سيتم التحقق من صحة رقم السجل التجاري' : 'CR number will be validated automatically'}
                required
              />
              <Select
                label={isRTL ? 'نوع الشركة' : 'Business Type'}
                placeholder={isRTL ? 'اختر نوع الشركة' : 'Select business type'}
                value={formData.businessType}
                onChange={(value) => handleInputChange('businessType', value)}
                data={businessTypes.map(type => ({
                  value: type.value,
                  label: isRTL ? type.labelAr : type.labelEn
                }))}
                error={errors.businessType}
                required
              />
            </Group>

            <Group grow>
              <Select
                label={isRTL ? 'المحافظة' : 'Governorate'}
                placeholder={isRTL ? 'اختر المحافظة' : 'Select governorate'}
                value={formData.governorate}
                onChange={(value) => {
                  handleInputChange('governorate', value);
                  handleInputChange('city', ''); // Reset city when governorate changes
                }}
                data={Object.entries(bahrainLocations).map(([key, location]) => ({
                  value: key,
                  label: isRTL ? location.nameAr : location.nameEn
                }))}
                required
              />
              <Select
                label={isRTL ? 'المدينة' : 'City'}
                placeholder={isRTL ? 'اختر المدينة' : 'Select city'}
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
                data={formData.governorate ? 
                  bahrainLocations[formData.governorate as keyof typeof bahrainLocations]?.cities.map(city => ({
                    value: city.value,
                    label: isRTL ? city.labelAr : city.labelEn
                  })) || [] : []
                }
                disabled={!formData.governorate}
                required
              />
            </Group>

            <Group grow>
              <Textarea
                label={isRTL ? 'العنوان (إنجليزي)' : 'Address (English)'}
                placeholder={isRTL ? 'أدخل عنوان شركتك بالإنجليزية' : 'Enter your business address in English'}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
              <Textarea
                label={isRTL ? 'العنوان (عربي)' : 'Address (Arabic)'}
                placeholder={isRTL ? 'أدخل عنوان شركتك بالعربية' : 'Enter your business address in Arabic'}
                value={formData.addressAr}
                onChange={(e) => handleInputChange('addressAr', e.target.value)}
                rows={2}
              />
            </Group>

            <NumberInput
              label={isRTL ? 'سنة التأسيس' : 'Year Established'}
              placeholder="2020"
              value={formData.establishedYear ? parseInt(formData.establishedYear) : undefined}
              onChange={(value) => handleInputChange('establishedYear', value?.toString() || '')}
              min={1900}
              max={new Date().getFullYear()}
            />
          </Stack>
        );

      case 2: // Documents
        return (
          <Stack gap="md">
            <Title order={4} mb="md">
              {isRTL ? 'الوثائق المطلوبة' : 'Required Documents'}
            </Title>

            <Alert
              icon={<IconInfoCircle size={16} />}
              title={isRTL ? 'متطلبات الوثائق' : 'Document Requirements'}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                {isRTL 
                  ? 'يرجى رفع ملفات واضحة بصيغة PDF أو JPG. الحد الأقصى لحجم الملف 5 ميجابايت.'
                  : 'Please upload clear files in PDF or JPG format. Maximum file size is 5MB.'
                }
              </Text>
            </Alert>
            
            <FileInput
              label={isRTL ? 'شهادة السجل التجاري' : 'Commercial Registration Certificate'}
              placeholder={isRTL ? 'ارفع شهادة السجل التجاري' : 'Upload CR certificate'}
              leftSection={<IconUpload size={16} />}
              accept=".pdf,.jpg,.jpeg,.png"
              value={formData.crCertificate}
              onChange={(file) => handleInputChange('crCertificate', file)}
              error={errors.crCertificate}
              description={isRTL ? 'مطلوب - شهادة سارية المفعول' : 'Required - Valid certificate'}
              required
            />

            <FileInput
              label={isRTL ? 'رخصة مزاولة التجارة' : 'Business License'}
              placeholder={isRTL ? 'ارفع رخصة مزاولة التجارة' : 'Upload business license'}
              leftSection={<IconUpload size={16} />}
              accept=".pdf,.jpg,.jpeg,.png"
              value={formData.businessLicense}
              onChange={(file) => handleInputChange('businessLicense', file)}
              error={errors.businessLicense}
              description={isRTL ? 'مطلوب - رخصة سارية المفعول' : 'Required - Valid license'}
              required
            />

            <FileInput
              label={isRTL ? 'شهادة العلامة التجارية' : 'Trademark Certificate'}
              placeholder={isRTL ? 'ارفع شهادة العلامة التجارية (اختياري)' : 'Upload trademark certificate (optional)'}
              leftSection={<IconUpload size={16} />}
              accept=".pdf,.jpg,.jpeg,.png"
              value={formData.trademarkCertificate}
              onChange={(file) => handleInputChange('trademarkCertificate', file)}
              description={isRTL ? 'اختياري - في حال وجود علامة تجارية' : 'Optional - If you have a trademark'}
            />

            <FileInput
              label={isRTL ? 'شهادة ضريبة القيمة المضافة' : 'VAT Registration Certificate'}
              placeholder={isRTL ? 'ارفع شهادة ضريبة القيمة المضافة (اختياري)' : 'Upload VAT certificate (optional)'}
              leftSection={<IconUpload size={16} />}
              accept=".pdf,.jpg,.jpeg,.png"
              value={formData.vatCertificate}
              onChange={(file) => handleInputChange('vatCertificate', file)}
              description={isRTL ? 'اختياري - للشركات المسجلة في ضريبة القيمة المضافة' : 'Optional - For VAT registered businesses'}
            />
          </Stack>
        );

      case 3: // Banking Details
        return (
          <Stack gap="md">
            <Title order={4} mb="md">
              {isRTL ? 'تفاصيل البنك' : 'Banking Details'}
            </Title>

            <Alert
              icon={<IconShield size={16} />}
              title={isRTL ? 'أمان البيانات' : 'Data Security'}
              color="green"
              variant="light"
            >
              <Text size="sm">
                {isRTL 
                  ? 'جميع البيانات المصرفية محمية بأعلى معايير الأمان ومتوافقة مع قانون حماية البيانات الشخصية البحريني.'
                  : 'All banking data is protected with the highest security standards and complies with Bahrain PDPL.'
                }
              </Text>
            </Alert>
            
            <Select
              label={isRTL ? 'اسم البنك' : 'Bank Name'}
              placeholder={isRTL ? 'اختر البنك' : 'Select bank'}
              leftSection={<IconBuildingBank size={16} />}
              value={formData.bankName}
              onChange={(value) => handleInputChange('bankName', value)}
              data={bahrainiBanks.map(bank => ({
                value: bank.value,
                label: isRTL ? bank.labelAr : bank.label
              }))}
              error={errors.bankName}
              searchable
              required
            />

            <TextInput
              label={isRTL ? 'اسم صاحب الحساب' : 'Account Holder Name'}
              placeholder={isRTL ? 'الاسم كما يظهر في البنك' : 'Name as it appears in bank'}
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              description={isRTL ? 'يجب أن يطابق اسم صاحب الحساب اسم الشركة أو المالك' : 'Must match business name or owner name'}
              required
            />

            <Group grow>
              <TextInput
                label={isRTL ? 'رقم الحساب' : 'Account Number'}
                placeholder="001234567890"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                error={errors.accountNumber}
                required
              />
              <TextInput
                label={isRTL ? 'رقم الآيبان (IBAN)' : 'IBAN Number'}
                placeholder="BH67NBOB00001234567890"
                value={formData.iban}
                onChange={(e) => handleInputChange('iban', e.target.value.toUpperCase())}
                error={errors.iban}
                description={isRTL ? 'رقم الآيبان البحريني (22 رقم)' : 'Bahrain IBAN (22 characters)'}
                required
              />
            </Group>

            <Alert
              icon={<IconClock size={16} />}
              title={isRTL ? 'جدولة الدفعات' : 'Payout Schedule'}
              color="orange"
              variant="light"
            >
              <Text size="sm">
                {isRTL 
                  ? 'سيتم تحويل العمولات كل يوم خميس أسبوعياً. الحد الأدنى للتحويل 50 د.ب.'
                  : 'Commissions will be transferred every Thursday weekly. Minimum payout amount is 50 BHD.'
                }
              </Text>
            </Alert>
          </Stack>
        );

      case 4: // Store Setup
        return (
          <Stack gap="md">
            <Title order={4} mb="md">
              {isRTL ? 'إعداد المتجر' : 'Store Setup'}
            </Title>
            
            <Group grow>
              <Textarea
                label={isRTL ? 'وصف المتجر (إنجليزي)' : 'Store Description (English)'}
                placeholder={isRTL ? 'اكتب وصفاً جذاباً لمتجرك بالإنجليزية' : 'Write an attractive description of your store in English'}
                value={formData.storeDescriptionEn}
                onChange={(e) => handleInputChange('storeDescriptionEn', e.target.value)}
                error={errors.storeDescriptionEn}
                rows={3}
                required
              />
              <Textarea
                label={isRTL ? 'وصف المتجر (عربي)' : 'Store Description (Arabic)'}
                placeholder={isRTL ? 'اكتب وصفاً جذاباً لمتجرك بالعربية' : 'Write an attractive description of your store in Arabic'}
                value={formData.storeDescriptionAr}
                onChange={(e) => handleInputChange('storeDescriptionAr', e.target.value)}
                rows={3}
              />
            </Group>

            <div>
              <Text fw={500} size="sm" mb="xs">
                {isRTL ? 'فئات المنتجات' : 'Product Categories'}
                <span style={{ color: 'red' }}>*</span>
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                {isRTL ? 'اختر الفئات التي ستبيع فيها منتجاتك' : 'Select categories where you will sell your products'}
              </Text>
              <Stack gap="xs">
                {productCategories.map((category) => (
                  <Checkbox
                    key={category.value}
                    label={isRTL ? category.labelAr : category.labelEn}
                    checked={formData.productCategories.includes(category.value)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...formData.productCategories, category.value]
                        : formData.productCategories.filter(c => c !== category.value);
                      handleInputChange('productCategories', newCategories);
                    }}
                  />
                ))}
              </Stack>
              {errors.productCategories && (
                <Text size="xs" c="red" mt="xs">{errors.productCategories}</Text>
              )}
            </div>

            <Select
              label={isRTL ? 'الحجم المتوقع للمبيعات الشهرية' : 'Expected Monthly Sales Volume'}
              placeholder={isRTL ? 'اختر الحجم المتوقع' : 'Select expected volume'}
              value={formData.estimatedMonthlyVolume}
              onChange={(value) => handleInputChange('estimatedMonthlyVolume', value)}
              data={[
                { value: 'small', label: isRTL ? 'صغير (أقل من 1,000 د.ب)' : 'Small (Less than 1,000 BHD)' },
                { value: 'medium', label: isRTL ? 'متوسط (1,000 - 10,000 د.ب)' : 'Medium (1,000 - 10,000 BHD)' },
                { value: 'large', label: isRTL ? 'كبير (10,000 - 50,000 د.ب)' : 'Large (10,000 - 50,000 BHD)' },
                { value: 'enterprise', label: isRTL ? 'مؤسسي (أكثر من 50,000 د.ب)' : 'Enterprise (More than 50,000 BHD)' }
              ]}
            />

            <Divider my="md" />

            <Stack gap="sm">
              <Text fw={600} size="lg">
                {isRTL ? 'الموافقات والأحكام' : 'Agreements & Terms'}
              </Text>
              
              <Checkbox
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                label={
                  <Text size="sm">
                    {isRTL ? 'أوافق على ' : 'I agree to the '}
                    <Anchor href="/vendor/terms" target="_blank">
                      {isRTL ? 'شروط وأحكام البائعين' : 'Vendor Terms & Conditions'}
                    </Anchor>
                    {isRTL ? ' ومعدل العمولة 15%' : ' and 15% commission rate'}
                  </Text>
                }
                error={errors.acceptTerms}
              />
              
              <Checkbox
                checked={formData.acceptCommission}
                onChange={(e) => handleInputChange('acceptCommission', e.target.checked)}
                label={
                  <Text size="sm">
                    {isRTL 
                      ? 'أوافق على نظام العمولة وأفهم أنه سيتم خصم 15% من كل عملية بيع'
                      : 'I agree to the commission system and understand that 15% will be deducted from each sale'
                    }
                  </Text>
                }
              />
              
              <Checkbox
                checked={formData.pdplConsent}
                onChange={(e) => handleInputChange('pdplConsent', e.target.checked)}
                label={
                  <Text size="sm">
                    {isRTL 
                      ? 'أوافق على معالجة بياناتي الشخصية وفقاً لقانون حماية البيانات الشخصية البحريني (PDPL)'
                      : 'I consent to processing of my personal data according to Bahrain Personal Data Protection Law (PDPL)'
                    }
                  </Text>
                }
                error={errors.pdplConsent}
              />
              
              <Checkbox
                checked={formData.marketingConsent}
                onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                label={
                  <Text size="sm">
                    {isRTL 
                      ? 'أرغب في استلام التحديثات التسويقية والعروض الخاصة للبائعين'
                      : 'I want to receive marketing updates and special offers for vendors'
                    }
                  </Text>
                }
              />
            </Stack>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        
        {/* Header */}
        <Card withBorder padding="lg">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1}>
                {isRTL ? 'انضم كبائع' : 'Become a Vendor'}
              </Title>
              <Text size="lg" c="dimmed" mt="xs">
                {isRTL 
                  ? 'ابدأ رحلتك في البيع على أكبر منصة تجارة إلكترونية في البحرين'
                  : 'Start your selling journey on Bahrain\'s largest e-commerce platform'
                }
              </Text>
            </div>
            
            <Group gap="md">
              <Button
                variant="outline"
                leftSection={<IconLanguage size={16} />}
                onClick={toggleLocale}
              >
                {isRTL ? 'English' : 'العربية'}
              </Button>
              <Badge size="lg" color="orange">
                {isRTL ? 'مجاني' : 'Free to Join'}
              </Badge>
            </Group>
          </Group>
        </Card>

        {/* Progress Stepper */}
        <Card withBorder padding="lg">
          <Stepper 
            active={currentStep} 
            onStepClick={setCurrentStep}
            color="orange"
            size="md"
            allowNextStepsSelect={false}
          >
            {steps.map((step, index) => (
              <Stepper.Step
                key={index}
                label={step.label}
                description={step.description}
                icon={<step.icon size={18} />}
                allowStepSelect={index <= currentStep}
              />
            ))}
          </Stepper>
        </Card>

        {/* Form Content */}
        <Card withBorder padding="xl">
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        <Group justify="space-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            leftSection={isRTL ? <IconArrowRight size={16} /> : undefined}
            rightSection={!isRTL ? <IconArrowLeft size={16} /> : undefined}
          >
            {isRTL ? 'التالي' : 'Previous'}
          </Button>
          
          <Group gap="md">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              leftSection={<IconEye size={16} />}
            >
              {isRTL ? 'معاينة الطلب' : 'Preview Application'}
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNextStep}
                rightSection={isRTL ? <IconArrowLeft size={16} /> : <IconArrowRight size={16} />}
              >
                {isRTL ? 'السابق' : 'Next'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                leftSection={<IconCheck size={16} />}
                size="lg"
              >
                {isRTL ? 'إرسال الطلب' : 'Submit Application'}
              </Button>
            )}
          </Group>
        </Group>

        {/* Preview Modal */}
        <Modal
          opened={showPreview}
          onClose={() => setShowPreview(false)}
          title={isRTL ? 'معاينة طلب الانضمام' : 'Application Preview'}
          size="lg"
          centered
        >
          <Stack gap="md">
            <Title order={4}>
              {isRTL ? 'ملخص المعلومات' : 'Information Summary'}
            </Title>
            
            <Group justify="space-between">
              <Text fw={500}>{isRTL ? 'الاسم:' : 'Name:'}</Text>
              <Text>{formData.firstName} {formData.lastName}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={500}>{isRTL ? 'اسم الشركة:' : 'Business Name:'}</Text>
              <Text>{isRTL ? formData.businessNameAr : formData.businessNameEn}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={500}>{isRTL ? 'رقم السجل التجاري:' : 'CR Number:'}</Text>
              <Text ff="monospace">{formData.crNumber}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={500}>{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</Text>
              <Text>{formData.email}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={500}>{isRTL ? 'الفئات:' : 'Categories:'}</Text>
              <Text>{formData.productCategories.length} {isRTL ? 'فئة' : 'categories'}</Text>
            </Group>

            <Alert
              icon={<IconInfoCircle size={16} />}
              title={isRTL ? 'مراجعة الطلب' : 'Application Review'}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                {isRTL 
                  ? 'سيتم مراجعة طلبك خلال 2-3 أيام عمل. ستصلك رسالة تأكيد على البريد الإلكتروني.'
                  : 'Your application will be reviewed within 2-3 business days. You will receive a confirmation email.'
                }
              </Text>
            </Alert>
          </Stack>
        </Modal>

      </Stack>
    </Container>
  );
}