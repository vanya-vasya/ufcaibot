# Master Nutritionist Pricing and Balance Gating Implementation

**Date:** October 2, 2025  
**Feature:** Pricing and Balance Gating for "Your Own Nutritionist"  
**Tool ID:** `master-nutritionist`  
**Cost:** 15 tokens per generation

## Summary

Successfully implemented pricing and balance gating for the "Your Own Nutritionist" product (`/dashboard/conversation?toolId=master-nutritionist`). Changed the product from a free tool to a paid tool costing 15 tokens per generation.

## Changes Made

### 1. Price Configuration
**File:** `app/(dashboard)/dashboard/conversation/page.tsx`

- Updated `getToolPrice` function to set master-nutritionist price to 15 tokens
- Changed from: `'master-nutritionist': 0  // Free tool`
- Changed to: `'master-nutritionist': 15  // 15 tokens per generation`

### 2. UI Updates
**File:** `app/(dashboard)/dashboard/conversation/page.tsx`

#### Description Text
- Updated tool config description from "Price: Free" to "Price: 15 tokens per generation"
- Line 135: `description: 'Advanced nutritional analysis and meal optimization with scientific precision, macro tracking, and health goal alignment\nPrice: 15 tokens per generation'`

#### Credit Display
- Shows "15 required" instead of "Free" in the credit information badge
- Displays available credits vs required tokens: "Credits: X available | 15 required"

#### Button Tooltip
- Updated tooltip to show token cost when credits are sufficient
- Changed from: "Click to generate nutritional analysis (Free tool)"
- Changed to: "Click to generate nutritional analysis (15 tokens)"
- Shows insufficient credit message: "Insufficient credits. You need 15 but have X available"

### 3. Balance Gating Logic

The existing gating logic already handles the balance checking:

#### Button Disabled State
```typescript
disabled={(toolId === 'master-nutritionist' ? !description.trim() : !uploadedImage) || 
         isLoading || hasInsufficientCredits || isLoadingCredits}
```

The button is disabled when:
- No description is entered (for master-nutritionist)
- Loading credits
- Insufficient credits (`availableCredits < 15`)
- Already submitting

#### Pre-Submission Check
```typescript
if (hasInsufficientCredits && toolPrice > 0) {
  toast.error(`Insufficient credits. You need ${toolPrice} credits but only have ${availableCredits} available.`);
  proModal.onOpen();
  return;
}
```

#### Credit Deduction
After successful generation, 15 tokens are deducted:
```typescript
if (toolPrice > 0) {
  setUsedCredits(prev => prev + toolPrice);  // Optimistic update: adds 15 to usedCredits
}
```

### 4. Balance Reactivity

Balance checks are **reactive** and **persist** across sessions:

1. **On Component Mount**: Fetches balance from `/api/generations`
2. **On User Change**: Re-fetches when `userId` changes
3. **After Generation**: Optimistically updates local state (deducts 15 tokens)
4. **Across Reloads**: Fetches fresh balance from database on every page load

```typescript
useEffect(() => {
  loadCreditBalance();
}, [userId, loadCreditBalance]);
```

## Test Coverage

### New Test File
**File:** `__tests__/integration/master-nutritionist-balance-gating.test.tsx`

Comprehensive test suite covering:

1. **Pricing Display**
   - Shows "15 tokens per generation" in description
   - Shows "15 required" in credit information
   - Does not show "Free" anywhere

2. **Balance Gating - Insufficient Credits**
   - Disables button when balance < 15 tokens
   - Disables button when balance = 14 tokens
   - Shows AlertCircle icon when insufficient
   - Prevents generation API call
   - Shows correct tooltip message

3. **Balance Gating - Sufficient Credits**
   - Enables button when balance = 15 tokens
   - Enables button when balance > 15 tokens
   - Allows generation with sufficient credits

4. **Balance Updates**
   - Deducts 15 tokens after successful generation
   - Loads balance on component mount
   - Reactively updates displayed balance
   - Balance display: 50 → 35 after one generation

5. **Edge Cases**
   - Handles balance exactly at threshold (15 tokens)
   - Handles loading state correctly
   - Handles API errors gracefully
   - Disables button when credits fall below 15 after generation

6. **Persistence**
   - Fetches balance on every component mount
   - Reloads balance when userId changes
   - Balance persists across page reloads

### Updated Test Files

1. **`__tests__/integration/master-nutritionist-conversation.test.tsx`**
   - Updated "Free Tool Behavior" → "Paid Tool Behavior"
   - Tests now verify button disabled with insufficient credits
   - Tests now verify button enabled with sufficient credits (15+)
   - Updated pricing assertions from "Free" to "15 tokens per generation"

2. **`__tests__/unit/frontend-tool-price.test.ts`**
   - Updated price from 150 → 15 tokens
   - Updated master-chef price from 0 → 10 tokens
   - Added test for free tool (cal-tracker)
   - Verified `hasInsufficientCredits` logic for all three tools

## Technical Implementation Details

### Price Calculation
```typescript
const toolPrice = getToolPrice(toolId);  // Returns 15 for master-nutritionist
const availableCredits = creditBalance - usedCredits;
const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
```

### Balance Check Flow
1. User enters description
2. Component checks: `hasInsufficientCredits`
3. If true: Button disabled + tooltip shows insufficient message
4. If false: Button enabled + tooltip shows token cost
5. On submit: Pre-submission check prevents API call if insufficient
6. After success: Deduct 15 tokens from local balance

### API Integration
- **GET `/api/generations`**: Fetches current balance
  - Returns: `{ available, used, remaining }`
- **Balance stored in**: `availableCredits = creditBalance - usedCredits`
- **Optimistic Update**: Updates local state immediately after generation

## User Experience

1. **Initial Load**: User sees current balance and 15 tokens required
2. **Insufficient Credits**: 
   - Button disabled with reduced opacity
   - AlertCircle icon displayed
   - Tooltip: "Insufficient credits. You need 15 but have X available."
3. **Sufficient Credits**:
   - Button enabled
   - Tooltip: "Click to generate nutritional analysis (15 tokens)"
4. **After Generation**:
   - Balance updates immediately (optimistic)
   - If balance drops below 15, button becomes disabled for next generation
5. **Page Reload**: Fresh balance loaded from database

## Verification

To verify the implementation:

1. Navigate to: `/dashboard/conversation?toolId=master-nutritionist`
2. Check description shows: "Price: 15 tokens per generation"
3. Check credit badge shows: "15 required"
4. With < 15 tokens: Button should be disabled
5. With >= 15 tokens: Button should be enabled
6. After generation: Balance should decrease by 15 tokens
7. Reload page: Balance should persist

## Related Files

- `app/(dashboard)/dashboard/conversation/page.tsx` - Main implementation
- `__tests__/integration/master-nutritionist-balance-gating.test.tsx` - New test suite
- `__tests__/integration/master-nutritionist-conversation.test.tsx` - Updated tests
- `__tests__/unit/frontend-tool-price.test.ts` - Updated price logic tests

## Notes

- The gating logic uses the same infrastructure as "Your Own Chef" (10 tokens)
- "Your Own Tracker" (`cal-tracker`) remains free (0 tokens)
- Balance checking is server-side via `/api/generations` endpoint
- Optimistic updates provide instant UI feedback
- Pro modal opens when user attempts generation with insufficient credits

