# Your Own Tracker Pricing Implementation

## Overview
Successfully implemented pricing and balance gating for "Your Own Tracker" (cal-tracker) tool.

## Implementation Details

### 1. Pricing Configuration
- **Cost per generation**: 5 tokens
- **Updated files**:
  - `app/(dashboard)/dashboard/conversation/page.tsx` (lines 143-177)
  - `lib/n8n-webhook.ts` (lines 794-803)

### 2. Balance Gating Logic

#### Frontend (Conversation Page)
```typescript
const getToolPrice = (toolId: string): number => {
  const prices = {
    'master-chef': 10,
    'master-nutritionist': 15,
    'cal-tracker': 5, // 5 tokens per generation
  };
  return prices[toolId as keyof typeof prices] ?? 100;
};

const toolPrice = getToolPrice(toolId);
const availableCredits = creditBalance - usedCredits;
const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
```

#### Backend (N8N Webhook Client)
```typescript
private getToolPrice(toolId: string): number {
  const prices = {
    'master-chef': 10,
    'master-nutritionist': 15,
    'cal-tracker': 5, // 5 tokens per generation
  };
  return prices[toolId as keyof typeof prices] ?? 100;
}
```

### 3. UI Behavior

#### Generate Button States
- **Enabled**: When `availableCredits >= 5` AND image uploaded AND not loading
- **Disabled**: When `availableCredits < 5` OR no image OR loading OR credits loading

#### Tooltip Messages
- Insufficient credits: "Insufficient credits. You need 5 but have {availableCredits} available."
- Sufficient credits: "Click to generate AI analysis (5 tokens)"
- No image: "Please upload an image first"
- Loading: "Loading credit balance..."

### 4. Reactive Balance Updates

The implementation ensures reactive balance updates through:
1. **Initial load**: Fetches credit balance from `/api/generations` on component mount
2. **Optimistic updates**: Decrements local balance immediately after successful generation
3. **Persistence**: Balance state is managed through React state and persists across renders
4. **Session persistence**: Balance is fetched from the backend on each page load

```typescript
// Load balance on mount
useEffect(() => {
  loadCreditBalance();
}, [userId, loadCreditBalance]);

// Update after successful generation
if (webhookResponse.success) {
  if (toolPrice > 0) {
    setUsedCredits(prev => prev + toolPrice);
  }
}
```

### 5. Test Coverage

Created comprehensive unit tests in `__tests__/unit/cal-tracker-pricing.test.ts`:

#### Test Categories
1. **Tool Price Configuration** (2 tests)
   - Verifies correct 5 token price
   - Verifies tool name

2. **Balance Gating Logic** (8 tests)
   - Tests with balance < 5 tokens (disabled)
   - Tests with balance = 5 tokens (enabled)
   - Tests with balance > 5 tokens (enabled)
   - Tests with used credits calculation
   - Tests edge cases (zero, negative, large balances)

3. **UI State Based on Balance** (7 tests)
   - Disabled state with insufficient credits
   - Enabled state with sufficient credits
   - Tooltip message accuracy
   - Loading states
   - Image upload requirement

4. **Reactive Balance Updates** (2 tests)
   - Balance recalculation after each generation
   - Remaining generations calculation

5. **Edge Cases** (5 tests)
   - Floating point balances
   - String to number conversion
   - Invalid input handling
   - Extremely large balances

6. **Persistence Across Sessions** (3 tests)
   - Balance state structure
   - API response handling
   - Failed load handling

### 6. Test Results

```
PASS __tests__/unit/cal-tracker-pricing.test.ts
  Your Own Tracker Pricing and Balance Gating
    ✓ 27 tests passed
    ✓ 0 tests failed
```

All pricing-related tests pass:
- `__tests__/unit/cal-tracker-pricing.test.ts` - 27 tests ✓
- `__tests__/unit/frontend-tool-price.test.ts` - 9 tests ✓
- `__tests__/unit/credit-balance.test.ts` - 26 tests ✓

### 7. Updated Files

1. **`app/(dashboard)/dashboard/conversation/page.tsx`**
   - Updated toolConfigs description (line 145)
   - Updated getToolPrice function (line 177)

2. **`lib/n8n-webhook.ts`**
   - Updated getToolPrice method (line 798)

3. **`__tests__/unit/frontend-tool-price.test.ts`**
   - Updated price expectations for cal-tracker
   - Added tests for 5 token pricing

4. **`__tests__/unit/credit-balance.test.ts`**
   - Updated price expectations for all tools
   - Fixed test scenarios for paid tools

5. **`__tests__/unit/cal-tracker-pricing.test.ts`** (NEW)
   - Comprehensive test suite for cal-tracker pricing
   - 27 tests covering all scenarios

## Usage

### For Users
1. Navigate to `/dashboard/conversation?toolId=cal-tracker`
2. Ensure you have at least 5 tokens in your balance
3. Upload a food image
4. Click "Generate" to analyze (costs 5 tokens)

### Balance Display
The page shows:
```
Credits: {availableCredits} available | 5 required
```

### Button Behavior
- **Enabled** (green gradient): Balance >= 5 tokens
- **Disabled** (grayed out): Balance < 5 tokens with tooltip explaining insufficient credits

## Technical Notes

- Uses nullish coalescing operator (`??`) instead of logical OR (`||`) to properly handle 0 values
- Implements optimistic UI updates for better UX
- Gracefully handles edge cases (negative balances, loading states, etc.)
- All state is reactive and updates immediately when balance changes
- Balance persists across page reloads through API calls

## Future Enhancements

Potential improvements:
1. Add balance warning when approaching 5 tokens
2. Show remaining generations count based on balance
3. Implement auto-refresh of balance after external purchases
4. Add animation when balance updates
5. Display generation history with token costs

## Verification Checklist

- [x] Set cost to 5 tokens per generation
- [x] Enable button only when balance >= 5 tokens
- [x] Disable button when balance < 5 tokens
- [x] Show explanatory tooltip when disabled
- [x] Balance check is reactive to updates
- [x] Balance persists across page reloads
- [x] Added comprehensive unit tests
- [x] All tests passing
- [x] No linter errors
- [x] Updated both frontend and backend pricing

