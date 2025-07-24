import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
if (!client.isOpen) {
  client.connect().catch(console.error);
}

// Payment session management
export class PaymentSessionManager {
  static async createSession(sessionData: any): Promise<string> {
    try {
      const sessionId = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await client.setEx(
        `payment:session:${sessionId}`, 
        3600, // 1 hour
        JSON.stringify({
          ...sessionData,
          createdAt: new Date().toISOString(),
          status: 'created'
        })
      );
      
      return sessionId;
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw error;
    }
  }

  static async getSession(sessionId: string): Promise<any | null> {
    try {
      const sessionData = await client.get(`payment:session:${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting payment session:', error);
      return null;
    }
  }

  static async updateSession(sessionId: string, updates: any): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) return false;

      const updatedSession = {
        ...session,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await client.setEx(
        `payment:session:${sessionId}`, 
        3600,
        JSON.stringify(updatedSession)
      );
      
      return true;
    } catch (error) {
      console.error('Error updating payment session:', error);
      return false;
    }
  }
}

// Arabic/English product cache utilities
export class BahrainCache {
  
  // Shopping cart with Arabic product data
  static async setCart(userId: string, cartData: unknown) {
    const key = `cart:${userId}`;
    await client.setEx(key, 3600, JSON.stringify(cartData)); // 1 hour expiry
  }

  static async getCart(userId: string) {
    const key = `cart:${userId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async addToCart(userId: string, productId: string, productData: Record<string, unknown>) {
    const key = `cart:${userId}`;
    await client.hSet(key, `item:${productId}`, JSON.stringify({
      ...productData,
      addedAt: Date.now(),
      vatIncluded: true // Bahrain requirement
    }));
    await client.expire(key, 3600); // Reset expiry
  }

  static async removeFromCart(userId: string, productId: string) {
    const key = `cart:${userId}`;
    await client.hDel(key, `item:${productId}`);
  }

  // Product search cache with Arabic support
  static async cacheSearchResults(query: string, locale: string, results: unknown) {
    const cacheKey = `search:${locale}:${Buffer.from(query).toString('base64')}`;
    await client.setEx(cacheKey, 300, JSON.stringify(results)); // 5 minutes
  }

  static async getSearchResults(query: string, locale: string) {
    const cacheKey = `search:${locale}:${Buffer.from(query).toString('base64')}`;
    const data = await client.get(cacheKey);
    return data ? JSON.parse(data) : null;
  }

  // Product catalog cache with Arabic/English support
  static async cacheProduct(productId: string, productData: unknown, locale: string) {
    const key = `product:${locale}:${productId}`;
    await client.setEx(key, 1800, JSON.stringify(productData)); // 30 minutes
  }

  static async getProduct(productId: string, locale: string) {
    const key = `product:${locale}:${productId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Vendor data cache
  static async cacheVendor(vendorId: string, vendorData: unknown, locale: string) {
    const key = `vendor:${locale}:${vendorId}`;
    await client.setEx(key, 3600, JSON.stringify(vendorData)); // 1 hour
  }

  static async getVendor(vendorId: string, locale: string) {
    const key = `vendor:${locale}:${vendorId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Category cache with Arabic/English names
  static async cacheCategories(categories: unknown[], locale: string) {
    const key = `categories:${locale}`;
    await client.setEx(key, 7200, JSON.stringify(categories)); // 2 hours
  }

  static async getCategories(locale: string) {
    const key = `categories:${locale}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // User session cache for PDPL compliance
  static async cacheUserSession(sessionId: string, userData: Record<string, unknown>) {
    const key = `session:${sessionId}`;
    await client.setEx(key, 86400, JSON.stringify({
      ...userData,
      lastActivity: Date.now(),
      pdplConsent: userData.pdplConsent || false
    })); // 24 hours
  }

  static async getUserSession(sessionId: string) {
    const key = `session:${sessionId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async invalidateUserSession(sessionId: string) {
    const key = `session:${sessionId}`;
    await client.del(key);
  }

  // Arabic text search optimization
  static async cacheArabicSearchSuggestions(suggestions: string[]) {
    const key = 'search:suggestions:ar';
    await client.setEx(key, 14400, JSON.stringify(suggestions)); // 4 hours
  }

  static async getArabicSearchSuggestions() {
    const key = 'search:suggestions:ar';
    const data = await client.get(key);
    return data ? JSON.parse(data) : [];
  }

  // VAT calculation cache (10% Bahrain VAT)
  static async cacheVATCalculation(cartId: string, vatData: Record<string, unknown>) {
    const key = `vat:${cartId}`;
    await client.setEx(key, 1800, JSON.stringify({
      ...vatData,
      vatRate: 0.10,
      calculatedAt: Date.now()
    })); // 30 minutes
  }

  static async getVATCalculation(cartId: string) {
    const key = `vat:${cartId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Clear all cache (admin utility)
  static async clearAllCache() {
    await client.flushAll();
  }

  // Clear specific pattern
  static async clearCachePattern(pattern: string) {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  }
}

export default client;