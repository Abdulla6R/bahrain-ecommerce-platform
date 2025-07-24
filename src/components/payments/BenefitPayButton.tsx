'use client';

import { useState } from 'react';
import { Button, Alert, Modal, Stack, Text, Group, Card, Loader } from '@mantine/core';
import { 
  IconCreditCard, 
  IconShield, 
  IconCheck, 
  IconX, 
  IconInfoCircle 
} from '@tabler/icons-react';

interface BenefitPayButtonProps {
  amount: number;
  currency?: string;
  orderItems: any[];
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  locale: string;
  disabled?: boolean;
}

interface PaymentSession {
  sessionId: string;
  redirectUrl?: string;
  qrCode?: string;
  reference: string;
}

export function BenefitPayButton({
  amount,
  currency = 'BHD',
  orderItems,
  onPaymentSuccess,
  onPaymentError,
  locale,
  disabled = false
}: BenefitPayButtonProps) {
  const isRTL = locale === 'ar';
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [threeDSecureUrl, setThreeDSecureUrl] = useState<string | null>(null);

  const initiateBenefitPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create payment session with Benefit Pay Web Card SDK V2
      const response = await fetch('/api/payments/benefit-pay/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          items: orderItems,
          locale: locale,
          returnUrl: `${window.location.origin}/checkout/payment/success`,
          cancelUrl: `${window.location.origin}/checkout/payment/cancel`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const session: PaymentSession = await response.json();
      setPaymentSession(session);
      setShowModal(true);

      // If it's a redirect-based payment, redirect immediately
      if (session.redirectUrl) {
        window.location.href = session.redirectUrl;
      }

    } catch (error) {
      console.error('BenefitPay error:', error);
      onPaymentError(
        isRTL 
          ? 'حدث خطأ في الاتصال مع خدمة الدفع. يرجى المحاولة مرة أخرى.'
          : 'Payment service connection failed. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async (cardData: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    holderName: string;
  }) => {
    if (!paymentSession) return;

    try {
      setIsProcessing(true);

      // Process card payment through Benefit Pay SDK
      const response = await fetch('/api/payments/benefit-pay/process-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: paymentSession.sessionId,
          cardData: cardData,
          threeDSecure: true // Always enforce 3D Secure for Bahrain
        })
      });

      const result = await response.json();

      if (result.status === 'requires_3d_secure') {
        setThreeDSecureUrl(result.threeDSecureUrl);
      } else if (result.status === 'completed') {
        onPaymentSuccess(result.transactionId);
        setShowModal(false);
      } else if (result.status === 'failed') {
        onPaymentError(
          isRTL 
            ? result.messageAr || 'فشل في معالجة الدفعة. يرجى التحقق من بيانات البطاقة.'
            : result.message || 'Payment processing failed. Please check your card details.'
        );
      }

    } catch (error) {
      console.error('Card payment error:', error);
      onPaymentError(
        isRTL 
          ? 'حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while processing payment. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!paymentSession) return;

    try {
      setIsProcessing(true);

      // Process BenefitPay wallet payment
      const response = await fetch('/api/payments/benefit-pay/process-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: paymentSession.sessionId,
          paymentMethod: 'benefit_wallet'
        })
      });

      const result = await response.json();

      if (result.status === 'completed') {
        onPaymentSuccess(result.transactionId);
        setShowModal(false);
      } else if (result.status === 'requires_authorization') {
        // Show QR code or redirect to BenefitPay app
        window.location.href = result.authorizationUrl;
      } else {
        onPaymentError(
          isRTL 
            ? result.messageAr || 'فشل في الدفع عبر بنفت باي. يرجى المحاولة مرة أخرى.'
            : result.message || 'BenefitPay payment failed. Please try again.'
        );
      }

    } catch (error) {
      console.error('Wallet payment error:', error);
      onPaymentError(
        isRTL 
          ? 'حدث خطأ في الدفع عبر المحفظة الرقمية.'
          : 'Digital wallet payment error occurred.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        size="lg"
        fullWidth
        color="blue"
        onClick={initiateBenefitPayment}
        disabled={disabled || isProcessing}
        loading={isProcessing}
        leftSection={<IconCreditCard size={20} />}
        styles={{
          root: {
            backgroundColor: '#1565C0',
            '&:hover': {
              backgroundColor: '#0D47A1'
            }
          }
        }}
      >
        {isRTL ? 'الدفع عبر بنفت باي' : 'Pay with BenefitPay'}
      </Button>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={isRTL ? 'الدفع عبر بنفت باي' : 'BenefitPay Payment'}
        size="lg"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Stack gap="md">
          
          {/* Security Notice */}
          <Alert
            icon={<IconShield size={16} />}
            title={isRTL ? 'معاملة آمنة' : 'Secure Transaction'}
            color="green"
            variant="light"
          >
            <Text size="sm">
              {isRTL 
                ? 'جميع المعاملات محمية بتقنية التشفير المتقدم والمصادقة ثلاثية الأبعاد'
                : 'All transactions are protected with advanced encryption and 3D Secure authentication'
              }
            </Text>
          </Alert>

          {/* Payment Amount */}
          <Card withBorder padding="md">
            <Group justify="space-between">
              <Text size="lg" fw={500}>
                {isRTL ? 'المبلغ المطلوب:' : 'Amount to Pay:'}
              </Text>
              <Text size="xl" fw={700} c="blue">
                {amount.toFixed(3)} {currency}
              </Text>
            </Group>
          </Card>

          {/* Payment Methods */}
          <Stack gap="sm">
            <Text fw={600} size="md">
              {isRTL ? 'اختر طريقة الدفع:' : 'Choose Payment Method:'}
            </Text>

            {/* BenefitPay Wallet */}
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleWalletPayment}
              disabled={isProcessing}
              leftSection={<IconCreditCard size={20} />}
              styles={{
                root: {
                  border: '2px solid #1565C0',
                  color: '#1565C0',
                  '&:hover': {
                    backgroundColor: '#E3F2FD'
                  }
                }
              }}
            >
              {isRTL ? 'محفظة بنفت باي الرقمية' : 'BenefitPay Digital Wallet'}
            </Button>

            {/* Credit/Debit Card */}
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {/* Open card form */}}
              disabled={isProcessing}
              leftSection={<IconCreditCard size={20} />}
            >
              {isRTL ? 'بطاقة ائتمان / خصم' : 'Credit / Debit Card'}
            </Button>
          </Stack>

          {/* 3D Secure Frame */}
          {threeDSecureUrl && (
            <Card withBorder padding="md">
              <Text fw={600} mb="sm">
                {isRTL ? 'التحقق الأمني' : 'Security Verification'}
              </Text>
              <iframe
                src={threeDSecureUrl}
                width="100%"
                height="400"
                frameBorder="0"
                title={isRTL ? 'التحقق الأمني' : 'Security Verification'}
              />
            </Card>
          )}

          {/* Processing State */}
          {isProcessing && (
            <Group justify="center" gap="sm">
              <Loader size="sm" color="blue" />
              <Text size="sm" c="dimmed">
                {isRTL ? 'جاري معالجة الدفعة...' : 'Processing payment...'}
              </Text>
            </Group>
          )}

          {/* Support Info */}
          <Alert
            icon={<IconInfoCircle size={16} />}
            title={isRTL ? 'هل تحتاج مساعدة؟' : 'Need Help?'}
            color="orange"
            variant="light"
          >
            <Text size="sm">
              {isRTL 
                ? 'للمساعدة في الدفع، اتصل بنا على: 17123456 أو info@tendzd.com'
                : 'For payment assistance, contact us: 17123456 or info@tendzd.com'
              }
            </Text>
          </Alert>

        </Stack>
      </Modal>
    </>
  );
}