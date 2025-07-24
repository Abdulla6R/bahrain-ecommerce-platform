'use client';

import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

const rtlCache = createCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
});

const ltrCache = createCache({
  key: 'mantine-ltr',
});

// Gulf-appropriate yellow/orange color scheme
const orange: MantineColorsTuple = [
  '#fff8e1',
  '#ffecb3',
  '#ffe082',
  '#ffd54f',
  '#ffcc02',
  '#FFA500', // Primary orange
  '#ff9800',
  '#f57c00',
  '#ef6c00',
  '#e65100'
];

const yellow: MantineColorsTuple = [
  '#fffde7',
  '#fff9c4',
  '#fff59d',
  '#fff176',
  '#ffee58',
  '#FFE135', // Accent yellow
  '#fdd835',
  '#fbc02d',
  '#f9a825',
  '#f57f17'
];

const theme = createTheme({
  primaryColor: 'orange',
  colors: {
    orange,
    yellow,
  },
  fontFamily: 'var(--font-cairo), var(--font-inter), Tahoma, sans-serif',
  headings: {
    fontFamily: 'var(--font-amiri), var(--font-cairo), Traditional Arabic, serif',
  },
  defaultRadius: 'md',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
});

interface BahrainMantineProviderProps {
  children: React.ReactNode;
  locale: string;
}

export default function BahrainMantineProvider({ 
  children, 
  locale 
}: BahrainMantineProviderProps) {
  const isRTL = locale === 'ar';
  const emotionCache = isRTL ? rtlCache : ltrCache;
  
  const localizedTheme = createTheme({
    ...theme,
    fontFamily: isRTL 
      ? 'var(--font-cairo), Traditional Arabic, Tahoma, sans-serif'
      : 'var(--font-inter), -apple-system, sans-serif',
    headings: {
      fontFamily: isRTL
        ? 'var(--font-amiri), var(--font-cairo), Traditional Arabic, serif'
        : 'var(--font-inter), -apple-system, sans-serif',
      sizes: {
        h1: { fontSize: isRTL ? '2.5rem' : '2.25rem' }, // +10% for Arabic
        h2: { fontSize: isRTL ? '2.2rem' : '2rem' },
        h3: { fontSize: isRTL ? '1.98rem' : '1.8rem' },
        h4: { fontSize: isRTL ? '1.65rem' : '1.5rem' },
        h5: { fontSize: isRTL ? '1.43rem' : '1.3rem' },
        h6: { fontSize: isRTL ? '1.21rem' : '1.1rem' },
      },
    },
    other: {
      lineHeight: isRTL ? 1.7 : 1.5, // Better Arabic readability
    },
  });

  return (
    <CacheProvider value={emotionCache}>
      <MantineProvider theme={localizedTheme}>
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}