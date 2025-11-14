# File Inventory - Payments & Token Top-ups System

This archive contains all files necessary to implement a complete token-based payment system using NetworkX Pay.

## Directory Structure

```
payments_token_topups/
├── REPORT.md                              # Detailed analysis report
├── PAYMENTS_SETUP_REPORT.md              # Comprehensive setup guide
├── FILE_INVENTORY.md                     # This file
├── payment/                              # Payment API routes
│   └── secure-processor/
│       └── route.ts                      # Payment checkout creation & status check
├── webhooks/                             # Webhook handlers
│   ├── secure-processor/
│   │   └── route.ts                      # NetworkX payment webhook (PRIMARY)
│   ├── payment/
│   │   └── route.ts                      # Legacy payment webhook
│   └── clerk/
│       └── route.ts                      # User authentication events
├── prisma/                               # Database schema & migrations
│   ├── schema.prisma                     # Prisma schema definition
│   └── migrations/
│       ├── 20240523115036_create_table/
│       │   └── migration.sql             # Initial User table
│       ├── 20250123151835_add_20_gen/
│       │   └── migration.sql             # Set default tokens to 20
│       └── 20250123152000_add_transactions/
│           └── migration.sql             # Create Transaction table
├── components/                           # React components
│   ├── pro-modal.tsx                     # Payment modal dialog (375 lines)
│   ├── buy-generations.tsx               # "Buy More" button (24 lines)
│   ├── free-counter.tsx                  # Token usage counter (50 lines)
│   ├── pdf/
│   │   └── receipt.tsx                   # PDF receipt template (254 lines)
│   └── landing/
│       └── pricing.tsx                   # Public pricing page (337 lines)
├── lib/                                  # Business logic & utilities
│   ├── receiptGeneration.tsx             # PDF generation function (28 lines)
│   ├── api-limit.ts                      # Token management functions (150 lines)
│   └── actions/
│       └── user.actions.ts               # User CRUD operations (166 lines)
├── config/                               # Configuration files
│   └── nodemailer.ts                     # Email SMTP setup (19 lines)
├── constants/                            # Constants & configuration
│   └── index.ts                          # Currencies, exchange rates, public key (256 lines)
├── constants.ts                          # Pricing & tool costs (407 lines)
├── dashboard_billing/                    # Payment history UI
│   └── payment-history/
│       ├── page.tsx                      # Payment history page (188 lines)
│       └── payment-history-client.tsx    # Client-side history component
└── docs/                                 # Documentation
    ├── SECURE-PROCESSOR_ENV_SETUP.md             # NetworkX environment variables guide
    └── ENV_SETUP.md                      # General environment setup guide
```

## File Details

### API Routes (7 files)

#### `/payment/secure-processor/route.ts` (227 lines)
**Purpose**: Payment checkout initialization and status checking  
**Endpoints**:
- `POST /api/payment/secure-processor` - Create payment session
- `GET /api/payment/secure-processor?token=xxx` - Check payment status

**Key Functions**:
- `createSignature()` - HMAC signature generation
- `POST()` - Create checkout with NetworkX API
- `GET()` - Query payment status

**Dependencies**: crypto, Next.js server

---

#### `/webhooks/secure-processor/route.ts` (340 lines)
**Purpose**: Primary webhook handler for payment notifications  
**Endpoint**: `POST /api/webhooks/secure-processor`

**Key Functions**:
- `verifyWebhookSignature()` - HMAC SHA256 verification
- `POST()` - Process payment webhooks
- `GET()` - Health check endpoint

**Database Operations**:
- Updates `User.availableGenerations` (line 194-200)
- Creates `Transaction` record (line 218-221)
- Idempotency check (line 146-158)

**Dependencies**: crypto, Prisma, nodemailer, receipt generation

---

#### `/webhooks/payment/route.ts` (186 lines)
**Purpose**: Legacy webhook handler (deprecated but kept for compatibility)  
**Endpoint**: `POST /api/webhooks/payment`

**Key Functions**:
- `chunkSplit()` - RSA key formatting
- `POST()` - Verify signature & process payment

**Security**: RSA signature verification with public key

**Dependencies**: crypto, Prisma, nodemailer, receipt generation

---

#### `/webhooks/clerk/route.ts` (137 lines)
**Purpose**: User authentication lifecycle events  
**Endpoint**: `POST /api/webhooks/clerk`

**Events Handled**:
- `user.created` - Create user in database
- `user.updated` - Update user details
- `user.deleted` - Delete user from database

**Dependencies**: @clerk/nextjs, svix, user actions

---

### Database Files (4 files)

#### `/prisma/schema.prisma` (37 lines)
**Purpose**: Database schema definition

**Models**:
1. **User** (9 fields)
   - `id`, `clerkId`, `email`, `photo`
   - `firstName`, `lastName`
   - `usedGenerations`, `availableGenerations`
   - `transactions` (relation)

2. **Transaction** (12 fields)
   - `id`, `tracking_id`, `userId`
   - `status`, `amount`, `currency`
   - `description`, `type`, `payment_method_type`
   - `message`, `paid_at`, `receipt_url`
   - `user` (relation)

**Provider**: PostgreSQL  
**ORM**: Prisma

---

#### `/prisma/migrations/20240523115036_create_table/migration.sql` (15 lines)
**Purpose**: Initial User table creation

**Operations**:
- Create `User` table
- Add unique indices on `clerkId` and `email`
- Set default values for token fields

---

#### `/prisma/migrations/20250123151835_add_20_gen/migration.sql` (2 lines)
**Purpose**: Update default token allocation

**Operations**:
- Set `availableGenerations` default to 20 (from 0)

---

#### `/prisma/migrations/20250123152000_add_transactions/migration.sql` (17 lines)
**Purpose**: Create Transaction table for payment history

**Operations**:
- Create `Transaction` table with 12 fields
- Add foreign key constraint to `User` table

---

### Frontend Components (5 files)

#### `/components/pro-modal.tsx` (375 lines)
**Purpose**: Payment modal with token purchase UI

**Features**:
- Token amount input field
- Currency selector (15+ currencies)
- Real-time price calculator
- Terms & conditions checkbox
- Embedded NetworkX payment widget

**State Management**:
- `tokens` - Number of tokens to purchase
- `currency` - Selected currency
- `policies` - Terms acceptance
- `showPaymentWidget` - Toggle payment UI

**Form Validation**: Zod schema with react-hook-form

**Dependencies**: react-hook-form, zod, @headlessui/react, framer-motion

---

#### `/components/buy-generations.tsx` (24 lines)
**Purpose**: Simple "Buy More" button component

**Features**:
- Opens ProModal on click
- Icon (Zap) with text
- Styled with premium variant

**Dependencies**: lucide-react, pro-modal hook

---

#### `/components/free-counter.tsx` (50 lines)
**Purpose**: Token usage progress display

**Features**:
- Visual progress bar
- Shows used vs available tokens
- "Buy More" button
- Responsive card design

**Props**:
- `apiUsedGenerations: number`
- `apiAvailableGenerations: number`

**Dependencies**: lucide-react, shadcn/ui components

---

#### `/components/pdf/receipt.tsx` (254 lines)
**Purpose**: PDF receipt template with company branding

**Sections**:
- Company logo header
- Receipt title & ID
- Customer email
- Transaction details (amount, date, method)
- Summary table
- Footer with contact info
- Company legal information

**Styling**: Custom StyleSheet for PDF layout

**Dependencies**: @react-pdf/renderer

---

#### `/components/landing/pricing.tsx` (337 lines)
**Purpose**: Public-facing pricing page with packages

**Pricing Tiers**:
1. **Tracker**: £20 / 100 tokens (standard rate)
2. **Master Chef**: £40 / 220 tokens (10% discount) ⭐ Popular
3. **Master Nutritionist**: £60 / 360 tokens (20% discount)
4. **Custom Amount**: £0.20/token (variable)

**Features**:
- Animated cards (framer-motion)
- Responsive grid layout
- Custom amount input
- Feature lists
- CTA buttons

**Dependencies**: framer-motion, lucide-react, Next.js Link

---

### Business Logic (3 files)

#### `/lib/receiptGeneration.tsx` (28 lines)
**Purpose**: Generate PDF receipt buffers

**Function**: `generatePdfReceipt()`

**Parameters**:
- `receiptId: string` - Transaction ID
- `email: string` - Customer email
- `date: string` - Payment date
- `tokens: number` - Number of tokens purchased
- `description: string` - Payment description
- `amount: number` - Amount in cents
- `currency: string` - Currency code

**Returns**: `Promise<Buffer>` - PDF as buffer

**Dependencies**: @react-pdf/renderer, receipt component

---

#### `/lib/api-limit.ts` (150 lines)
**Purpose**: Token balance management

**Functions**:
1. `incrementApiLimit(value: number)` - Deduct tokens
2. `checkApiLimit(generationPrice: number)` - Validate balance
3. `getApiAvailableGenerations()` - Get current balance
4. `getApiUsedGenerations()` - Get consumed tokens
5. `fetchPaymentHistory()` - Retrieve transaction history

**Features**:
- Automatic user creation fallback
- Error handling
- Type-safe queries

**Dependencies**: @clerk/nextjs, Prisma, user actions

---

#### `/lib/actions/user.actions.ts` (166 lines)
**Purpose**: User CRUD operations

**Functions**:
1. `createOrGetUser()` - Upsert user with 10 free tokens
2. `createUser()` - Create new user (webhook)
3. `getUserById()` - Fetch user by Clerk ID
4. `updateUser()` - Update user details
5. `deleteUser()` - Delete user & transactions
6. `updateCredits()` - Manual token adjustment

**Features**:
- Error handling with retry logic
- Duplicate prevention (P2002 errors)
- Logging for debugging

**Dependencies**: Prisma, Next.js cache revalidation

---

### Configuration Files (3 files)

#### `/config/nodemailer.ts` (19 lines)
**Purpose**: SMTP email transporter setup

**Configuration**:
- **Host**: smtp.titan.email
- **Port**: 465 (SSL/TLS)
- **Auth**: Username/password from env

**Exports**:
- `transporter` - Nodemailer instance
- `mailOptions` - Default email options

**Environment Variables**:
- `OUTBOX_EMAIL` - Sender email
- `OUTBOX_EMAIL_PASSWORD` - SMTP password
- `INBOX_EMAIL` - Support/reply-to email

**Dependencies**: nodemailer

---

#### `/constants/index.ts` (256 lines)
**Purpose**: Payment-related constants

**Exports**:
1. `Currency` - Type for supported currencies
2. `currencies` - Array of 15 currency codes
3. `currenciesRate` - Exchange rate mapping
4. `MODEL_GENERATIONS_PRICE` - Token costs per AI feature
5. `PUBLIC_KEY` - NetworkX RSA public key for webhooks
6. Tools & navigation links (secondary)

**Currency Support**:
EUR, USD, GBP, CHF, AED, SEK, PLN, CZK, DKK, NOK, RON, HUF, MDL, BGN, JOD, KWD

**Dependencies**: lucide-react (for icons)

---

#### `/constants.ts` (407 lines)
**Purpose**: General app constants & tool definitions

**Key Exports**:
1. `GENERATIONS_PRICE = 0.20` - Base price per token (GBP)
2. `MODEL_GENERATIONS_PRICE` - Token cost per AI tool
3. `tools[]` - List of AI features with metadata
4. `navLinks[]` - Navigation menu items
5. `transformationTypes` - Image transformation configs
6. `aspectRatioOptions` - Image aspect ratios

**Tool Token Costs**:
- Conversation: 1 token
- Image Generation: 14 tokens
- Image Restore: 11 tokens
- Background Removal: 17 tokens
- Generative Fill: 20 tokens
- Object Recolor: 16 tokens
- Object Remove: 28 tokens
- Music Generation: 11 tokens
- Speech Generation: 13 tokens
- Code Generation: 5 tokens

**Dependencies**: lucide-react

---

### UI Pages (2 files)

#### `/dashboard_billing/payment-history/page.tsx` (188 lines)
**Purpose**: Server component for payment history page

**Features**:
- Fetches transaction history via `fetchPaymentHistory()`
- Displays in responsive table
- Columns: ID (last 12 chars), Date, Amount, Status
- Empty state message
- Currency formatting

**Data Source**: `Transaction` table filtered by current user

**Layout**: FeatureContainer with gradient header

**Dependencies**: Server components, Prisma, api-limit

---

#### `/dashboard_billing/payment-history/payment-history-client.tsx`
**Purpose**: Client-side wrapper for payment history

**Features**:
- Client-side interactivity
- Data passed from server component

---

### Documentation (2 files)

#### `/docs/SECURE-PROCESSOR_ENV_SETUP.md` (63 lines)
**Purpose**: NetworkX-specific environment variable guide

**Sections**:
1. Required server-side variables
2. Required client-side variables
3. How to add variables in Vercel
4. Fallback configuration
5. Changes made to codebase
6. Testing instructions

**Credentials Listed**:
- Shop ID: 29959
- Secret Key: (example provided)
- API URL: https://checkout.secure-processorpay.com
- Public Key: (full RSA key)

---

#### `/docs/ENV_SETUP.md` (65 lines)
**Purpose**: General environment setup guide

**Sections**:
1. Required environment variables
2. Database provider options (Neon, Supabase, Planetscale)
3. Clerk authentication setup
4. Local development instructions
5. Migration commands

**Database Providers**:
- ✅ Neon (PostgreSQL) - Recommended
- ✅ Supabase (PostgreSQL)
- ✅ Planetscale (MySQL)
- ❌ SQLite (not for production)

---

## Summary Statistics

### Total Files: 25

**By Type**:
- TypeScript/TSX: 18 files
- SQL Migrations: 3 files
- Prisma Schema: 1 file
- Markdown Docs: 5 files

**By Category**:
- API Routes: 4 files (227 + 340 + 186 + 137 = 890 lines)
- Database: 4 files (37 + 15 + 2 + 17 = 71 lines)
- Components: 5 files (375 + 24 + 50 + 254 + 337 = 1,040 lines)
- Business Logic: 3 files (28 + 150 + 166 = 344 lines)
- Configuration: 3 files (19 + 256 + 407 = 682 lines)
- UI Pages: 2 files (188+ lines)
- Documentation: 5 files (63 + 65 + this file + 2 reports)

**Total Lines of Code**: ~3,200+ lines (excluding documentation)

---

## Critical Files for Payment Flow

### Payment Initiation
1. `components/pro-modal.tsx` - User interface
2. `components/landing/pricing.tsx` - Pricing packages
3. `payment/secure-processor/route.ts` - API integration

### Payment Processing
4. `webhooks/secure-processor/route.ts` - Primary webhook handler
5. `lib/actions/user.actions.ts` - User management
6. `prisma/schema.prisma` - Data models

### Token Management
7. `lib/api-limit.ts` - Balance operations
8. `constants.ts` - Pricing configuration
9. `constants/index.ts` - Currency rates

### Receipt & Email
10. `lib/receiptGeneration.tsx` - PDF generation
11. `components/pdf/receipt.tsx` - Receipt template
12. `config/nodemailer.ts` - Email delivery

---

## Dependencies Matrix

| File | Prisma | Clerk | Nodemailer | React PDF | Crypto |
|------|--------|-------|------------|-----------|--------|
| webhooks/secure-processor/route.ts | ✅ | ❌ | ✅ | ✅ | ✅ |
| webhooks/payment/route.ts | ✅ | ❌ | ✅ | ✅ | ✅ |
| webhooks/clerk/route.ts | ✅ | ✅ | ❌ | ❌ | ❌ |
| payment/secure-processor/route.ts | ❌ | ❌ | ❌ | ❌ | ✅ |
| lib/api-limit.ts | ✅ | ✅ | ❌ | ❌ | ❌ |
| lib/actions/user.actions.ts | ✅ | ❌ | ❌ | ❌ | ❌ |
| lib/receiptGeneration.tsx | ❌ | ❌ | ❌ | ✅ | ❌ |
| components/pro-modal.tsx | ❌ | ✅ | ❌ | ❌ | ❌ |
| config/nodemailer.ts | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## Import Instructions Quick Reference

1. **Copy all files** from this archive to your project
2. **Install dependencies**: `npm install` (see PAYMENTS_SETUP_REPORT.md)
3. **Set environment variables** (see .env.example)
4. **Run migrations**: `npx prisma migrate deploy`
5. **Update domain references** in API routes
6. **Configure NetworkX webhook** in dashboard
7. **Test in development** with test cards
8. **Deploy to production** and verify

---

## Related Documentation

- **REPORT.md** - Detailed system analysis
- **PAYMENTS_SETUP_REPORT.md** - Complete setup guide
- **docs/SECURE-PROCESSOR_ENV_SETUP.md** - NetworkX configuration
- **docs/ENV_SETUP.md** - General environment setup

---

**File Inventory Generated**: October 24, 2025  
**Archive Version**: 1.0  
**Total Size**: ~3,200 lines of code + documentation

