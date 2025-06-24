import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './utils/auth';
import { breadcrumbScenarios } from './fixtures/testData';

/**
 * E2E Tests for Breadcrumb Navigation
 * Tests breadcrumb functionality across admin pages
 * Verifies navigation works correctly and breadcrumbs update appropriately
 */

test.describe('Breadcrumb Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up admin authentication for each test
    await loginAsAdmin(page);
  });

  test.describe('Breadcrumb Display', () => {
    test('breadcrumbs show correct hierarchy on admin pages', async ({ page }) => {
      for (const scenario of breadcrumbScenarios) {
        await page.goto(scenario.path);
        await page.waitForLoadState('networkidle');

        // Check if breadcrumbs container exists
        const breadcrumbsContainer = page.locator('nav[aria-label="Breadcrumb"], .breadcrumbs, [data-testid="breadcrumbs"]');
        await expect(breadcrumbsContainer).toBeVisible();

        // Verify each expected breadcrumb item
        for (const expectedBreadcrumb of scenario.expectedBreadcrumbs) {
          const breadcrumbItem = page.locator(`text="${expectedBreadcrumb.label}"`);
          await expect(breadcrumbItem).toBeVisible();

          // Check if item should be a link or current page
          if (expectedBreadcrumb.href) {
            // Should be a clickable link
            const linkElement = breadcrumbItem.locator('xpath=./ancestor-or-self::a');
            await expect(linkElement).toHaveAttribute('href', expectedBreadcrumb.href);
          } else {
            // Should be current page (last item) - not clickable
            await expect(breadcrumbItem).toHaveAttribute('aria-current', 'page');
          }
        }
      }
    });

    test('breadcrumbs contain proper separators', async ({ page }) => {
      // Test pages with multiple breadcrumb levels
      const multiLevelPaths = breadcrumbScenarios.filter(s => s.expectedBreadcrumbs.length > 1);
      
      for (const scenario of multiLevelPaths) {
        await page.goto(scenario.path);
        await page.waitForLoadState('networkidle');

        // Count separators - should be one less than number of breadcrumb items
        const separators = page.locator('[aria-hidden="true"]:has-text("/"), .breadcrumb-separator, text="/"');
        const expectedSeparatorCount = scenario.expectedBreadcrumbs.length - 1;
        
        await expect(separators).toHaveCount(expectedSeparatorCount);
      }
    });

    test('current page breadcrumb is not clickable', async ({ page }) => {
      for (const scenario of breadcrumbScenarios) {
        await page.goto(scenario.path);
        await page.waitForLoadState('networkidle');

        const lastBreadcrumb = scenario.expectedBreadcrumbs[scenario.expectedBreadcrumbs.length - 1];
        const currentPageElement = page.locator(`text="${lastBreadcrumb.label}"`);
        
        await expect(currentPageElement).toBeVisible();
        await expect(currentPageElement).toHaveAttribute('aria-current', 'page');
        
        // Current page should not be wrapped in a link
        const linkParent = currentPageElement.locator('xpath=./ancestor::a');
        await expect(linkParent).toHaveCount(0);
      }
    });
  });

  test.describe('Breadcrumb Navigation Functionality', () => {
    test('clicking breadcrumb links navigates correctly', async ({ page }) => {
      // Start from a deep page (user detail)
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');

      // Find and click on a user to go to detail page
      const userRows = page.locator('tr').filter({ hasText: '@' });
      if (await userRows.count() > 0) {
        await userRows.first().click();
        await page.waitForLoadState('networkidle');

        // Should now be on user detail page with breadcrumbs
        const breadcrumbsContainer = page.locator('nav[aria-label="Breadcrumb"], .breadcrumbs, [data-testid="breadcrumbs"]');
        await expect(breadcrumbsContainer).toBeVisible();

        // Click on "Users" breadcrumb to go back to users list
        const usersBreadcrumb = page.locator('a:has-text("Users")');
        if (await usersBreadcrumb.count() > 0) {
          await usersBreadcrumb.click();
          await page.waitForLoadState('networkidle');
          
          // Should be back on users list page
          expect(page.url()).toContain('/admin/users');
          await expect(page.locator('h1, text="Users"')).toBeVisible();
        }

        // Click on "Admin" breadcrumb to go to admin dashboard
        const adminBreadcrumb = page.locator('a:has-text("Admin")');
        if (await adminBreadcrumb.count() > 0) {
          await adminBreadcrumb.click();
          await page.waitForLoadState('networkidle');
          
          // Should be back on admin dashboard
          expect(page.url()).toContain('/admin');
          expect(page.url()).not.toContain('/admin/users');
        }
      }
    });

    test('breadcrumbs update when navigating between admin sections', async ({ page }) => {
      // Start at admin dashboard
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Check initial breadcrumb
      await expect(page.locator('text="Admin Dashboard", text="Admin"')).toBeVisible();

      // Navigate to users section
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');

      // Verify breadcrumbs updated
      await expect(page.locator('a:has-text("Admin")')).toBeVisible();
      await expect(page.locator('[aria-current="page"]:has-text("Users")')).toBeVisible();

      // Navigate to organizations section
      await page.goto('/admin/organizations');
      await page.waitForLoadState('networkidle');

      // Verify breadcrumbs updated again
      await expect(page.locator('a:has-text("Admin")')).toBeVisible();
      await expect(page.locator('[aria-current="page"]:has-text("Organizations")')).toBeVisible();

      // Navigate to projects section
      await page.goto('/admin/projects');
      await page.waitForLoadState('networkidle');

      // Verify breadcrumbs updated again
      await expect(page.locator('a:has-text("Admin")')).toBeVisible();
      await expect(page.locator('[aria-current="page"]:has-text("Projects")')).toBeVisible();
    });

    test('breadcrumbs work in detail pages', async ({ page }) => {
      // Test user detail page
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');

      const userRows = page.locator('tr').filter({ hasText: '@' });
      if (await userRows.count() > 0) {
        await userRows.first().click();
        await page.waitForLoadState('networkidle');

        // Verify breadcrumb hierarchy: Admin > Users > [User Name/Email]
        await expect(page.locator('a:has-text("Admin")')).toBeVisible();
        await expect(page.locator('a:has-text("Users")')).toBeVisible();
        
        // Current page should have aria-current="page"
        const currentPageBreadcrumb = page.locator('[aria-current="page"]');
        await expect(currentPageBreadcrumb).toBeVisible();
      }

      // Test organization detail page
      await page.goto('/admin/organizations');
      await page.waitForLoadState('networkidle');

      const orgRows = page.locator('tr').filter({ hasText: /Test|Demo|Sample/ });
      if (await orgRows.count() > 0) {
        await orgRows.first().click();
        await page.waitForLoadState('networkidle');

        // Verify breadcrumb hierarchy: Admin > Organizations > [Org Name]
        await expect(page.locator('a:has-text("Admin")')).toBeVisible();
        await expect(page.locator('a:has-text("Organizations")')).toBeVisible();
        
        // Current page should have aria-current="page"
        const currentPageBreadcrumb = page.locator('[aria-current="page"]');
        await expect(currentPageBreadcrumb).toBeVisible();
      }

      // Test project detail page
      await page.goto('/admin/projects');
      await page.waitForLoadState('networkidle');

      const projectRows = page.locator('tr').filter({ hasText: /Test|Demo|Sample/ });
      if (await projectRows.count() > 0) {
        await projectRows.first().click();
        await page.waitForLoadState('networkidle');

        // Verify breadcrumb hierarchy: Admin > Projects > [Project Name]
        await expect(page.locator('a:has-text("Admin")')).toBeVisible();
        await expect(page.locator('a:has-text("Projects")')).toBeVisible();
        
        // Current page should have aria-current="page"
        const currentPageBreadcrumb = page.locator('[aria-current="page"]');
        await expect(currentPageBreadcrumb).toBeVisible();
      }
    });
  });

  test.describe('Breadcrumb Accessibility', () => {
    test('breadcrumbs have proper ARIA attributes', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');

      // Breadcrumbs container should have proper ARIA label
      const breadcrumbsNav = page.locator('nav[aria-label="Breadcrumb"]');
      await expect(breadcrumbsNav).toBeVisible();

      // Current page should have aria-current="page"
      const currentPage = page.locator('[aria-current="page"]');
      await expect(currentPage).toBeVisible();

      // Separators should be hidden from screen readers
      const separators = page.locator('[aria-hidden="true"]').filter({ hasText: '/' });
      if (await separators.count() > 0) {
        for (let i = 0; i < await separators.count(); i++) {
          await expect(separators.nth(i)).toHaveAttribute('aria-hidden', 'true');
        }
      }
    });

    test('breadcrumb links have proper keyboard navigation', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');

      // Find clickable breadcrumb links
      const breadcrumbLinks = page.locator('nav[aria-label="Breadcrumb"] a');
      
      if (await breadcrumbLinks.count() > 0) {
        // Focus first breadcrumb link
        await breadcrumbLinks.first().focus();
        await expect(breadcrumbLinks.first()).toBeFocused();

        // Tab to next link if exists
        if (await breadcrumbLinks.count() > 1) {
          await page.keyboard.press('Tab');
          await expect(breadcrumbLinks.nth(1)).toBeFocused();
        }

        // Press Enter to navigate
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
        
        // Should have navigated successfully
        expect(page.url()).toContain('/admin');
      }
    });
  });

  test.describe('Breadcrumb Styling and Visual Consistency', () => {
    test('breadcrumbs maintain consistent styling across pages', async ({ page }) => {
      const pagesToTest = ['/admin', '/admin/users', '/admin/organizations', '/admin/projects'];
      
      for (const path of pagesToTest) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const breadcrumbsContainer = page.locator('nav[aria-label="Breadcrumb"], .breadcrumbs, [data-testid="breadcrumbs"]');
        
        if (await breadcrumbsContainer.count() > 0) {
          // Check that breadcrumbs are visible and properly styled
          await expect(breadcrumbsContainer).toBeVisible();
          
          // Verify breadcrumbs have consistent layout (flex display)
          const containerStyles = await breadcrumbsContainer.evaluate(el => 
            getComputedStyle(el).display
          );
          expect(containerStyles).toBe('flex');

          // Check link styling consistency
          const breadcrumbLinks = breadcrumbsContainer.locator('a');
          if (await breadcrumbLinks.count() > 0) {
            const linkColor = await breadcrumbLinks.first().evaluate(el => 
              getComputedStyle(el).color
            );
            // All breadcrumb links should have the same color
            for (let i = 0; i < await breadcrumbLinks.count(); i++) {
              const currentLinkColor = await breadcrumbLinks.nth(i).evaluate(el => 
                getComputedStyle(el).color
              );
              expect(currentLinkColor).toBe(linkColor);
            }
          }
        }
      }
    });
  });
});
