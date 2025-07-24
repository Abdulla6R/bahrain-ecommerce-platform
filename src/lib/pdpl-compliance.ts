import { AuditAction, AuditLog } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// PDPL (Personal Data Protection Law) Compliance Utilities for Bahrain

export interface PDPLConsentData {
  userId: string;
  consentType: 'marketing' | 'necessary' | 'analytics' | 'functional';
  consentGiven: boolean;
  consentWithdrawn?: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataExportRequest {
  userId: string;
  requestedAt: Date;
  format: 'json' | 'csv' | 'xml';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface DataDeletionRequest {
  userId: string;
  requestedAt: Date;
  reason: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  completedAt?: Date;
  retainedData?: string[]; // Data that must be retained for legal reasons
}

export class PDPLComplianceManager {
  
  // Record consent according to PDPL requirements
  static async recordConsent(consentData: PDPLConsentData): Promise<void> {
    const { userId, consentType, consentGiven, timestamp, ipAddress, userAgent } = consentData;
    
    // Update user consent status
    await prisma.user.update({
      where: { id: userId },
      data: {
        pdplConsent: consentGiven,
        pdplConsentAt: consentGiven ? timestamp : null,
      }
    });

    // Create audit log for PDPL compliance
    await this.createAuditLog({
      userId,
      action: consentGiven ? AuditAction.CONSENT_GIVEN : AuditAction.CONSENT_WITHDRAWN,
      entity: 'user_consent',
      entityId: userId,
      newData: JSON.stringify({
        consentType,
        consentGiven,
        timestamp: timestamp.toISOString(),
        ipAddress,
        userAgent
      }),
      ipAddress,
      userAgent,
    });
  }

  // Withdraw consent (Right to object - Article 15 PDPL)
  static async withdrawConsent(userId: string, reason?: string): Promise<void> {
    const withdrawalTime = new Date();
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        pdplConsent: false,
        pdplConsentAt: null,
      }
    });

    await this.createAuditLog({
      userId,
      action: AuditAction.CONSENT_WITHDRAWN,
      entity: 'user_consent',
      entityId: userId,
      newData: JSON.stringify({
        withdrawalTime: withdrawalTime.toISOString(),
        reason: reason || 'User requested withdrawal'
      }),
    });

    // Stop all non-essential data processing
    await this.anonymizeMarketingData(userId);
  }

  // Export user data (Right to portability - Article 16 PDPL)
  static async requestDataExport(userId: string, format: 'json' | 'csv' | 'xml' = 'json'): Promise<DataExportRequest> {
    const request: DataExportRequest = {
      userId,
      requestedAt: new Date(),
      format,
      status: 'pending'
    };

    // Log the export request
    await this.createAuditLog({
      userId,
      action: AuditAction.DATA_EXPORT,
      entity: 'data_export_request',
      entityId: userId,
      newData: JSON.stringify(request),
    });

    // In production, this would trigger an async job to compile user data
    // For now, we'll generate a basic export
    const userData = await this.compileUserData(userId);
    
    // Create export file (in production, store in secure S3 bucket)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exportData = this.formatExportData(userData, format);
    
    return {
      ...request,
      status: 'completed',
      downloadUrl: `/api/data-export/${userId}`, // Secure endpoint
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
  }

  // Delete user data (Right to erasure - Article 14 PDPL)
  static async requestDataDeletion(userId: string, reason: string): Promise<DataDeletionRequest> {
    const request: DataDeletionRequest = {
      userId,
      requestedAt: new Date(),
      reason,
      status: 'pending'
    };

    // Log deletion request
    await this.createAuditLog({
      userId,
      action: AuditAction.DATA_DELETION,
      entity: 'data_deletion_request',
      entityId: userId,
      newData: JSON.stringify(request),
    });

    // Check for legal obligations to retain data
    const retainedData = await this.checkDataRetentionRequirements(userId);
    
    if (retainedData.length > 0) {
      // Partial deletion - anonymize personal data but retain transactional records
      await this.anonymizePersonalData(userId);
      
      return {
        ...request,
        status: 'completed',
        completedAt: new Date(),
        retainedData: retainedData.map(item => item.reason)
      };
    } else {
      // Full deletion
      await this.deleteUserData(userId);
      
      return {
        ...request,
        status: 'completed',
        completedAt: new Date()
      };
    }
  }

  // Create audit log for PDPL compliance tracking
  private static async createAuditLog(logData: {
    userId?: string;
    action: AuditAction;
    entity: string;
    entityId: string;
    oldData?: string;
    newData?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    return await prisma.auditLog.create({
      data: {
        userId: logData.userId,
        action: logData.action,
        entity: logData.entity,
        entityId: logData.entityId,
        oldData: logData.oldData,
        newData: logData.newData,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        timestamp: new Date(),
      }
    });
  }

  // Compile all user data for export
  private static async compileUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        vendor: true,
        orders: {
          include: {
            items: true,
            vendorOrders: true
          }
        },
        cart: {
          include: {
            product: true
          }
        },
        addresses: true,
        auditLogs: true
      }
    });

    return user;
  }

  // Format export data according to requested format
  private static formatExportData(userData: unknown, format: string) {
    switch (format) {
      case 'json':
        return JSON.stringify(userData, null, 2);
      case 'csv':
        // Implement CSV formatting
        return this.convertToCSV(userData);
      case 'xml':
        // Implement XML formatting  
        return this.convertToXML(userData);
      default:
        return JSON.stringify(userData, null, 2);
    }
  }

  // Check legal requirements for data retention (VAT, commercial law)
  private static async checkDataRetentionRequirements(userId: string) {
    const retentionRequirements = [];
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: true,
        vendor: true
      }
    });

    // Commercial transactions must be kept for 7 years (Bahrain Commercial Law)
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);
    
    const recentOrders = user?.orders?.filter(order => 
      order.createdAt > sevenYearsAgo
    );

    if (recentOrders && recentOrders.length > 0) {
      retentionRequirements.push({
        type: 'commercial_transactions',
        reason: 'Commercial law requires 7-year retention of transaction records',
        data: 'Order history, payment records, VAT calculations'
      });
    }

    // VAT records must be kept for CBB compliance
    if (user?.vendor) {
      retentionRequirements.push({
        type: 'vat_records',
        reason: 'VAT registration requires retention of business records',
        data: 'VAT calculations, business transactions'
      });
    }

    return retentionRequirements;
  }

  // Anonymize personal data while retaining transactional records
  private static async anonymizePersonalData(userId: string) {
    const anonymizedData = {
      nameEn: '[DELETED USER]',
      nameAr: '[محذوف]',
      email: `deleted-${Date.now()}@tendzd.bh`,
      phone: null,
      passwordHash: '[DELETED]',
      pdplConsent: false,
      pdplConsentAt: null,
    };

    await prisma.user.update({
      where: { id: userId },
      data: anonymizedData
    });

    // Anonymize addresses
    await prisma.address.updateMany({
      where: { userId },
      data: {
        nameEn: '[DELETED]',
        nameAr: '[محذوف]',
        phone: '[DELETED]',
        addressLine1: '[DELETED]',
        addressLine2: '[DELETED]'
      }
    });
  }

  // Stop marketing data processing
  private static async anonymizeMarketingData(userId: string) {
    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    // Clear wishlist data if we had it
    // await prisma.wishlist.deleteMany({ where: { userId } });

    // Remove from marketing lists (Redis cache)
    // await BahrainCache.clearCachePattern(`marketing:${userId}:*`);
  }

  // Full data deletion (when legally permissible)
  private static async deleteUserData(userId: string) {
    // Delete in order due to foreign key constraints
    await prisma.cartItem.deleteMany({ where: { userId } });
    await prisma.address.deleteMany({ where: { userId } });
    await prisma.auditLog.deleteMany({ where: { userId } });
    
    // Delete vendor data if exists
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (vendor) {
      await prisma.product.deleteMany({ where: { vendorId: vendor.id } });
      await prisma.vendor.delete({ where: { id: vendor.id } });
    }
    
    // Finally delete user
    await prisma.user.delete({ where: { id: userId } });
  }

  // Utility methods for data conversion
  private static convertToCSV(data: unknown): string {
    // Basic CSV conversion - implement based on requirements
    return 'CSV conversion not implemented';
  }

  private static convertToXML(data: unknown): string {
    // Basic XML conversion - implement based on requirements
    return '<xml>XML conversion not implemented</xml>';
  }

  // Check if user has valid consent
  static async hasValidConsent(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pdplConsent: true, pdplConsentAt: true }
    });

    if (!user || !user.pdplConsent || !user.pdplConsentAt) {
      return false;
    }

    // Check if consent is not older than 2 years (recommended practice)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    return user.pdplConsentAt > twoYearsAgo;
  }

  // Get audit trail for a specific user (for DPO requests)
  static async getUserAuditTrail(userId: string): Promise<AuditLog[]> {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 1000 // Limit to last 1000 entries
    });
  }

  // Clean up expired audit logs (run as cron job)
  static async cleanExpiredAuditLogs(): Promise<number> {
    const retentionDate = new Date();
    const retentionDays = parseInt(process.env.AUDIT_LOG_RETENTION_DAYS || '2555'); // 7 years default
    retentionDate.setDate(retentionDate.getDate() - retentionDays);

    const result = await prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: retentionDate
        }
      }
    });

    return result.count;
  }
}