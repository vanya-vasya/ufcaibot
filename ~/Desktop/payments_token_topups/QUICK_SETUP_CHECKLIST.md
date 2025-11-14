# Quick Setup Checklist

Use this checklist to quickly set up the payment system in a new project.

## ✅ Phase 1: Prerequisites (15 minutes)

- [ ] Node.js 18+ installed
- [ ] Git repository initialized
- [ ] PostgreSQL database service account
  - [ ] Neon.tech (recommended) OR
  - [ ] Supabase OR
  - [ ] Other PostgreSQL provider
- [ ] NetworkX Pay merchant account
  - [ ] Sign up at https://secure-processorpay.com
  - [ ] Complete KYC verification
  - [ ] Note Shop ID and Secret Key
- [ ] SMTP email provider
  - [ ] Titan Email (recommended) OR
  - [ ] Gmail OR
  - [ ] SendGrid OR
  - [ ] AWS SES
- [ ] Clerk account for authentication
  - [ ] Sign up at https://clerk.com
  - [ ] Create new application

---

## ✅ Phase 2: File Setup (10 minutes)

- [ ] Copy all files from archive to your project:
  ```bash
  cp -r ~/Desktop/payments_token_topups/payment your_project/app/api/
  cp -r ~/Desktop/payments_token_topups/webhooks your_project/app/api/
  cp -r ~/Desktop/payments_token_topups/components/* your_project/components/
  cp -r ~/Desktop/payments_token_topups/lib/* your_project/lib/
  cp ~/Desktop/payments_token_topups/config/nodemailer.ts your_project/config/
  cp ~/Desktop/payments_token_topups/constants.ts your_project/
  cp ~/Desktop/payments_token_topups/constants/index.ts your_project/constants/
  cp ~/Desktop/payments_token_topups/prisma/schema.prisma your_project/prisma/
  cp -r ~/Desktop/payments_token_topups/prisma/migrations/* your_project/prisma/migrations/
  ```

---

## ✅ Phase 3: Install Dependencies (5 minutes)

- [ ] Install required packages:
  ```bash
  npm install @clerk/nextjs @prisma/client @react-pdf/renderer nodemailer zod react-hook-form @hookform/resolvers framer-motion axios react-hot-toast @headlessui/react lucide-react
  ```

- [ ] Install dev dependencies:
  ```bash
  npm install -D prisma @types/nodemailer @types/node typescript
  ```

---

## ✅ Phase 4: Environment Variables (20 minutes)

Create `.env` file in project root:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# NetworkX Pay
SECURE-PROCESSOR_SHOP_ID=your_shop_id
SECURE-PROCESSOR_SECRET_KEY=your_secret_key
SECURE-PROCESSOR_API_URL=https://checkout.secure-processorpay.com
SECURE-PROCESSOR_TEST_MODE=true
SECURE-PROCESSOR_PUBLIC_KEY=your_public_key

# Email/SMTP
OUTBOX_EMAIL=noreply@yourdomain.com
OUTBOX_EMAIL_PASSWORD=your_smtp_password
INBOX_EMAIL=support@yourdomain.com

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App Config
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Checklist**:
- [ ] Added `DATABASE_URL` from Neon/Supabase
- [ ] Added `SECURE-PROCESSOR_SHOP_ID` from NetworkX dashboard
- [ ] Added `SECURE-PROCESSOR_SECRET_KEY` from NetworkX dashboard
- [ ] Added `SECURE-PROCESSOR_PUBLIC_KEY` from NetworkX dashboard
- [ ] Added SMTP credentials (email + password)
- [ ] Added Clerk keys (publishable + secret)
- [ ] Added Clerk webhook secret
- [ ] Set `SECURE-PROCESSOR_TEST_MODE=true` for development

---

## ✅ Phase 5: Database Setup (10 minutes)

- [ ] Generate Prisma client:
  ```bash
  npx prisma generate
  ```

- [ ] Run migrations:
  ```bash
  npx prisma migrate deploy
  ```

- [ ] Verify database connection:
  ```bash
  npx prisma studio
  ```
  - [ ] Open http://localhost:5555
  - [ ] Check `User` table exists
  - [ ] Check `Transaction` table exists

---

## ✅ Phase 6: Code Customization (15 minutes)

### Update Domain References

- [ ] `app/api/payment/secure-processor/route.ts`:
  ```typescript
  const returnUrl = 'https://www.YOURDOMAIN.com/dashboard';
  const notificationUrl = 'https://www.YOURDOMAIN.com/api/webhooks/secure-processor';
  ```

### Update Company Information

- [ ] `components/pdf/receipt.tsx`:
  ```typescript
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

### Update Pricing (Optional)

- [ ] `components/landing/pricing.tsx`:
  ```typescript
  const pricingTiers = [
    { id: "tier1", price: "£20", tokens: "100", ... },
    { id: "tier2", price: "£40", tokens: "220", ... },
    // Update as needed
  ];
  ```

- [ ] `constants.ts`:
  ```typescript
  export const GENERATIONS_PRICE = 0.20; // Update if needed
  ```

---

## ✅ Phase 7: Webhook Configuration (10 minutes)

### NetworkX Dashboard Setup

- [ ] Log in to NetworkX merchant dashboard
- [ ] Navigate to **Settings** → **Webhooks**
- [ ] Add webhook URL: `https://yourdomain.com/api/webhooks/secure-processor`
- [ ] Select events: **All payment events**
- [ ] Verify signature method: **HMAC SHA256**
- [ ] Save webhook configuration

### Clerk Dashboard Setup

- [ ] Log in to Clerk dashboard
- [ ] Navigate to **Webhooks**
- [ ] Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
- [ ] Select events:
  - [ ] `user.created`
  - [ ] `user.updated`
  - [ ] `user.deleted`
- [ ] Copy webhook secret to `.env` → `WEBHOOK_SECRET`

---

## ✅ Phase 8: Local Testing (20 minutes)

### Start Development Server

- [ ] Run: `npm run dev`
- [ ] Open: http://localhost:3000
- [ ] Verify no build errors

### Test Authentication

- [ ] Navigate to `/sign-up`
- [ ] Create test account
- [ ] Verify user created in database (Prisma Studio)
- [ ] Check `availableGenerations = 10` (free tokens)

### Test Payment Modal

- [ ] Navigate to `/dashboard`
- [ ] Click "Buy More" button
- [ ] Verify modal opens
- [ ] Enter token amount (e.g., 100)
- [ ] Select currency (GBP)
- [ ] Check price calculation
- [ ] Accept terms checkbox
- [ ] Click "Buy Tokens"
- [ ] Verify payment widget appears

### Test Payment Flow (with test card)

- [ ] Use test card: 4111 1111 1111 1111
- [ ] Expiry: 12/25
- [ ] CVV: 123
- [ ] Complete payment
- [ ] Verify redirect to `/dashboard`

### Verify Database Updates

- [ ] Open Prisma Studio
- [ ] Check `Transaction` table:
  - [ ] New record exists
  - [ ] `status = "successful"`
  - [ ] `amount` is correct (in cents)
  - [ ] `userId` matches user
- [ ] Check `User` table:
  - [ ] `availableGenerations` increased
  - [ ] `usedGenerations = 0`

### Check Email Receipt

- [ ] Check inbox (test email)
- [ ] Verify receipt email received
- [ ] Check PDF attachment
- [ ] Verify transaction details correct

---

## ✅ Phase 9: Webhook Testing (15 minutes)

### Test Webhook Locally (with ngrok)

- [ ] Install ngrok: `npm install -g ngrok`
- [ ] Start ngrok: `ngrok http 3000`
- [ ] Copy HTTPS URL (e.g., `https://abc123.ngrok.io`)
- [ ] Update NetworkX webhook URL: `https://abc123.ngrok.io/api/webhooks/secure-processor`
- [ ] Make test payment
- [ ] Check terminal logs for webhook received

### Verify Webhook Processing

- [ ] Check console logs show:
  ```
  📥 Secure-Processor HPP Webhook Received
  ✅ Payment SUCCESSFUL
  ✅ Updated user balance
  ✅ Transaction saved to database
  ✅ Receipt email sent
  ```

### Test Idempotency

- [ ] Resend same webhook payload (manually with curl)
- [ ] Verify no duplicate transaction created
- [ ] Verify user balance not double-credited

---

## ✅ Phase 10: Production Deployment (30 minutes)

### Prepare for Production

- [ ] Set `NODE_ENV=production`
- [ ] Set `SECURE-PROCESSOR_TEST_MODE=false`
- [ ] Update all URLs from localhost to production domain
- [ ] Review `.env` for production values
- [ ] Test build: `npm run build`

### Deploy to Vercel

- [ ] Push code to Git repository
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel dashboard:
  - [ ] All `SECURE-PROCESSOR_*` variables
  - [ ] `DATABASE_URL`
  - [ ] SMTP credentials
  - [ ] Clerk keys
- [ ] Deploy: `vercel --prod`
- [ ] Note production URL

### Update Webhook URLs

- [ ] Update NetworkX webhook URL to production
- [ ] Update Clerk webhook URL to production
- [ ] Test webhook delivery from both providers

### Production Test Payment

- [ ] Make small real payment (£1-2)
- [ ] Verify entire flow works:
  - [ ] Payment succeeds
  - [ ] Webhook received
  - [ ] Database updated
  - [ ] Receipt email sent
- [ ] Check Vercel logs for any errors

---

## ✅ Phase 11: Monitoring & Maintenance (Ongoing)

### Set Up Monitoring

- [ ] Enable Vercel analytics
- [ ] Set up error tracking (Sentry/Bugsnag)
- [ ] Create webhook failure alerts
- [ ] Set up database backup schedule
- [ ] Monitor transaction success rate

### Regular Checks

- [ ] Weekly: Review transaction logs
- [ ] Weekly: Check webhook delivery rate
- [ ] Monthly: Verify email delivery rates
- [ ] Monthly: Review currency exchange rates
- [ ] Quarterly: Update dependencies

---

## 🎯 Success Criteria

Your payment system is ready when:

✅ Users can purchase tokens through payment modal  
✅ Payments process successfully via NetworkX  
✅ Webhooks update database correctly  
✅ Token balances reflect purchases  
✅ PDF receipts generate properly  
✅ Emails deliver with receipts attached  
✅ Payment history displays transactions  
✅ Idempotency prevents duplicate charges  
✅ Test and production modes work correctly  
✅ No errors in production logs  

---

## 🆘 Troubleshooting

### Payment Modal Not Opening
- Check `useProModal` hook imported correctly
- Verify button has `onClick={proModal.onOpen}`

### Webhook Not Received
- Verify webhook URL is publicly accessible
- Check NetworkX dashboard for webhook attempts
- Review webhook logs in Vercel
- Test with ngrok in development

### Database Connection Failed
- Verify `DATABASE_URL` format
- Check database service is running
- Ensure IP allowlist includes Vercel (if applicable)
- Try connection from Prisma Studio

### Email Not Sending
- Verify SMTP credentials
- Check port (465 vs 587)
- Test with simple email first
- Review email provider logs

### Token Balance Not Updating
- Check webhook signature verification passes
- Verify `tracking_id` format correct
- Review database write logs
- Check for race conditions

---

## 📞 Get Help

If you encounter issues:

1. Check `PAYMENTS_SETUP_REPORT.md` → Troubleshooting section
2. Review Vercel/database logs
3. Test each component independently
4. Verify all environment variables set correctly
5. Ensure webhook URLs are correct

---

## 📚 Additional Resources

- **Detailed Setup Guide**: `PAYMENTS_SETUP_REPORT.md`
- **System Analysis**: `REPORT.md`
- **File Descriptions**: `FILE_INVENTORY.md`
- **NetworkX Docs**: https://docs.secure-processorpay.com
- **Prisma Docs**: https://prisma.io/docs
- **Clerk Docs**: https://clerk.com/docs

---

**Estimated Total Setup Time**: 2-3 hours  
**Difficulty**: Intermediate  
**Prerequisites**: Next.js, React, PostgreSQL, TypeScript knowledge

---

**Version**: 1.0  
**Last Updated**: October 24, 2025

Good luck with your implementation! 🚀

