// Comprehensive input validation schemas for Bahrain multi-vendor e-commerce platform
// PDPL compliance and Arabic/English content validation

import { z } from 'zod';

// Bahrain-specific validation patterns
const BAHRAIN_PHONE_REGEX = /^(\+973|00973|973)?[0-9]{8}$/;
const BAHRAIN_CR_REGEX = /^[0-9]{1,8}$/;
const BAHRAIN_VAT_REGEX = /^[0-9]{15}$/;
const ORDER_NUMBER_REGEX = /^TND-\d{8}-\d{4}$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Arabic text validation helper
const arabicTextSchema = z.string().refine(
  (text) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text),
  { message: 'Must contain Arabic characters' }
);

// User Authentication Schemas
export const UserRegistrationSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(STRONG_PASSWORD_REGEX, 'Password must contain uppercase, lowercase, number, and special character'),
  
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Last name can only contain letters and spaces'),
  
  phone: z.string()
    .regex(BAHRAIN_PHONE_REGEX, 'Invalid Bahrain phone number format'),
  
  language: z.enum(['en', 'ar'], { message: 'Language must be English or Arabic' }),
  
  dateOfBirth: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, 'Age must be between 13 and 120 years'),
  
  gender: z.enum(['male', 'female', 'prefer_not_to_say']).optional(),
  
  // PDPL Compliance
  consentGiven: z.boolean().refine(val => val === true, 'Privacy consent is required'),
  marketingConsent: z.boolean().default(false),
  analyticsConsent: z.boolean().default(true)
});

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false)
});

export const UserUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().regex(BAHRAIN_PHONE_REGEX).optional(),
  language: z.enum(['en', 'ar']).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'prefer_not_to_say']).optional(),
  marketingConsent: z.boolean().optional(),
  analyticsConsent: z.boolean().optional()
});

// Address Validation Schema
export const AddressSchema = z.object({
  type: z.enum(['home', 'work', 'other'], { message: 'Invalid address type' }),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  phone: z.string()
    .regex(BAHRAIN_PHONE_REGEX, 'Invalid Bahrain phone number'),
  
  email: z.string().email().optional(),
  
  // Bahrain address format
  building: z.string()
    .min(1, 'Building number/name is required')
    .max(50, 'Building must be less than 50 characters'),
  
  road: z.string()
    .min(1, 'Road number/name is required')
    .max(100, 'Road must be less than 100 characters'),
  
  block: z.string()
    .min(1, 'Block number is required')
    .max(10, 'Block must be less than 10 characters'),
  
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  
  governorate: z.enum(['capital', 'muharraq', 'northern', 'southern'], {
    message: 'Invalid Bahrain governorate'
  }),
  
  floor: z.string().max(10).optional(),
  apartment: z.string().max(20).optional(),
  landmark: z.string().max(100).optional(),
  instructions: z.string().max(500).optional(),
  
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  isDefault: z.boolean().default(false)
});

// Vendor Registration Schema
export const VendorRegistrationSchema = z.object({
  // Business names
  businessNameEn: z.string()
    .min(2, 'English business name must be at least 2 characters')
    .max(100, 'English business name must be less than 100 characters'),
  
  businessNameAr: arabicTextSchema
    .min(2, 'Arabic business name must be at least 2 characters')
    .max(100, 'Arabic business name must be less than 100 characters'),
  
  // Owner information
  ownerFirstName: z.string().min(1).max(50),
  ownerLastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().regex(BAHRAIN_PHONE_REGEX),
  
  // Business details
  crNumber: z.string()
    .regex(BAHRAIN_CR_REGEX, 'Invalid Bahrain CR number format')
    .min(1, 'CR number is required'),
  
  businessType: z.string().min(1).max(100),
  
  // Location
  governorate: z.enum(['capital', 'muharraq', 'northern', 'southern']),
  city: z.string().min(1).max(50),
  address: z.string().min(10).max(200),
  addressAr: z.string().max(200).optional(),
  
  // Descriptions
  storeDescriptionEn: z.string()
    .min(50, 'English description must be at least 50 characters')
    .max(1000, 'English description must be less than 1000 characters'),
  
  storeDescriptionAr: z.string()
    .max(1000, 'Arabic description must be less than 1000 characters')
    .optional(),
  
  establishedYear: z.number()
    .min(1900, 'Established year cannot be before 1900')
    .max(new Date().getFullYear(), 'Established year cannot be in the future')
    .optional(),
  
  employeeCount: z.enum(['1-5', '6-20', '21-50', '51-100', '100+']).optional(),
  
  // Compliance
  vatRegistered: z.boolean().default(false),
  vatNumber: z.string()
    .regex(BAHRAIN_VAT_REGEX, 'Invalid Bahrain VAT number format')
    .optional(),
  
  pdplCompliant: z.boolean().refine(val => val === true, 'PDPL compliance agreement is required')
});

// Product Schemas
export const ProductCreateSchema = z.object({
  // Names and descriptions
  nameEn: z.string()
    .min(3, 'English product name must be at least 3 characters')
    .max(200, 'English product name must be less than 200 characters'),
  
  nameAr: z.string()
    .min(3, 'Arabic product name must be at least 3 characters')
    .max(200, 'Arabic product name must be less than 200 characters'),
  
  descriptionEn: z.string()
    .min(20, 'English description must be at least 20 characters')
    .max(2000, 'English description must be less than 2000 characters'),
  
  descriptionAr: z.string()
    .max(2000, 'Arabic description must be less than 2000 characters')
    .optional(),
  
  shortDescriptionEn: z.string().max(500).optional(),
  shortDescriptionAr: z.string().max(500).optional(),
  
  // Vendor and category
  vendorId: z.string().uuid('Invalid vendor ID'),
  categoryId: z.string().uuid('Invalid category ID'),
  subcategoryId: z.string().uuid().optional(),
  
  // Pricing (in BHD)
  price: z.number()
    .positive('Price must be positive')
    .max(100000, 'Price cannot exceed 100,000 BHD')
    .multipleOf(0.001, 'Price can have maximum 3 decimal places'),
  
  originalPrice: z.number()
    .positive()
    .max(100000)
    .multipleOf(0.001)
    .optional(),
  
  costPrice: z.number()
    .positive()
    .max(100000)
    .multipleOf(0.001)
    .optional(),
  
  // Inventory
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Z0-9-_]+$/, 'SKU can only contain uppercase letters, numbers, hyphens, and underscores'),
  
  barcode: z.string().max(50).optional(),
  
  stockQuantity: z.number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative')
    .max(999999, 'Stock quantity cannot exceed 999,999'),
  
  minStockLevel: z.number()
    .int()
    .min(0)
    .max(1000)
    .default(5),
  
  trackInventory: z.boolean().default(true),
  
  // Physical properties
  weight: z.number().positive().max(1000).optional(), // kg
  
  dimensions: z.object({
    length: z.number().positive().max(1000),
    width: z.number().positive().max(1000),
    height: z.number().positive().max(1000),
    unit: z.enum(['cm', 'mm', 'in'])
  }).optional(),
  
  // SEO and marketing
  slug: z.string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  
  metaTitleEn: z.string().max(60).optional(),
  metaTitleAr: z.string().max(60).optional(),
  metaDescriptionEn: z.string().max(160).optional(),
  metaDescriptionAr: z.string().max(160).optional(),
  
  tags: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 tags allowed'),
  tagsAr: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 Arabic tags allowed'),
  
  // Status
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  
  // Shipping
  shippingRequired: z.boolean().default(true),
  shippingWeight: z.number().positive().max(1000).optional(),
  shippingClass: z.string().max(50).optional(),
  
  // Bahrain specific
  madeBahrain: z.boolean().default(false),
  halalCertified: z.boolean().default(false)
});

export const ProductUpdateSchema = ProductCreateSchema.partial().omit({
  vendorId: true,
  sku: true
});

// Order Schemas
export const OrderCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive().max(100),
    variant: z.string().optional()
  })).min(1, 'At least one item is required'),
  
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid().optional(),
  
  paymentMethod: z.enum(['benefit_pay', 'apple_pay', 'bank_transfer', 'cash_on_delivery']),
  
  shippingMethod: z.string().max(100).optional(),
  customerNotes: z.string().max(500).optional(),
  
  // Coupon/discount
  couponCode: z.string().max(50).optional()
});

export const OrderUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded', 'partially_refunded']).optional(),
  fulfillmentStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  
  trackingNumber: z.string().max(100).optional(),
  estimatedDelivery: z.string().datetime().optional(),
  adminNotes: z.string().max(1000).optional()
});

// Payment Schema
export const PaymentCreateSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number()
    .positive('Amount must be positive')
    .max(100000, 'Amount cannot exceed 100,000 BHD')
    .multipleOf(0.001, 'Amount can have maximum 3 decimal places'),
  
  currency: z.literal('BHD'),
  
  paymentMethod: z.enum(['benefit_pay', 'apple_pay', 'bank_transfer', 'cash_on_delivery']),
  
  // Payment provider specific data
  paymentData: z.record(z.any()).optional(),
  
  // Return URLs for online payments
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

// Review Schema
export const ReviewCreateSchema = z.object({
  productId: z.string().uuid(),
  orderId: z.string().uuid(),
  
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  
  title: z.string()
    .min(5, 'Review title must be at least 5 characters')
    .max(100, 'Review title must be less than 100 characters'),
  
  comment: z.string()
    .min(10, 'Review comment must be at least 10 characters')
    .max(1000, 'Review comment must be less than 1000 characters'),
  
  pros: z.string().max(500).optional(),
  cons: z.string().max(500).optional(),
  
  // Recommendations
  wouldRecommend: z.boolean().default(true),
  
  // Anonymous review
  isAnonymous: z.boolean().default(false)
});

// Search Schema
export const SearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(200, 'Search query must be less than 200 characters'),
  
  categoryId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  
  // Filters
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  
  sortBy: z.enum(['relevance', 'price_low', 'price_high', 'rating', 'popular', 'newest']).default('relevance'),
  
  locale: z.enum(['en', 'ar']).default('en'),
  
  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  
  // Filters
  inStock: z.boolean().optional(),
  madeBahrain: z.boolean().optional(),
  halalCertified: z.boolean().optional(),
  freeShipping: z.boolean().optional()
});

// Analytics Schema
export const AnalyticsEventSchema = z.object({
  type: z.enum([
    'page_view', 'product_view', 'add_to_cart', 'remove_from_cart',
    'purchase', 'search', 'click', 'scroll', 'swipe'
  ]),
  
  productId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  
  value: z.number().optional(),
  currency: z.literal('BHD').optional(),
  
  searchQuery: z.string().max(200).optional(),
  
  // Device and context
  locale: z.enum(['en', 'ar']),
  device: z.enum(['mobile', 'tablet', 'desktop']),
  
  // Custom properties
  properties: z.record(z.any()).optional(),
  
  timestamp: z.string().datetime().default(() => new Date().toISOString())
});

// Contact/Support Schema
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string().email('Invalid email format'),
  
  phone: z.string()
    .regex(BAHRAIN_PHONE_REGEX, 'Invalid Bahrain phone number')
    .optional(),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  category: z.enum([
    'general_inquiry', 'technical_support', 'billing_support',
    'vendor_application', 'partnership', 'complaint', 'suggestion'
  ]),
  
  orderNumber: z.string().regex(ORDER_NUMBER_REGEX).optional(),
  
  urgency: z.enum(['low', 'medium', 'high']).default('medium')
});

// Newsletter Schema
export const NewsletterSubscriptionSchema = z.object({
  email: z.string().email('Invalid email format'),
  language: z.enum(['en', 'ar']).default('en'),
  categories: z.array(z.enum([
    'new_products', 'promotions', 'vendor_updates', 'platform_news'
  ])).default(['promotions'])
});

// Export validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: z.ZodError; 
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}

// Sanitization helpers for Arabic/English content
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, ''); // Remove basic HTML characters
}

export function normalizeArabicText(text: string): string {
  return text
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ىي]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[ؤئء]/g, 'ء')
    .replace(/[ـ]/g, '') // Remove tatweel
    .replace(/[\u064B-\u065F]/g, '') // Remove diacritics
    .trim();
}

export const ValidationSchemas = {
  // User schemas
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSchema,
  
  // Address schema
  AddressSchema,
  
  // Vendor schemas
  VendorRegistrationSchema,
  
  // Product schemas
  ProductCreateSchema,
  ProductUpdateSchema,
  
  // Order schemas
  OrderCreateSchema,
  OrderUpdateSchema,
  
  // Payment schema
  PaymentCreateSchema,
  
  // Review schema
  ReviewCreateSchema,
  
  // Search schema
  SearchSchema,
  
  // Analytics schema
  AnalyticsEventSchema,
  
  // Contact schema
  ContactFormSchema,
  
  // Newsletter schema
  NewsletterSubscriptionSchema
} as const;

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type VendorRegistration = z.infer<typeof VendorRegistrationSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
export type PaymentCreate = z.infer<typeof PaymentCreateSchema>;
export type ReviewCreate = z.infer<typeof ReviewCreateSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type NewsletterSubscription = z.infer<typeof NewsletterSubscriptionSchema>;