// Performance optimization utilities for Bahrain e-commerce platform

import { type NextRequest, NextResponse } from 'next/server';

// Image optimization configuration
export const imageConfig = {
  formats: ['image/webp', 'image/avif', 'image/jpeg'],
  sizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  quality: {
    default: 75,
    low: 50,
    high: 90
  },
  deviceSizes: {
    mobile: [320, 640, 750],
    tablet: [828, 1080, 1200],
    desktop: [1920, 2048, 3840]
  }
};

// Cache configuration for different content types
export const cacheConfig = {
  static: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400 // 1 day
  },
  api: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60 // 1 minute
  },
  pages: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 300 // 5 minutes
  },
  products: {
    maxAge: 1800, // 30 minutes
    staleWhileRevalidate: 300 // 5 minutes
  },
  user: {
    maxAge: 0, // No cache
    staleWhileRevalidate: 0
  }
};

// Redis cache implementation
export class RedisCache {
  private redis: any;
  
  constructor() {
    // Initialize Redis connection (would be actual Redis instance in production)
    this.redis = {
      get: async (key: string) => {
        // Mock implementation
        return null;
      },
      set: async (key: string, value: string, ttl?: number) => {
        // Mock implementation
        return 'OK';
      },
      del: async (key: string) => {
        // Mock implementation
        return 1;
      }
    };
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), ttl);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  // Cache patterns for different data types
  generateKey(type: string, id: string, locale?: string): string {
    return locale ? `${type}:${id}:${locale}` : `${type}:${id}`;
  }

  // Product cache methods
  async getProduct(id: string, locale: string = 'en') {
    return this.get(this.generateKey('product', id, locale));
  }

  async setProduct(id: string, product: any, locale: string = 'en') {
    await this.set(this.generateKey('product', id, locale), product, cacheConfig.products.maxAge);
  }

  // User session cache methods
  async getUserSession(sessionId: string) {
    return this.get(this.generateKey('session', sessionId));
  }

  async setUserSession(sessionId: string, session: any) {
    await this.set(this.generateKey('session', sessionId), session, 86400); // 24 hours
  }

  // Cart cache methods
  async getCart(userId: string) {
    return this.get(this.generateKey('cart', userId));
  }

  async setCart(userId: string, cart: any) {
    await this.set(this.generateKey('cart', userId), cart, 3600); // 1 hour
  }

  // Search results cache
  async getSearchResults(query: string, filters: string, locale: string = 'en') {
    const key = `search:${Buffer.from(query + filters).toString('base64')}:${locale}`;
    return this.get(key);
  }

  async setSearchResults(query: string, filters: string, results: any, locale: string = 'en') {
    const key = `search:${Buffer.from(query + filters).toString('base64')}:${locale}`;
    await this.set(key, results, 300); // 5 minutes
  }
}

// Lazy loading utility for images
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  
  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.observer?.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );
    }
  }

  observe(img: HTMLImageElement) {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  // Core Web Vitals monitoring
  measureLCP() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
        this.reportMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  measureFID() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.set('FID', entry.processingStart - entry.startTime);
          this.reportMetric('FID', entry.processingStart - entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  measureCLS() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.set('CLS', clsValue);
        this.reportMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Custom timing measurements
  startTiming(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  }

  endTiming(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = performance.getEntriesByName(name);
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration;
        this.metrics.set(name, duration);
        this.reportMetric(name, duration);
      }
    }
  }

  private reportMetric(name: string, value: number) {
    // In production, send to analytics service
    console.log(`Performance metric - ${name}: ${value.toFixed(2)}ms`);
    
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true
      });
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Bundle analysis and code splitting helpers
export const dynamicImports = {
  // Lazy load heavy components
  SearchEngine: () => import('../components/search/SearchEngine'),
  ProductRecommendations: () => import('../components/recommendations/ProductRecommendations'),
  ReviewSystem: () => import('../components/reviews/ReviewSystem'),
  VendorAnalytics: () => import('../components/vendor/VendorAnalytics'),
  PDPLCompliance: () => import('../components/vendor/PDPLCompliance'),
  
  // Lazy load utility libraries
  dateUtils: () => import('date-fns'),
  chartLibrary: () => import('recharts'),
  
  // Lazy load by route
  vendorDashboard: () => import('../app/vendor/dashboard/page'),
  adminPanel: () => import('../app/admin/page'),
  userAccount: () => import('../app/account/page')
};

// Network-aware loading
export class NetworkAwareLoader {
  private connection: any;
  
  constructor() {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      this.connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    }
  }

  getConnectionType(): 'slow-2g' | '2g' | '3g' | '4g' | 'unknown' {
    if (!this.connection) return 'unknown';
    return this.connection.effectiveType || 'unknown';
  }

  isSlowConnection(): boolean {
    const type = this.getConnectionType();
    return type === 'slow-2g' || type === '2g';
  }

  isFastConnection(): boolean {
    const type = this.getConnectionType();
    return type === '4g';
  }

  // Adaptive loading based on network conditions
  getImageQuality(): 'low' | 'default' | 'high' {
    if (this.isSlowConnection()) return 'low';
    if (this.isFastConnection()) return 'high';
    return 'default';
  }

  shouldPreloadImages(): boolean {
    return !this.isSlowConnection();
  }

  getResourcePriority(): 'high' | 'low' {
    return this.isSlowConnection() ? 'low' : 'high';
  }
}

// Optimized image component props generator
export function generateImageProps(
  src: string,
  alt: string,
  priority: boolean = false,
  quality?: 'low' | 'default' | 'high'
) {
  const networkLoader = new NetworkAwareLoader();
  const actualQuality = quality || networkLoader.getImageQuality();
  
  return {
    src,
    alt,
    quality: imageConfig.quality[actualQuality],
    sizes: priority 
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      : '(max-width: 768px) 100vw, 50vw',
    priority,
    loading: priority ? 'eager' as const : 'lazy' as const,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
  };
}

// Service Worker registration for PWA
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                if (window.confirm('A new version is available. Would you like to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/cairo-variable.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Preload critical CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'preload';
    cssLink.href = '/styles/critical.css';
    cssLink.as = 'style';
    document.head.appendChild(cssLink);

    // DNS prefetch for external domains
    const domains = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'api.benefitpay.bh'];
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }
}

// Export singleton instances
export const cache = new RedisCache();
export const imageLoader = new LazyImageLoader();
export const performanceMonitor = new PerformanceMonitor();
export const networkLoader = new NetworkAwareLoader();

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.measureLCP();
  performanceMonitor.measureFID();
  performanceMonitor.measureCLS();
}