import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['ar', 'en'] as const;
export const defaultLocale = 'ar' as const;

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as 'ar' | 'en')) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale!,
    timeZone: 'Asia/Bahrain',
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        medium: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'BHD',
          minimumFractionDigits: 3 // Bahrain Dinar uses 3 decimal places
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 1
        }
      }
    }
  };
});