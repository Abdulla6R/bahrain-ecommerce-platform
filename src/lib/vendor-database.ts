import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Vendor Management Database Operations
export class VendorDatabase {
  
  // Vendor Creation and Onboarding
  static async createVendorApplication(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessNameEn: string;
    businessNameAr: string;
    crNumber: string;
    businessType: string;
    governorate: string;
    city: string;
    address: string;
    addressAr?: string;
    establishedYear?: number;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    iban: string;
    storeDescriptionEn: string;
    storeDescriptionAr?: string;
    productCategories: string[];
    estimatedMonthlyVolume?: string;
    documents: {
      crCertificate: string;
      businessLicense: string;
      trademarkCertificate?: string;
      vatCertificate?: string;
    };
  }) {
    try {
      const vendor = await prisma.vendor.create({
        data: {
          // Personal Information
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          
          // Business Information
          businessNameEn: data.businessNameEn,
          businessNameAr: data.businessNameAr,
          crNumber: data.crNumber,
          businessType: data.businessType,
          governorate: data.governorate,
          city: data.city,
          address: data.address,
          addressAr: data.addressAr,
          establishedYear: data.establishedYear,
          
          // Store Information
          storeDescriptionEn: data.storeDescriptionEn,
          storeDescriptionAr: data.storeDescriptionAr,
          estimatedMonthlyVolume: data.estimatedMonthlyVolume,
          
          // Banking Information
          bankDetails: {
            create: {
              bankName: data.bankName,
              accountHolderName: data.accountHolderName,
              accountNumber: data.accountNumber,
              iban: data.iban,
              isVerified: false
            }
          },
          
          // Documents
          documents: {
            create: [
              {
                type: 'CR_CERTIFICATE',
                filePath: data.documents.crCertificate,
                status: 'PENDING'
              },
              {
                type: 'BUSINESS_LICENSE',
                filePath: data.documents.businessLicense,
                status: 'PENDING'
              },
              ...(data.documents.trademarkCertificate ? [{
                type: 'TRADEMARK_CERTIFICATE' as const,
                filePath: data.documents.trademarkCertificate,
                status: 'PENDING' as const
              }] : []),
              ...(data.documents.vatCertificate ? [{
                type: 'VAT_CERTIFICATE' as const,
                filePath: data.documents.vatCertificate,
                status: 'PENDING' as const
              }] : [])
            ]
          },
          
          // Categories
          categories: {
            create: data.productCategories.map(categoryId => ({
              category: { connect: { id: categoryId } }
            }))
          },
          
          // Initial Status
          status: 'PENDING_REVIEW',
          verificationStatus: 'PENDING',
          isActive: false,
          
          // Audit Trail
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          bankDetails: true,
          documents: true,
          categories: {
            include: {
              category: true
            }
          }
        }
      });

      // Create initial commission rate (15% default for Bahrain market)
      await prisma.vendorCommission.create({
        data: {
          vendorId: vendor.id,
          rate: 0.15, // 15%
          tier: 'STANDARD',
          isActive: true,
          effectiveFrom: new Date()
        }
      });

      return vendor;
    } catch (error) {
      console.error('Error creating vendor application:', error);
      throw error;
    }
  }

  // Vendor Verification and Approval
  static async updateVendorStatus(
    vendorId: string, 
    status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED',
    adminId: string,
    notes?: string
  ) {
    try {
      const vendor = await prisma.vendor.update({
        where: { id: vendorId },
        data: {
          status: status,
          verificationStatus: status === 'APPROVED' ? 'VERIFIED' : 'PENDING',
          isActive: status === 'APPROVED',
          approvedAt: status === 'APPROVED' ? new Date() : null,
          approvedBy: status === 'APPROVED' ? adminId : null,
          updatedAt: new Date()
        }
      });

      // Create audit log for status change
      await prisma.vendorAuditLog.create({
        data: {
          vendorId: vendorId,
          action: 'STATUS_CHANGE',
          previousValue: null,
          newValue: status,
          performedBy: adminId,
          notes: notes,
          timestamp: new Date()
        }
      });

      // If approved, create default payout schedule
      if (status === 'APPROVED') {
        await prisma.vendorPayout.create({
          data: {
            vendorId: vendorId,
            schedule: 'WEEKLY', // Every Thursday
            minimumAmount: 50.000, // 50 BHD minimum
            isActive: true
          }
        });
      }

      return vendor;
    } catch (error) {
      console.error('Error updating vendor status:', error);
      throw error;
    }
  }

  // Product Management
  static async createVendorProduct(vendorId: string, productData: {
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr?: string;
    price: number;
    categoryId: string;
    subcategoryId?: string;
    sku: string;
    stockQuantity: number;
    images: string[];
    specifications?: Record<string, any>;
    isActive?: boolean;
  }) {
    try {
      const product = await prisma.product.create({
        data: {
          nameEn: productData.nameEn,
          nameAr: productData.nameAr,
          descriptionEn: productData.descriptionEn,
          descriptionAr: productData.descriptionAr,
          price: productData.price,
          vendorId: vendorId,
          categoryId: productData.categoryId,
          subcategoryId: productData.subcategoryId,
          sku: productData.sku,
          stockQuantity: productData.stockQuantity,
          specifications: productData.specifications || {},
          isActive: productData.isActive ?? true,
          
          // Create product images
          images: {
            create: productData.images.map((imageUrl, index) => ({
              url: imageUrl,
              altTextEn: `${productData.nameEn} - Image ${index + 1}`,
              altTextAr: `${productData.nameAr} - صورة ${index + 1}`,
              displayOrder: index,
              isPrimary: index === 0
            }))
          },
          
          // Initial metrics
          viewCount: 0,
          orderCount: 0,
          rating: 0,
          reviewCount: 0,
          
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          images: true,
          category: true,
          vendor: true
        }
      });

      return product;
    } catch (error) {
      console.error('Error creating vendor product:', error);
      throw error;
    }
  }

  // Order Management
  static async getVendorOrders(
    vendorId: string,
    status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      const where = {
        items: {
          some: {
            product: {
              vendorId: vendorId
            }
          }
        },
        ...(status && { status })
      };

      const orders = await prisma.order.findMany({
        where,
        include: {
          items: {
            where: {
              product: {
                vendorId: vendorId
              }
            },
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          },
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          shippingAddress: true,
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      });

      return orders;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  static async getVendorAnalytics(vendorId: string, startDate: Date, endDate: Date) {
    try {
      // Sales Analytics
      const salesData = await prisma.order.aggregate({
        where: {
          items: {
            some: {
              product: {
                vendorId: vendorId
              }
            }
          },
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: {
            not: 'CANCELLED'
          }
        },
        _sum: {
          totalAmount: true,
          vatAmount: true
        },
        _count: {
          id: true
        }
      });

      // Product Performance
      const topProducts = await prisma.product.findMany({
        where: {
          vendorId: vendorId,
          orders: {
            some: {
              order: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          }
        },
        select: {
          id: true,
          nameEn: true,
          nameAr: true,
          price: true,
          viewCount: true,
          orderCount: true,
          stockQuantity: true,
          _count: {
            select: {
              orders: {
                where: {
                  order: {
                    createdAt: {
                      gte: startDate,
                      lte: endDate
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          orderCount: 'desc'
        },
        take: 10
      });

      // Commission Calculations
      const commissionRate = await prisma.vendorCommission.findFirst({
        where: {
          vendorId: vendorId,
          isActive: true
        }
      });

      const totalRevenue = salesData._sum.totalAmount || 0;
      const totalCommission = totalRevenue * (commissionRate?.rate || 0.15);

      // Customer Analytics
      const customerStats = await prisma.order.groupBy({
        by: ['customerId'],
        where: {
          items: {
            some: {
              product: {
                vendorId: vendorId
              }
            }
          },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _count: {
          id: true
        },
        _sum: {
          totalAmount: true
        }
      });

      return {
        sales: {
          totalRevenue: totalRevenue,
          totalOrders: salesData._count.id,
          totalVAT: salesData._sum.vatAmount || 0,
          totalCommission: totalCommission,
          averageOrderValue: salesData._count.id ? totalRevenue / salesData._count.id : 0
        },
        products: {
          topPerforming: topProducts
        },
        customers: {
          totalCustomers: customerStats.length,
          repeatCustomers: customerStats.filter(c => c._count.id > 1).length,
          averageCustomerValue: customerStats.length ? 
            customerStats.reduce((sum, c) => sum + (c._sum.totalAmount || 0), 0) / customerStats.length : 0
        }
      };
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      throw error;
    }
  }

  // Commission and Payout Management
  static async calculateVendorPayout(vendorId: string, startDate: Date, endDate: Date) {
    try {
      // Get all completed orders in the period
      const orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                vendorId: vendorId
              }
            }
          },
          status: 'DELIVERED',
          completedAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          items: {
            where: {
              product: {
                vendorId: vendorId
              }
            },
            include: {
              product: true
            }
          }
        }
      });

      // Get current commission rate
      const commission = await prisma.vendorCommission.findFirst({
        where: {
          vendorId: vendorId,
          isActive: true
        }
      });

      const commissionRate = commission?.rate || 0.15;

      // Calculate payout
      let totalSales = 0;
      let totalCommission = 0;

      orders.forEach(order => {
        order.items.forEach(item => {
          const itemTotal = item.quantity * item.price;
          totalSales += itemTotal;
          totalCommission += itemTotal * commissionRate;
        });
      });

      const netPayout = totalSales - totalCommission;

      return {
        vendorId,
        period: { startDate, endDate },
        totalSales,
        commissionRate,
        totalCommission,
        netPayout,
        orderCount: orders.length,
        itemCount: orders.reduce((sum, order) => sum + order.items.length, 0)
      };
    } catch (error) {
      console.error('Error calculating vendor payout:', error);
      throw error;
    }
  }

  // PDPL Compliance Functions
  static async logDataAccess(vendorId: string, action: string, dataSubject: string, details: string) {
    try {
      await prisma.dataAuditLog.create({
        data: {
          vendorId: vendorId,
          action: action,
          dataSubject: dataSubject,
          details: details,
          timestamp: new Date(),
          ipAddress: '0.0.0.0', // This should be captured from request
          userAgent: 'Vendor Dashboard' // This should be captured from request
        }
      });
    } catch (error) {
      console.error('Error logging data access:', error);
      throw error;
    }
  }

  static async createDataRequest(data: {
    customerId: string;
    vendorId: string;
    requestType: 'ACCESS' | 'DELETION' | 'CORRECTION' | 'PORTABILITY';
    description: string;
    customerEmail: string;
  }) {
    try {
      return await prisma.dataRequest.create({
        data: {
          customerId: data.customerId,
          vendorId: data.vendorId,
          requestType: data.requestType,
          description: data.description,
          customerEmail: data.customerEmail,
          status: 'PENDING',
          requestDate: new Date()
        }
      });
    } catch (error) {
      console.error('Error creating data request:', error);
      throw error;
    }
  }

  // Vendor Performance Metrics
  static async updateVendorMetrics(vendorId: string) {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate metrics for the last 30 days
      const metrics = await this.getVendorAnalytics(vendorId, thirtyDaysAgo, now);

      // Update vendor performance record
      await prisma.vendorPerformance.upsert({
        where: { vendorId },
        update: {
          totalSales: metrics.sales.totalRevenue,
          totalOrders: metrics.sales.totalOrders,
          averageOrderValue: metrics.sales.averageOrderValue,
          customerCount: metrics.customers.totalCustomers,
          rating: 0, // This would be calculated from reviews
          updatedAt: new Date()
        },
        create: {
          vendorId,
          totalSales: metrics.sales.totalRevenue,
          totalOrders: metrics.sales.totalOrders,
          averageOrderValue: metrics.sales.averageOrderValue,
          customerCount: metrics.customers.totalCustomers,
          rating: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      return metrics;
    } catch (error) {
      console.error('Error updating vendor metrics:', error);
      throw error;
    }
  }
}

export default VendorDatabase;