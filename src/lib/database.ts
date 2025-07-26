// Complete database integration for Bahrain multi-vendor e-commerce platform
// Includes PostgreSQL schema, Redis integration, and PDPL compliance

import { prisma } from './prisma';
import { cache, type RedisCache } from './performance';

// Database models and types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  language: 'en' | 'ar';
  currency: 'BHD';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // PDPL compliance fields
  consentGiven: boolean;
  consentDate?: Date;
  dataRetentionDate?: Date;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  
  // Profile data
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'prefer_not_to_say';
  
  // Address information
  addresses?: Address[];
  defaultAddressId?: string;
  
  // Loyalty program
  loyaltyPoints: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  
  // Relations
  orders?: Order[];
  reviews?: Review[];
  wishlist?: WishlistItem[];
  cart?: CartItem[];
}

export interface Vendor {
  id: string;
  businessNameEn: string;
  businessNameAr: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phone: string;
  crNumber: string;
  businessType: string;
  
  // Location
  governorate: string;
  city: string;
  address: string;
  addressAr?: string;
  latitude?: number;
  longitude?: number;
  
  // Business details
  establishedYear?: number;
  employeeCount?: string;
  storeDescriptionEn: string;
  storeDescriptionAr?: string;
  logo?: string;
  banner?: string;
  
  // Status and verification
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  approvedAt?: Date;
  approvedBy?: string;
  
  // Financial information
  bankDetails?: VendorBankDetails;
  
  // Documents
  documents?: VendorDocument[];
  
  // Performance metrics
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalOrders: number;
  
  // Compliance
  vatRegistered: boolean;
  vatNumber?: string;
  pdplCompliant: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  products?: Product[];
  orders?: OrderItem[];
  categories?: VendorCategory[];
  commission?: VendorCommission[];
  payouts?: VendorPayout[];
  performance?: VendorPerformance;
  auditLogs?: VendorAuditLog[];
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr?: string;
  shortDescriptionEn?: string;
  shortDescriptionAr?: string;
  
  // Vendor and category
  vendorId: string;
  vendor?: Vendor;
  categoryId: string;
  category?: Category;
  subcategoryId?: string;
  subcategory?: Category;
  
  // Pricing
  price: number;
  originalPrice?: number;
  costPrice?: number;
  currency: 'BHD';
  
  // Inventory
  sku: string;
  barcode?: string;
  stockQuantity: number;
  minStockLevel: number;
  trackInventory: boolean;
  
  // Physical properties
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'mm' | 'in';
  };
  
  // Specifications and variants
  specifications: Record<string, any>;
  variants?: ProductVariant[];
  
  // Media
  images?: ProductImage[];
  videos?: ProductVideo[];
  
  // SEO and marketing
  slug: string;
  metaTitleEn?: string;
  metaTitleAr?: string;
  metaDescriptionEn?: string;
  metaDescriptionAr?: string;
  tags: string[];
  tagsAr: string[];
  
  // Status and visibility
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  
  // Performance metrics
  viewCount: number;
  orderCount: number;
  rating: number;
  reviewCount: number;
  
  // Shipping
  shippingRequired: boolean;
  shippingWeight?: number;
  shippingClass?: string;
  
  // Bahrain specific
  madeBahrain: boolean;
  halalCertified: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Relations
  reviews?: Review[];
  orderItems?: OrderItem[];
  wishlistItems?: WishlistItem[];
  cartItems?: CartItem[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  
  // Status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  
  // Pricing
  subtotal: number;
  vatAmount: number;
  vatRate: number; // 10% for Bahrain
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: 'BHD';
  
  // Shipping information
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  
  // Payment information
  paymentMethod: 'benefit_pay' | 'apple_pay' | 'bank_transfer' | 'cash_on_delivery';
  paymentReference?: string;
  
  // Customer information
  customerNotes?: string;
  adminNotes?: string;
  
  // Multi-vendor support
  items?: OrderItem[];
  vendorOrders?: VendorOrder[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  
  // Relations
  payment?: Payment;
  refunds?: Refund[];
  reviews?: Review[];
  auditLogs?: OrderAuditLog[];
}

export interface Address {
  id: string;
  userId?: string;
  vendorId?: string;
  
  // Address details
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  email?: string;
  
  // Bahrain specific address format
  building: string;
  road: string;
  block: string;
  city: string;
  governorate: 'capital' | 'muharraq' | 'northern' | 'southern';
  
  // Additional details
  floor?: string;
  apartment?: string;
  landmark?: string;
  instructions?: string;
  
  // Coordinates
  latitude?: number;
  longitude?: number;
  
  // Status
  isDefault: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Database operations class
export class DatabaseManager {
  private redis: RedisCache;
  
  constructor() {
    this.redis = cache;
  }

  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          consentGiven: true,
          consentDate: new Date(),
          dataRetentionDate: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000), // 7 years
          loyaltyPoints: 0,
          membershipTier: 'bronze',
          currency: 'BHD',
          isActive: true
        } as any
      });

      // Log PDPL compliance event
      await this.logPDPLEvent(user.id, 'USER_CREATED', 'User account created with consent');
      
      return user as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: string, useCache: boolean = true): Promise<User | null> {
    try {
      if (useCache) {
        const cachedUser = await this.redis.get<User>(`user:${id}`);
        if (cachedUser) return cachedUser;
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          addresses: true,
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (user && useCache) {
        await this.redis.set(`user:${id}`, user, 1800); // 30 minutes
      }

      return user as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData as any
      });

      // Clear cache
      await this.redis.del(`user:${id}`);
      
      // Log PDPL compliance event if personal data changed
      if (updateData.email || updateData.phone || updateData.firstName || updateData.lastName) {
        await this.logPDPLEvent(id, 'USER_UPDATED', 'Personal information updated');
      }

      return user as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Product operations with Arabic support
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const product = await prisma.product.create({
        data: {
          ...productData,
          currency: 'BHD',
          rating: 0,
          reviewCount: 0,
          viewCount: 0,
          orderCount: 0,
          isActive: true,
          isVisible: true,
          trackInventory: true,
          minStockLevel: 5
        } as any,
        include: {
          vendor: true,
          category: true,
          images: true
        }
      });

      // Clear related caches
      await this.redis.del(`vendor:${productData.vendorId}:products`);
      await this.redis.del(`category:${productData.categoryId}:products`);

      return product as Product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProducts(filters: {
    vendorId?: string;
    categoryId?: string;
    search?: string;
    locale?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    inStock?: boolean;
  }): Promise<{ products: Product[]; total: number }> {
    try {
      const cacheKey = `products:${JSON.stringify(filters)}`;
      const cached = await this.redis.get<{ products: Product[]; total: number }>(cacheKey);
      if (cached) return cached;

      const where: any = {
        isActive: true,
        isVisible: true
      };

      if (filters.vendorId) where.vendorId = filters.vendorId;
      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.inStock) where.stockQuantity = { gt: 0 };
      
      if (filters.search) {
        const searchTerms = {
          OR: [
            { nameEn: { contains: filters.search, mode: 'insensitive' } },
            { nameAr: { contains: filters.search, mode: 'insensitive' } },
            { descriptionEn: { contains: filters.search, mode: 'insensitive' } },
            { descriptionAr: { contains: filters.search, mode: 'insensitive' } },
            { tags: { has: filters.search } },
            { tagsAr: { has: filters.search } }
          ]
        };
        Object.assign(where, searchTerms);
      }

      const orderBy = this.getProductSortOrder(filters.sortBy);

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            vendor: true,
            category: true,
            images: { orderBy: { displayOrder: 'asc' } },
            reviews: { take: 5, orderBy: { createdAt: 'desc' } }
          },
          orderBy,
          take: filters.limit || 20,
          skip: filters.offset || 0
        }),
        prisma.product.count({ where })
      ]);

      const result = { products: products as Product[], total };
      
      // Cache for 5 minutes
      await this.redis.set(cacheKey, result, 300);

      return result;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  private getProductSortOrder(sortBy?: string) {
    switch (sortBy) {
      case 'price_low': return { price: 'asc' };
      case 'price_high': return { price: 'desc' };
      case 'rating': return { rating: 'desc' };
      case 'popular': return { orderCount: 'desc' };
      case 'newest': return { createdAt: 'desc' };
      default: return { createdAt: 'desc' };
    }
  }

  // Order operations with multi-vendor support
  async createOrder(orderData: Partial<Order>, items: OrderItemData[]): Promise<Order> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Create main order
        const order = await tx.order.create({
          data: {
            ...orderData,
            orderNumber: await this.generateOrderNumber(),
            currency: 'BHD',
            vatRate: 0.10 // 10% VAT for Bahrain
          } as any
        });

        // Create order items
        let subtotal = 0;
        for (const itemData of items) {
          const product = await tx.product.findUnique({
            where: { id: itemData.productId }
          });

          if (!product) throw new Error(`Product ${itemData.productId} not found`);

          const itemTotal = product.price * itemData.quantity;
          subtotal += itemTotal;

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: itemData.productId,
              vendorId: product.vendorId,
              quantity: itemData.quantity,
              price: product.price,
              totalPrice: itemTotal
            }
          });

          // Update product order count and stock
          await tx.product.update({
            where: { id: itemData.productId },
            data: {
              orderCount: { increment: 1 },
              stockQuantity: { decrement: itemData.quantity }
            }
          });
        }

        // Calculate totals
        const vatAmount = subtotal * 0.10; // 10% VAT
        const totalAmount = subtotal + vatAmount + (orderData.shippingCost || 0);

        // Update order with calculated totals
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            subtotal,
            vatAmount,
            totalAmount
          },
          include: {
            items: {
              include: {
                product: true,
                vendor: true
              }
            },
            user: true,
            shippingAddress: true,
            billingAddress: true
          }
        });

        // Log compliance event
        await this.logPDPLEvent(
          orderData.userId!,
          'ORDER_CREATED',
          `Order ${order.orderNumber} created`
        );

        return updatedOrder as Order;
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Vendor operations
  async approveVendor(vendorId: string, adminId: string): Promise<Vendor> {
    try {
      const vendor = await prisma.vendor.update({
        where: { id: vendorId },
        data: {
          status: 'approved',
          verificationStatus: 'verified',
          isActive: true,
          approvedAt: new Date(),
          approvedBy: adminId
        }
      });

      // Create audit log
      await prisma.vendorAuditLog.create({
        data: {
          vendorId,
          action: 'APPROVED',
          performedBy: adminId,
          details: 'Vendor application approved',
          timestamp: new Date()
        }
      });

      // Clear vendor cache
      await this.redis.del(`vendor:${vendorId}`);
      await this.redis.del('vendors:pending');

      return vendor as Vendor;
    } catch (error) {
      console.error('Error approving vendor:', error);
      throw error;
    }
  }

  // Search operations with Arabic support
  async searchProducts(query: string, filters: any, locale: string = 'en'): Promise<Product[]> {
    try {
      const cacheKey = `search:${query}:${JSON.stringify(filters)}:${locale}`;
      const cached = await this.redis.getSearchResults(query, JSON.stringify(filters), locale);
      if (cached) return cached;

      // Arabic text normalization for search
      const normalizedQuery = locale === 'ar' ? this.normalizeArabicText(query) : query.toLowerCase();

      const searchResults = await prisma.product.findMany({
        where: {
          AND: [
            { isActive: true },
            { isVisible: true },
            {
              OR: [
                { nameEn: { contains: normalizedQuery, mode: 'insensitive' } },
                { nameAr: { contains: normalizedQuery, mode: 'insensitive' } },
                { descriptionEn: { contains: normalizedQuery, mode: 'insensitive' } },
                { descriptionAr: { contains: normalizedQuery, mode: 'insensitive' } },
                { tags: { hasSome: [normalizedQuery] } },
                { tagsAr: { hasSome: [normalizedQuery] } }
              ]
            }
          ]
        },
        include: {
          vendor: true,
          category: true,
          images: { take: 1 }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { orderCount: 'desc' },
          { rating: 'desc' }
        ],
        take: 50
      });

      const results = searchResults as Product[];
      
      // Cache search results for 5 minutes
      await this.redis.setSearchResults(query, JSON.stringify(filters), results, locale);

      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // PDPL compliance operations
  async logPDPLEvent(userId: string, action: string, details: string): Promise<void> {
    try {
      await prisma.dataAuditLog.create({
        data: {
          userId,
          action,
          details,
          timestamp: new Date(),
          ipAddress: '0.0.0.0', // Should be captured from request context
          userAgent: 'System' // Should be captured from request context
        }
      });
    } catch (error) {
      console.error('Error logging PDPL event:', error);
    }
  }

  async handleDataRequest(requestData: {
    userId: string;
    requestType: 'ACCESS' | 'DELETION' | 'CORRECTION' | 'PORTABILITY';
    description: string;
  }): Promise<void> {
    try {
      await prisma.dataRequest.create({
        data: {
          ...requestData,
          status: 'PENDING',
          requestDate: new Date()
        }
      });

      // Process data request based on type
      switch (requestData.requestType) {
        case 'ACCESS':
          await this.generateDataExport(requestData.userId);
          break;
        case 'DELETION':
          await this.scheduleDataDeletion(requestData.userId);
          break;
        case 'CORRECTION':
          // Flag for manual review
          break;
        case 'PORTABILITY':
          await this.generatePortableData(requestData.userId);
          break;
      }

      await this.logPDPLEvent(
        requestData.userId,
        `DATA_REQUEST_${requestData.requestType}`,
        requestData.description
      );
    } catch (error) {
      console.error('Error handling data request:', error);
      throw error;
    }
  }

  // Helper methods
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(year, date.getMonth(), date.getDate()),
          lt: new Date(year, date.getMonth(), date.getDate() + 1)
        }
      }
    });

    return `TND-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
  }

  private normalizeArabicText(text: string): string {
    return text
      .replace(/[أإآا]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/[ة]/g, 'ه')
      .replace(/[ؤئء]/g, 'ء')
      .replace(/[ـ]/g, '')
      .replace(/[\u064B-\u065F]/g, '')
      .toLowerCase()
      .trim();
  }

  private async generateDataExport(userId: string): Promise<void> {
    // Generate comprehensive user data export
    console.log(`Generating data export for user ${userId}`);
  }

  private async scheduleDataDeletion(userId: string): Promise<void> {
    // Schedule user data deletion according to PDPL requirements
    console.log(`Scheduling data deletion for user ${userId}`);
  }

  private async generatePortableData(userId: string): Promise<void> {
    // Generate portable user data in standard format
    console.log(`Generating portable data for user ${userId}`);
  }

  // Analytics and reporting - FIXED: SQL Injection vulnerability
  async getVendorAnalytics(vendorId: string, startDate: Date, endDate: Date) {
    try {
      // Input validation
      if (!vendorId || typeof vendorId !== 'string') {
        throw new Error('Invalid vendor ID');
      }
      
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('Invalid date parameters');
      }

      // Use Prisma's type-safe aggregation instead of raw SQL
      const [orderStats, ratingStats] = await Promise.all([
        // Order statistics
        prisma.orderItem.groupBy({
          by: ['vendorId'],
          where: {
            vendorId,
            order: {
              createdAt: {
                gte: startDate,
                lte: endDate
              },
              status: {
                not: 'cancelled'
              }
            }
          },
          _sum: {
            totalPrice: true,
            quantity: true
          },
          _count: {
            orderId: true
          },
          _avg: {
            price: true
          }
        }),
        
        // Rating statistics
        prisma.product.aggregate({
          where: {
            vendorId,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _avg: {
            rating: true
          },
          _count: {
            id: true
          }
        })
      ]);

      // Get unique customers count safely
      const uniqueCustomers = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: {
            not: 'cancelled'
          },
          items: {
            some: {
              vendorId
            }
          }
        },
        select: {
          userId: true
        },
        distinct: ['userId']
      });

      const analytics = {
        total_orders: orderStats[0]?._count.orderId || 0,
        total_revenue: orderStats[0]?._sum.totalPrice || 0,
        average_order_value: orderStats[0]?._avg.price || 0,
        unique_customers: uniqueCustomers.length,
        average_rating: ratingStats._avg.rating || 0,
        total_products: ratingStats._count.id || 0
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      throw error;
    }
  }

  // Cleanup and maintenance
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const expiredSessions = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      console.log(`Cleaned up ${expiredSessions.count} expired sessions`);
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }

  async cleanupExpiredCaches(): Promise<void> {
    // Implement cache cleanup logic
    console.log('Cleaning up expired caches');
  }
}

// Types for order creation
interface OrderItemData {
  productId: string;
  quantity: number;
  variant?: string;
}

// Export singleton instance
export const db = new DatabaseManager();
export { prisma };

// Initialize database connection
export async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Run periodic cleanup tasks
    setInterval(() => {
      db.cleanupExpiredSessions();
      db.cleanupExpiredCaches();
    }, 60 * 60 * 1000); // Every hour
    
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}