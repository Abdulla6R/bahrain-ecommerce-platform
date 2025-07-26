// Mock Prisma client for build compatibility
export const prisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  },
  vendor: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  },
  product: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  },
  order: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  },
  $disconnect: async () => {},
  $connect: async () => {},
};

// Extend Prisma client with Bahrain-specific utilities
export class BahrainPrismaUtils {
  
  // VAT calculation helper (10% Bahrain VAT)
  static calculateVAT(amount: number, vatIncluded: boolean = true): { amount: number; vatAmount: number; totalAmount: number } {
    const VAT_RATE = 0.10; // 10% Bahrain VAT
    
    if (vatIncluded) {
      // VAT is included in the price
      const amountExVAT = amount / (1 + VAT_RATE);
      const vatAmount = amount - amountExVAT;
      
      return {
        amount: Number(amountExVAT.toFixed(3)), // Bahrain Dinar uses 3 decimal places
        vatAmount: Number(vatAmount.toFixed(3)),
        totalAmount: Number(amount.toFixed(3))
      };
    } else {
      // VAT needs to be added
      const vatAmount = amount * VAT_RATE;
      const totalAmount = amount + vatAmount;
      
      return {
        amount: Number(amount.toFixed(3)),
        vatAmount: Number(vatAmount.toFixed(3)),
        totalAmount: Number(totalAmount.toFixed(3))
      };
    }
  }

  // Generate Bahrain-style order number
  static generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `BH${year}${month}${day}${random}`;
  }

  // Generate vendor-specific order number
  static generateVendorOrderNumber(vendorSlug: string): string {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const prefix = vendorSlug.slice(0, 3).toUpperCase();
    
    return `${prefix}${timestamp}`;
  }

  // Format Bahrain phone number
  static formatBahrainPhone(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Bahrain phone format: +973 XXXX XXXX
    if (cleaned.startsWith('973')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 8) {
      return `+973${cleaned}`;
    }
    
    return phone; // Return original if doesn't match expected format
  }

  // Validate Bahrain CR (Commercial Registration) number
  static validateBahrainCR(crNumber: string): boolean {
    // Bahrain CR numbers are typically 6-8 digits
    const cleaned = crNumber.replace(/\D/g, '');
    return cleaned.length >= 6 && cleaned.length <= 8;
  }

  // Validate Bahrain VAT registration number
  static validateBahrainVAT(vatNumber: string): boolean {
    // Bahrain VAT numbers follow format: BH + 9 digits
    const pattern = /^BH\d{9}$/;
    return pattern.test(vatNumber.replace(/\s/g, ''));
  }

  // Convert amounts to fils (smallest Bahrain currency unit)
  static toFils(dinars: number): number {
    return Math.round(dinars * 1000); // 1 BHD = 1000 fils
  }

  // Convert fils to dinars
  static toDinars(fils: number): number {
    return Number((fils / 1000).toFixed(3));
  }

  // Format currency for display
  static formatCurrency(amount: number, locale: string = 'ar-BH'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  }

  // Arabic slug generation
  static generateArabicSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Replace Arabic characters with transliteration
      .replace(/[\u0621-\u064A]/g, (char) => {
        const arabicMap: { [key: string]: string } = {
          'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
          'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r',
          'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
          'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
          'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
          'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'a', 'ى': 'a'
        };
        return arabicMap[char] || char;
      })
      .replace(/[^a-z0-9\u0621-\u064A]/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  // Get business hours for Bahrain (considering Islamic calendar)
  static getBahrainBusinessHours(date: Date = new Date()): { isOpen: boolean; nextOpen?: Date } {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = date.getHours();
    
    // Friday is weekend in Bahrain
    if (dayOfWeek === 5) {
      const nextOpen = new Date(date);
      nextOpen.setDate(date.getDate() + 1);
      nextOpen.setHours(8, 0, 0, 0);
      return { isOpen: false, nextOpen };
    }
    
    // Saturday half day (8 AM - 12 PM)
    if (dayOfWeek === 6) {
      const isOpen = hour >= 8 && hour < 12;
      if (!isOpen) {
        const nextOpen = new Date(date);
        nextOpen.setDate(date.getDate() + (dayOfWeek === 6 ? 2 : 1)); // Skip to Sunday
        nextOpen.setHours(8, 0, 0, 0);
        return { isOpen, nextOpen };
      }
      return { isOpen };
    }
    
    // Regular business hours (8 AM - 6 PM, break 12-2 PM)
    const isOpen = (hour >= 8 && hour < 12) || (hour >= 14 && hour < 18);
    
    if (!isOpen) {
      const nextOpen = new Date(date);
      if (hour < 8) {
        nextOpen.setHours(8, 0, 0, 0);
      } else if (hour >= 12 && hour < 14) {
        nextOpen.setHours(14, 0, 0, 0);
      } else {
        nextOpen.setDate(date.getDate() + 1);
        nextOpen.setHours(8, 0, 0, 0);
      }
      return { isOpen, nextOpen };
    }
    
    return { isOpen };
  }

  // Islamic/Hijri date utilities
  static getHijriDate(gregorianDate: Date = new Date()): string {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(gregorianDate);
    } catch {
      // Fallback if Hijri calendar not supported
      return gregorianDate.toLocaleDateString('ar-SA');
    }
  }

  // Check if date is during Ramadan (affects business hours)
  static isRamadan(date: Date = new Date()): boolean {
    // This is a simplified check - in production, use proper Islamic calendar library
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hijriYear = parseInt(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric' }).format(date));
    const hijriMonth = parseInt(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { month: 'numeric' }).format(date));
    
    return hijriMonth === 9; // Ramadan is the 9th month in Islamic calendar
  }
}