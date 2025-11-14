# Comprehensive Payments Setup Report
## Token-Based Payment System with NetworkX Pay

**Version**: 1.0  
**Last Updated**: October 24, 2025  
**Framework**: Next.js 14+ (App Router)  
**Database**: PostgreSQL (via Prisma ORM)  
**Payment Gateway**: NetworkX Pay (Hosted Payment Page API v2)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Environment Variables](#environment-variables)
3. [Database Schema & Migrations](#database-schema--migrations)
4. [Payment Gateway Configuration](#payment-gateway-configuration)
5. [API Endpoints](#api-endpoints)
6. [Webhook Implementation](#webhook-implementation)
7. [Frontend Components](#frontend-components)
8. [Receipt Generation](#receipt-generation)
9. [Email Configuration](#email-configuration)
10. [Security Implementation](#security-implementation)
11. [Dependencies & Installation](#dependencies--installation)
12. [Step-by-Step Import Instructions](#step-by-step-import-instructions)
13. [Testing Guide](#testing-guide)
14. [Troubleshooting](#troubleshooting)

---

## System Overview

### Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   User UI   │─────→│   Next.js    │─────→│  NetworkX   │
│  (Browser)  │      │   Backend    │      │   Pay API   │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ↓
                     ┌──────────────┐
                     │  PostgreSQL  │
                     │   Database   │
                     └──────────────┘
                            │
                            ↓
                     ┌──────────────┐
                     │    Email     │
                     │   (SMTP)     │
                     └──────────────┘
```

### Key Features

✅ Token-based credit system  
✅ Multiple currency support (15+ currencies)  
✅ Preset pricing packages with discounts  
✅ Custom amount payments  
✅ Automated PDF receipt generation  
✅ Email confirmations with attachments  
✅ Payment history tracking  
✅ Webhook signature verification  
✅ Idempotency protection  
✅ Test/Production mode switching  

---

## Environment Variables

### Required Variables

#### **Payment Gateway Credentials**

```env
# NetworkX Pay Configuration
SECURE-PROCESSOR_SHOP_ID=29959
SECURE-PROCESSOR_SECRET_KEY=your_secret_key_here
SECURE-PROCESSOR_API_URL=https://checkout.secure-processorpay.com
SECURE-PROCESSOR_TEST_MODE=false
SECURE-PROCESSOR_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Hskkcbbus+LFkyD1NdJHu5ZcV2X/01b3jHhlA6vTFSPpNYnHq8Y3WEe7jrSc44PsR0kGibMjZJAB+S1vyZrI/c1OJKk0njXU59ofyRVR6fTkpytwIXqALweGKfWmmSxpJDJXGt+m0sQyG+UjYunHNY6Qw4ARO5+MWNT2GVpbuAEQ+sOksYWjUi9ftEhlcFeFGhO25/eqbV/QtnbqBXjZj3TsCUM1mQY/F9PhXj8Ku6T1vi/Av+Tf4dgyEsch57DTWZa7hMfp663UpaDLNk7Zd90nztYhjPrN9/AWrqyQQ9IKZHpco2iPLbqM8iloi4n5wSTIfWSVR8bZ1kWPhhoAQIDAQAB

# Production URLs (replace with your domain)
SECURE-PROCESSOR_RETURN_URL=https://www.yourdomain.com/dashboard
SECURE-PROCESSOR_CANCEL_URL=https://www.yourdomain.com/payment/cancel
SECURE-PROCESSOR_WEBHOOK_URL=https://www.yourdomain.com/api/webhooks/secure-processor
```

#### **Database Configuration**

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Example for Neon
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Example for Supabase
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

#### **Email/SMTP Configuration**

```env
# SMTP Server Details
OUTBOX_EMAIL=noreply@yourdomain.com
OUTBOX_EMAIL_PASSWORD=your_smtp_password
INBOX_EMAIL=support@yourdomain.com

# SMTP Provider Details (example: Titan Email)
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_SECURE=true
```

#### **Authentication (Clerk)**

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
WEBHOOK_SECRET=whsec_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### **App Configuration**

```env
# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://www.yourdomain.com
```

### Environment Variable Scopes

| Variable | Scope | Required | Purpose |
|----------|-------|----------|---------|
| `SECURE-PROCESSOR_SHOP_ID` | Server | Yes | Merchant identifier |
| `SECURE-PROCESSOR_SECRET_KEY` | Server | Yes | API authentication |
| `SECURE-PROCESSOR_API_URL` | Server | Yes | Payment gateway endpoint |
| `SECURE-PROCESSOR_TEST_MODE` | Server | Yes | Test/production toggle |
| `SECURE-PROCESSOR_PUBLIC_KEY` | Both | Yes | Webhook signature verification |
| `DATABASE_URL` | Server | Yes | Database connection |
| `OUTBOX_EMAIL` | Server | Yes | Email sender address |
| `OUTBOX_EMAIL_PASSWORD` | Server | Yes | SMTP password |
| `CLERK_SECRET_KEY` | Server | Yes | Auth backend key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Yes | Auth frontend key |
| `WEBHOOK_SECRET` | Server | Yes | Clerk webhook verification |

### Setting Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate scope:
   - **Production**: Live environment
   - **Preview**: Staging/PR previews
   - **Development**: Local development
4. Click **Save**
5. Redeploy your application

---

## Database Schema & Migrations

### Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model - tracks account and token balance
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

// Transaction model - payment history
model Transaction {
  id                  String    @id @default(cuid())
  tracking_id         String
  userId              String
  status              String?
  amount              Int?       // Amount in cents
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

### Migration Files

#### 1. Create User Table

`prisma/migrations/20240523115036_create_table/migration.sql`:

```sql
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "clerkId" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "photo" TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "usedGenerations" INTEGER DEFAULT 0 NOT NULL,
  "availableGenerations" INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkId_key" ON "User" ("clerkId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");
```

#### 2. Set Default Tokens

`prisma/migrations/20250123151835_add_20_gen/migration.sql`:

```sql
ALTER TABLE "User" ALTER COLUMN "availableGenerations" SET DEFAULT 20;
```

#### 3. Create Transaction Table

`prisma/migrations/20250123152000_add_transactions/migration.sql`:

```sql
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT,
    "amount" INTEGER,
    "currency" TEXT,
    "description" TEXT,
    "type" TEXT,
    "payment_method_type" TEXT,
    "message" TEXT,
    "paid_at" TIMESTAMP(3),
    "receipt_url" TEXT,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") 
ON DELETE RESTRICT ON UPDATE CASCADE;
```

### Running Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations in development
npx prisma migrate dev

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Payment Gateway Configuration

### NetworkX Pay Setup

#### 1. Create Merchant Account
1. Visit https://secure-processorpay.com
2. Sign up for merchant account
3. Complete KYC verification
4. Note your Shop ID and Secret Key

#### 2. Configure Webhooks
In NetworkX merchant dashboard:
- **Webhook URL**: `https://yourdomain.com/api/webhooks/secure-processor`
- **Events**: All payment events
- **Signature Method**: HMAC SHA256

#### 3. API Integration Details

**Base URL**: `https://checkout.secure-processorpay.com`

**Authentication**: HTTP Basic Auth
```
Authorization: Basic base64(SHOP_ID:SECRET_KEY)
```

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Basic <base64_credentials>",
  "X-API-Version": "2"
}
```

### Webhook Payload Formats

NetworkX sends webhooks in two formats:

#### Format 1: Direct Transaction API
```json
{
  "transaction": {
    "uid": "abc123",
    "tracking_id": "gen_user_xxx_1234567890",
    "status": "successful",
    "amount": 2000,
    "currency": "GBP",
    "description": "Payment for 100 Tokens (100 Tokens)",
    "type": "payment",
    "payment_method_type": "credit_card",
    "customer": {
      "email": "user@example.com"
    },
    "paid_at": "2025-01-23T10:30:00Z",
    "receipt_url": "https://receipt.url"
  }
}
```

#### Format 2: Hosted Payment Page (HPP)
```json
{
  "checkout": {
    "token": "abc123",
    "status": "successful",
    "test": false,
    "order": {
      "tracking_id": "gen_user_xxx_1234567890",
      "amount": 2000,
      "currency": "GBP",
      "description": "Payment for 100 Tokens (100 Tokens)"
    },
    "customer": {
      "email": "user@example.com"
    },
    "transaction": {
      "type": "payment",
      "payment_method_type": "credit_card",
      "paid_at": "2025-01-23T10:30:00Z"
    }
  }
}
```

### Signature Verification

```typescript
function verifyWebhookSignature(
  data: Record<string, any>, 
  signature: string, 
  secretKey: string
): boolean {
  // Remove signature from data
  const { signature: _, ...dataForSignature } = data;

  // Sort parameters by key
  const sortedParams = Object.keys(dataForSignature)
    .sort()
    .reduce((obj: Record<string, any>, key) => {
      obj[key] = dataForSignature[key];
      return obj;
    }, {});

  // Create signature string
  const signString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Generate HMAC SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(signString)
    .digest('hex');

  return expectedSignature === signature;
}
```

---

## API Endpoints

### 1. Create Payment Checkout

**File**: `app/api/payment/secure-processor/route.ts`

**Endpoint**: `POST /api/payment/secure-processor`

**Request Body**:
```typescript
{
  amount: number;        // Major units (e.g., 20.00)
  currency: string;      // ISO code (e.g., "GBP")
  orderId: string;       // Unique transaction ID
  description: string;   // Must include "(X Tokens)" pattern
  customerEmail: string; // User email
}
```

**Response**:
```typescript
{
  success: true,
  token: "checkout_token_abc123",
  redirect_url: "https://checkout.secure-processorpay.com/pay/abc123",
  checkout_id: "checkout_token_abc123"
}
```

**Implementation**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'GBP', orderId, description, customerEmail } = body;
    
    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const shopId = process.env.SECURE-PROCESSOR_SHOP_ID;
    const secretKey = process.env.SECURE-PROCESSOR_SECRET_KEY;
    const apiUrl = process.env.SECURE-PROCESSOR_API_URL || 'https://checkout.secure-processorpay.com';
    const testMode = process.env.SECURE-PROCESSOR_TEST_MODE === 'true';
    
    const returnUrl = process.env.SECURE-PROCESSOR_RETURN_URL;
    const notificationUrl = process.env.SECURE-PROCESSOR_WEBHOOK_URL;
    
    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);
    
    const requestData = {
      checkout: {
        test: testMode,
        transaction_type: "payment",
        order: {
          amount: amountInCents,
          currency: currency,
          description: description,
          tracking_id: orderId
        },
        customer: {
          email: customerEmail
        },
        settings: {
          return_url: returnUrl,
          notification_url: notificationUrl
        }
      }
    };

    const secure-processorResponse = await fetch(`${apiUrl}/ctp/api/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
        'X-API-Version': '2',
      },
      body: JSON.stringify(requestData),
    });

    if (!secure-processorResponse.ok) {
      const errorData = await secure-processorResponse.text();
      return NextResponse.json(
        { error: 'Failed to create payment token', details: errorData },
        { status: 400 }
      );
    }

    const result = await secure-processorResponse.json();
    
    return NextResponse.json({
      success: true,
      token: result.checkout.token,
      redirect_url: result.checkout.redirect_url,
      checkout_id: result.checkout.token,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Check Payment Status

**Endpoint**: `GET /api/payment/secure-processor?token=xxx`

**Response**:
```typescript
{
  success: true,
  status: "successful",
  transaction: { /* full transaction data */ }
}
```

**Implementation**:

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Payment token is required' },
        { status: 400 }
      );
    }

    const shopId = process.env.SECURE-PROCESSOR_SHOP_ID;
    const secretKey = process.env.SECURE-PROCESSOR_SECRET_KEY;
    const apiUrl = process.env.SECURE-PROCESSOR_API_URL || 'https://checkout.secure-processorpay.com';

    const secure-processorResponse = await fetch(`${apiUrl}/ctp/api/checkouts/${token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
        'X-API-Version': '2',
      },
    });

    const result = await secure-processorResponse.json();

    if (!secure-processorResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to check payment status', details: result },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      transaction: result,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Webhook Implementation

### Webhook Handler

**File**: `app/api/webhooks/secure-processor/route.ts`

**Endpoint**: `POST /api/webhooks/secure-processor`

**Key Functions**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prismadb from '@/lib/prismadb';
import { transporter } from '@/config/nodemailer';
import { generatePdfReceipt } from '@/lib/receiptGeneration';

function verifyWebhookSignature(
  data: Record<string, any>, 
  signature: string, 
  secretKey: string
): boolean {
  const { signature: _, ...dataForSignature } = data;
  
  const sortedParams = Object.keys(dataForSignature)
    .sort()
    .reduce((obj: Record<string, any>, key) => {
      obj[key] = dataForSignature[key];
      return obj;
    }, {});
  
  const signString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(signString)
    .digest('hex');
  
  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secretKey = process.env.SECURE-PROCESSOR_SECRET_KEY;

    // Extract payment data (supports both formats)
    let tracking_id, amount, currency, email, status, transaction, description;
    
    if (body.transaction) {
      // Format 1: Direct transaction
      transaction = body.transaction;
      tracking_id = transaction.tracking_id;
      amount = transaction.amount;
      currency = transaction.currency;
      email = transaction.customer?.email;
      status = transaction.status;
      description = transaction.description;
    } else if (body.checkout) {
      // Format 2: HPP
      const checkout = body.checkout;
      status = checkout.status;
      tracking_id = checkout.order?.tracking_id;
      amount = checkout.order?.amount;
      currency = checkout.order?.currency;
      email = checkout.customer?.email;
      description = checkout.order?.description;
      transaction = checkout.transaction;
    } else {
      return NextResponse.json(
        { error: 'Invalid webhook structure' },
        { status: 400 }
      );
    }

    // Process successful payments
    if (['completed', 'success', 'successful'].includes(status)) {
      // Extract userId from tracking_id
      let userId = tracking_id;
      if (tracking_id.startsWith('gen_user_')) {
        const parts = tracking_id.replace('gen_', '').split('_');
        parts.pop(); // Remove timestamp
        userId = parts.join('_');
      }
      
      // Check for duplicate (idempotency)
      const existingTransaction = await prismadb.transaction.findFirst({
        where: {
          tracking_id: tracking_id,
          userId: userId,
          status: { in: ['completed', 'success', 'successful'] },
        },
      });

      if (existingTransaction) {
        return NextResponse.json({ status: 'ok' }, { status: 200 });
      }
      
      // Get user
      const user = await prismadb.user.findUnique({
        where: { clerkId: userId },
        select: {
          usedGenerations: true,
          availableGenerations: true,
          email: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Extract token count from description
      const match = description.match(/\((\d+)\s+Tokens\)/i);
      if (!match) {
        return NextResponse.json(
          { error: 'Invalid description format' },
          { status: 400 }
        );
      }
      
      const tokens = parseInt(match[1]);

      // Update user balance
      await prismadb.user.update({
        where: { clerkId: userId },
        data: {
          availableGenerations: user.availableGenerations - user.usedGenerations + tokens,
          usedGenerations: 0,
        },
      });

      // Save transaction
      const savedTransaction = await prismadb.transaction.create({
        data: {
          tracking_id: tracking_id,
          userId: userId,
          status: status,
          amount: amount,
          currency: currency,
          description: description,
          type: transaction?.type || 'payment',
          payment_method_type: transaction?.payment_method_type || 'credit_card',
          message: transaction?.message || 'Payment successful',
          paid_at: transaction?.paid_at ? new Date(transaction.paid_at) : new Date(),
          receipt_url: transaction?.receipt_url || null,
        },
      });

      // Generate and send receipt
      try {
        const transactionId = savedTransaction.id.slice(-8);
        const pdfBuffer = await generatePdfReceipt(
          transactionId,
          email,
          new Date().toLocaleDateString('en-GB'),
          tokens,
          description,
          amount,
          currency
        );

        await transporter.sendMail({
          from: process.env.OUTBOX_EMAIL,
          to: email,
          subject: `Receipt #${transactionId} - Token Purchase`,
          text: `Thank you for your purchase of ${tokens} tokens.`,
          attachments: [
            {
              filename: `receipt-${transactionId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
      } catch (emailError) {
        console.error('Failed to send receipt email:', emailError);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
```

### Webhook Security Checklist

✅ Verify signature using HMAC SHA256  
✅ Validate request origin  
✅ Implement idempotency checks  
✅ Return 200 OK immediately  
✅ Process async operations in background  
✅ Log all webhook attempts  
✅ Handle retries gracefully  

---

## Frontend Components

### 1. Payment Modal

**File**: `components/pro-modal.tsx`

**Key Features**:
- Token amount input
- Currency selector
- Price calculator
- Terms checkbox
- Embedded payment widget

**Usage**:

```typescript
import { useProModal } from "@/hooks/use-pro-modal";

function MyComponent() {
  const proModal = useProModal();
  
  return (
    <button onClick={proModal.onOpen}>
      Buy Tokens
    </button>
  );
}
```

### 2. Pricing Page

**File**: `components/landing/pricing.tsx`

**Pricing Tiers**:

```typescript
const pricingTiers = [
  {
    id: "Tracker",
    name: "Your Own Tracker",
    price: "£20",
    tokens: "100 Tokens",
    discount: "Standard Rate",
  },
  {
    id: "master-chef",
    name: "Your Own Chef",
    price: "£40",
    tokens: "220 Tokens",
    discount: "10% Token Discount",
    popular: true,
  },
  {
    id: "master-nutritionist",
    name: "Your Own Nutritionist",
    price: "£60",
    tokens: "360 Tokens",
    discount: "20% Token Discount",
  },
  {
    id: "custom",
    name: "Custom Amount",
    tokenRate: "£0.20 per token",
  }
];
```

### 3. Token Counter

**File**: `components/free-counter.tsx`

**Usage**:

```typescript
<FreeCounter
  apiUsedGenerations={usedTokens}
  apiAvailableGenerations={availableTokens}
/>
```

### 4. Payment History

**File**: `app/(dashboard)/dashboard/billing/payment-history/page.tsx`

**Features**:
- Transaction list
- Date formatting
- Currency display
- Status indicators

---

## Receipt Generation

### PDF Receipt Component

**File**: `components/pdf/receipt.tsx`

**Libraries**: `@react-pdf/renderer`

**Template Structure**:

```typescript
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

const Receipt = ({
  receiptId,
  email,
  date,
  tokens,
  description,
  amount,
  currency,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        {/* Header with logo */}
        <View style={styles.header}>
          <Image src={company.logo} style={styles.headerImage} />
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Receipt from {company.name}</Text>
          <Text style={styles.subtitle}>Receipt #{receiptId}</Text>
        </View>

        {/* Customer info */}
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.label}>Client Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </View>

        {/* Transaction details */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Amount paid</Text>
            <Text style={styles.value}>
              {(amount / 100).toFixed(2)} {currency}
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Date paid</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.block}>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{description}</Text>
            <Text style={styles.itemText}>
              {(amount / 100).toFixed(2)} {currency}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Questions? Contact {company.email}
        </Text>
      </View>

      {/* Company info */}
      <Text style={styles.companyInfo}>
        {company.name} | {company.company}
        {"\n"}
        {company.address}
      </Text>
    </Page>
  </Document>
);
```

### Generate PDF Function

**File**: `lib/receiptGeneration.tsx`

```typescript
import { renderToBuffer } from "@react-pdf/renderer";
import Receipt from "@/components/pdf/receipt";

export async function generatePdfReceipt(
  receiptId: string,
  email: string,
  date: string,
  tokens: number,
  description: string,
  amount: number,
  currency: string
): Promise<Buffer> {
  const pdfBuffer = await renderToBuffer(
    <Receipt
      receiptId={receiptId}
      date={date}
      email={email}
      tokens={tokens}
      description={description}
      amount={amount}
      currency={currency}
    />
  );
  return pdfBuffer;
}
```

---

## Email Configuration

### SMTP Setup

**File**: `config/nodemailer.ts`

```typescript
import nodemailer from "nodemailer";

const email = process.env.OUTBOX_EMAIL;
const pass = process.env.OUTBOX_EMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions = {
  from: email,
  to: process.env.INBOX_EMAIL
};
```

### Email Templates

#### Payment Receipt Email

```typescript
await transporter.sendMail({
  from: process.env.OUTBOX_EMAIL,
  to: customerEmail,
  subject: `Receipt #${transactionId} - Token Purchase`,
  text: `Hi there,

We're excited to welcome you to [Your App] — thanks so much for your recent order!

You'll find your transaction receipt attached to this message. Be sure to keep it in case you need it later.

If you run into any issues, have questions about your token usage, or need guidance, our support team is just an email away at support@yourdomain.com.

With appreciation,
The [Your App] Team
www.yourdomain.com
support@yourdomain.com`,
  attachments: [
    {
      filename: `receipt-${transactionId}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    },
  ],
});
```

### Supported SMTP Providers

| Provider | Host | Port | Secure |
|----------|------|------|--------|
| Titan Email | smtp.titan.email | 465 | Yes |
| Gmail | smtp.gmail.com | 587 | No (TLS) |
| SendGrid | smtp.sendgrid.net | 587 | No (TLS) |
| Mailgun | smtp.mailgun.org | 587 | No (TLS) |
| AWS SES | email-smtp.region.amazonaws.com | 587 | No (TLS) |

---

## Security Implementation

### 1. Webhook Signature Verification

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  data: Record<string, any>, 
  signature: string, 
  secretKey: string
): boolean {
  const { signature: _, ...dataForSignature } = data;
  
  const sortedParams = Object.keys(dataForSignature)
    .sort()
    .reduce((obj, key) => {
      obj[key] = dataForSignature[key];
      return obj;
    }, {});
  
  const signString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(signString)
    .digest('hex');
  
  return expectedSignature === signature;
}
```

### 2. Idempotency Protection

```typescript
// Check for duplicate transaction
const existingTransaction = await prismadb.transaction.findFirst({
  where: {
    tracking_id: tracking_id,
    userId: userId,
    status: { in: ['completed', 'success', 'successful'] },
  },
});

if (existingTransaction) {
  // Return success without creating duplicate
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
```

### 3. Amount Validation

```typescript
// Server-side price calculation
const calculatePrice = (tokens: number, currency: string): number => {
  const basePrice = 0.20; // GBP per token
  const priceInGBP = tokens * basePrice;
  
  if (currency === "GBP") {
    return priceInGBP;
  }
  
  // Convert to target currency
  const exchangeRate = currenciesRate[currency];
  return (priceInGBP / currenciesRate["GBP"]) * exchangeRate;
};
```

### 4. User Authentication

```typescript
import { auth } from "@clerk/nextjs/server";

export async function protectedAction() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  // Proceed with authenticated logic
}
```

### 5. Database Constraints

```sql
-- Unique constraints
CREATE UNIQUE INDEX "User_clerkId_key" ON "User" ("clerkId");
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- Foreign key constraints
ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") 
ON DELETE RESTRICT ON UPDATE CASCADE;
```

### Security Best Practices Checklist

✅ Store secrets in environment variables  
✅ Use HTTPS for all endpoints  
✅ Verify webhook signatures  
✅ Implement rate limiting  
✅ Validate all user inputs  
✅ Use prepared statements (Prisma handles this)  
✅ Enable CORS only for trusted domains  
✅ Log security events  
✅ Implement idempotency  
✅ Use secure session management (Clerk)  

---

## Dependencies & Installation

### NPM Package Requirements

```json
{
  "dependencies": {
    "@clerk/nextjs": "^4.29.0",
    "@headlessui/react": "^1.7.18",
    "@hookform/resolvers": "^3.3.4",
    "@prisma/client": "^5.9.0",
    "@react-pdf/renderer": "^3.1.15",
    "axios": "^1.6.5",
    "crypto": "built-in",
    "framer-motion": "^11.0.3",
    "lucide-react": "^0.312.0",
    "next": "14.1.0",
    "nodemailer": "^6.9.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "react-hot-toast": "^2.4.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/nodemailer": "^6.4.14",
    "@types/react": "^18",
    "prisma": "^5.9.0",
    "typescript": "^5"
  }
}
```

### Installation Steps

```bash
# Install dependencies
npm install

# Install Prisma CLI (if not in devDependencies)
npm install -D prisma

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Build the application
npm run build

# Start production server
npm start
```

### Additional Setup Scripts

Create `scripts/init-db.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

async function initDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');
    
    // Test User table
    await prisma.user.findFirst();
    console.log('✅ Database tables exist');
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
```

Run with: `node scripts/init-db.js`

---

## Step-by-Step Import Instructions

### Phase 1: Database Setup

1. **Create Database**
   ```bash
   # Option 1: Neon (Recommended)
   # Visit https://neon.tech
   # Create project, copy connection string
   
   # Option 2: Supabase
   # Visit https://supabase.com
   # Create project, get PostgreSQL connection string
   ```

2. **Configure Database URL**
   ```bash
   # Add to .env
   DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
   ```

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### Phase 2: Payment Gateway Setup

1. **NetworkX Account**
   - Sign up at https://secure-processorpay.com
   - Complete merchant verification
   - Note Shop ID and Secret Key

2. **Configure Webhook**
   - In NetworkX dashboard, add webhook URL
   - URL: `https://yourdomain.com/api/webhooks/secure-processor`
   - Events: All payment events

3. **Environment Variables**
   ```bash
   # Add to .env
   SECURE-PROCESSOR_SHOP_ID=your_shop_id
   SECURE-PROCESSOR_SECRET_KEY=your_secret_key
   SECURE-PROCESSOR_API_URL=https://checkout.secure-processorpay.com
   SECURE-PROCESSOR_TEST_MODE=true  # Set to false for production
   ```

### Phase 3: Email Setup

1. **Choose SMTP Provider**
   - Titan Email (recommended)
   - Gmail
   - SendGrid
   - AWS SES

2. **Configure SMTP**
   ```bash
   # Add to .env
   OUTBOX_EMAIL=noreply@yourdomain.com
   OUTBOX_EMAIL_PASSWORD=your_smtp_password
   INBOX_EMAIL=support@yourdomain.com
   ```

3. **Test Email**
   ```bash
   node scripts/test-email.js
   ```

### Phase 4: Copy Files

1. **Copy API Routes**
   ```bash
   cp -r payment_token_topups/payment your_project/app/api/
   cp -r payment_token_topups/webhooks your_project/app/api/
   ```

2. **Copy Components**
   ```bash
   cp -r payment_token_topups/components/* your_project/components/
   ```

3. **Copy Library Files**
   ```bash
   cp -r payment_token_topups/lib/* your_project/lib/
   ```

4. **Copy Configuration**
   ```bash
   cp payment_token_topups/config/nodemailer.ts your_project/config/
   cp payment_token_topups/constants.ts your_project/
   cp payment_token_topups/constants/index.ts your_project/constants/
   ```

5. **Copy Prisma Schema**
   ```bash
   cp payment_token_topups/prisma/schema.prisma your_project/prisma/
   cp -r payment_token_topups/prisma/migrations/* your_project/prisma/migrations/
   ```

### Phase 5: Install Dependencies

```bash
npm install @clerk/nextjs @prisma/client @react-pdf/renderer nodemailer zod react-hook-form @hookform/resolvers framer-motion axios react-hot-toast
npm install -D prisma @types/nodemailer
```

### Phase 6: Configure URLs

Update all domain references:

```typescript
// In app/api/payment/secure-processor/route.ts
const returnUrl = 'https://www.YOURDOMAIN.com/dashboard';
const notificationUrl = 'https://www.YOURDOMAIN.com/api/webhooks/secure-processor';

// In components/pdf/receipt.tsx
const company = {
  name: "Your App Name",
  company: "YOUR COMPANY LTD",
  address: "YOUR ADDRESS",
  website: "yourdomain.com",
  email: "support@yourdomain.com",
  logo: "./public/logos/your-logo.png",
  companyNumber: "YOUR_COMPANY_NUMBER",
};
```

### Phase 7: Test in Development

```bash
# Start dev server
npm run dev

# Test payment flow
# 1. Open http://localhost:3000
# 2. Sign in
# 3. Click "Buy More"
# 4. Enter token amount
# 5. Click "Buy Tokens"
# 6. Complete payment with test card
```

### Phase 8: Deploy to Production

```bash
# Push to Git
git add .
git commit -m "Add payment system"
git push

# Deploy to Vercel
vercel --prod

# Update NetworkX webhook URL to production domain
# Test with real payment
```

---

## Testing Guide

### Test Cards (NetworkX Sandbox)

| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| 4111 1111 1111 1111 | 12/25 | 123 | Success |
| 4000 0000 0000 0002 | 12/25 | 123 | Declined |
| 4000 0000 0000 0069 | 12/25 | 123 | Expired |

### Testing Checklist

#### Unit Tests
- [ ] Database connection
- [ ] Prisma queries
- [ ] Token calculation
- [ ] Currency conversion
- [ ] Signature verification

#### Integration Tests
- [ ] Create payment checkout
- [ ] Process webhook
- [ ] Update user balance
- [ ] Generate PDF receipt
- [ ] Send email

#### E2E Tests
- [ ] Full payment flow
- [ ] Payment cancellation
- [ ] Payment failure handling
- [ ] Duplicate payment prevention
- [ ] Receipt generation

### Manual Testing Steps

1. **Test Payment Creation**
   ```bash
   curl -X POST http://localhost:3000/api/payment/secure-processor \
     -H "Content-Type: application/json" \
     -d '{
       "amount": 20,
       "currency": "GBP",
       "orderId": "test_123",
       "description": "Test Payment (100 Tokens)",
       "customerEmail": "test@example.com"
     }'
   ```

2. **Test Webhook**
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/secure-processor \
     -H "Content-Type: application/json" \
     -d '{
       "transaction": {
         "tracking_id": "user_test123_1234567890",
         "status": "successful",
         "amount": 2000,
         "currency": "GBP",
         "description": "Payment (100 Tokens)",
         "customer": { "email": "test@example.com" }
       }
     }'
   ```

3. **Test Email**
   ```bash
   node -e "require('./lib/receiptGeneration').generatePdfReceipt('TEST123', 'test@example.com', '01/01/2025', 100, 'Test', 2000, 'GBP').then(console.log)"
   ```

### Debugging Tips

```typescript
// Enable webhook logging
console.log('═'.repeat(60));
console.log('📥 Webhook Received');
console.log(JSON.stringify(body, null, 2));
console.log('═'.repeat(60));

// Log database writes
console.log('🔍 [DB-WRITE]', {
  transactionId: savedTransaction.id,
  userId: userId,
  tokens: tokens,
  timestamp: new Date().toISOString(),
});
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Problem**: `Cannot connect to database`

**Solutions**:
- Verify `DATABASE_URL` in `.env`
- Check database is accessible
- Ensure SSL mode is correct
- Run `npx prisma generate`

#### 2. Webhook Not Receiving

**Problem**: Payments succeed but tokens not added

**Solutions**:
- Check webhook URL in NetworkX dashboard
- Verify endpoint is publicly accessible
- Check webhook logs
- Ensure signature verification passes
- Test with `curl` directly

#### 3. Email Not Sending

**Problem**: Receipts not received

**Solutions**:
- Verify SMTP credentials
- Check spam folder
- Test with simple email first
- Verify port (465 vs 587)
- Check firewall rules

#### 4. PDF Generation Fails

**Problem**: `Error generating receipt`

**Solutions**:
- Ensure `@react-pdf/renderer` installed
- Check font files exist
- Verify image paths
- Test PDF generation separately

#### 5. Currency Conversion Issues

**Problem**: Wrong amounts displayed

**Solutions**:
- Update exchange rates in `constants/index.ts`
- Verify amount conversion (major → minor units)
- Check rounding logic
- Log intermediate values

### Error Messages

#### `P2002: Unique constraint violation`
**Cause**: Duplicate user/email  
**Fix**: Use `createOrGetUser()` instead of `create()`

#### `Failed to create payment token`
**Cause**: Invalid NetworkX credentials  
**Fix**: Verify `SECURE-PROCESSOR_SHOP_ID` and `SECURE-PROCESSOR_SECRET_KEY`

#### `Invalid signature`
**Cause**: Webhook verification failed  
**Fix**: Check `SECURE-PROCESSOR_SECRET_KEY` matches NetworkX dashboard

#### `User not found`
**Cause**: Payment for non-existent user  
**Fix**: Ensure user created via Clerk webhook first

### Logs to Check

```bash
# Vercel logs
vercel logs --follow

# Database logs
npx prisma studio

# Local logs
tail -f .next/trace

# Webhook logs
curl https://yourdomain.com/api/webhooks/secure-processor
```

---

## Production Checklist

Before going live:

### Security
- [ ] All secrets in environment variables (not hardcoded)
- [ ] HTTPS enabled
- [ ] Webhook signature verification working
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Input validation on all endpoints

### Database
- [ ] Migrations deployed
- [ ] Backups configured
- [ ] Connection pooling enabled
- [ ] Indices created

### Payment Gateway
- [ ] Production credentials configured
- [ ] `SECURE-PROCESSOR_TEST_MODE=false`
- [ ] Webhook URL updated to production
- [ ] Test payment completed successfully

### Email
- [ ] Production SMTP configured
- [ ] Domain verified (SPF/DKIM)
- [ ] Email templates reviewed
- [ ] Test emails sent

### Monitoring
- [ ] Error tracking (Sentry/Bugsnag)
- [ ] Payment monitoring dashboard
- [ ] Webhook failure alerts
- [ ] Database performance monitoring

### Legal
- [ ] Terms of Service linked
- [ ] Privacy Policy linked
- [ ] Refund policy defined
- [ ] Company details in receipts

---

## Support & Resources

### Documentation Links

- **NetworkX Pay Docs**: https://docs.secure-processorpay.com
- **Prisma Docs**: https://prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Clerk Docs**: https://clerk.com/docs
- **React PDF**: https://react-pdf.org

### Contact Information

For questions about this implementation:
- Email: support@yourdomain.com
- GitHub: [Your GitHub]
- Documentation: [Your Docs Site]

---

## Changelog

### v1.0 (October 24, 2025)
- Initial implementation
- NetworkX Pay integration
- Token system with balance tracking
- PDF receipt generation
- Email notifications
- Payment history UI
- Multi-currency support
- Webhook security implementation

---

**End of Document**

*This comprehensive setup guide contains all necessary information to implement a production-ready token-based payment system. Follow the step-by-step instructions carefully and test thoroughly before deploying to production.*

