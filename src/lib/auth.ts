// Authentication configuration for Bahrain Multi-Vendor Platform
// NextAuth.js with PDPL compliance and role-based access control

import { NextAuthOptions, User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './database';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export interface ExtendedUser extends User {
  id: string;
  role: UserRole;
  locale: string;
  isActive: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  consentGiven: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error('Invalid email format');
        }

        try {
          // Find user with secure query
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              password: true,
              firstName: true,
              lastName: true,
              role: true,
              locale: true,
              isActive: true,
              emailVerified: true,
              phoneVerified: true,
              consentGiven: true,
              avatar: true
            }
          });

          if (!user || !user.password) {
            // Log failed attempt for security monitoring
            await logSecurityEvent('AUTH_FAILED', {
              email: credentials.email,
              reason: 'User not found',
              timestamp: new Date()
            });
            throw new Error('Invalid credentials');
          }

          // Check if user is active
          if (!user.isActive) {
            await logSecurityEvent('AUTH_BLOCKED', {
              userId: user.id,
              reason: 'Account inactive',
              timestamp: new Date()
            });
            throw new Error('Account is inactive. Please contact support.');
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            await logSecurityEvent('AUTH_FAILED', {
              userId: user.id,
              email: credentials.email,
              reason: 'Invalid password',
              timestamp: new Date()
            });
            throw new Error('Invalid credentials');
          }

          // Check PDPL consent
          if (!user.consentGiven) {
            throw new Error('PDPL consent required. Please register again.');
          }

          // Log successful login
          await logSecurityEvent('AUTH_SUCCESS', {
            userId: user.id,
            email: user.email,
            timestamp: new Date()
          });

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              lastLogin: new Date(),
              lastLoginIP: '0.0.0.0' // Will be set by middleware
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.avatar,
            role: user.role,
            locale: user.locale,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            consentGiven: user.consentGiven
          } as ExtendedUser;

        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60 // 1 hour
  },

  jwt: {
    maxAge: 24 * 60 * 60 // 24 hours
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.role = extendedUser.role;
        token.locale = extendedUser.locale;
        token.isActive = extendedUser.isActive;
        token.emailVerified = extendedUser.emailVerified;
        token.phoneVerified = extendedUser.phoneVerified;
        token.consentGiven = extendedUser.consentGiven;
      }

      // Handle OAuth providers
      if (account?.provider === 'google') {
        // Create or update user for Google OAuth
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! }
        });

        if (!existingUser) {
          // Create new user with Google OAuth
          const newUser = await prisma.user.create({
            data: {
              email: token.email!,
              firstName: token.name?.split(' ')[0] || '',
              lastName: token.name?.split(' ').slice(1).join(' ') || '',
              avatar: token.picture,
              role: UserRole.CUSTOMER,
              locale: 'en',
              isActive: true,
              emailVerified: true,
              phoneVerified: false,
              consentGiven: false, // Will need to provide consent
              provider: 'google'
            }
          });

          token.role = newUser.role;
          token.locale = newUser.locale;
          token.isActive = newUser.isActive;
          token.consentGiven = newUser.consentGiven;
        } else {
          token.role = existingUser.role;
          token.locale = existingUser.locale;
          token.isActive = existingUser.isActive;
          token.consentGiven = existingUser.consentGiven;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub!,
          role: token.role as UserRole,
          locale: token.locale as string,
          isActive: token.isActive as boolean,
          emailVerified: token.emailVerified as boolean,
          phoneVerified: token.phoneVerified as boolean,
          consentGiven: token.consentGiven as boolean
        } as ExtendedUser;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // Additional sign-in validation
      const extendedUser = user as ExtendedUser;

      // Block inactive users
      if (!extendedUser.isActive) {
        return false;
      }

      // For OAuth providers, check if consent is given
      if (account?.provider !== 'credentials' && !extendedUser.consentGiven) {
        // Redirect to consent page
        return '/auth/consent?provider=' + account?.provider;
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Secure redirect handling
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/auth/welcome'
  },

  events: {
    async signIn({ user, account }) {
      await logSecurityEvent('SIGNIN', {
        userId: user.id,
        provider: account?.provider,
        timestamp: new Date()
      });
    },

    async signOut({ session }) {
      if (session?.user) {
        await logSecurityEvent('SIGNOUT', {
          userId: (session.user as ExtendedUser).id,
          timestamp: new Date()
        });
      }
    },

    async createUser({ user }) {
      await logSecurityEvent('USER_CREATED', {
        userId: user.id,
        email: user.email,
        timestamp: new Date()
      });
    }
  },

  debug: process.env.NODE_ENV === 'development'
};

// Security event logging for PDPL compliance
async function logSecurityEvent(action: string, details: any) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details: JSON.stringify(details),
        timestamp: new Date(),
        ipAddress: details.ipAddress || '0.0.0.0',
        userAgent: details.userAgent || 'system'
      }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Role-based access control helpers
export function hasRole(user: ExtendedUser | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false;
}

export function isAdmin(user: ExtendedUser | null): boolean {
  return hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}

export function isVendor(user: ExtendedUser | null): boolean {
  return hasRole(user, [UserRole.VENDOR]);
}

export function isCustomer(user: ExtendedUser | null): boolean {
  return hasRole(user, [UserRole.CUSTOMER]);
}

export function requireAuth(user: ExtendedUser | null): ExtendedUser {
  if (!user) {
    throw new Error('Authentication required');
  }
  if (!user.isActive) {
    throw new Error('Account is inactive');
  }
  if (!user.consentGiven) {
    throw new Error('PDPL consent required');
  }
  return user;
}

export function requireRole(user: ExtendedUser | null, roles: UserRole[]): ExtendedUser {
  const authenticatedUser = requireAuth(user);
  if (!hasRole(authenticatedUser, roles)) {
    throw new Error('Insufficient permissions');
  }
  return authenticatedUser;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    throw new Error('Password must contain uppercase, lowercase, number, and special character');
  }

  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Session helpers
export async function invalidateUserSessions(userId: string): Promise<void> {
  // Invalidate all sessions for a user (useful for admin actions)
  await prisma.session.deleteMany({
    where: { userId }
  });
  
  await logSecurityEvent('SESSIONS_INVALIDATED', {
    userId,
    timestamp: new Date()
  });
}

// Two-factor authentication (future implementation)
export async function generateTwoFactorSecret(userId: string): Promise<string> {
  // Placeholder for 2FA implementation
  const secret = Math.random().toString(36).substring(2, 15);
  
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret }
  });
  
  return secret;
}

export default authOptions;