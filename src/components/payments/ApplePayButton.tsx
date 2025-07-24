'use client';

import { useState, useEffect } from 'react';
import { Button, Alert, Text, Group, Loader } from '@mantine/core';
import { IconDeviceMobile, IconApple, IconShield } from '@tabler/icons-react';

interface ApplePayButtonProps {
  amount: number;
  currency?: string;
  orderItems: any[];
  merchantInfo: {
    merchantId: string;
    merchantName: string;
    countryCode: string;
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  locale: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    ApplePaySession: any;
  }
}

export function ApplePayButton({
  amount,
  currency = 'BHD',
  orderItems,
  merchantInfo,
  onPaymentSuccess,
  onPaymentError,
  locale,
  disabled = false
}: ApplePayButtonProps) {
  const isRTL = locale === 'ar';
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check Apple Pay availability
    if (typeof window !== 'undefined' && window.ApplePaySession) {
      const canMakePayments = window.ApplePaySession.canMakePayments();
      const canMakePaymentsWithActiveCard = window.ApplePaySession.canMakePaymentsWithActiveCard(merchantInfo.merchantId);
      
      Promise.resolve(canMakePaymentsWithActiveCard).then((result) => {
        setIsApplePayAvailable(canMakePayments && result);
      });
    }
  }, [merchantInfo.merchantId]);

  const initiateApplePayment = async () => {
    if (!window.ApplePaySession || !isApplePayAvailable) {
      onPaymentError(
        isRTL 
          ? 'آبل باي غير متاح على هذا الجهاز'
          : 'Apple Pay is not available on this device'
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Create Apple Pay payment request
      const paymentRequest = {
        countryCode: merchantInfo.countryCode,
        currencyCode: currency,
        supportedNetworks: ['visa', 'masterCard', 'amex'], // Supported in Bahrain
        merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
        total: {
          label: isRTL ? 'إجمالي الطلب' : 'Order Total',
          amount: amount.toFixed(3),
          type: 'final'
        },
        lineItems: orderItems.map(item => ({
          label: isRTL ? item.nameAr || item.name : item.name,
          amount: (item.price * item.quantity).toFixed(3),
          type: 'final'
        })),
        requiredBillingContactFields: ['postalAddress', 'name'],
        requiredShippingContactFields: ['postalAddress', 'name', 'phone'],
        shippingMethods: [
          {
            label: isRTL ? 'توصيل عادي (1-3 أيام)' : 'Standard Delivery (1-3 days)',
            amount: '5.000',
            identifier: 'standard',
            detail: isRTL ? 'التوصيل خلال 1-3 أيام عمل' : 'Delivery within 1-3 business days'
          },
          {
            label: isRTL ? 'توصيل سريع (نفس اليوم)' : 'Express Delivery (Same day)',
            amount: '10.000',
            identifier: 'express',
            detail: isRTL ? 'التوصيل خلال نفس اليوم' : 'Same day delivery'
          }
        ],
        applicationData: btoa(JSON.stringify({
          orderId: `order_${Date.now()}`,
          locale: locale
        }))
      };

      // Create Apple Pay session
      const session = new window.ApplePaySession(10, paymentRequest); // Version 10 for latest features

      // Handle merchant validation
      session.onvalidatemerchant = async (event: any) => {
        try {
          const response = await fetch('/api/payments/apple-pay/validate-merchant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              validationURL: event.validationURL,
              merchantIdentifier: merchantInfo.merchantId
            })
          });

          if (!response.ok) {
            throw new Error('Merchant validation failed');
          }

          const merchantSession = await response.json();
          session.completeMerchantValidation(merchantSession);
        } catch (error) {
          console.error('Apple Pay merchant validation error:', error);
          session.abort();
          onPaymentError(
            isRTL 
              ? 'فشل في التحقق من صحة التاجر'
              : 'Merchant validation failed'
          );
        }
      };

      // Handle shipping method selection
      session.onshippingmethodselected = (event: any) => {
        const shippingMethod = event.shippingMethod;
        const shippingCost = parseFloat(shippingMethod.amount);
        const newTotal = amount + shippingCost;

        const update = {
          newTotal: {
            label: isRTL ? 'إجمالي الطلب' : 'Order Total',
            amount: newTotal.toFixed(3),
            type: 'final'
          },
          newLineItems: [
            ...orderItems.map(item => ({
              label: isRTL ? item.nameAr || item.name : item.name,
              amount: (item.price * item.quantity).toFixed(3),
              type: 'final'
            })),
            {
              label: shippingMethod.label,
              amount: shippingCost.toFixed(3),
              type: 'final'
            }
          ]
        };

        session.completeShippingMethodSelection(update);
      };

      // Handle shipping contact selection
      session.onshippingcontactselected = (event: any) => {
        const contact = event.shippingContact;
        
        // Validate Bahrain address
        const isBahrainAddress = contact.countryCode === 'BH';
        
        if (!isBahrainAddress) {
          session.completeShippingContactSelection({
            errors: [{
              code: 'shippingContactInvalid',
              contactField: 'countryCode',
              message: isRTL 
                ? 'نحن نوصل فقط داخل البحرين'
                : 'We only deliver within Bahrain'
            }],
            newShippingMethods: []
          });
          return;
        }

        session.completeShippingContactSelection({
          errors: [],
          newShippingMethods: paymentRequest.shippingMethods
        });
      };

      // Handle payment authorization
      session.onpaymentauthorized = async (event: any) => {
        try {
          const payment = event.payment;
          
          // Process payment through backend
          const response = await fetch('/api/payments/apple-pay/process-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentData: payment.token,
              billingContact: payment.billingContact,
              shippingContact: payment.shippingContact,
              orderItems: orderItems,
              amount: amount,
              currency: currency,
              locale: locale
            })
          });

          const result = await response.json();

          if (result.success) {
            session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
            onPaymentSuccess({
              transactionId: result.transactionId,
              paymentMethod: 'apple_pay',
              billingContact: payment.billingContact,
              shippingContact: payment.shippingContact
            });
          } else {
            session.completePayment(window.ApplePaySession.STATUS_FAILURE);
            onPaymentError(
              isRTL 
                ? result.messageAr || 'فشل في معالجة الدفعة'
                : result.message || 'Payment processing failed'
            );
          }

        } catch (error) {
          console.error('Apple Pay payment processing error:', error);
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
          onPaymentError(
            isRTL 
              ? 'حدث خطأ أثناء معالجة الدفعة'
              : 'An error occurred while processing payment'
          );
        }
      };

      // Handle session cancellation
      session.oncancel = () => {
        setIsProcessing(false);
        onPaymentError(
          isRTL 
            ? 'تم إلغاء عملية الدفع'
            : 'Payment was cancelled'
        );
      };

      // Start the session
      session.begin();

    } catch (error) {
      console.error('Apple Pay initialization error:', error);
      setIsProcessing(false);
      onPaymentError(
        isRTL 
          ? 'فشل في تشغيل آبل باي'
          : 'Failed to initialize Apple Pay'
      );
    }
  };

  if (!isApplePayAvailable) {
    return (
      <Alert
        icon={<IconDeviceMobile size={16} />}
        title={isRTL ? 'آبل باي غير متاح' : 'Apple Pay Not Available'}
        color="gray"
        variant="light"
      >
        <Text size="sm">
          {isRTL 
            ? 'آبل باي غير متاح على هذا الجهاز أو لا توجد بطاقات مضافة'
            : 'Apple Pay is not available on this device or no cards are added'
          }
        </Text>
      </Alert>
    );
  }

  return (
    <div>
      <Button
        size="lg"
        fullWidth
        color="dark"
        onClick={initiateApplePayment}
        disabled={disabled || isProcessing}
        loading={isProcessing}
        leftSection={<IconApple size={20} />}
        styles={{
          root: {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333'
            }
          }
        }}
      >
        {isRTL ? 'الدفع عبر آبل باي' : 'Pay with Apple Pay'}
      </Button>

      {/* Trust indicator */}
      <Group justify="center" gap="xs" mt="xs">
        <IconShield size={14} className="text-green-600" />
        <Text size="xs" c="dimmed">
          {isRTL 
            ? 'آمن ومدعوم من البنوك البحرينية'
            : 'Secure and supported by Bahraini banks'
          }
        </Text>
      </Group>
    </div>
  );
}