import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Bahrain Multi-Vendor E-commerce Platform
 * 
 * Features:
 * - Mobile-first testing with Arabic RTL support
 * - Bahrain-specific geolocation and locale testing
 * - Performance monitoring with Core Web Vitals
 * - Cross-browser compatibility for Gulf region
 * - PWA and offline functionality testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL for testing */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Collect screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Geolocation for Bahrain */
    geolocation: { latitude: 26.2285, longitude: 50.5860 },
    permissions: ['geolocation'],
    
    /* Locale and timezone for Bahrain */
    locale: 'ar-BH',
    timezoneId: 'Asia/Bahrain',
    
    /* Extended timeout for mobile networks */
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  /* Configure projects for major browsers and devices */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },

    /* Desktop browsers for admin/vendor dashboards */
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain'
      },
      dependencies: ['setup']
    },

    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain'
      },
      dependencies: ['setup']
    },

    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain'
      },
      dependencies: ['setup']
    },

    /* Mobile devices - Primary focus for customer experience */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain'
      },
      dependencies: ['setup']
    },

    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain'
      },
      dependencies: ['setup']
    },

    {
      name: 'Samsung Galaxy S21',
      use: {
        ...devices['Galaxy S8'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain',
        // Samsung Internet browser simulation
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.0 Chrome/87.0.4280.141 Mobile Safari/537.36'
      },
      dependencies: ['setup']
    },

    /* Tablet devices for better UX testing */
    {
      name: 'iPad',
      use: { 
        ...devices['iPad Pro'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain'
      },
      dependencies: ['setup']
    },

    /* Arabic RTL-specific testing */
    {
      name: 'Arabic RTL Mobile',
      use: {
        ...devices['iPhone 12'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain',
        extraHTTPHeaders: {
          'Accept-Language': 'ar-BH,ar;q=0.9,en;q=0.8'
        }
      },
      dependencies: ['setup']
    },

    /* Performance testing on slower networks (common in Gulf region) */
    {
      name: 'Mobile 3G',
      use: {
        ...devices['Pixel 5'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain',
        // Simulate slower 3G connection
        launchOptions: {
          args: [
            '--enable-features=NetworkService',
            '--force-fieldtrials=NetworkService/Enabled',
            '--throttling-cpu-slowdown=4',
            '--throttling-download-throughput=1600000',
            '--throttling-upload-throughput=750000'
          ]
        }
      },
      dependencies: ['setup']
    },

    /* PWA and offline testing */
    {
      name: 'PWA Offline',
      use: {
        ...devices['iPhone 12'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain',
        // Start with network disabled for offline testing
        offline: true
      },
      dependencies: ['setup']
    },

    /* Accessibility testing */
    {
      name: 'Accessibility',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain',
        // Enable accessibility features
        launchOptions: {
          args: [
            '--force-prefers-reduced-motion',
            '--force-color-profile=srgb',
            '--enable-accessibility-object-model'
          ]
        }
      },
      dependencies: ['setup']
    },

    /* High contrast mode testing */
    {
      name: 'High Contrast',
      use: {
        ...devices['iPhone 12'],
        locale: 'ar-BH',
        timezoneId: 'Asia/Bahrain',
        colorScheme: 'dark',
        // Simulate high contrast preferences
        extraHTTPHeaders: {
          'User-Agent': devices['iPhone 12'].userAgent + ' HighContrast'
        }
      },
      dependencies: ['setup']
    }
  ],

  /* Global test configuration */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  /* Test match patterns */
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  /* Ignore patterns */
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**'
  ],

  /* Web server configuration for local testing */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  /* Output directory for test results */
  outputDir: 'test-results/',

  /* Maximum time one test can run for */
  timeout: 30000,

  /* Expect timeout for assertions */
  expect: {
    timeout: 5000
  }
});