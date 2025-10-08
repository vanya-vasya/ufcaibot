/**
 * E2E Tests for Hamburger Menu Auto-Close Behavior
 * 
 * Tests that the mobile hamburger menu automatically closes when:
 * 1. User clicks a navigation link (client-side routing)
 * 2. User navigates to a new page (full page load)
 * 3. Route changes programmatically
 * 
 * Also verifies:
 * - Background scroll prevention when menu is open
 * - Accessibility features (ARIA attributes, focus management)
 * - Menu state management
 * - Cross-browser compatibility
 */

import { test, expect, Page } from '@playwright/test';

// Test pages with hamburger menus
const PAGES_WITH_MENU = [
  { name: 'Homepage', path: '/', hasAuth: false },
  { name: 'Our Story', path: '/story', hasAuth: false },
  { name: 'FAQ', path: '/faq', hasAuth: false },
  { name: 'Contact', path: '/contact', hasAuth: false },
];

/**
 * Helper: Open the hamburger menu
 */
async function openHamburgerMenu(page: Page) {
  // Find hamburger menu button (Menu icon button)
  const hamburgerButton = page.locator('button').filter({ 
    has: page.locator('[stroke="currentColor"]')
  }).first();
  
  await expect(hamburgerButton).toBeVisible();
  await hamburgerButton.click();
  
  // Wait for sheet/dialog to be visible
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 3000 });
}

/**
 * Helper: Check if menu is open
 */
async function isMenuOpen(page: Page): Promise<boolean> {
  const dialog = page.locator('[role="dialog"]').first();
  return await dialog.isVisible();
}

/**
 * Helper: Check if background scroll is prevented
 */
async function isScrollPrevented(page: Page): Promise<boolean> {
  const overflow = await page.evaluate(() => {
    return window.getComputedStyle(document.body).overflow;
  });
  return overflow === 'hidden';
}

test.describe('Hamburger Menu Auto-Close - Basic Behavior', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  PAGES_WITH_MENU.forEach(({ name, path }) => {
    
    test(`${name}: Menu closes when clicking a navigation link`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Open hamburger menu
      await openHamburgerMenu(page);
      
      // Verify menu is open
      expect(await isMenuOpen(page)).toBe(true);
      
      // Click a navigation link (e.g., "Our Story")
      const navLink = page.locator('[role="dialog"] a').filter({ hasText: 'Our Story' }).first();
      await expect(navLink).toBeVisible();
      
      // Click the link
      await navLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Verify menu is closed after navigation
      await page.waitForTimeout(500); // Wait for close animation
      expect(await isMenuOpen(page)).toBe(false);
    });
    
    test(`${name}: Menu closes when clicking Products submenu item`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Open hamburger menu
      await openHamburgerMenu(page);
      
      // Open Products collapsible if present
      const productsButton = page.locator('[role="dialog"] button').filter({ hasText: 'Products' }).first();
      const productsExists = await productsButton.count() > 0;
      
      if (productsExists) {
        await productsButton.click();
        await page.waitForTimeout(300); // Wait for expand animation
        
        // Click a product link
        const productLink = page.locator('[role="dialog"] a').filter({ 
          hasText: /Your Own Chef|Your Own Nutritionist|Your Own Tracker/ 
        }).first();
        
        if (await productLink.count() > 0) {
          await productLink.click();
          
          // Wait for navigation
          await page.waitForLoadState('networkidle');
          
          // Verify menu is closed
          await page.waitForTimeout(500);
          expect(await isMenuOpen(page)).toBe(false);
        }
      }
    });
    
    test(`${name}: Menu closes when navigating with browser back button`, async ({ page }) => {
      // Start on homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to test page
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Open hamburger menu
      await openHamburgerMenu(page);
      expect(await isMenuOpen(page)).toBe(true);
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Verify menu is closed after back navigation
      await page.waitForTimeout(500);
      expect(await isMenuOpen(page)).toBe(false);
    });
    
  });
});

test.describe('Hamburger Menu - Background Scroll Prevention', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Background scroll should be prevented when menu is open', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check scroll is allowed initially
    const initialOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(initialOverflow).not.toBe('hidden');
    
    // Open hamburger menu
    await openHamburgerMenu(page);
    
    // Verify scroll is prevented
    await page.waitForTimeout(200); // Wait for effect to apply
    expect(await isScrollPrevented(page)).toBe(true);
    
    // Verify padding was added to prevent layout shift
    const paddingRight = await page.evaluate(() => document.body.style.paddingRight);
    expect(paddingRight).not.toBe('');
  });
  
  test('Background scroll should be restored when menu closes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open menu
    await openHamburgerMenu(page);
    await page.waitForTimeout(200);
    expect(await isScrollPrevented(page)).toBe(true);
    
    // Close menu by clicking a link
    const navLink = page.locator('[role="dialog"] a').first();
    await navLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Verify scroll is restored
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).not.toBe('hidden');
    
    // Verify padding was removed
    const paddingRight = await page.evaluate(() => document.body.style.paddingRight);
    expect(paddingRight).toBe('');
  });
  
  test('Background scroll should be restored when menu closes via Escape key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open menu
    await openHamburgerMenu(page);
    await page.waitForTimeout(200);
    expect(await isScrollPrevented(page)).toBe(true);
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Verify scroll is restored
    expect(await isScrollPrevented(page)).toBe(false);
  });
});

test.describe('Hamburger Menu - Accessibility Features', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Hamburger button should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hamburgerButton = page.locator('button').filter({ 
      has: page.locator('[stroke="currentColor"]')
    }).first();
    
    // Check aria-label
    const ariaLabel = await hamburgerButton.getAttribute('aria-label');
    expect(ariaLabel).toContain('menu');
    
    // Check aria-expanded when closed
    let ariaExpanded = await hamburgerButton.getAttribute('aria-expanded');
    expect(ariaExpanded).toBe('false');
    
    // Open menu
    await hamburgerButton.click();
    await page.waitForTimeout(200);
    
    // Check aria-expanded when open
    ariaExpanded = await hamburgerButton.getAttribute('aria-expanded');
    expect(ariaExpanded).toBe('true');
  });
  
  test('Menu dialog should have proper ARIA label', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await openHamburgerMenu(page);
    
    const dialog = page.locator('[role="dialog"]').first();
    const ariaLabel = await dialog.getAttribute('aria-label');
    
    // Should have a descriptive label
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel?.toLowerCase()).toMatch(/menu|navigation/);
  });
  
  test('Collapsible Products section should have aria-expanded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await openHamburgerMenu(page);
    
    const productsButton = page.locator('[role="dialog"] button').filter({ 
      hasText: 'Products' 
    }).first();
    
    if (await productsButton.count() > 0) {
      // Check aria-expanded when collapsed
      let ariaExpanded = await productsButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
      
      // Expand
      await productsButton.click();
      await page.waitForTimeout(300);
      
      // Check aria-expanded when expanded
      ariaExpanded = await productsButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    }
  });
  
  test('Navigation links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await openHamburgerMenu(page);
    
    // Get all navigation links
    const navLinks = page.locator('[role="dialog"] a');
    const count = await navLinks.count();
    
    // Check each link has tabindex (or inherits from <a>)
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      const tagName = await link.evaluate(el => el.tagName);
      expect(tagName.toLowerCase()).toBe('a');
      
      // Links should be focusable
      await link.focus();
      const isFocused = await link.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }
  });
});

test.describe('Hamburger Menu - State Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Menu state should reset when navigating between pages', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open menu and expand Products
    await openHamburgerMenu(page);
    
    const productsButton = page.locator('[role="dialog"] button').filter({ 
      hasText: 'Products' 
    }).first();
    
    if (await productsButton.count() > 0) {
      await productsButton.click();
      await page.waitForTimeout(300);
      
      // Verify Products is expanded
      let ariaExpanded = await productsButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    }
    
    // Navigate to another page
    const storyLink = page.locator('[role="dialog"] a').filter({ hasText: 'Our Story' }).first();
    await storyLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Open menu again
    await openHamburgerMenu(page);
    await page.waitForTimeout(300);
    
    // Products should be collapsed (state reset)
    const productsButtonAfter = page.locator('[role="dialog"] button').filter({ 
      hasText: 'Products' 
    }).first();
    
    if (await productsButtonAfter.count() > 0) {
      const ariaExpanded = await productsButtonAfter.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
    }
  });
  
  test('Menu should remain closed after navigation completes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open and close menu via navigation
    await openHamburgerMenu(page);
    
    const navLink = page.locator('[role="dialog"] a').filter({ hasText: 'FAQ' }).first();
    await navLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Menu should stay closed
    expect(await isMenuOpen(page)).toBe(false);
    
    // Verify it stays closed even after waiting
    await page.waitForTimeout(1000);
    expect(await isMenuOpen(page)).toBe(false);
  });
});

test.describe('Hamburger Menu - Cross-Browser Compatibility', () => {
  
  test('Auto-close works consistently across browsers', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Testing on: ${browserName}`);
    
    // Open menu
    await openHamburgerMenu(page);
    expect(await isMenuOpen(page)).toBe(true);
    
    // Click navigation link
    const navLink = page.locator('[role="dialog"] a').first();
    await navLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Verify closed on all browsers
    expect(await isMenuOpen(page)).toBe(false);
  });
});

test.describe('Hamburger Menu - Manual Example Test', () => {
  
  test('Example: Complete user flow with hamburger menu', async ({ page }) => {
    // This test demonstrates the complete user flow
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 1. User lands on homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✓ User lands on homepage');
    
    // 2. User clicks hamburger menu to open
    const hamburgerButton = page.locator('button').filter({ 
      has: page.locator('[stroke="currentColor"]')
    }).first();
    await hamburgerButton.click();
    await page.waitForTimeout(300);
    expect(await isMenuOpen(page)).toBe(true);
    console.log('✓ User opens hamburger menu');
    
    // 3. User sees background scroll is prevented
    expect(await isScrollPrevented(page)).toBe(true);
    console.log('✓ Background scroll is prevented');
    
    // 4. User clicks on "Our Story" link
    const storyLink = page.locator('[role="dialog"] a').filter({ 
      hasText: 'Our Story' 
    }).first();
    await storyLink.click();
    console.log('✓ User clicks "Our Story" link');
    
    // 5. Page navigates to /story
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/story');
    console.log('✓ Page navigates to /story');
    
    // 6. Menu automatically closes
    await page.waitForTimeout(500);
    expect(await isMenuOpen(page)).toBe(false);
    console.log('✓ Menu automatically closes');
    
    // 7. Background scroll is restored
    expect(await isScrollPrevented(page)).toBe(false);
    console.log('✓ Background scroll is restored');
    
    // 8. User can open menu again on new page
    await openHamburgerMenu(page);
    expect(await isMenuOpen(page)).toBe(true);
    console.log('✓ User can open menu on new page');
    
    console.log('\n✅ Complete user flow test passed!');
  });
});

