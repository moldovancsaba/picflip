import { test, expect } from '@playwright/test';

/**
 * Simple test to verify Playwright setup is working
 * This test checks basic functionality and serves as a setup verification
 */

test.describe('Basic Application Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Basic check that the page loads without errors
    expect(page.url()).toBe('http://localhost:3000/');
    
    // Check for basic page structure
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('application responds to navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try navigating to admin (should redirect to login or show login prompt)
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Should not error out (may show login page or redirect)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
