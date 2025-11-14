# Payment & Token Top-ups System Archive

Complete implementation of a token-based payment system with NetworkX Pay integration, extracted from the yum-mi project.

## 📦 What's Inside

This archive contains **all files** necessary to implement a production-ready payment system with:

✅ Token-based credit management  
✅ Multi-currency support (15+ currencies)  
✅ Automated PDF receipt generation  
✅ Email confirmations with attachments  
✅ Payment history tracking  
✅ Webhook signature verification  
✅ Idempotency protection  
✅ Test/Production mode switching  

## 📋 Quick Start

1. **Read the reports first**:
   - `REPORT.md` - System analysis & data sink documentation
   - `PAYMENTS_SETUP_REPORT.md` - Complete setup guide with code examples

2. **Review the file inventory**:
   - `FILE_INVENTORY.md` - Detailed list of all 25 files with descriptions

3. **Follow the import instructions** in `PAYMENTS_SETUP_REPORT.md`

## 📊 Database Sinks

### User Table
**Tracks token balances**:
- `availableGenerations` - Total tokens available
- `usedGenerations` - Tokens consumed
- **Net Balance**: `availableGenerations - usedGenerations`

**Write Paths**:
- `webhooks/secure-processor/route.ts:194-200` - Updates after successful payment
- `lib/actions/user.actions.ts:30-40` - Creates new users with 10 free tokens
- `lib/api-limit.ts:19-23` - Deducts tokens when using AI features

### Transaction Table
**Records all payments**:
- `tracking_id` - Unique transaction identifier
- `userId` - User who made payment (Clerk ID)
- `amount` - Payment amount in cents
- `currency` - Currency code (GBP, USD, EUR, etc.)
- `status` - Payment status (successful, failed, pending, etc.)
- `description` - Payment description (includes token count)
- `paid_at` - Payment timestamp

**Write Paths**:
- `webhooks/secure-processor/route.ts:218-221` - Creates transaction record after payment
- `webhooks/payment/route.ts:94-108` - Legacy webhook handler

## 🗂️ Directory Structure

```
payments_token_topups/
├── README.md                    ⬅️ You are here
├── REPORT.md                    📊 System analysis
├── PAYMENTS_SETUP_REPORT.md     📖 Complete setup guide
├── FILE_INVENTORY.md            📋 Detailed file list
├── payment/                     💳 Payment API routes
├── webhooks/                    🔔 Webhook handlers
├── prisma/                      🗄️ Database schema & migrations
├── components/                  🎨 React UI components
├── lib/                         📚 Business logic
├── config/                      ⚙️ Configuration files
├── constants/                   📐 Constants & pricing
├── dashboard_billing/           📈 Payment history UI
└── docs/                        📝 Setup documentation
```

## 🔑 Key Files

### Payment Flow
1. **`components/pro-modal.tsx`** - Payment UI modal
2. **`payment/secure-processor/route.ts`** - Creates payment session
3. **`webhooks/secure-processor/route.ts`** - Processes payment webhook
4. **`lib/api-limit.ts`** - Manages token balance

### Database
5. **`prisma/schema.prisma`** - User & Transaction models
6. **`prisma/migrations/`** - Database migrations

### Receipt Generation
7. **`components/pdf/receipt.tsx`** - PDF template
8. **`lib/receiptGeneration.tsx`** - PDF generator
9. **`config/nodemailer.ts`** - Email sender

### Configuration
10. **`constants.ts`** - Pricing & tool costs
11. **`constants/index.ts`** - Currencies & exchange rates

## 💰 Pricing Model

### Base Rate
**£0.20 per token** (GBP)

### Preset Packages
| Package | Price | Tokens | Discount |
|---------|-------|--------|----------|
| Tracker | £20 | 100 | Standard |
| Master Chef | £40 | 220 | 10% off |
| Master Nutritionist | £60 | 360 | 20% off |

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

## 🔒 Security Features

✅ HMAC SHA256 webhook signature verification  
✅ Idempotency checks (prevents duplicate charges)  
✅ Server-side amount validation  
✅ Secure environment variable storage  
✅ Test mode for safe development  
✅ Database foreign key constraints  
✅ RSA signature verification (legacy)  

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (via Prisma ORM)
- **Payment Gateway**: NetworkX Pay (Hosted Payment Page API v2)
- **Authentication**: Clerk
- **Email**: Nodemailer (SMTP)
- **PDF Generation**: @react-pdf/renderer
- **Forms**: react-hook-form + zod
- **UI**: Tailwind CSS + Headless UI + Framer Motion

## 📦 Dependencies

```bash
npm install @clerk/nextjs @prisma/client @react-pdf/renderer nodemailer zod react-hook-form @hookform/resolvers framer-motion axios react-hot-toast
npm install -D prisma @types/nodemailer
```

## 🚀 Quick Setup Checklist

### Phase 1: Environment Setup
- [ ] Copy all files to your project
- [ ] Install dependencies (`npm install`)
- [ ] Set up PostgreSQL database (Neon/Supabase)
- [ ] Configure environment variables

### Phase 2: Database
- [ ] Update `DATABASE_URL` in `.env`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate deploy`

### Phase 3: Payment Gateway
- [ ] Sign up for NetworkX Pay account
- [ ] Get Shop ID and Secret Key
- [ ] Configure webhook URL in NetworkX dashboard
- [ ] Add credentials to `.env`

### Phase 4: Email
- [ ] Choose SMTP provider (Titan Email recommended)
- [ ] Configure SMTP credentials in `.env`
- [ ] Test email sending

### Phase 5: Customization
- [ ] Update domain references in API routes
- [ ] Update company info in receipt template
- [ ] Update pricing tiers (optional)
- [ ] Update branding (logo, colors)

### Phase 6: Testing
- [ ] Test payment flow with test cards
- [ ] Verify webhook processing
- [ ] Check token balance updates
- [ ] Confirm receipt emails
- [ ] Review payment history

### Phase 7: Production
- [ ] Set `SECURE-PROCESSOR_TEST_MODE=false`
- [ ] Update webhook URL to production
- [ ] Deploy to Vercel/production
- [ ] Test with real payment (small amount)
- [ ] Monitor logs and transactions

## 📊 Data Queries

### Get User Token Balance
```typescript
const user = await prismadb.user.findUnique({
  where: { clerkId: userId },
  select: {
    availableGenerations: true,
    usedGenerations: true,
  },
});
const balance = user.availableGenerations - user.usedGenerations;
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
  SUM(amount) / 100 as total_amount,
  COUNT(*) as transaction_count,
  currency
FROM Transaction
WHERE status = 'successful'
GROUP BY currency;
```

## 🔍 Where Payments Are Recorded

### User Balance Updates
**File**: `webhooks/secure-processor/route.ts`  
**Lines**: 194-200  
**Database**: `User` table  
**Fields**: `availableGenerations`, `usedGenerations`

```typescript
await prismadb.user.update({
  where: { clerkId: userId },
  data: {
    availableGenerations: user.availableGenerations - user.usedGenerations + tokens,
    usedGenerations: 0,
  },
});
```

### Transaction Records
**File**: `webhooks/secure-processor/route.ts`  
**Lines**: 218-221  
**Database**: `Transaction` table  
**Fields**: All transaction details

```typescript
await prismadb.transaction.create({
  data: {
    tracking_id, userId, status, amount, currency,
    description, type, payment_method_type,
    message, paid_at, receipt_url
  },
});
```

## 🌐 API Endpoints

### Payment Creation
```
POST /api/payment/secure-processor
Body: { amount, currency, orderId, description, customerEmail }
Response: { success, token, redirect_url, checkout_id }
```

### Payment Status Check
```
GET /api/payment/secure-processor?token=xxx
Response: { success, status, transaction }
```

### Webhook Handler
```
POST /api/webhooks/secure-processor
Body: NetworkX webhook payload
Response: { status: "ok" }
```

## 📧 Email Notifications

**Provider**: Titan Email (or any SMTP)  
**Port**: 465 (SSL/TLS)  
**Format**: Plain text + PDF attachment

**Email Contents**:
- Transaction confirmation
- PDF receipt with branding
- Company contact information
- Support email link

## 🧪 Testing

### Test Cards (NetworkX Sandbox)
- **Success**: 4111 1111 1111 1111 (12/25, CVV 123)
- **Declined**: 4000 0000 0000 0002 (12/25, CVV 123)
- **Expired**: 4000 0000 0000 0069 (12/25, CVV 123)

### Test Mode
Set `SECURE-PROCESSOR_TEST_MODE=true` in `.env` to use sandbox environment.

## 📞 Support

**Original Implementation**: yum-mi.com  
**Company**: QUICK FIT LTD (Company #15995367)  
**Address**: DEPT 2, 43 OWSTON ROAD, CARCROFT, DONCASTER, UNITED KINGDOM, DN6 8DA

## 📚 Documentation Files

1. **REPORT.md** - Comprehensive system analysis with:
   - Database sink documentation
   - File paths and line numbers
   - Payment flow sequence
   - Security implementation details

2. **PAYMENTS_SETUP_REPORT.md** - Complete setup guide with:
   - Environment variables (with descriptions)
   - API endpoint specifications
   - Webhook payload formats
   - Code examples for all components
   - Step-by-step import instructions
   - Testing guide
   - Troubleshooting tips

3. **FILE_INVENTORY.md** - Detailed file listing with:
   - Purpose of each file
   - Key functions and exports
   - Dependencies matrix
   - Line counts and statistics

4. **docs/SECURE-PROCESSOR_ENV_SETUP.md** - NetworkX-specific configuration
5. **docs/ENV_SETUP.md** - General environment setup

## 🎯 Use Cases

This payment system is ideal for:

- ✅ SaaS applications with credit/token systems
- ✅ AI/ML platforms with usage-based pricing
- ✅ API services with prepaid credits
- ✅ Digital content platforms
- ✅ Any application requiring token purchases

## ⚠️ Important Notes

1. **Test thoroughly** before going to production
2. **Backup database** before running migrations
3. **Verify webhook URL** is publicly accessible
4. **Keep secrets secure** (never commit .env files)
5. **Monitor webhook logs** for debugging
6. **Set up error tracking** (Sentry/Bugsnag)
7. **Review legal requirements** (Terms, Privacy Policy)

## 📈 Statistics

- **Total Files**: 25
- **Lines of Code**: ~3,200+ (excluding docs)
- **API Routes**: 4 files (890 lines)
- **Components**: 5 files (1,040 lines)
- **Database Files**: 4 files (4 migration files + schema)
- **Documentation**: 5 markdown files

## 🔄 Next Steps

1. Read `PAYMENTS_SETUP_REPORT.md` thoroughly
2. Set up your development environment
3. Copy files to your project
4. Configure environment variables
5. Test in development
6. Deploy to production
7. Monitor and iterate

---

**Version**: 1.0  
**Generated**: October 24, 2025  
**Source**: yum-mi.com payment system  
**License**: [Add your license here]

For detailed implementation instructions, see **PAYMENTS_SETUP_REPORT.md**.

