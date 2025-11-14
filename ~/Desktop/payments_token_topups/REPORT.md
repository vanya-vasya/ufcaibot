# Payment & Token Top-ups Analysis Report

## Executive Summary

This repository implements a comprehensive token-based payment system using NetworkX Pay (formerly known as Secure-Processor Pay) as the payment gateway. The system tracks user token purchases, manages user balances, generates PDF receipts, and sends email confirmations.

---

## Database Sinks & Data Storage

### Primary Database: PostgreSQL (Neon/Vercel)
**Connection**: Via Prisma ORM

### Tables & Schema

#### 1. **User Table** (`prisma/schema.prisma`)
Tracks user account data and token balance:

```prisma
model User {
  id                   String        @id @default(cuid())
  clerkId              String        @unique
  email                String        @unique
  photo                String
  firstName            String?
  lastName             String?
  usedGenerations      Int           @default(0)
  availableGenerations Int           @default(20)
  transactions         Transaction[]
}
```

**Token Top-up Data Sinks**:
- `availableGenerations`: Total tokens available to user (includes free + purchased)
- `usedGenerations`: Tokens consumed by user actions
- **Net Balance**: `availableGenerations - usedGenerations`

**Database Write Paths**:
1. `/app/api/webhooks/secure-processor/route.ts` (lines 194-200) - Updates token balance after successful payment
2. `/app/api/webhooks/payment/route.ts` (lines 81-90) - Legacy webhook handler
3. `/lib/actions/user.actions.ts` (lines 30-40) - Creates new users with 10 free tokens

#### 2. **Transaction Table** (`prisma/schema.prisma`)
Records all payment transactions:

```prisma
model Transaction {
  id                  String    @id @default(cuid())
  tracking_id         String
  userId              String
  status              String?
  amount              Int?       # Amount in cents/minor units
  currency            String?
  description         String?
  type                String?
  payment_method_type String?
  message             String?
  paid_at             DateTime?
  receipt_url         String?
  user                User      @relation(fields: [userId], references: [clerkId])
}
```

**Database Write Paths**:
1. `/app/api/webhooks/secure-processor/route.ts` (lines 218-221) - Main webhook creates transaction record
2. `/app/api/webhooks/payment/route.ts` (lines 94-108) - Legacy webhook handler

**Migration Files**:
- `prisma/migrations/20240523115036_create_table/migration.sql` - Initial User table
- `prisma/migrations/20250123151835_add_20_gen/migration.sql` - Set default tokens to 20
- `prisma/migrations/20250123152000_add_transactions/migration.sql` - Create Transaction table

---

## Payment System Architecture

### Payment Flow Sequence

```
1. User clicks "Buy More" → Opens ProModal
2. User selects tokens + currency → Calculates price
3. User submits form → Shows NetworkPaymentWidget
4. Widget calls /api/payment/secure-processor (POST)
5. API creates checkout session with NetworkX
6. User redirected to NetworkX hosted payment page
7. User completes payment
8. NetworkX sends webhook to /api/webhooks/secure-processor (POST)
9. Webhook verifies signature, updates DB:
   - Creates Transaction record
   - Updates User token balance
   - Generates PDF receipt
   - Sends email with receipt
10. User redirected to /dashboard
```

---

## File Inventory

### API Routes (Backend)

#### Payment Initialization
- **`app/api/payment/secure-processor/route.ts`** (227 lines)
  - **POST**: Creates payment checkout session
  - **GET**: Checks payment status
  - Integrates with NetworkX Pay API v2
  - Handles amount conversion (major units → cents)
  - Returns redirect URL for hosted payment page

#### Webhook Handlers
- **`app/api/webhooks/secure-processor/route.ts`** (340 lines)
  - **PRIMARY WEBHOOK**: Handles NetworkX payment notifications
  - Supports two webhook formats (Direct API & HPP)
  - **Database Writes**:
    - Lines 194-200: Updates `User.availableGenerations`
    - Lines 218-221: Creates `Transaction` record
  - Implements idempotency checks (prevents duplicate charges)
  - Generates PDF receipts
  - Sends email confirmations
  
- **`app/api/webhooks/payment/route.ts`** (186 lines)
  - **LEGACY WEBHOOK**: Alternative payment webhook (deprecated)
  - Uses RSA signature verification
  - Similar database write logic

- **`app/api/webhooks/clerk/route.ts`** (137 lines)
  - Handles user authentication events (create/update/delete)
  - Not directly payment-related but creates user records

### Frontend Components

#### Payment UI
- **`components/pro-modal.tsx`** (375 lines)
  - Main payment modal dialog
  - Token amount input
  - Currency selector (15+ currencies supported)
  - Price calculator
  - Terms & conditions checkbox
  - Embeds `NetworkPaymentWidget`

- **`components/buy-generations.tsx`** (24 lines)
  - "Buy More" button component
  - Opens ProModal

- **`components/free-counter.tsx`** (50 lines)
  - Displays token usage progress bar
  - Shows available vs used tokens
  - "Buy More" button

- **`components/landing/pricing.tsx`** (337 lines)
  - Public pricing page
  - 3 preset packages + custom amount
  - **Pricing Tiers**:
    - Tracker: £20 / 100 tokens
    - Master Chef: £40 / 220 tokens (10% discount)
    - Master Nutritionist: £60 / 360 tokens (20% discount)
    - Custom Amount: £0.20/token

#### Payment History
- **`app/(dashboard)/dashboard/billing/payment-history/page.tsx`** (188 lines)
  - Displays transaction history table
  - Columns: ID, Date, Amount, Status
  - Fetches from `Transaction` table

- **`app/(dashboard)/dashboard/billing/payment-history/payment-history-client.tsx`**
  - Client-side rendering for payment history

### Receipt Generation
- **`lib/receiptGeneration.tsx`** (28 lines)
  - Generates PDF receipts using `@react-pdf/renderer`
  
- **`components/pdf/receipt.tsx`** (254 lines)
  - PDF receipt template
  - Company branding
  - Transaction details
  - Legal information

### Business Logic
- **`lib/api-limit.ts`** (150 lines)
  - **Token Management Functions**:
    - `incrementApiLimit()`: Deducts tokens after AI generation
    - `checkApiLimit()`: Validates sufficient balance
    - `getApiAvailableGenerations()`: Returns current balance
    - `getApiUsedGenerations()`: Returns consumed tokens
    - `fetchPaymentHistory()`: Retrieves transactions
  
- **`lib/actions/user.actions.ts`** (166 lines)
  - User CRUD operations
  - `createOrGetUser()`: Creates user with 10 free tokens
  - `updateCredits()`: Manual token adjustment

### Configuration
- **`config/nodemailer.ts`** (19 lines)
  - Email transporter setup
  - SMTP configuration (Titan Email)

- **`constants.ts`** (407 lines)
  - Token pricing: `GENERATIONS_PRICE = 0.20` (GBP)
  - Tool costs (various AI features)

- **`constants/index.ts`** (256 lines)
  - Currency conversion rates (15 currencies)
  - NetworkX Public Key for webhook verification
  - Payment configuration constants

### Documentation
- **`docs/SECURE-PROCESSOR_ENV_SETUP.md`** (63 lines)
  - Environment variables guide
  - NetworkX credentials
  - Webhook configuration

- **`docs/ENV_SETUP.md`** (65 lines)
  - General environment setup
  - Database configuration
  - Clerk authentication setup

---

## Database Write Operations Summary

### Who Topped Up How Much?

**Query Path**: `Transaction` table
```sql
SELECT 
  userId,
  amount,
  currency,
  description,
  paid_at,
  status
FROM Transaction
WHERE status IN ('successful', 'completed', 'success')
ORDER BY paid_at DESC;
```

**Extracted Token Count**: Regex pattern in webhook
```typescript
const match = description.match(/\((\d+)\s+Tokens\)/i);
const tokens = parseInt(match[1]);
```

**User Balance Update Logic** (`app/api/webhooks/secure-processor/route.ts:194-200`):
```typescript
await prismadb.user.update({
  where: { clerkId: userId },
  data: {
    availableGenerations: user.availableGenerations - user.usedGenerations + tokens,
    usedGenerations: 0,
  },
});
```

**Key Write Locations**:
1. **Transaction Creation**: `/app/api/webhooks/secure-processor/route.ts:218-221`
2. **User Balance Update**: `/app/api/webhooks/secure-processor/route.ts:194-200`
3. **Token Deduction**: `/lib/api-limit.ts:19-23` (when using AI features)

---

## Payment Gateway Details

### Provider: NetworkX Pay (https://secure-processorpay.com)

**API Endpoint**: `https://checkout.secure-processorpay.com/ctp/api/checkouts`

**Authentication**: HTTP Basic Auth
- Shop ID: `29959`
- Secret Key: (stored in env vars)

**Webhook URL**: `https://www.yum-mi.com/api/webhooks/secure-processor`

**Return URL**: `https://www.yum-mi.com/dashboard`

**Security**:
- HMAC SHA256 signature verification
- Idempotency checks (prevents duplicate charges)
- Test mode support

---

## Pricing Model

### Base Rate
- **£0.20 per token** (GBP)
- Converted to 15+ currencies dynamically

### Preset Packages (with discounts)
| Package | Price | Tokens | Effective Rate | Discount |
|---------|-------|--------|----------------|----------|
| Tracker | £20 | 100 | £0.20/token | Standard |
| Master Chef | £40 | 220 | £0.18/token | 10% |
| Master Nutritionist | £60 | 360 | £0.17/token | 20% |

### Token Usage Costs
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

---

## Security Features

1. **Webhook Signature Verification**: HMAC SHA256
2. **Idempotency**: Duplicate transaction detection
3. **Amount Validation**: Server-side price calculation
4. **User Authentication**: Clerk integration
5. **Database Constraints**: Unique indices, foreign keys
6. **Test Mode**: Separate sandbox environment

---

## Email Notifications

**SMTP Provider**: Titan Email (smtp.titan.email:465)

**Sent Emails**:
1. Payment receipt with PDF attachment
2. Transaction confirmation
3. Company contact information

**Email Template**: Plain text with PDF receipt attachment

---

## Dependencies

### Payment-Related NPM Packages
```json
{
  "@prisma/client": "^5.x",
  "@react-pdf/renderer": "^3.x",
  "nodemailer": "^6.x",
  "crypto": "built-in",
  "zod": "^3.x",
  "@clerk/nextjs": "^4.x"
}
```

---

## Rationale for File Selection

All files in this archive are directly involved in:
1. **Payment Processing**: API routes, webhook handlers
2. **Token Management**: Balance tracking, deduction logic
3. **UI Components**: Payment modals, pricing pages, history views
4. **Data Persistence**: Database schema, migrations
5. **Receipt Generation**: PDF creation, email delivery
6. **Configuration**: Environment variables, constants, credentials

**Exclusion Criteria**: Files related to AI features, authentication (Clerk), or general UI components were excluded unless directly referenced by payment logic.

---

## Database Query Examples

### Get User Token Balance
```typescript
const user = await prismadb.user.findUnique({
  where: { clerkId: userId },
  select: {
    availableGenerations: true,
    usedGenerations: true,
  },
});
const netBalance = user.availableGenerations - user.usedGenerations;
```

### Get User Transaction History
```typescript
const transactions = await prismadb.transaction.findMany({
  where: { userId: clerkId },
  orderBy: { paid_at: 'desc' },
});
```

### Get Total Revenue
```sql
SELECT 
  SUM(amount) as total_cents,
  COUNT(*) as transaction_count,
  currency
FROM Transaction
WHERE status = 'successful'
GROUP BY currency;
```

---

## Support & Maintenance

**Company**: QUICK FIT LTD (Company #15995367)  
**Support Email**: support@yum-mi.com  
**Website**: https://www.yum-mi.com  
**Address**: DEPT 2, 43 OWSTON ROAD, CARCROFT, DONCASTER, UNITED KINGDOM, DN6 8DA

---

*Report generated on October 24, 2025*

