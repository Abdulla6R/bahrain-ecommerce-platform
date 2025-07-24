import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Initializes test environment with Bahrain-specific configurations
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up global test environment for Bahrain Multi-Vendor Platform...');
  
  // Launch browser for setup operations
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'ar-BH',
    geolocation: { latitude: 26.2285, longitude: 50.5860 }, // Manama, Bahrain
    permissions: ['geolocation'],
    timezoneId: 'Asia/Bahrain'
  });
  
  const page = await context.newPage();
  
  try {
    // Set up test data and environment
    await setupTestDatabase();
    await setupTestUsers();
    await setupTestProducts();
    await setupPaymentMocks();
    await setupAnalyticsMocks();
    
    // Warm up the application
    console.log('🌡️ Warming up application...');
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    
    // Visit main pages to ensure they load correctly
    const pagesToWarmUp = [
      '/',
      '/?locale=ar',
      '/?locale=en',
      '/products',
      '/categories',
      '/search'
    ];
    
    for (const pagePath of pagesToWarmUp) {
      try {
        await page.goto(`${baseURL}${pagePath}`, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        // Wait for critical resources to load
        await page.waitForFunction(() => {
          // Check if main content is loaded
          return document.querySelector('main') !== null;
        }, { timeout: 10000 });
        
        console.log(`✅ Warmed up: ${pagePath}`);
      } catch (error) {
        console.warn(`⚠️ Failed to warm up ${pagePath}:`, error);
      }
    }
    
    // Set up PWA and Service Worker
    await setupPWAEnvironment(page, baseURL);
    
    // Verify critical services are running
    await verifyServices(page, baseURL);
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function setupTestDatabase() {
  console.log('🗄️ Setting up test database...');
  
  // In a real implementation, this would:
  // 1. Create test database schema
  // 2. Seed with test data
  // 3. Set up multi-vendor test accounts
  // 4. Create test products with Arabic/English content
  
  // Mock implementation for demonstration
  const testData = {
    users: [
      {
        id: 'test-customer-1',
        email: 'customer@test.bh',
        name: 'Ahmed Al-Mahmood',
        nameAr: 'أحمد المحمود',
        locale: 'ar',
        phone: '+973-1234-5678'
      },
      {
        id: 'test-vendor-1',
        email: 'vendor@test.bh',
        name: 'Fatima Trading Co.',
        nameAr: 'شركة فاطمة التجارية',
        locale: 'ar',
        status: 'approved'
      }
    ],
    products: [
      {
        id: 'test-product-1',
        nameEn: 'Premium Smartphone',
        nameAr: 'هاتف ذكي متميز',
        price: 299.000, // BHD
        currency: 'BHD',
        vendorId: 'test-vendor-1',
        inStock: true
      }
    ]
  };
  
  // Store test data in environment or external service
  process.env.TEST_DATA = JSON.stringify(testData);
  
  console.log('✅ Test database setup completed');
}

async function setupTestUsers() {
  console.log('👥 Setting up test user accounts...');
  
  // Create authentication tokens for test users
  const testTokens = {
    customerToken: 'test-customer-jwt-token',
    vendorToken: 'test-vendor-jwt-token',
    adminToken: 'test-admin-jwt-token'
  };
  
  process.env.TEST_TOKENS = JSON.stringify(testTokens);
  
  console.log('✅ Test users setup completed');
}

async function setupTestProducts() {
  console.log('📦 Setting up test products...');
  
  // Create test product catalog with Arabic/English content
  const testProducts = {
    electronics: [
      {
        id: 'electronics-001',
        nameEn: 'Latest Smartphone',
        nameAr: 'أحدث هاتف ذكي',
        price: 450.000,
        images: ['/test-images/phone-1.webp'],
        category: 'electronics',
        vendor: 'test-vendor-1'
      }
    ],
    fashion: [
      {
        id: 'fashion-001',
        nameEn: 'Traditional Thobe',
        nameAr: 'ثوب تقليدي',
        price: 85.000,
        images: ['/test-images/thobe-1.webp'],
        category: 'fashion',
        vendor: 'test-vendor-2'
      }
    ]
  };
  
  process.env.TEST_PRODUCTS = JSON.stringify(testProducts);
  
  console.log('✅ Test products setup completed');
}

async function setupPaymentMocks() {
  console.log('💳 Setting up payment system mocks...');
  
  // Mock BenefitPay and Apple Pay responses
  const paymentMocks = {
    benefitPay: {
      sandbox: true,
      apiKey: 'test-benefit-pay-key',
      webhookSecret: 'test-webhook-secret'
    },
    applePay: {
      merchantId: 'merchant.com.tendzd.test',
      countryCode: 'BH',
      currencyCode: 'BHD'
    }
  };
  
  process.env.PAYMENT_MOCKS = JSON.stringify(paymentMocks);
  
  console.log('✅ Payment mocks setup completed');
}

async function setupAnalyticsMocks() {
  console.log('📊 Setting up analytics mocks...');
  
  // Mock Google Analytics and performance monitoring
  process.env.GA_MEASUREMENT_ID = 'G-TEST123456';
  process.env.ANALYTICS_DEBUG = 'true';
  
  console.log('✅ Analytics mocks setup completed');
}

async function setupPWAEnvironment(page: any, baseURL: string) {
  console.log('📱 Setting up PWA environment...');
  
  try {
    // Navigate to the app to register service worker
    await page.goto(baseURL);
    
    // Wait for service worker registration
    await page.waitForFunction(() => {
      return 'serviceWorker' in navigator && 
             navigator.serviceWorker.controller !== null;
    }, { timeout: 10000 });
    
    // Verify PWA manifest
    const manifestResponse = await page.goto(`${baseURL}/manifest.json`);
    if (!manifestResponse?.ok()) {
      console.warn('⚠️ PWA manifest not found or invalid');
    } else {
      console.log('✅ PWA manifest verified');
    }
    
    // Cache critical resources
    await page.evaluate(() => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_CRITICAL_RESOURCES'
        });
      }
    });
    
    console.log('✅ PWA environment setup completed');
    
  } catch (error) {
    console.warn('⚠️ PWA setup failed:', error);
  }
}

async function verifyServices(page: any, baseURL: string) {
  console.log('🔍 Verifying critical services...');
  
  const servicesToCheck = [
    { name: 'API Health', endpoint: '/api/health' },
    { name: 'Database Connection', endpoint: '/api/db/ping' },
    { name: 'Cache Service', endpoint: '/api/cache/ping' },
    { name: 'Search Service', endpoint: '/api/search/ping' }
  ];
  
  for (const service of servicesToCheck) {
    try {
      const response = await page.goto(`${baseURL}${service.endpoint}`, {
        timeout: 5000
      });
      
      if (response?.ok()) {
        console.log(`✅ ${service.name}: OK`);
      } else {
        console.warn(`⚠️ ${service.name}: ${response?.status()}`);
      }
    } catch (error) {
      console.warn(`⚠️ ${service.name}: Failed to connect`);
    }
  }
  
  console.log('✅ Service verification completed');
}

export default globalSetup;