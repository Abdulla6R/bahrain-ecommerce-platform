# 🇧🇭 Tendzd - Bahrain Multi-Vendor E-commerce Platform

[![Build Status](https://github.com/tendzd/bahrain-platform/workflows/CI/CD/badge.svg)](https://github.com/tendzd/bahrain-platform/actions)
[![Coverage](https://codecov.io/gh/tendzd/bahrain-platform/branch/main/graph/badge.svg)](https://codecov.io/gh/tendzd/bahrain-platform)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Arabic Support](https://img.shields.io/badge/Arabic-RTL%20Ready-success.svg)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)]()

A modern, mobile-first multi-vendor e-commerce platform built specifically for the Bahrain market, featuring comprehensive Arabic RTL support, local payment integration, and compliance with Bahrain's regulatory requirements.

## ✨ Phase 5 & 6 Complete: Mobile-First PWA Ready!

## 🚀 Features

### Core E-commerce
- **Multi-vendor marketplace** with vendor dashboards
- **Arabic/English dual language** support with RTL layouts
- **Product catalog** with advanced search and filtering
- **Shopping cart** with real-time updates
- **Order management** with vendor-specific processing
- **Commission system** for multi-vendor payouts

### Bahrain-Specific Features
- **Benefit Pay integration** (primary payment method)
- **Apple Pay support** for NBB, ila Digital Bank, BBK
- **10% VAT calculation** and compliance reporting
- **PDPL compliance** (Personal Data Protection Law)
- **Islamic calendar integration** for promotions
- **Arabic typography** with Cairo and Amiri fonts
- **Bahrain business validation** (CR numbers, VAT registration)

### Technical Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Mantine UI
- **Backend**: PostgreSQL 16, Redis 7, Prisma ORM
- **Styling**: Tailwind CSS with RTL support
- **Internationalization**: next-intl
- **Authentication**: NextAuth.js with PDPL compliance
- **Payment**: Benefit Pay API, Apple Pay SDK
- **Caching**: Redis with Arabic content optimization
- **Deployment**: Vercel with Dubai region (dxb1)

## 📋 Prerequisites

- Node.js 18.17+ 
- PostgreSQL 16+
- Redis 7+
- npm or yarn

## 🛠 Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd bahrain-multivendor-ecommerce
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp .env .env.local
   # Edit .env.local with your configuration
   ```

3. **Database setup**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed  # Optional: seed with sample data
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🗄 Database Schema

The PostgreSQL schema includes:
- **Users** with PDPL compliance tracking
- **Vendors** with Bahrain business verification
- **Products** with Arabic/English content
- **Orders** with multi-vendor splitting
- **Audit logs** for compliance reporting
- **VAT calculations** and commission tracking

## 🎨 UI Components

Built with Mantine v7 for optimal Arabic/RTL support:
- **RTL-aware layouts** with automatic direction switching
- **Arabic typography** optimization (+10-15% font scaling)
- **Cultural color schemes** (teal primary for Gulf region)
- **Mobile-first design** (70%+ mobile users in Bahrain)

## 💳 Payment Integration

### Benefit Pay (Primary)
- Web Card SDK V2 with redirect flow
- 3D Secure mandatory for all banks
- PIN + OTP mobile verification
- 5-minute token validity

### Apple Pay (Secondary)
- Support for NBB, ila Digital Bank, BBK
- Face ID/Touch ID authentication
- Standard Apple Pay SDK integration

### BenefitPay Digital Wallet
- QR code payments
- Instant transfers
- Open banking integration via Tarabut Gateway

## 📊 Compliance

### PDPL (Personal Data Protection Law)
- **Consent management** with explicit opt-in/opt-out
- **Data export** functionality (Right to portability)
- **Data deletion** requests (Right to erasure)
- **Audit logging** for all data processing activities
- **7-year retention** for commercial records

### VAT Compliance
- **10% Bahrain VAT** automatic calculation
- **VAT-inclusive pricing** with breakdown display
- **Business transaction recording** for CBB compliance
- **E-invoicing preparation** for 2025 mandate

## 🌐 Internationalization

### Arabic Support
- **RTL layouts** with Mantine framework
- **Arabic fonts**: Cairo (body), Amiri (headings)
- **Cultural considerations**: Islamic calendar, business hours
- **Number formatting**: Bahrain Dinar (3 decimal places)
- **Date formatting**: Hijri calendar alongside Gregorian

### Localization
- **Dynamic language switching**
- **Culturally appropriate imagery**
- **Local business hours** (Friday weekend, Saturday half-day)
- **Ramadan-aware** business logic

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Configure for Middle East optimization
vercel --regions dxb1
```

### Environment Variables
Essential production variables:
- `DATABASE_URL`: PostgreSQL connection
- `REDIS_URL`: Redis cache connection
- `BENEFIT_PAY_*`: Payment gateway credentials
- `NEXTAUTH_SECRET`: Authentication security
- `AWS_*`: File upload configuration (Bahrain region)

## 📝 Development Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking
npm run type-check   # TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm run clean        # Clean build artifacts
```

## 🔧 Configuration

### Next.js Configuration
- **Turbopack** enabled for development
- **Image optimization** for Arabic content
- **Security headers** for PDPL compliance
- **Arabic URL patterns** and redirects
- **Font optimization** for Arabic typography

### Database Configuration
- **Multi-tenant architecture** with vendor isolation
- **Audit logging** for compliance tracking
- **VAT calculation** helpers
- **Arabic slug generation**
- **Bahrain business validation**

## 🧪 Testing

```bash
npm run test         # Run test suite
npm run type-check   # TypeScript validation
npm run lint         # Code quality checks
```

## 📈 Performance Optimizations

- **Redis caching** for Arabic content
- **Image optimization** with WebP/AVIF
- **Code splitting** for Arabic text processing
- **CDN optimization** for Arabic fonts
- **Mobile-first** responsive design
- **3G network optimization** for Middle East users

## 🔐 Security

- **OWASP compliance** for e-commerce security
- **PCI DSS** through Benefit Pay integration
- **HTTPS enforcement** with security headers
- **SQL injection prevention**
- **XSS protection** with CSP headers
- **PDPL audit trails** for data processing

## 🏢 Bahrain Market Specifics

- **CBB licensing** requirements for payment facilitators
- **Commercial law** 7-year record retention
- **VAT registration** validation
- **CR number** format validation
- **Business hours** respecting local customs
- **Currency handling** (Bahrain Dinar with fils)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Ensure Arabic/English translations are complete
4. Test RTL layouts thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software developed for the Bahrain market.

## 🆘 Support

For technical support or questions about Bahrain market integration:
- Email: support@tendzd.bh
- Phone: +973 XXXX XXXX
- Documentation: [Internal Wiki]

---

**Built with ❤️ for the Bahrain market | صُنع بحب للسوق البحريني**