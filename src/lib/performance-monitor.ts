// Performance monitoring and analytics for Bahrain Multi-Vendor Platform
// Tracks Core Web Vitals, user interactions, and Arabic-specific performance metrics

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay  
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // Custom metrics
  pageLoadTime: number;
  domInteractive: number;
  domComplete: number;
  arabicFontLoadTime: number | null;
  rtlLayoutTime: number | null;
  
  // Network metrics
  connectionType: string;
  downlink: number | null;
  
  // User context
  locale: string;
  userAgent: string;
  viewport: { width: number; height: number };
  device: 'mobile' | 'tablet' | 'desktop';
  
  // Page context
  path: string;
  referrer: string;
  timestamp: number;
}

export interface UserInteractionMetrics {
  type: 'click' | 'scroll' | 'touch' | 'swipe' | 'keyboard';
  element: string;
  duration?: number;
  coordinates?: { x: number; y: number };
  scrollDepth?: number;
  locale: string;
  device: string;
  timestamp: number;
}

export interface BusinessMetrics {
  type: 'product_view' | 'add_to_cart' | 'purchase' | 'search' | 'vendor_visit';
  productId?: string;
  vendorId?: string;
  searchQuery?: string;
  category?: string;
  value?: number;
  currency?: string;
  locale: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private observer: PerformanceObserver | null = null;
  private reportingEndpoint = '/api/analytics/performance';
  private batchSize = 10;
  private batchTimeout = 5000;
  private metricsQueue: any[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    // Initialize Core Web Vitals monitoring
    this.initializeCoreWebVitals();
    
    // Initialize custom metrics
    this.initializeCustomMetrics();
    
    // Initialize user interaction tracking
    this.initializeInteractionTracking();
    
    // Initialize network monitoring
    this.initializeNetworkMonitoring();
    
    // Initialize Arabic-specific monitoring
    this.initializeArabicMetrics();
    
    // Setup automatic reporting
    this.setupAutomaticReporting();
  }

  private initializeCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEventTiming;
        this.updateMetric('lcp', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.updateMetric('fid', entry.processingStart - entry.startTime);
        });
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.updateMetric('cls', clsValue);
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.updateMetric('fcp', fcpEntry.startTime);
        }
      });

      try {
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {
        console.warn('FCP monitoring not supported');
      }
    }
  }

  private initializeCustomMetrics(): void {
    // Navigation timing metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.updateMetric('pageLoadTime', navigation.loadEventEnd - navigation.fetchStart);
          this.updateMetric('domInteractive', navigation.domInteractive - navigation.fetchStart);
          this.updateMetric('domComplete', navigation.domComplete - navigation.fetchStart);
          this.updateMetric('ttfb', navigation.responseStart - navigation.fetchStart);
        }
      }, 0);
    });

    // Resource timing for fonts and critical assets
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceResourceTiming) => {
        // Track Arabic font loading
        if (entry.name.includes('cairo') || entry.name.includes('amiri') || entry.name.includes('noto-arabic')) {
          this.updateMetric('arabicFontLoadTime', entry.duration);
        }
      });
    });

    try {
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.warn('Resource timing not supported');
    }
  }

  private initializeInteractionTracking(): void {
    // Click tracking with Arabic element detection
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      const elementText = target.textContent || '';
      const hasArabic = /[\u0600-\u06FF]/.test(elementText);
      
      this.trackUserInteraction({
        type: 'click',
        element: this.getElementSelector(target),
        coordinates: { x: event.clientX, y: event.clientY },
        locale: hasArabic ? 'ar' : this.getCurrentLocale(),
        device: this.getDeviceType(),
        timestamp: Date.now()
      });
    });

    // Touch gesture tracking for mobile
    if ('ontouchstart' in window) {
      let touchStart: { x: number; y: number; time: number } | null = null;

      document.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStart = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      });

      document.addEventListener('touchend', (event) => {
        if (touchStart) {
          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - touchStart.x;
          const deltaY = touch.clientY - touchStart.y;
          const deltaTime = Date.now() - touchStart.time;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Detect swipe gestures
          if (distance > 50 && deltaTime < 300) {
            const direction = Math.abs(deltaX) > Math.abs(deltaY) 
              ? (deltaX > 0 ? 'right' : 'left')
              : (deltaY > 0 ? 'down' : 'up');
            
            this.trackUserInteraction({
              type: 'swipe',
              element: `swipe-${direction}`,
              duration: deltaTime,
              locale: this.getCurrentLocale(),
              device: this.getDeviceType(),
              timestamp: Date.now()
            });
          } else if (deltaTime < 300) {
            // Regular touch
            this.trackUserInteraction({
              type: 'touch',
              element: this.getElementSelector(event.target as Element),
              coordinates: { x: touch.clientX, y: touch.clientY },
              locale: this.getCurrentLocale(),
              device: this.getDeviceType(),
              timestamp: Date.now()
            });
          }

          touchStart = null;
        }
      });
    }

    // Scroll depth tracking
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track scroll milestones
        if (maxScrollDepth >= 25 && maxScrollDepth % 25 === 0) {
          this.trackUserInteraction({
            type: 'scroll',
            element: 'page',
            scrollDepth: maxScrollDepth,
            locale: this.getCurrentLocale(),
            device: this.getDeviceType(),
            timestamp: Date.now()
          });
        }
      }
    };

    let scrollTimer: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(trackScroll, 100);
    }, { passive: true });
  }

  private initializeNetworkMonitoring(): void {
    // Network information API
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      this.updateMetric('connectionType', connection.effectiveType || 'unknown');
      this.updateMetric('downlink', connection.downlink || null);
      
      // Monitor network changes
      connection.addEventListener('change', () => {
        this.updateMetric('connectionType', connection.effectiveType || 'unknown');
        this.updateMetric('downlink', connection.downlink || null);
        this.reportMetrics(); // Immediate report on network change
      });
    }
  }

  private initializeArabicMetrics(): void {
    // Measure RTL layout performance
    const measureRTLLayout = () => {
      const startTime = performance.now();
      
      // Find Arabic text elements
      const arabicElements = Array.from(document.querySelectorAll('[dir="rtl"], .arabic-text'))
        .filter(el => /[\u0600-\u06FF]/.test(el.textContent || ''));

      if (arabicElements.length > 0) {
        // Force reflow to measure layout impact
        arabicElements.forEach(el => {
          el.getBoundingClientRect();
        });
        
        const endTime = performance.now();
        this.updateMetric('rtlLayoutTime', endTime - startTime);
      }
    };

    // Measure after fonts are loaded
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(measureRTLLayout, 100);
      });
    } else {
      setTimeout(measureRTLLayout, 1000);
    }
  }

  private setupAutomaticReporting(): void {
    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics(true); // Force immediate report
    });

    // Report periodically
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Every 30 seconds

    // Report on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics(true);
      }
    });
  }

  private updateMetric(key: keyof PerformanceMetrics, value: any): void {
    if (!this.metrics) {
      this.metrics = this.createBaseMetrics();
    }
    
    (this.metrics as any)[key] = value;
  }

  private createBaseMetrics(): PerformanceMetrics {
    return {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
      pageLoadTime: 0,
      domInteractive: 0,
      domComplete: 0,
      arabicFontLoadTime: null,
      rtlLayoutTime: null,
      connectionType: 'unknown',
      downlink: null,
      locale: this.getCurrentLocale(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      device: this.getDeviceType(),
      path: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now()
    };
  }

  private getCurrentLocale(): string {
    return document.documentElement.lang || 
           localStorage.getItem('locale') || 
           'en';
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private trackUserInteraction(interaction: UserInteractionMetrics): void {
    this.addToQueue('interaction', interaction);
  }

  public trackBusinessMetric(metric: BusinessMetrics): void {
    this.addToQueue('business', metric);
  }

  private addToQueue(type: string, data: any): void {
    this.metricsQueue.push({ type, data, timestamp: Date.now() });
    
    if (this.metricsQueue.length >= this.batchSize) {
      this.reportMetrics();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.reportMetrics();
      }, this.batchTimeout);
    }
  }

  private async reportMetrics(immediate = false): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const payload = {
      performance: this.metrics,
      queue: [...this.metricsQueue],
      immediate,
      timestamp: Date.now()
    };

    // Clear queue
    this.metricsQueue = [];

    try {
      // Use sendBeacon for immediate reports (more reliable)
      if (immediate && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(this.reportingEndpoint, blob);
      } else {
        // Regular fetch for batched reports
        await fetch(this.reportingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (error) {
      console.warn('Failed to report metrics:', error);
      // Add failed metrics back to queue for retry
      this.metricsQueue.push(...payload.queue);
    }
  }

  // Public API for custom tracking
  public startTiming(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.addToQueue('timing', {
        name,
        duration,
        locale: this.getCurrentLocale(),
        timestamp: Date.now()
      });
    };
  }

  public trackError(error: Error, context?: any): void {
    this.addToQueue('error', {
      message: error.message,
      stack: error.stack,
      context,
      locale: this.getCurrentLocale(),
      timestamp: Date.now()
    });
  }

  public trackFeatureUsage(feature: string, details?: any): void {
    this.addToQueue('feature', {
      feature,
      details,
      locale: this.getCurrentLocale(),
      timestamp: Date.now()
    });
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions for common use cases
export const trackProductView = (productId: string, vendorId: string, locale: string) => {
  performanceMonitor.trackBusinessMetric({
    type: 'product_view',
    productId,
    vendorId,
    locale,
    timestamp: Date.now()
  });
};

export const trackSearch = (query: string, locale: string) => {
  performanceMonitor.trackBusinessMetric({
    type: 'search',
    searchQuery: query,
    locale,
    timestamp: Date.now()
  });
};

export const trackPurchase = (value: number, currency: string, locale: string) => {
  performanceMonitor.trackBusinessMetric({
    type: 'purchase',
    value,
    currency,
    locale,
    timestamp: Date.now()
  });
};

export const trackAddToCart = (productId: string, locale: string) => {
  performanceMonitor.trackBusinessMetric({
    type: 'add_to_cart',
    productId,
    locale,
    timestamp: Date.now()
  });
};

// Arabic-specific performance helpers
export const measureArabicTextRender = (callback: () => void) => {
  const endTiming = performanceMonitor.startTiming('arabic_text_render');
  callback();
  endTiming();
};

export const measureRTLLayoutShift = (callback: () => void) => {
  const endTiming = performanceMonitor.startTiming('rtl_layout_shift');
  callback();
  endTiming();
};