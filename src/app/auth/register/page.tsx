'use client';

import { useState } from 'react';
import {
  Container,
  Card,
  Stack,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Divider,
  Alert,
  Checkbox,
  Select,
  Modal,
  Progress,
  Badge,
  Anchor
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
  IconShield,
  IconInfoCircle,
  IconUserPlus
} from '@tabler/icons-react';

interface RegisterPageProps {
  searchParams: Promise<{ locale?: string }>;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  governorate: string;
  city: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  pdplConsent: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  governorate?: string;
  city?: string;
  acceptTerms?: string;
  acceptMarketing?: string;
  pdplConsent?: string;
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

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const locale = resolvedSearchParams.locale || 'en';
  const isRTL = locale === 'ar';
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    governorate: '',
    city: '',
    acceptTerms: false,
    acceptMarketing: false,
    pdplConsent: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOTP] = useState('');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Phone number validation for Bahrain
  const validateBahrainPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const bahrainPhoneRegex = /^(\+973|973|00973)?[3679]\d{7}$/;
    return bahrainPhoneRegex.test(cleanPhone);
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = isRTL ? 'الاسم الأول مطلوب' : 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = isRTL ? 'اسم العائلة مطلوب' : 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address';
    }

    // Phone validation
    if (!validateBahrainPhone(formData.phone)) {
      newErrors.phone = isRTL ? 'رقم الهاتف البحريني غير صحيح' : 'Invalid Bahrain phone number';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }

    // Location validation
    if (!formData.governorate) {
      newErrors.governorate = isRTL ? 'المحافظة مطلوبة' : 'Governorate is required';
    }
    if (!formData.city) {
      newErrors.city = isRTL ? 'المدينة مطلوبة' : 'City is required';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'Terms and conditions must be accepted';
    }
    if (!formData.pdplConsent) {
      newErrors.pdplConsent = isRTL ? 'موافقة حماية البيانات مطلوبة' : 'Data protection consent is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to OTP verification
      setRegistrationStep(2);
      setShowOTPModal(true);
      
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 6) return;
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRegistrationStep(3);
      setShowOTPModal(false);
      
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'red';
    if (passwordStrength < 60) return 'yellow';
    if (passwordStrength < 80) return 'orange';
    return 'green';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return isRTL ? 'ضعيف' : 'Weak';
    if (passwordStrength < 60) return isRTL ? 'متوسط' : 'Fair';
    if (passwordStrength < 80) return isRTL ? 'جيد' : 'Good';
    return isRTL ? 'قوي' : 'Strong';
  };

  if (registrationStep === 3) {
    return (
      <Container size="sm" py="xl">
        <Card shadow="lg" padding="xl" radius="md" withBorder className="text-center">
          <Stack gap="xl" align="center">
            <IconCheck size={80} className="text-green-600" />
            <div>
              <Title order={2} c="green" mb="md">
                {isRTL ? 'مرحباً بك في تندز!' : 'Welcome to Tendzd!'}
              </Title>
              <Text size="lg" c="dimmed">
                {isRTL 
                  ? 'تم تسجيل حسابك بنجاح. يمكنك الآن البدء في التسوق.'
                  : 'Your account has been successfully created. You can now start shopping.'
                }
              </Text>
            </div>
            <Group>
              <Button size="lg" onClick={() => window.location.href = '/'}>
                {isRTL ? 'ابدأ التسوق' : 'Start Shopping'}
              </Button>
              <Button variant="outline" size="lg">
                {isRTL ? 'إعداد الملف الشخصي' : 'Setup Profile'}
              </Button>
            </Group>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Stack gap="lg">
          
          {/* Header */}
          <div className="text-center">
            <Group justify="center" gap="sm" mb="md">
              <IconUserPlus size={32} className="text-orange-600" />
              <Title order={1}>
                {isRTL ? 'إنشاء حساب جديد' : 'Create New Account'}
              </Title>
            </Group>
            <Text c="dimmed" size="lg">
              {isRTL 
                ? 'انضم إلى أكبر منصة تجارة إلكترونية في البحرين'
                : 'Join Bahrain\'s largest e-commerce marketplace'
              }
            </Text>
          </div>

          {/* Registration Progress */}
          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                {isRTL ? 'خطوات التسجيل' : 'Registration Progress'}
              </Text>
              <Text size="sm" c="dimmed">
                {registrationStep}/3
              </Text>
            </Group>
            <Progress value={(registrationStep / 3) * 100} color="orange" />
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Stack gap="md">
              
              {/* Personal Information */}
              <div>
                <Text fw={600} mb="sm">
                  {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                </Text>
                
                <Group grow>
                  <TextInput
                    label={isRTL ? 'الاسم الأول' : 'First Name'}
                    placeholder={isRTL ? 'أدخل اسمك الأول' : 'Enter your first name'}
                    leftSection={<IconUser size={16} />}
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
              </div>

              {/* Contact Information */}
              <div>
                <Text fw={600} mb="sm">
                  {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
                </Text>
                
                <TextInput
                  label={isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                  placeholder={isRTL ? 'name@example.com' : 'name@example.com'}
                  leftSection={<IconMail size={16} />}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />
                
                <TextInput
                  label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  placeholder={isRTL ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                  leftSection={<IconPhone size={16} />}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  description={isRTL ? 'رقم الهاتف البحريني مطلوب للتحقق' : 'Bahrain phone number required for verification'}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Text fw={600} mb="sm">
                  {isRTL ? 'العنوان' : 'Location'}
                </Text>
                
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
                    error={errors.governorate}
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
                    error={errors.city}
                    required
                  />
                </Group>
              </div>

              {/* Password */}
              <div>
                <Text fw={600} mb="sm">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </Text>
                
                <PasswordInput
                  label={isRTL ? 'كلمة المرور' : 'Password'}
                  placeholder={isRTL ? 'أدخل كلمة مرور قوية' : 'Enter a strong password'}
                  leftSection={<IconLock size={16} />}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  required
                />
                
                {formData.password && (
                  <div className="mt-2">
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">
                        {isRTL ? 'قوة كلمة المرور:' : 'Password strength:'}
                      </Text>
                      <Text size="sm" c={getPasswordStrengthColor()}>
                        {getPasswordStrengthText()}
                      </Text>
                    </Group>
                    <Progress value={passwordStrength} color={getPasswordStrengthColor()} size="sm" />
                  </div>
                )}
                
                <PasswordInput
                  label={isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                  leftSection={<IconLock size={16} />}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  mt="sm"
                  required
                />
              </div>

              <Divider />

              {/* Agreements */}
              <Stack gap="sm">
                <Checkbox
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  label={
                    <Text size="sm">
                      {isRTL ? 'أوافق على ' : 'I agree to the '}
                      <Anchor href="/terms" target="_blank">
                        {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
                      </Anchor>
                      {isRTL ? ' و' : ' and '}
                      <Anchor href="/privacy" target="_blank">
                        {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                      </Anchor>
                    </Text>
                  }
                  error={errors.acceptTerms}
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
                  checked={formData.acceptMarketing}
                  onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                  label={
                    <Text size="sm">
                      {isRTL 
                        ? 'أرغب في استلام العروض والتحديثات التسويقية'
                        : 'I want to receive marketing offers and updates'
                      }
                    </Text>
                  }
                />
              </Stack>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isSubmitting}
                leftSection={<IconUserPlus size={20} />}
                mt="lg"
              >
                {isRTL ? 'إنشاء الحساب' : 'Create Account'}
              </Button>

              {/* Login Link */}
              <Text ta="center" size="sm" c="dimmed">
                {isRTL ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                <Anchor href="/auth/login">
                  {isRTL ? 'تسجيل الدخول' : 'Sign in'}
                </Anchor>
              </Text>

            </Stack>
          </form>

        </Stack>
      </Card>

      {/* OTP Verification Modal */}
      <Modal
        opened={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        title={isRTL ? 'تحقق من رقم الهاتف' : 'Phone Verification'}
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Stack gap="md">
          <Alert
            icon={<IconInfoCircle size={16} />}
            title={isRTL ? 'رمز التحقق' : 'Verification Code'}
            color="blue"
            variant="light"
          >
            <Text size="sm">
              {isRTL 
                ? `تم إرسال رمز التحقق إلى ${formData.phone}`
                : `Verification code sent to ${formData.phone}`
              }
            </Text>
          </Alert>
          
          <TextInput
            label={isRTL ? 'رمز التحقق' : 'Verification Code'}
            placeholder={isRTL ? 'أدخل الرمز المكون من 6 أرقام' : 'Enter 6-digit code'}
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            maxLength={6}
            size="lg"
            styles={{
              input: {
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem'
              }
            }}
          />
          
          <Group grow>
            <Button variant="outline" onClick={() => setShowOTPModal(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={handleOTPVerification}
              disabled={otp.length !== 6}
            >
              {isRTL ? 'تحقق' : 'Verify'}
            </Button>
          </Group>
          
          <Text ta="center" size="sm" c="dimmed">
            {isRTL ? 'لم تستلم الرمز؟ ' : 'Didn\'t receive the code? '}
            <Anchor onClick={() => console.log('Resend OTP')}>
              {isRTL ? 'إعادة الإرسال' : 'Resend'}
            </Anchor>
          </Text>
        </Stack>
      </Modal>
    </Container>
  );
}