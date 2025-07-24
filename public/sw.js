// Service Worker for Tendzd PWA - Bahrain Multi-Vendor E-commerce Platform

const CACHE_NAME = 'tendzd-v1.0.0';
const STATIC_CACHE = 'tendzd-static-v1.0.0';
const DYNAMIC_CACHE = 'tendzd-dynamic-v1.0.0';
const API_CACHE = 'tendzd-api-v1.0.0';
const IMAGE_CACHE = 'tendzd-images-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Critical CSS and JS will be added by build process
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/products',
  '/api/categories',
  '/api/vendors',
  '/api/search',
  '/api/recommendations'
];

// Routes that should always be served from cache first
const CACHE_FIRST_ROUTES = [
  '/icons/',
  '/images/',
  '/fonts/',
  '/static/',
  '/_next/static/'
];

// Routes that need network first strategy
const NETWORK_FIRST_ROUTES = [
  '/api/cart',
  '/api/orders',
  '/api/auth',
  '/api/payments',
  '/api/user'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAssets(request));
  } else if (isApiRequest(url.pathname)) {
    event.respondWith(handleApiRequests(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequests(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequests(request));
  } else {
    event.respondWith(handleDynamicRequests(request));
  }
});

// Static assets - Cache First strategy
async function handleStaticAssets(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Static asset fetch failed:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// API requests - Network First with cache fallback
async function handleApiRequests(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok && isCacheableApi(request.url)) {
      const cache = await caches.open(API_CACHE);
      
      // Set cache expiry
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const responseToCache = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      cache.put(request, responseToCache);
    }
    
    return response;
  } catch (error) {
    console.log('Network failed, trying cache for API request:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cache is still fresh (5 minutes for API)
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      if (cachedAt && Date.now() - parseInt(cachedAt) < 300000) {
        return cachedResponse;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        message_en: 'You are currently offline. Some features may not be available.',
        message_ar: 'أنت غير متصل حالياً. قد لا تكون بعض الميزات متاحة.'
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Image requests - Cache First with WebP optimization
async function handleImageRequests(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      
      // Only cache images smaller than 5MB
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 5242880) {
        cache.put(request, response.clone());
      }
    }
    
    return response;
  } catch (error) {
    console.error('Image fetch failed:', error);
    
    // Return placeholder image for failed image requests
    return new Response(
      await generatePlaceholderImage(),
      { 
        headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Navigation requests - Network First with offline fallback
async function handleNavigationRequests(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Navigation failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline') || new Response(
      generateOfflinePage(),
      { 
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Dynamic requests - Network First
async function handleDynamicRequests(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      
      // Limit dynamic cache size
      limitCacheSize(DYNAMIC_CACHE, 50);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Resource not available offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return CACHE_FIRST_ROUTES.some(route => pathname.startsWith(route));
}

function isApiRequest(pathname) {
  return pathname.startsWith('/api/');
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         request.headers.get('accept')?.includes('image/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

function isCacheableApi(url) {
  return CACHEABLE_APIS.some(api => url.includes(api));
}

// Cache management
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Generate placeholder image for failed image loads
async function generatePlaceholderImage() {
  return `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle" dy=".3em">
        Image unavailable offline
      </text>
    </svg>
  `;
}

// Generate offline page HTML
function generateOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Tendzd</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #FFA500 0%, #FFE135 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
        }
        .container {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
          margin: 2rem;
        }
        h1 { color: #FFA500; font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        .retry-btn {
          background: #FFA500;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        .retry-btn:hover { background: #ff8c00; }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }
        .feature {
          text-align: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .feature-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .feature-text { font-size: 0.9rem; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🌐</div>
        <h1>You're Offline</h1>
        <p>It looks like you're not connected to the internet. Some features may not be available, but you can still browse cached content.</p>
        
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🛒</div>
            <div class="feature-text">View Cart</div>
          </div>
          <div class="feature">
            <div class="feature-icon">⭐</div>
            <div class="feature-text">Saved Items</div>
          </div>
          <div class="feature">
            <div class="feature-icon">👤</div>
            <div class="feature-text">Account Info</div>
          </div>
        </div>
      </div>
      
      <script>
        // Check for network connectivity
        window.addEventListener('online', () => {
          window.location.reload();
        });
        
        // Register retry functionality
        function retry() {
          if (navigator.onLine) {
            window.location.reload();
          } else {
            alert('Still offline. Please check your connection.');
          }
        }
      </script>
    </body>
    </html>
  `;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'order-sync') {
    event.waitUntil(syncOrders());
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync cart data when back online
async function syncCart() {
  try {
    // Get pending cart updates from IndexedDB
    const pendingUpdates = await getPendingCartUpdates();
    
    for (const update of pendingUpdates) {
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
    }
    
    // Clear pending updates
    await clearPendingCartUpdates();
    console.log('Cart sync completed');
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

// Sync order data when back online
async function syncOrders() {
  try {
    const pendingOrders = await getPendingOrders();
    
    for (const order of pendingOrders) {
      await fetch('/api/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    }
    
    await clearPendingOrders();
    console.log('Orders sync completed');
  } catch (error) {
    console.error('Orders sync failed:', error);
  }
}

// Sync analytics data
async function syncAnalytics() {
  try {
    const pendingAnalytics = await getPendingAnalytics();
    
    for (const event of pendingAnalytics) {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    }
    
    await clearPendingAnalytics();
    console.log('Analytics sync completed');
  } catch (error) {
    console.error('Analytics sync failed:', error);
  }
}

// IndexedDB helper functions (mock implementations)
async function getPendingCartUpdates() {
  // In real implementation, this would read from IndexedDB
  return [];
}

async function clearPendingCartUpdates() {
  // Clear IndexedDB cart updates
}

async function getPendingOrders() {
  return [];
}

async function clearPendingOrders() {
  // Clear IndexedDB orders
}

async function getPendingAnalytics() {
  return [];
}

async function clearPendingAnalytics() {
  // Clear IndexedDB analytics events
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New notification from Tendzd',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    renotify: data.renotify || false,
    tag: data.tag || 'default'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Tendzd', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
    console.log('Performance measure:', event.data.metric, event.data.value);
    
    // Store performance data for analytics sync
    storePerformanceMetric(event.data);
  }
});

async function storePerformanceMetric(metric) {
  // Store in IndexedDB for later sync
  console.log('Storing performance metric:', metric);
}

console.log('Service Worker loaded and ready!');