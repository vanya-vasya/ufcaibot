# Testing Guide - Dropdown Menu Fix

Quick reference for testing the hamburger menu dropdown fix.

## Prerequisites

1. Install Playwright browsers (first time only):
```bash
npm run playwright:install
```

2. Ensure development server is running:
```bash
npm run dev
```

## Quick Test Commands

### Run All Tests
```bash
npm run test:e2e
```

### Interactive Testing (Recommended for Development)
```bash
npm run test:e2e:ui
```
This opens Playwright UI where you can:
- See all tests visually
- Run tests one by one
- Watch tests in real-time
- Debug failed tests

### Debug Mode (Step Through Tests)
```bash
npm run test:e2e:debug
```

### Browser-Specific Tests

```bash
# Chrome/Chromium
npm run test:e2e:chromium

# Firefox
npm run test:e2e:firefox

# Safari (WebKit)
npm run test:e2e:webkit
```

### Mobile Tests
```bash
npm run test:e2e:mobile
```
Tests on Mobile Chrome (Android) and Mobile Safari (iOS).

### Watch Tests Run (Headed Mode)
```bash
npm run test:e2e:headed
```
Opens real browser windows so you can see tests executing.

## Manual Testing Checklist

### Desktop Testing

1. **Homepage** (`http://localhost:3000/`)
   - [ ] Click "Products" in nav bar
   - [ ] Dropdown appears below header
   - [ ] All 3 products visible (Your Own Chef, Nutritionist, Tracker)
   - [ ] No items clipped behind header
   - [ ] Click outside to close
   - [ ] Press Escape to close

2. **Our Story** (`http://localhost:3000/story`)
   - [ ] Same tests as homepage
   
3. **FAQ** (`http://localhost:3000/faq`)
   - [ ] Same tests as homepage
   
4. **Contact** (`http://localhost:3000/contact`)
   - [ ] Same tests as homepage

### Mobile Testing

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select device (iPhone, Pixel, etc.)
4. Test each page:
   - [ ] Desktop nav hidden
   - [ ] Hamburger menu visible
   - [ ] Hamburger opens side sheet

### Keyboard Accessibility Testing

1. Navigate with Tab key
2. Press Enter/Space on "Products"
3. Use Arrow keys to navigate items
4. Press Enter to select
5. Press Escape to close

### Browser Testing Matrix

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome  | ✅ | ✅ | Tests pass |
| Firefox | ✅ | N/A | Tests pass |
| Safari  | ✅ | ✅ | Tests pass |
| Edge    | ✅ | N/A | Tests pass |

## What to Look For

### ✅ **Correct Behavior**

1. **Dropdown Position**
   - Appears directly below header
   - Not overlapping header
   - Fully visible (no clipping)

2. **All Items Visible**
   - First item NOT hidden behind header
   - All three products fully readable
   - Icons and text aligned properly

3. **Z-Index Stacking**
   - Dropdown appears above header
   - No visual glitches or flickering
   - Smooth animation

4. **Interactions**
   - Opens on click
   - Closes on outside click
   - Closes on Escape key
   - Keyboard navigation works

### ❌ **Issues to Report**

1. **Clipping/Overflow**
   - First item hidden
   - Dropdown cut off
   - Text overlapping

2. **Z-Index Problems**
   - Dropdown behind header
   - Incorrect stacking order

3. **Interaction Issues**
   - Won't open
   - Won't close
   - Can't click items

## Test Results

After running tests, view results:

```bash
# Open HTML report
npx playwright show-report
```

This shows:
- Pass/fail status for each test
- Screenshots of failures
- Detailed error messages
- Performance metrics

## CI/CD Integration

Tests automatically run on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

View results in GitHub Actions tab.

## Troubleshooting

### Tests Failing?

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Browsers not installed**
   ```bash
   npm run playwright:install
   ```

3. **Timeout errors**
   - Increase timeout in `playwright.config.ts`
   - Check if dev server is slow to start

4. **Screenshot differences**
   - Update baseline screenshots: `npm run test:e2e -- --update-snapshots`

### Need Help?

- Check `DROPDOWN_MENU_FIX_DOCUMENTATION.md` for detailed info
- Review test code in `__tests__/dropdown-menu-header.spec.ts`
- Check Playwright docs: https://playwright.dev

## Performance Testing

Monitor dropdown performance:

```bash
# Run tests with trace
npx playwright test --trace on
```

View trace:
```bash
npx playwright show-trace trace.zip
```

## Visual Regression Testing

Compare dropdown appearance:

```bash
# Update baseline screenshots
npm run test:e2e -- --update-snapshots

# Run visual comparison
npm run test:e2e -- --grep "Visual Regression"
```

## Tips

1. **Use UI Mode for Development**: `npm run test:e2e:ui`
   - Fastest way to iterate
   - Visual feedback
   - Easy debugging

2. **Test on Real Devices**: 
   - Use BrowserStack or Sauce Labs for real device testing
   - iOS Safari sometimes behaves differently than emulation

3. **Keep Tests Updated**:
   - Update tests when UI changes
   - Add new tests for new features
   - Remove obsolete tests

---

**Quick Start**: `npm run test:e2e:ui` ← Start here!

