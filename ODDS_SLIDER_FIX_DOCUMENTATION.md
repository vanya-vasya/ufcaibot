# Odds Slider Visibility Fix Documentation

## Issue Summary

**Problem**: The live betting odds slider was not visible on the landing page. While the component rendered in the DOM correctly, it had `height: 0px` making it invisible to users.

**Root Cause**: The OddsSlider component was being collapsed by the parent flexbox layout. The landing page layout uses `flex flex-col justify-between` which, combined with the Hero component taking `100vh`, caused the OddsSlider to be compressed to zero height.

**Date Identified**: December 1, 2025  
**Branch**: `feature/odds-slider-marquee-2025-01-20`

---

## Root Cause Analysis

### Investigation Steps

1. **DOM Inspection**: Confirmed the OddsSlider component was rendering correctly in the DOM with all fight odds data
2. **Computed Styles Check**: Discovered `height: 0px` via browser DevTools evaluation
3. **Layout Analysis**: Identified the parent `<main>` element using `flex flex-col justify-between h-full`
4. **CSS Conflict**: The Hero component with `height: 100vh` was consuming all available space

### Technical Details

**Parent Layout** (`app/(landing)/layout.tsx`):
```tsx
<main className="bg-white text-[#A1AAC9] overflow-x-hidden h-full flex flex-col justify-between">
  <Header/>
  <OddsSlider />  {/* Was collapsing to 0px height */}
  {children}       {/* Hero takes 100vh */}
  <Footer/>
</main>
```

**Before Fix** - Computed styles of `#odds-slider`:
- `height: 0px`
- `flexShrink: 1` (default)
- `boundingRect.height: 0`

**After Fix** - Computed styles of `#odds-slider`:
- `height: 44px`
- `flexShrink: 0`
- `boundingRect.height: 44`
- `minHeight: 44px`

---

## The Fix

### Changes Made

**File**: `components/landing/odds-slider.tsx`

1. Added Tailwind `shrink-0` class to the section element:
```tsx
<section
  id="odds-slider"
  className="odds-slider-section shrink-0"  // Added shrink-0
  aria-label="Live betting odds ticker"
  role="region"
>
```

2. Added CSS properties to prevent flexbox collapse:
```css
.odds-slider-section {
  width: 100%;
  background-color: #000000;
  overflow: hidden;
  /* Prevent flexbox collapse in parent layout */
  flex-shrink: 0;
  min-height: 44px;
}
```

---

## Test Coverage

### Unit Tests Added (`__tests__/components/OddsSlider.test.tsx`)

4 new tests in "OddsSlider Layout & Visibility" describe block:
- `should have shrink-0 class to prevent flexbox collapse`
- `should have odds-slider-section class for styling`
- `should have id='odds-slider' for CSS targeting`
- `should render visible content with LIVE label and fight items`

**Total Unit Tests**: 49 passing

### E2E Tests Added (`__tests__/odds-slider-visibility.spec.ts`)

10 Playwright tests covering:
- `Odds slider is visible on landing page`
- `Odds slider has non-zero height (not collapsed by flexbox)`
- `Odds slider has flex-shrink: 0 to prevent collapse`
- `Odds slider displays LIVE indicator`
- `Odds slider displays fight odds items`
- `Odds slider is positioned between header and hero`
- `Odds slider bounding rect has positive dimensions`
- `Odds slider has black background`
- `Odds slider is accessible with proper aria-label`
- `Odds slider animation is working (marquee content moves)`

---

## Monitoring & Alerting

### Recommended Monitoring

1. **Visual Regression Testing**: Add the landing page to visual regression suite
2. **Synthetic Monitoring**: Add Datadog/New Relic synthetic check for:
   - `#odds-slider` element visibility
   - Computed height > 0
3. **Error Tracking**: Monitor for any CSS-related console errors

### Alert Conditions

Set up alerts if:
- `#odds-slider` computed height equals 0
- E2E test `odds-slider-visibility` fails
- User reports via feedback form mentioning "odds" or "live bets"

---

## Rollback Plan

### Quick Rollback (< 5 minutes)

If the fix causes issues, revert to previous state:

```bash
# Revert the specific file changes
git checkout HEAD~1 -- components/landing/odds-slider.tsx

# Or revert the entire commit
git revert <commit-hash>
```

### Rollback Commands

```bash
# 1. Identify the commit to revert
git log --oneline -5

# 2. Revert the odds-slider changes
git revert --no-commit <fix-commit-hash>

# 3. Verify the revert
npm test -- --testPathPatterns="OddsSlider"

# 4. Deploy the revert
git commit -m "revert: Odds slider visibility fix causing [issue description]"
git push origin main
```

### Post-Rollback

1. Notify team via Slack/Discord
2. Create incident ticket
3. Document what went wrong
4. Plan alternative fix approach

---

## Deployment Steps

### Pre-Deployment Checklist

- [ ] All unit tests pass: `npm test -- --testPathPatterns="OddsSlider"`
- [ ] E2E tests pass: `npx playwright test odds-slider-visibility`
- [ ] Visual QA on localhost
- [ ] Code review approved
- [ ] No linting errors: `npm run lint`

### Deployment

```bash
# 1. Ensure on correct branch
git checkout feature/odds-slider-marquee-2025-01-20

# 2. Pull latest changes
git pull origin feature/odds-slider-marquee-2025-01-20

# 3. Run full test suite
npm test
npx playwright test odds-slider-visibility --project=chromium

# 4. Build verification
npm run build

# 5. Merge to main (or create PR)
git checkout main
git merge feature/odds-slider-marquee-2025-01-20

# 6. Push to trigger Vercel deployment
git push origin main
```

### Post-Deployment Verification

1. Visit production landing page
2. Verify odds slider is visible
3. Check browser console for errors
4. Verify marquee animation is running
5. Test on mobile viewport (responsive)

---

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `components/landing/odds-slider.tsx` | Modified | Added `shrink-0` class and CSS properties |
| `__tests__/components/OddsSlider.test.tsx` | Modified | Added 4 layout/visibility tests |
| `__tests__/odds-slider-visibility.spec.ts` | Created | New e2e test file with 10 tests |
| `ODDS_SLIDER_FIX_DOCUMENTATION.md` | Created | This documentation file |

---

## Future Considerations

1. **Layout Refactor**: Consider refactoring the landing layout to avoid `justify-between` with `h-full` which can cause similar collapse issues
2. **CSS Custom Properties**: Could use CSS variables for consistent min-heights across ticker components
3. **Live Data Integration**: Current implementation uses sample data - future work needed to connect to real odds API

---

## Contact

For questions about this fix, contact the development team or refer to the git history for this file.

