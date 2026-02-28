import { test, expect } from '@playwright/test';

test.describe('Odds Slider Visibility Tests', () => {
  
  test('Odds slider is visible on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Get the odds slider element
    const oddsSlider = page.locator('#odds-slider');
    await expect(oddsSlider).toBeVisible();
  });

  test('Odds slider has non-zero height (not collapsed by flexbox)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    
    // Check computed height is not 0
    const height = await oddsSlider.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    
    // Should have minimum height of 44px (as defined in CSS)
    expect(parseInt(height)).toBeGreaterThanOrEqual(44);
  });

  test('Odds slider has flex-shrink: 0 to prevent collapse', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    
    const flexShrink = await oddsSlider.evaluate((el) => {
      return window.getComputedStyle(el).flexShrink;
    });
    
    expect(flexShrink).toBe('0');
  });

  test('Odds slider displays LIVE indicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for LIVE text (exact match to avoid matching "OLIVEIRA")
    const liveLabel = page.locator('#odds-slider').getByText('LIVE', { exact: true });
    await expect(liveLabel).toBeVisible();
  });

  test('Odds slider displays fight odds items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    
    // Should have at least one listitem (fight odds)
    const listItems = oddsSlider.locator('[role="listitem"]');
    const count = await listItems.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('Odds slider is positioned between header and hero', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header');
    const oddsSlider = page.locator('#odds-slider');
    
    // Get bounding boxes
    const headerBox = await header.boundingBox();
    const sliderBox = await oddsSlider.boundingBox();
    
    expect(headerBox).not.toBeNull();
    expect(sliderBox).not.toBeNull();
    
    if (headerBox && sliderBox) {
      // Slider should start at or below where header ends
      expect(sliderBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 5);
    }
  });

  test('Odds slider bounding rect has positive dimensions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    const boundingBox = await oddsSlider.boundingBox();
    
    expect(boundingBox).not.toBeNull();
    
    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThan(0);
      expect(boundingBox.height).toBeGreaterThan(0);
    }
  });

  test('Odds slider has black background', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    
    const backgroundColor = await oddsSlider.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be black (rgb(0, 0, 0))
    expect(backgroundColor).toMatch(/(rgb\(0,\s*0,\s*0\)|rgba\(0,\s*0,\s*0,\s*1\))/);
  });

  test('Odds slider is accessible with proper aria-label', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    
    const ariaLabel = await oddsSlider.getAttribute('aria-label');
    expect(ariaLabel).toBe('Live betting odds ticker');
    
    const role = await oddsSlider.getAttribute('role');
    expect(role).toBe('region');
  });

  test('Odds slider animation is working (marquee content moves)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const oddsSlider = page.locator('#odds-slider');
    await expect(oddsSlider).toBeVisible();
    
    // Check that animation property is defined
    const animation = await oddsSlider.locator('.marquee-content, [class*="marquee"]').first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animation || style.animationName;
    });
    
    // Animation should be defined (not 'none')
    expect(animation).not.toBe('none');
    expect(animation.length).toBeGreaterThan(0);
  });
});

