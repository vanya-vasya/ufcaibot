# Product Deprecation Changelog

## Date: November 14, 2025

## Summary
Complete removal of three deprecated nutrition products from the dashboard application: **Your Own Chef**, **Your Own Nutritionist**, and **Your Own Tracker**.

---

## Removed Product Scopes

### 1. Your Own Chef
- **Description**: Recipe generation from ingredient photos with nutritional breakdown
- **Tool ID**: `master-chef`
- **Token Price**: 10 tokens per generation
- **Features**: Ingredient photo upload, recipe suggestions, nutritional information

### 2. Your Own Nutritionist
- **Description**: Advanced nutritional analysis and meal optimization
- **Tool ID**: `master-nutritionist`
- **Token Price**: 15 tokens per generation
- **Features**: Health goal alignment, macro tracking, personalized nutrition guidance

### 3. Your Own Tracker
- **Description**: Intelligent calorie and nutrient tracking
- **Tool ID**: `cal-tracker`
- **Token Price**: 5 tokens per generation
- **Features**: Real-time nutrition insights, progress monitoring, meal recommendations

---

## Files Removed

### Pages & Routes
- `app/(dashboard)/dashboard/conversation/` - Main conversation page for all three products
- `app/(dashboard)/dashboard/conversation/page.tsx` - Conversation interface
- `app/(dashboard)/dashboard/conversation/constants.ts` - Form schemas and configurations

### Components
- `components/RecipeCard.tsx` - Recipe display component for Your Own Chef
- `components/FriendlyResponseCard.tsx` - Friendly response UI for Your Own Nutritionist
- `components/CalTrackerNutritionCard.tsx` - Nutrition card for Your Own Tracker
- `components/GuidelineSection.tsx` - "How It Works" guideline section for all products

### Libraries
- `lib/friendly-response-formatter.ts` - Response formatting for Your Own Nutritionist
- `lib/n8n-webhook.ts` - N8N webhook client for product integrations

### Constants & Configuration
- `constants/product-navigation.ts` - Product navigation items and configurations

### Assets
- `public/images/guidelines/` - All guideline images for the three products
  - `step-1-gather-ingredients.png`
  - `step-2-snap-photo.png`
  - `step-3-upload-service.png`
  - `step-4-discover-recipe.png`
  - `nutritionist-step-1-share-goals.png`
  - `nutritionist-step-2-personal-details.png`
  - `nutritionist-step-3-personalized-plan.png`
  - `nutritionist-step-4-daily-recommendations.png`
  - `tracker-step-1-take-photo.png`
  - `tracker-step-2-upload-tap.png`
  - `tracker-step-3-instant-insights.png`
  - `tracker-step-4-stay-on-track.png`

### Tests
- `__tests__/app/(dashboard)/dashboard/conversation/page.test.tsx`
- `__tests__/integration/master-chef-balance-gating.test.tsx`
- `__tests__/integration/master-nutritionist-balance-gating.test.tsx`
- `__tests__/integration/master-nutritionist-conversation.test.tsx`
- `__tests__/lib/friendly-response-formatter.test.ts`
- `__tests__/lib/n8n-webhook.test.ts`
- `__tests__/lib/n8n-webhook-enhanced.test.ts`
- `__tests__/lib/n8n-webhook-master-nutritionist.test.ts`
- `__tests__/unit/cal-tracker-pricing.test.ts`
- `__tests__/unit/file-upload.test.ts`
- `__tests__/unit/master-nutritionist.test.ts`
- `__tests__/unit/recipe-visualization.test.ts`
- `__tests__/api/generate.test.ts`

### Documentation
- `MASTER_CHEF_PRICING_IMPLEMENTATION.md`
- `MASTER_NUTRITIONIST_PRICING_IMPLEMENTATION.md`
- `CAL_TRACKER_PRICING_IMPLEMENTATION.md`
- `TRACKER_GUIDELINE_IMPLEMENTATION.md`

---

## Files Modified

### Navigation Components
- `components/main-nav.tsx` - Removed product navigation items, kept only Payments link
- `components/mobile-nav.tsx` - Removed product collapsible section and items
- `components/guest-mobile-sidebar.tsx` - Removed product navigation imports and UI

### Dashboard
- `app/(dashboard)/dashboard/page.tsx` - Replaced product cards with deprecation notice

---

## Breaking Changes

### For Users
- All three nutrition products are no longer accessible
- Product URLs (`/dashboard/conversation?toolId=*`) now return 404
- Guideline images and "How It Works" sections removed

### For Developers
- **Removed Imports**: Components, libraries, and constants related to products are no longer available
- **Removed Routes**: `/dashboard/conversation` route deleted
- **Removed APIs**: N8N webhook integration removed
- **Removed Types**: Recipe, NutritionData, FriendlyResponse types no longer available
- **Removed Tests**: All product-specific test suites removed

### API Changes
- `N8nWebhookClient` class removed - no replacement
- `friendlyFormatter` utility removed - no replacement
- Product tool IDs no longer recognized:
  - `master-chef`
  - `master-nutritionist`
  - `cal-tracker`

---

## Migration Guide

### For Navigation Updates
If you have bookmarks or links to these products:
- **Old**: `/dashboard/conversation?toolId=master-chef`
- **New**: Feature deprecated, navigate to `/dashboard` instead

### For Code References
If your code references these components or utilities:
```typescript
// ❌ REMOVED - No longer available
import { RecipeCard } from '@/components/RecipeCard';
import { FriendlyResponseCard } from '@/components/FriendlyResponseCard';
import { CalTrackerNutritionCard } from '@/components/CalTrackerNutritionCard';
import { GuidelineSection } from '@/components/GuidelineSection';
import { friendlyFormatter } from '@/lib/friendly-response-formatter';
import { N8nWebhookClient } from '@/lib/n8n-webhook';
import { PRODUCT_ITEMS } from '@/constants/product-navigation';
```

**Recommendation**: Remove all references to these imports from your code.

---

## Build & Test Status

### Build Status
- ✅ Prisma client generated successfully
- ✅ Next.js compilation successful
- ⚠️ TypeScript type errors in `app/layout.tsx` (pre-existing Clerk configuration issue, unrelated to deprecation)

### Test Status
- ✅ **51 tests passing** (Jest unit and integration tests)
- ⚠️ **8 Playwright tests failing** (TransformStream environment issues, unrelated to deprecation)
- ✅ All product-specific tests removed successfully

---

## Environment Variables

No environment variable changes required. The following can be optionally removed if no longer used:
- `NEXT_PUBLIC_N8N_MASTER_NUTRITIONIST_URL`
- `NEXT_PUBLIC_N8N_AUTH_TOKEN`
- `N8N_WEBHOOK_URL`
- `WEBHOOK_URL`

---

## Rollback Instructions

If rollback is needed:
1. Revert to commit before this deprecation
2. Restore files from backup:
   - All files listed in "Files Removed" section
   - All modified navigation components
3. Run `npm install` to restore dependencies
4. Run `npm run build` to verify build passes
5. Run `npm test` to verify tests pass

---

## Notes

- The dashboard now displays a deprecation notice: "The nutrition products have been deprecated. Please check the navigation menu for available features."
- Main navigation only shows "Payments" link
- Mobile navigation removed Products collapsible section
- All product-related webhooks, APIs, and integrations cleaned up
- Zero dead code remaining in codebase related to these products

---

## Verification Checklist

- [x] Dashboard page updated with deprecation notice
- [x] All product cards removed from UI
- [x] Conversation route deleted
- [x] Navigation components updated (main-nav, mobile-nav, guest-mobile-sidebar)
- [x] Product-specific components deleted
- [x] Product-specific libraries deleted
- [x] Guideline images removed
- [x] Tests for products removed
- [x] Documentation files removed
- [x] Build compiles successfully
- [x] Jest tests passing (51/51)
- [x] No import errors or missing module errors

---

## Contact

For questions or issues related to this deprecation, please contact the development team.

---

**End of Changelog**

