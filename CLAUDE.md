# Multi-Vendor E-commerce Platform - Bahrain Market

## Project Overview
Next.js 15 multi-vendor marketplace with Arabic/English support, Bahrain payment integration, and CBB compliance targeting the Gulf market with cultural sensitivity and regulatory compliance.

## Tech Stack
- Framework: Next.js 15 with App Router and Turbopack
- Language: TypeScript 5.3 with strict configuration
- Database: PostgreSQL 16 with multi-vendor schema
- Cache: Redis 7 for sessions and product catalog
- Styling: Tailwind CSS + Mantine v7 for RTL/Arabic support
- Payments: Benefit Pay API + Apple Pay integration
- Authentication: NextAuth.js with PDPL compliance
- Internationalization: next-intl with Arabic/English
- UI Framework: Mantine v7 (primary), shadcn/ui (performance-critical components)

## Architecture Patterns
- Server Components for product catalogs and vendor dashboards
- Client Components for interactive cart and checkout flows
- Progressive Web App with offline capability
- Multi-tenant database architecture with vendor isolation
- Redis caching for Arabic product data and user sessions
- Edge functions for Middle East optimization

## Compliance Requirements
- PDPL data protection (Bahrain GDPR equivalent)
- CBB banking regulations compliance
- 10% VAT calculation and reporting
- E-invoicing system preparation (2025 mandate)
- PCI DSS compliance through Benefit Pay
- OWASP security guidelines implementation

## Cultural Considerations
- RTL layout support with Mantine framework
- Arabic typography using Cairo/Amiri fonts
- Islamic calendar integration for promotions
- Cultural sensitivity in imagery and colors
- Mobile-first design (70%+ mobile users in Bahrain)
- Dual calendar system (Gregorian/Hijri) for promotions

## Payment Integration
- Primary: Benefit Pay with 3D Secure mandatory
- Secondary: Apple Pay (NBB, ila Digital Bank, BBK support)
- BenefitPay digital wallet with QR code support
- No Stripe Connect (not available in Bahrain)
- PIN + OTP verification for all transactions

## Performance Requirements
- LCP < 2.5s for Arabic content
- PWA score > 90 on Lighthouse
- Mobile optimization for 3G networks
- Dubai region deployment (dxb1)
- Arabic font optimization through CDN

## Development Phases
1. Foundation: Next.js 15 + Mantine v7 + RTL setup
2. Database: PostgreSQL multi-vendor schema + Redis caching
3. Localization: Arabic/English with next-intl
4. E-commerce: Product catalog + vendor management
5. Payments: Benefit Pay + Apple Pay integration
6. Compliance: PDPL + VAT + security framework
7. Optimization: PWA + performance tuning

## Security Framework
- Input validation for SQL injection prevention
- Secure session management with Redis
- Role-based access control (customer, vendor, admin)
- Data encryption at rest and in transit
- PDPL consent management system
- Audit logging for compliance reporting

## Do NOT Section
- Never use Stripe Connect (not available in Bahrain)
- Avoid Ant Design (React 19 compatibility issues)
- Don't implement generic payment flows without 3D Secure
- Never store payment data without PCI DSS compliance
- Avoid Google Pay (not available in Bahrain)
- Don't ignore RTL layout requirements
- Never skip VAT calculation (10% mandatory)
- Avoid non-Arabic font fallbacks without proper testing

## Cultural Design Guidelines
- Use culturally appropriate colors (teal primary)
- Implement proper Arabic typography scaling (+10-15% font size)
- Support Islamic calendar alongside Gregorian
- Mobile-first approach for Gulf market preferences
- Respect cultural sensitivities in product imagery
- Ensure proper Arabic text rendering and line height (1.6-1.8)