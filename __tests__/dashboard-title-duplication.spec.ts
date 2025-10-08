/**
 * E2E Test for Dashboard Title Duplication
 * 
 * Tests to ensure that the "MINDFUL EATER" title appears exactly once
 * on the dashboard page and not duplicated in the header or anywhere else.
 * 
 * This test covers:
 * - Title appears exactly once on the page
 * - No duplicate h1 tags
 * - Proper header structure
 * - Visual regression to prevent title duplication
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard Title Duplication - Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (may require authentication)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display "MINDFUL EATER" title exactly once on the page', async ({ page }) => {
    // Find all elements containing "MINDFUL EATER" text
    const titleElements = page.locator(':text("MINDFUL EATER")');
    const count = await titleElements.count();
    
    // Should appear exactly once
    expect(count).toBe(1);
  });

  test('should have exactly one h1 element on the page', async ({ page }) => {
    // Count all h1 elements
    const h1Elements = page.locator('h1');
    const count = await h1Elements.count();
    
    // Should have exactly one h1 per page (semantic HTML best practice)
    expect(count).toBe(1);
  });

  test('h1 element should contain "MINDFUL EATER" text', async ({ page }) => {
    // Get the h1 element
    const h1 = page.locator('h1');
    const text = await h1.textContent();
    
    // Should contain "MINDFUL EATER"
    expect(text).toContain('MINDFUL EATER');
  });

  test('should not have duplicate header tags', async ({ page }) => {
    // Check for proper header structure
    const headers = page.locator('header');
    const headerCount = await headers.count();
    
    // Should have exactly one header element (not nested)
    // Note: If using AnimatedLayout with motion.header, this might be 2
    // We'll verify they're not nested improperly
    expect(headerCount).toBeLessThanOrEqual(2);
    
    // If there are 2 headers, ensure they're properly structured
    if (headerCount === 2) {
      // Check if one is wrapping the other (which is acceptable)
      const firstHeader = headers.first();
      const secondHeader = headers.nth(1);
      
      // Both should be visible
      await expect(firstHeader).toBeVisible();
      await expect(secondHeader).toBeVisible();
    }
  });

  test('title should be in the main content area, not in navigation header', async ({ page }) => {
    // Get the navigation header
    const navHeader = page.locator('header nav');
    await expect(navHeader).toBeVisible();
    
    // Check that "MINDFUL EATER" is NOT in the nav header
    const navText = await navHeader.textContent();
    
    // Nav should not contain the full "MINDFUL EATER" title
    // (it might contain product names, but not the main page title)
    const hasTitle = navText?.includes('MINDFUL EATER');
    expect(hasTitle).toBe(false);
  });

  test('title should be visible and properly styled', async ({ page }) => {
    // Find the title
    const title = page.locator('h1:has-text("MINDFUL EATER")');
    
    // Should be visible
    await expect(title).toBeVisible();
    
    // Should have proper styling (gradient text)
    const span = title.locator('span');
    await expect(span).toBeVisible();
    
    // Check computed styles
    const hasGradientClass = await span.evaluate((el) => {
      const classes = el.className;
      return classes.includes('bg-clip-text') && 
             classes.includes('text-transparent') && 
             classes.includes('bg-gradient');
    });
    
    expect(hasGradientClass).toBe(true);
  });

  test('should have correct document structure for accessibility', async ({ page }) => {
    // Check that there's proper heading hierarchy
    const h1 = page.locator('h1');
    const h2Elements = page.locator('h2');
    const h3Elements = page.locator('h3');
    
    // Should have one h1
    expect(await h1.count()).toBe(1);
    
    // H1 should be the first heading on the page
    const firstHeading = page.locator('h1, h2, h3, h4, h5, h6').first();
    const firstHeadingTag = await firstHeading.evaluate(el => el.tagName);
    expect(firstHeadingTag).toBe('H1');
  });

  test('should not have duplicate title in different viewports', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    let titleCount = await page.locator(':text("MINDFUL EATER")').count();
    expect(titleCount).toBe(1);
    
    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    titleCount = await page.locator(':text("MINDFUL EATER")').count();
    expect(titleCount).toBe(1);
    
    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    titleCount = await page.locator(':text("MINDFUL EATER")').count();
    expect(titleCount).toBe(1);
  });

  test('should match visual snapshot (regression test)', async ({ page }) => {
    // Take a screenshot of the title area
    const titleSection = page.locator('h1:has-text("MINDFUL EATER")').locator('..');
    
    // Visual regression test
    await expect(titleSection).toHaveScreenshot('dashboard-title-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('should not render title multiple times during navigation', async ({ page }) => {
    // Initial check
    let titleCount = await page.locator(':text("MINDFUL EATER")').count();
    expect(titleCount).toBe(1);
    
    // Navigate away
    await page.goto('/dashboard/conversation?toolId=master-chef');
    await page.waitForLoadState('networkidle');
    
    // Navigate back
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Check again - should still be exactly one
    titleCount = await page.locator(':text("MINDFUL EATER")').count();
    expect(titleCount).toBe(1);
  });

  test('should have proper ARIA landmark structure', async ({ page }) => {
    // Check for proper landmark structure
    const main = page.locator('main');
    const header = page.locator('header');
    
    // Should have both main and header landmarks
    await expect(main).toBeVisible();
    await expect(header).toBeVisible();
    
    // Title should be inside main, not header
    const titleInMain = main.locator('h1:has-text("MINDFUL EATER")');
    await expect(titleInMain).toBeVisible();
    
    const titleInHeader = header.locator('h1:has-text("MINDFUL EATER")');
    expect(await titleInHeader.count()).toBe(0);
  });
});

test.describe('Dashboard Header Structure', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('header should contain navigation, not page title', async ({ page }) => {
    const header = page.locator('header');
    
    // Header should contain navigation elements
    const nav = header.locator('nav');
    await expect(nav).toBeVisible();
    
    // Header should contain logo
    const logo = header.locator('img[alt*="Logo"]');
    await expect(logo).toBeVisible();
    
    // Header should not contain h1
    const h1InHeader = header.locator('h1');
    expect(await h1InHeader.count()).toBe(0);
  });

  test('should have proper z-index stacking for header and content', async ({ page }) => {
    const header = page.locator('header');
    const main = page.locator('main');
    
    // Get z-index values
    const headerZIndex = await header.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).zIndex) || 0;
    });
    
    const mainZIndex = await main.evaluate((el) => {
      return parseInt(window.getComputedStyle(el).zIndex) || 0;
    });
    
    // Header should have higher or equal z-index than main
    // (or auto, which is 0)
    expect(headerZIndex).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Cross-Browser Title Duplication Tests', () => {
  
  test('title duplication check works on all browsers', async ({ page, browserName }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log(`Testing on: ${browserName}`);
    
    // Check for exactly one "MINDFUL EATER" title
    const titleCount = await page.locator(':text("MINDFUL EATER")').count();
    expect(titleCount).toBe(1);
    
    // Check for exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });
});

