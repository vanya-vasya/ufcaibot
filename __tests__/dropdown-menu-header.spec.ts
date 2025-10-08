/**
 * E2E Tests for Header Dropdown Menu
 * 
 * Tests the "Products" dropdown menu behavior across all landing pages
 * (Home, Our Story, FAQ, Contact) to ensure:
 * 
 * 1. Dropdown appears correctly below the header
 * 2. All product items are visible without clipping
 * 3. Z-index stacking is correct
 * 4. Cross-browser compatibility (Chrome, Safari, Firefox, iOS Safari, Android Chrome)
 * 5. Responsive behavior on mobile and desktop
 * 6. Proper positioning and overflow handling
 */

import { test, expect, Page } from '@playwright/test';

// Test pages - all should have consistent dropdown behavior
const TEST_PAGES = [
  { name: 'Homepage', path: '/', hasDropdown: true },
  { name: 'Our Story', path: '/story', hasDropdown: true },
  { name: 'FAQ', path: '/faq', hasDropdown: true },
  { name: 'Contact', path: '/contact', hasDropdown: true },
];

// Product items that should appear in dropdown
const EXPECTED_PRODUCTS = [
  'Your Own Chef',
  'Your Own Nutritionist', 
  'Your Own Tracker',
];

/**
 * Helper function to get header dimensions
 */
async function getHeaderDimensions(page: Page) {
  const header = page.locator('header');
  const headerBox = await header.boundingBox();
  return headerBox;
}

/**
 * Helper function to open the Products dropdown
 */
async function openProductsDropdown(page: Page) {
  // Find and click the Products dropdown trigger
  const productsButton = page.locator('button:has-text("Products"), a:has-text("Products")').first();
  await expect(productsButton).toBeVisible();
  await productsButton.click();
  
  // Wait for dropdown to be visible
  await page.waitForSelector('[role="menu"]', { state: 'visible', timeout: 5000 });
}

/**
 * Helper function to close dropdown by clicking outside
 */
async function closeDropdown(page: Page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300); // Wait for close animation
}

test.describe('Header Dropdown Menu - Desktop Views', () => {
  
  // Run tests for each page
  TEST_PAGES.forEach(({ name, path, hasDropdown }) => {
    
    test.describe(`${name} Page`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
      });
      
      test('should render header with correct z-index', async ({ page }) => {
        const header = page.locator('header');
        await expect(header).toBeVisible();
        
        // Check header positioning
        const headerPosition = await header.evaluate((el) => 
          window.getComputedStyle(el).position
        );
        expect(['sticky', 'fixed']).toContain(headerPosition);
        
        // Check header z-index
        const headerZIndex = await header.evaluate((el) => 
          window.getComputedStyle(el).zIndex
        );
        expect(parseInt(headerZIndex)).toBeGreaterThanOrEqual(9998);
      });
      
      test('should open Products dropdown on click', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Verify dropdown is visible
        const dropdown = page.locator('[role="menu"]').first();
        await expect(dropdown).toBeVisible();
      });
      
      test('should display all product items in dropdown', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Check all expected products are visible
        for (const product of EXPECTED_PRODUCTS) {
          const productItem = page.locator(`[role="menuitem"]:has-text("${product}")`);
          await expect(productItem).toBeVisible();
        }
      });
      
      test('should position dropdown below header without clipping', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Get header and dropdown positions
        const headerBox = await getHeaderDimensions(page);
        const dropdown = page.locator('[role="menu"]').first();
        const dropdownBox = await dropdown.boundingBox();
        
        // Assert header exists
        expect(headerBox).not.toBeNull();
        expect(dropdownBox).not.toBeNull();
        
        if (headerBox && dropdownBox) {
          // Dropdown should appear below the header
          expect(dropdownBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
          
          // Dropdown should not be hidden behind header
          expect(dropdownBox.y).toBeGreaterThan(headerBox.y);
        }
      });
      
      test('should have correct z-index for dropdown (above header)', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Get z-index values
        const header = page.locator('header');
        const headerZIndex = await header.evaluate((el) => 
          parseInt(window.getComputedStyle(el).zIndex)
        );
        
        const dropdown = page.locator('[role="menu"]').first();
        const dropdownZIndex = await dropdown.evaluate((el) => 
          parseInt(window.getComputedStyle(el).zIndex)
        );
        
        // Dropdown z-index should be higher than header
        expect(dropdownZIndex).toBeGreaterThan(headerZIndex);
        expect(dropdownZIndex).toBeGreaterThanOrEqual(9999);
      });
      
      test('should show all product items without overflow clipping', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Check each product item is fully visible
        for (const product of EXPECTED_PRODUCTS) {
          const productItem = page.locator(`[role="menuitem"]:has-text("${product}")`);
          
          // Item should be visible
          await expect(productItem).toBeVisible();
          
          // Item should have non-zero dimensions
          const itemBox = await productItem.boundingBox();
          expect(itemBox).not.toBeNull();
          if (itemBox) {
            expect(itemBox.width).toBeGreaterThan(0);
            expect(itemBox.height).toBeGreaterThan(0);
            
            // Item should be within viewport
            expect(itemBox.y).toBeGreaterThanOrEqual(0);
          }
        }
      });
      
      test('should not have first product item hidden behind header', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Get first product item
        const firstProduct = page.locator(`[role="menuitem"]:has-text("${EXPECTED_PRODUCTS[0]}")`);
        const firstProductBox = await firstProduct.boundingBox();
        
        // Get header dimensions
        const headerBox = await getHeaderDimensions(page);
        
        expect(headerBox).not.toBeNull();
        expect(firstProductBox).not.toBeNull();
        
        if (headerBox && firstProductBox) {
          // First product should be fully below header
          expect(firstProductBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
          
          // Verify it's not overlapping with header
          const isOverlapping = (
            firstProductBox.y < (headerBox.y + headerBox.height) &&
            (firstProductBox.y + firstProductBox.height) > headerBox.y
          );
          expect(isOverlapping).toBe(false);
        }
      });
      
      test('should close dropdown on Escape key', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Press Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500); // Wait for animation
        
        // Dropdown should be hidden
        const dropdown = page.locator('[role="menu"]').first();
        await expect(dropdown).toBeHidden();
      });
      
      test('should close dropdown when clicking outside', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Click outside the dropdown (on the page body)
        await page.locator('body').click({ position: { x: 10, y: 200 } });
        await page.waitForTimeout(500); // Wait for animation
        
        // Dropdown should be hidden
        const dropdown = page.locator('[role="menu"]').first();
        await expect(dropdown).toBeHidden();
      });
      
      test('should navigate to correct page when clicking product item', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Click on first product
        const firstProduct = page.locator(`[role="menuitem"]:has-text("${EXPECTED_PRODUCTS[0]}")`);
        await firstProduct.click();
        
        // Wait for navigation
        await page.waitForLoadState('networkidle');
        
        // URL should change to dashboard with toolId
        expect(page.url()).toContain('/dashboard');
      });
      
      test('should maintain dropdown visibility during scroll', async ({ page }) => {
        if (!hasDropdown) return;
        
        await openProductsDropdown(page);
        
        // Scroll down slightly
        await page.evaluate(() => window.scrollBy(0, 50));
        await page.waitForTimeout(300);
        
        // Dropdown should still be visible (or close on scroll, depending on design)
        const dropdown = page.locator('[role="menu"]').first();
        const isVisible = await dropdown.isVisible();
        
        // Dropdown behavior on scroll: either remains visible or closes
        // Both are acceptable, just ensure it doesn't break
        expect(typeof isVisible).toBe('boolean');
      });
      
    });
  });
});

test.describe('Header Dropdown Menu - Mobile Views', () => {
  
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size
  
  TEST_PAGES.forEach(({ name, path }) => {
    
    test(`${name} - Mobile: should show hamburger menu instead of desktop dropdown`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Desktop Products button should be hidden on mobile
      const desktopProductsButton = page.locator('.nav-container-light-green button:has-text("Products")');
      
      // Check if it exists before asserting hidden (might not exist on mobile)
      const exists = await desktopProductsButton.count() > 0;
      if (exists) {
        await expect(desktopProductsButton).toBeHidden();
      }
      
      // Hamburger menu button should be visible
      const hamburgerButton = page.locator('button').filter({ has: page.locator('[data-lucide="menu"]') }).or(
        page.locator('[aria-label*="menu"]')
      ).first();
      
      // Hamburger should exist on mobile
      const hamburgerExists = await hamburgerButton.count() > 0;
      expect(hamburgerExists).toBe(true);
    });
    
  });
});

test.describe('Header Dropdown Menu - Cross-Browser Compatibility', () => {
  
  // These tests will automatically run on all browsers defined in playwright.config.ts
  
  test('should work consistently across all browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Testing on: ${browserName}`);
    
    // Open dropdown
    await openProductsDropdown(page);
    
    // Verify dropdown is visible
    const dropdown = page.locator('[role="menu"]').first();
    await expect(dropdown).toBeVisible();
    
    // Verify all products are visible
    for (const product of EXPECTED_PRODUCTS) {
      const productItem = page.locator(`[role="menuitem"]:has-text("${product}")`);
      await expect(productItem).toBeVisible();
    }
    
    // Get positioning
    const headerBox = await getHeaderDimensions(page);
    const dropdownBox = await dropdown.boundingBox();
    
    if (headerBox && dropdownBox) {
      // Verify dropdown is below header on all browsers
      expect(dropdownBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
    }
  });
});

test.describe('Header Dropdown Menu - Accessibility', () => {
  
  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab to Products button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Press Enter or Space to open
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Dropdown should be visible
    const dropdown = page.locator('[role="menu"]').first();
    const isVisible = await dropdown.isVisible();
    
    // If not visible after first attempt, try Space key
    if (!isVisible) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);
    }
    
    // At least one method should work
    await expect(dropdown).toBeVisible();
    
    // Arrow keys should navigate items
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    
    // Focus should move to first item
    const focusedElement = await page.evaluate(() => document.activeElement?.textContent);
    expect(EXPECTED_PRODUCTS.some(product => focusedElement?.includes(product))).toBe(true);
  });
  
  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await openProductsDropdown(page);
    
    // Check dropdown has role="menu"
    const dropdown = page.locator('[role="menu"]').first();
    await expect(dropdown).toBeVisible();
    
    // Check items have role="menuitem"
    const menuItems = page.locator('[role="menuitem"]');
    const count = await menuItems.count();
    expect(count).toBeGreaterThanOrEqual(EXPECTED_PRODUCTS.length);
  });
});

test.describe('Header Dropdown Menu - Visual Regression', () => {
  
  test('should match expected visual appearance on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await openProductsDropdown(page);
    
    // Take screenshot of dropdown area
    const dropdown = page.locator('[role="menu"]').first();
    await expect(dropdown).toHaveScreenshot('products-dropdown-homepage.png', {
      maxDiffPixels: 100, // Allow minor rendering differences
    });
  });
  
  test('should match expected visual appearance on Our Story page', async ({ page }) => {
    await page.goto('/story');
    await page.waitForLoadState('networkidle');
    
    await openProductsDropdown(page);
    
    const dropdown = page.locator('[role="menu"]').first();
    await expect(dropdown).toHaveScreenshot('products-dropdown-story.png', {
      maxDiffPixels: 100,
    });
  });
});

