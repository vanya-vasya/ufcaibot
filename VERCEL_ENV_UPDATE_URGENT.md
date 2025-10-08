# 🚨 URGENT: Vercel Environment Variables Update Required

## ⚠️ Current Issue

**Problem:** Vercel is still using OLD environment variables  
**Evidence from logs:**
```
apiUrl: 'https://gateway.networxpay.com'  ❌ OLD
return_url: 'https://website-2-fl3pjwurp...'  ❌ OLD
```

**Impact:** Networx API returns "This route doesn't exist"

---

## ✅ Solution: Update Vercel Environment Variables

### Step 1: Go to Vercel Dashboard

**URL:** https://vercel.com/vladis-projects-8c520e18/website-3/settings/environment-variables

Or:
1. Go to https://vercel.com
2. Select project: **website-3**
3. Navigate to: **Settings → Environment Variables**

---

### Step 2: Update These Variables

**⚠️ CRITICAL - Update immediately:**

#### 1. NETWORX_API_URL
```
Key: NETWORX_API_URL
Value: https://checkout.networxpay.com
Environment: Production, Preview, Development (check all)
```

#### 2. NETWORX_RETURN_URL
```
Key: NETWORX_RETURN_URL
Value: https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/payment/success
Environment: Production, Preview, Development (check all)
```

#### 3. NETWORX_CANCEL_URL
```
Key: NETWORX_CANCEL_URL
Value: https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/payment/cancel
Environment: Production, Preview, Development (check all)
```

#### 4. NETWORX_WEBHOOK_URL
```
Key: NETWORX_WEBHOOK_URL
Value: https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/api/webhooks/networx
Environment: Production, Preview, Development (check all)
```

#### 5. NETWORX_TEST_MODE
```
Key: NETWORX_TEST_MODE
Value: false
Environment: Production, Preview, Development (check all)
```

---

### Step 3: Verify All Environment Variables

**Make sure these are also set (from previous setup):**

```bash
NETWORX_SHOP_ID=29959
NETWORX_SECRET_KEY=dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950

NEXT_PUBLIC_NETWORX_SHOP_ID=29959
NEXT_PUBLIC_NETWORX_TEST_MODE=false
NEXT_PUBLIC_NETWORX_WIDGET_URL=https://checkout.networxpay.com

NETWORX_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Hskkcbbus+LFkyD1NdJHu5ZcV2X/01b3jHhlA6vTFSPpNYnHq8Y3WEe7jrSc44PsR0kGibMjZJAB+S1vyZrI/c1OJKk0njXU59ofyRVR6fTkpytwIXqALweGKfWmmSxpJDJXGt+m0sQyG+UjYunHNY6Qw4ARO5+MWNT2GVpbuAEQ+sOksYWjUi9ftEhlcFeFGhO25/eqbV/QtnbqBXjZj3TsCUM1mQY/F9PhXj8Ku6T1vi/Av+Tf4dgyEsch57DTWZa7hMfp663UpaDLNk7Zd90nztYhjPrN9/AWrqyQQ9IKZHpco2iPLbqM8iloi4n5wSTIfWSVR8bZ1kWPhhoAQIDAQAB
```

---

### Step 4: Redeploy

After updating environment variables, you MUST redeploy:

**Option A - Redeploy from Dashboard:**
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Click "..." menu → "Redeploy"
4. Confirm redeploy

**Option B - Push to trigger auto-deploy:**
```bash
git push origin full-project-deploy-20251008
```

**Option C - Merge to main:**
```bash
git checkout main
git merge full-project-deploy-20251008
git push origin main
```

---

## 🔍 How to Verify Fix

### Check Logs After Redeploy

After redeploying, you should see in logs:
```javascript
apiUrl: 'https://checkout.networxpay.com'  ✅ CORRECT
return_url: 'https://website-3-gesry583g...'  ✅ CORRECT
notification_url: 'https://website-3-gesry583g...'  ✅ CORRECT
```

### Test Payment

Visit: `https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/payment/test`

Expected:
- ✅ No "This route doesn't exist" error
- ✅ Payment widget loads successfully
- ✅ Can initiate payment

---

## 📋 Complete Environment Variables List

Copy this entire block to ensure nothing is missing:

```bash
# Networx Payment Gateway - Server Side
NETWORX_SHOP_ID=29959
NETWORX_SECRET_KEY=dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950
NETWORX_API_URL=https://checkout.networxpay.com
NETWORX_TEST_MODE=false
NETWORX_RETURN_URL=https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/payment/success
NETWORX_CANCEL_URL=https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/payment/cancel
NETWORX_WEBHOOK_URL=https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app/api/webhooks/networx

# Networx Payment Gateway - Client Side
NEXT_PUBLIC_NETWORX_SHOP_ID=29959
NEXT_PUBLIC_NETWORX_TEST_MODE=false
NEXT_PUBLIC_NETWORX_WIDGET_URL=https://checkout.networxpay.com
NETWORX_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Hskkcbbus+LFkyD1NdJHu5ZcV2X/01b3jHhlA6vTFSPpNYnHq8Y3WEe7jrSc44PsR0kGibMjZJAB+S1vyZrI/c1OJKk0njXU59ofyRVR6fTkpytwIXqALweGKfWmmSxpJDJXGt+m0sQyG+UjYunHNY6Qw4ARO5+MWNT2GVpbuAEQ+sOksYWjUi9ftEhlcFeFGhO25/eqbV/QtnbqBXjZj3TsCUM1mQY/F9PhXj8Ku6T1vi/Av+Tf4dgyEsch57DTWZa7hMfp663UpaDLNk7Zd90nztYhjPrN9/AWrqyQQ9IKZHpco2iPLbqM8iloi4n5wSTIfWSVR8bZ1kWPhhoAQIDAQAB

# Application URL
NEXT_PUBLIC_APP_URL=https://website-3-gesry583g-vladis-projects-8c520e18.vercel.app
```

---

## 🎯 Quick Action Steps

1. ✅ Go to Vercel: https://vercel.com/vladis-projects-8c520e18/website-3/settings/environment-variables
2. ✅ Update 5 critical variables (API_URL, RETURN_URL, CANCEL_URL, WEBHOOK_URL, TEST_MODE)
3. ✅ Click "Save"
4. ✅ Redeploy from dashboard or push code
5. ✅ Wait for deployment to complete
6. ✅ Test payment flow

---

## ⏱️ Expected Timeline

- Update env variables: 2 minutes
- Redeploy: 2-3 minutes
- Total: ~5 minutes

---

## ❓ Why This Happened

**Root Cause:** Environment variables on Vercel were not updated when we fixed the code.

**Timeline:**
1. ✅ Code fixed in GitHub (correct API endpoint)
2. ❌ Vercel environment variables NOT updated
3. ❌ Vercel still uses OLD values from env variables
4. ❌ Result: Wrong API endpoint used at runtime

**Solution:** Update Vercel environment variables + Redeploy

---

## 📞 Need Help?

If you still get errors after following these steps:

1. Check Vercel deployment logs for any error messages
2. Verify all environment variables are set correctly
3. Ensure the deployment completed successfully
4. Test payment flow at `/payment/test`

---

**Status:** 🚨 ACTION REQUIRED  
**Priority:** HIGH  
**Time Required:** ~5 minutes  
**Vercel URL:** https://vercel.com/vladis-projects-8c520e18/website-3/settings/environment-variables

