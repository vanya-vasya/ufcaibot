import { test, expect } from '@playwright/test';

test.describe('Footer Background Tests', () => {
  
  test('Footer has white background on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Get the footer element
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check that the footer has white background
    const backgroundColor = await footer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be white (rgb(255, 255, 255) or rgba(255, 255, 255, 1))
    expect(backgroundColor).toMatch(/(rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255,\s*1\))/);
  });

  test('Footer has white background on dashboard', async ({ page }) => {
    // You may need to handle authentication here
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const backgroundColor = await footer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toMatch(/(rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255,\s*1\))/);
  });

  test('Body background is white on all pages', async ({ page }) => {
    const pages = ['/', '/privacy-policy'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      const bodyBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      expect(bodyBg).toMatch(/(rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255,\s*1\))/);
    }
  });

  test('No dark blue backgrounds in footer area', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that no elements in the footer area have dark blue backgrounds
    const darkBlueElements = await page.locator('footer *').evaluateAll((elements) => {
      return elements.filter((el) => {
        const bg = window.getComputedStyle(el).backgroundColor;
        // Check for dark blue colors (roughly hue 220-240, saturation >50%, lightness <30%)
        return bg.includes('rgb') && (
          bg.includes('rgb(15, 23, 42)') || // slate-900
          bg.includes('rgb(17, 24, 39)') || // gray-900  
          bg.includes('rgb(16, 16, 34)') ||  // custom dark blue
          bg.includes('rgb(34, 32, 32)')     // thm-white old value
        );
      });
    });
    
    expect(darkBlueElements.length).toBe(0);
  });
});
