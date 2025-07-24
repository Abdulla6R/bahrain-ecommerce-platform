import { test, expect, devices } from '@playwright/test';

// Mobile device configurations for testing
const mobileDevices = [
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'Samsung Galaxy S21', ...devices['Galaxy S8'] },
  { name: 'iPad Mini', ...devices['iPad Mini'] }
];

// Test data for Bahrain market
const testData = {
  arabicText: {
    productName: 'هاتف ذكي متطور',
    searchQuery: 'إلكترونيات',
    address: 'المنامة، البحرين',
    customerName: 'أحمد المحمود'
  },
  englishText: {
    productName: 'Advanced Smartphone',
    searchQuery: 'electronics',
    address: 'Manama, Bahrain',
    customerName: 'Ahmed Al-Mahmood'
  },
  bahrainData: {
    phone: '+973-1234-5678',
    governorate: 'capital',
    vatRate: 0.10,
    currency: 'BHD'
  }
};

// Configure tests for mobile devices
mobileDevices.forEach(device => {
  test.describe(`Mobile E2E Tests - ${device.name}`, () => {
    
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport and user agent
      await page.setViewportSize(device.viewport);
      await page.setUserAgent(device.userAgent);
      
      // Enable geolocation for Bahrain
      await page.context().grantPermissions(['geolocation']);
      await page.setGeolocation({ latitude: 26.2285, longitude: 50.5860 }); // Manama, Bahrain
      
      // Set locale to Arabic for RTL testing
      await page.goto('/?locale=ar');
      await page.waitForLoadState('networkidle');
    });

    test('should load homepage with Arabic RTL layout on mobile', async ({ page }) => {
      // Check if page loads correctly
      await expect(page).toHaveTitle(/تندز|Tendzd/);
      
      // Verify RTL layout
      const body = page.locator('body');
      await expect(body).toHaveAttribute('dir', 'rtl');
      
      // Check if Arabic content is displayed
      await expect(page.getByText('السيرفر يعمل بنجاح')).toBeVisible();
      
      // Verify mobile navigation is visible
      await expect(page.locator('[role="navigation"]')).toBeVisible();
      
      // Check touch targets are adequate (min 44px)
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should handle touch gestures correctly', async ({ page }) => {
      // Navigate to a page with swipeable content
      await page.goto('/demo?locale=ar');
      
      // Wait for swipeable gallery to load
      const gallery = page.locator('[data-testid="product-gallery"]').first();
      await gallery.waitFor({ state: 'visible', timeout: 10000 });
      
      // Get initial position
      const initialText = await page.locator('[data-testid="current-slide"]').textContent();
      
      // Perform swipe gesture (touch start, move, end)
      const galleryBox = await gallery.boundingBox();
      if (galleryBox) {
        await page.touchscreen.tap(galleryBox.x + galleryBox.width / 2, galleryBox.y + galleryBox.height / 2);
        await page.mouse.move(galleryBox.x + galleryBox.width / 4, galleryBox.y + galleryBox.height / 2);
        await page.mouse.move(galleryBox.x + 3 * galleryBox.width / 4, galleryBox.y + galleryBox.height / 2);
      }
      
      // Wait for swipe animation to complete
      await page.waitForTimeout(500);
      
      // Verify slide changed
      const newText = await page.locator('[data-testid="current-slide"]').textContent();
      expect(newText).not.toBe(initialText);
    });

    test('should support Arabic text input with virtual keyboard', async ({ page }) => {
      // Navigate to search page
      await page.goto('/search?locale=ar');
      
      // Find search input
      const searchInput = page.locator('input[type="search"]');
      await expect(searchInput).toBeVisible();
      
      // Verify input has correct RTL attributes
      await expect(searchInput).toHaveAttribute('dir', 'rtl');
      
      // Type Arabic text
      await searchInput.fill(testData.arabicText.searchQuery);
      
      // Verify Arabic text is displayed correctly
      await expect(searchInput).toHaveValue(testData.arabicText.searchQuery);
      
      // Test virtual keyboard if available
      const keyboardTrigger = page.locator('[data-testid="virtual-keyboard-trigger"]');
      if (await keyboardTrigger.isVisible()) {
        await keyboardTrigger.click();
        
        // Verify virtual keyboard appears
        await expect(page.locator('[data-testid="virtual-keyboard"]')).toBeVisible();
        
        // Test Arabic key press
        await page.locator('button').filter({ hasText: 'ا' }).click();
        
        // Verify character was added
        const currentValue = await searchInput.inputValue();
        expect(currentValue).toContain('ا');
      }
    });

    test('should handle mobile checkout flow with Bahrain specifics', async ({ page }) => {
      // Add product to cart
      await page.goto('/demo?locale=ar');
      
      // Wait for add to cart button and click
      const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
      await addToCartBtn.waitFor({ state: 'visible', timeout: 10000 });
      await addToCartBtn.click();
      
      // Navigate to cart
      await page.locator('[data-testid="cart-icon"]').click();
      await expect(page.locator('[data-testid="cart-items"]')).toBeVisible();
      
      // Proceed to checkout
      await page.locator('[data-testid="checkout-button"]').click();
      
      // Fill shipping address with Bahrain format
      await page.locator('input[name="building"]').fill('مبنى 123');
      await page.locator('input[name="road"]').fill('شارع الفاتح');
      await page.locator('input[name="block"]').fill('408');
      await page.locator('select[name="governorate"]').selectOption('capital');
      await page.locator('input[name="city"]').fill('المنامة');
      
      // Fill contact information
      await page.locator('input[name="phone"]').fill(testData.bahrainData.phone);
      await page.locator('input[name="email"]').fill('test@example.bh');
      
      // Verify VAT calculation (10% for Bahrain)
      const subtotal = await page.locator('[data-testid="subtotal"]').textContent();
      const vatAmount = await page.locator('[data-testid="vat-amount"]').textContent();
      
      if (subtotal && vatAmount) {
        const subtotalNum = parseFloat(subtotal.replace(/[^\d.]/g, ''));
        const vatNum = parseFloat(vatAmount.replace(/[^\d.]/g, ''));
        const expectedVat = subtotalNum * 0.10;
        
        expect(vatNum).toBeCloseTo(expectedVat, 2);
      }
      
      // Test payment method selection
      await expect(page.locator('[data-testid="benefit-pay-option"]')).toBeVisible();
      await expect(page.locator('[data-testid="apple-pay-option"]')).toBeVisible();
      
      // Select BenefitPay (primary payment method in Bahrain)
      await page.locator('[data-testid="benefit-pay-option"]').click();
      
      // Verify payment form appears
      await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();
    });

    test('should display proper Arabic typography and spacing', async ({ page }) => {
      await page.goto('/?locale=ar');
      
      // Check Arabic font loading
      const arabicText = page.locator('.arabic-text').first();
      if (await arabicText.isVisible()) {
        const styles = await arabicText.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            fontFamily: computed.fontFamily,
            lineHeight: computed.lineHeight,
            direction: computed.direction,
            textAlign: computed.textAlign
          };
        });
        
        expect(styles.fontFamily).toMatch(/Cairo|Amiri/);
        expect(styles.direction).toBe('rtl');
        expect(styles.textAlign).toBe('right');
      }
      
      // Verify proper spacing for Arabic text
      const textElements = page.locator('p, h1, h2, h3');
      const elementCount = await textElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 3); i++) {
        const element = textElements.nth(i);
        const lineHeight = await element.evaluate(el => 
          parseFloat(window.getComputedStyle(el).lineHeight)
        );
        
        // Arabic text needs higher line height (1.6-1.8)
        expect(lineHeight).toBeGreaterThan(1.5);
      }
    });

    test('should handle offline functionality with PWA features', async ({ page }) => {
      // Go online first
      await page.goto('/');
      
      // Wait for service worker registration
      await page.waitForFunction(() => 'serviceWorker' in navigator);
      
      // Simulate going offline
      await page.context().setOffline(true);
      
      // Navigate to cached page
      await page.goto('/');
      
      // Should show offline page or cached content
      const isOfflinePageVisible = await page.locator('[data-testid="offline-indicator"]').isVisible();
      const isCachedContentVisible = await page.locator('main').isVisible();
      
      expect(isOfflinePageVisible || isCachedContentVisible).toBeTruthy();
      
      // Test offline cart functionality
      if (isCachedContentVisible) {
        const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
        if (await addToCartBtn.isVisible()) {
          await addToCartBtn.click();
          
          // Should queue action for when back online
          await expect(page.locator('[data-testid="offline-queue-indicator"]')).toBeVisible();
        }
      }
      
      // Go back online
      await page.context().setOffline(false);
      await page.reload();
      
      // Verify sync happens
      await page.waitForTimeout(1000);
      await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible({ timeout: 5000 });
    });

    test('should handle performance requirements on mobile network', async ({ page }) => {
      // Simulate slow 3G network common in Gulf region
      await page.context().route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
      });
      
      const startTime = Date.now();
      
      // Navigate to product listing page
      await page.goto('/products?locale=ar');
      
      // Measure time to first contentful paint
      await page.waitForSelector('main', { timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 2.5 seconds for LCP requirement
      expect(loadTime).toBeLessThan(2500);
      
      // Verify images are lazy loaded
      const images = page.locator('img[loading="lazy"]');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
      
      // Check if WebP images are served for better performance
      const firstImage = images.first();
      if (await firstImage.isVisible()) {
        const src = await firstImage.getAttribute('src');
        expect(src).toMatch(/\.(webp|avif)$/i);
      }
    });

    test('should handle accessibility features on mobile', async ({ page }) => {
      await page.goto('/?locale=ar');
      
      // Test touch target sizes (minimum 44x44px)
      const interactiveElements = page.locator('button, a, input, [role="button"]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = interactiveElements.nth(i);
        const box = await element.boundingBox();
        
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
      
      // Test ARIA labels for screen readers
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        
        // Should have either aria-label or visible text
        expect(ariaLabel || text?.trim()).toBeTruthy();
      }
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();
      
      // Test high contrast mode support
      await page.emulateMedia({ prefersColorScheme: 'dark' });
      await page.reload();
      
      // Verify elements are still visible in dark mode
      await expect(page.locator('main')).toBeVisible();
    });

    test('should validate Bahrain-specific business rules', async ({ page }) => {
      await page.goto('/checkout?locale=ar');
      
      // Test phone number validation (Bahrain format)
      const phoneInput = page.locator('input[name="phone"]');
      if (await phoneInput.isVisible()) {
        // Invalid format
        await phoneInput.fill('12345');
        await page.locator('form').first().press('Enter');
        await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
        
        // Valid Bahrain format
        await phoneInput.fill(testData.bahrainData.phone);
        await expect(page.locator('[data-testid="phone-error"]')).not.toBeVisible();
      }
      
      // Test governorate selection (Bahrain-specific)
      const governorateSelect = page.locator('select[name="governorate"]');
      if (await governorateSelect.isVisible()) {
        const options = await governorateSelect.locator('option').allTextContents();
        
        // Should include all Bahrain governorates
        expect(options).toContain('العاصمة'); // Capital
        expect(options).toContain('المحرق'); // Muharraq
        expect(options).toContain('الشمالية'); // Northern
        expect(options).toContain('الجنوبية'); // Southern
      }
      
      // Test VAT display (10% for Bahrain)
      const vatDisplay = page.locator('[data-testid="vat-rate"]');
      if (await vatDisplay.isVisible()) {
        const vatText = await vatDisplay.textContent();
        expect(vatText).toMatch(/10%|0\.10/);
      }
      
      // Test currency display (BHD)
      const prices = page.locator('[data-testid="price"]');
      const priceCount = await prices.count();
      
      if (priceCount > 0) {
        const priceText = await prices.first().textContent();
        expect(priceText).toMatch(/BHD|د\.ب/);
      }
    });
  });
});

// Cross-device compatibility tests
test.describe('Cross-Device Compatibility', () => {
  test('should maintain functionality across different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
      { width: 360, height: 740 }  // Android small
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/?locale=ar');
      
      // Verify layout adapts correctly
      await expect(page.locator('main')).toBeVisible();
      
      // Check if mobile navigation is appropriate for screen size
      const mobileNav = page.locator('[data-testid="mobile-navigation"]');
      const desktopNav = page.locator('[data-testid="desktop-navigation"]');
      
      if (viewport.width < 768) {
        await expect(mobileNav).toBeVisible();
      } else {
        await expect(desktopNav).toBeVisible();
      }
      
      // Verify text remains readable
      const textElements = page.locator('p, h1, h2, h3');
      const firstText = textElements.first();
      
      if (await firstText.isVisible()) {
        const fontSize = await firstText.evaluate(el => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        
        // Should be at least 14px for readability
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    }
  });
});

// Performance monitoring tests
test.describe('Mobile Performance Monitoring', () => {
  test('should meet Core Web Vitals on mobile', async ({ page }) => {
    // Navigate to page and measure performance
    const startTime = performance.now();
    
    await page.goto('/?locale=ar');
    await page.waitForSelector('main');
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Largest Contentful Paint should be < 2.5s
    expect(loadTime).toBeLessThan(2500);
    
    // Measure layout shift
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries: any[] = [];
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              const firstSessionEntry = sessionEntries[0];
              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
              
              if (sessionValue && 
                  (entry as any).startTime - lastSessionEntry.startTime < 1000 &&
                  (entry as any).startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += (entry as any).value;
                sessionEntries.push(entry);
              } else {
                sessionValue = (entry as any).value;
                sessionEntries = [entry];
              }
              
              if (sessionValue > clsValue) {
                clsValue = sessionValue;
              }
            }
          }
          
          setTimeout(() => resolve(clsValue), 1000);
        }).observe({ type: 'layout-shift', buffered: true });
      });
    });
    
    // Cumulative Layout Shift should be < 0.1
    expect(cls).toBeLessThan(0.1);
  });
});