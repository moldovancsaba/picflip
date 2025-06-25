import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './utils/auth';
import { editTestData, TestDataValidator } from './fixtures/testData';
import { seedTestData } from './fixtures/seedTestData';

/**
 * E2E Tests for Admin Edit Flows
 * Tests admin ability to edit users, projects, and organizations
 * Verifies that changes persist after reload and navigation
 */

test.describe('Admin Edit Flows', () => {
test.beforeEach(async ({ page }) => {
    // Set up admin authentication and seed test data
    await loginAsAdmin(page);
    await seedTestData(page);
    
    // Wait for page to be fully ready
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  });

  test.describe('User Editing', () => {
    test('admin can edit user details and changes persist', async ({ page }) => {
      // Navigate to users list and wait for full page load
      await page.goto('/admin/users');
      await page.waitForLoadState('load');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('networkidle');

      // Wait for data table to be ready
      await page.waitForSelector('table tbody tr:has-text("@")', {
        state: 'visible',
        timeout: 10000
      });

      // Find user row that isn't the admin
      const userRows = page.locator('tbody tr').filter({
        hasText: 'test.user@example.com'
      });
      const firstUser = userRows.first();
      
      // Click on user to view details
      await firstUser.click();
      await page.waitForLoadState('networkidle');

      // Wait for user detail page to load
      await expect(page.locator('h1')).toContainText(/User (Details|Management)/);

      // Wait for form fields to be visible
await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 30000, state: 'visible' });
      
      // Store original values for comparison
      const originalEmail = await page.locator('input[name="email"], input[type="email"]').inputValue();
      const originalRole = await page.locator('select[name="role"]').inputValue();

      // Edit user details
      await page.fill('input[name="email"], input[type="email"]', editTestData.user.email);
      await page.selectOption('select[name="role"]', editTestData.user.role);

      // Save changes
      await page.click('button:has-text("Save"), button:has-text("Update")');
      
      // Wait for success message or page update
      await expect(page.locator('text=updated successfully, text=Changes saved')).toBeVisible({ timeout: 10000 });

      // Verify changes are visible immediately
      await expect(page.locator('input[name="email"], input[type="email"]')).toHaveValue(editTestData.user.email);
      await expect(page.locator('select[name="role"]')).toHaveValue(editTestData.user.role);

      // Navigate away and back to verify persistence
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');
      
      // Find the updated user
      await page.click(`text=${editTestData.user.email}`);
      await page.waitForLoadState('networkidle');

      // Verify changes persisted after navigation
      await expect(page.locator('input[name="email"], input[type="email"]')).toHaveValue(editTestData.user.email);
      await expect(page.locator('select[name="role"]')).toHaveValue(editTestData.user.role);

      // Verify email format is valid
      expect(TestDataValidator.isValidEmail(editTestData.user.email)).toBe(true);
    });

    test('user edit form validates required fields', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');

      await page.waitForSelector('tr >> text=@', { timeout: 10000 });
      const userRows = page.locator('tbody tr').filter({ hasText: /@(?!moldovancsaba@gmail\.com)/ });
      await userRows.first().click();
      await page.waitForLoadState('networkidle');

      // Clear email field and trigger validation
      await page.fill('input[name="email"], input[type="email"]', '');
      await page.locator('input[name="email"]').blur();

      // Check either for disabled save button or visible error message
      try {
        await expect(page.locator('button:has-text("Save")')).toBeDisabled({ timeout: 5000 });
      } catch {
        // If button isn't disabled, we should see an error message
        await expect(page.locator('[data-testid="email-error"]')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Organization Editing', () => {
    test('admin can edit organization details and changes persist', async ({ page }) => {
      // Navigate to organizations list
      await page.goto('/admin/organizations');
      await page.waitForLoadState('networkidle');

      // Find an organization to edit
      // Wait for organizations table to be ready
      await page.waitForSelector('table tbody tr:has-text("Test Organization")', {
        state: 'visible',
        timeout: 10000
      });
      const orgRows = page.locator('tbody tr').filter({ hasText: /Test Organization|E2E Demo Company/ });
      const firstOrg = orgRows.first();
      
      // Click on organization to view details
      await firstOrg.click();
      await page.waitForLoadState('networkidle');

      // Wait for organization detail page to load
      await expect(page.locator('h1')).toContainText(/Organization|Details/);

      // Store original values
      const originalName = await page.locator('input[name="name"], input[placeholder*="name"]').inputValue();
      const originalDescription = await page.locator('textarea[name="description"], input[name="description"]').inputValue();

      // Edit organization details
      await page.fill('input[name="name"], input[placeholder*="name"]', editTestData.organization.name);
      await page.fill('textarea[name="description"], input[name="description"]', editTestData.organization.description);
      
      // Toggle privacy setting if available
      const publicToggle = page.locator('input[type="checkbox"][name="isPublic"], button:has-text("Public"), button:has-text("Private")');
      if (await publicToggle.count() > 0) {
        if (editTestData.organization.isPublic) {
          await publicToggle.check();
        } else {
          await publicToggle.uncheck();
        }
      }

      // Save changes
      await page.click('button:has-text("Save"), button:has-text("Update")');
      
      // Wait for success indication
      await expect(page.locator('text=updated successfully, text=Changes saved')).toBeVisible({ timeout: 10000 });

      // Verify changes are visible immediately
      await expect(page.locator('input[name="name"], input[placeholder*="name"]')).toHaveValue(editTestData.organization.name);
      await expect(page.locator('textarea[name="description"], input[name="description"]')).toHaveValue(editTestData.organization.description);

      // Navigate away and back to verify persistence
      await page.goto('/admin/organizations');
      await page.waitForLoadState('networkidle');
      
      // Find the updated organization by name
      await page.click(`text=${editTestData.organization.name}`);
      await page.waitForLoadState('networkidle');

      // Verify changes persisted after navigation
      await expect(page.locator('input[name="name"], input[placeholder*="name"]')).toHaveValue(editTestData.organization.name);
      await expect(page.locator('textarea[name="description"], input[name="description"]')).toHaveValue(editTestData.organization.description);

      // Verify data integrity
      expect(TestDataValidator.hasBeenUpdated(originalName, editTestData.organization.name)).toBe(true);
      expect(TestDataValidator.hasBeenUpdated(originalDescription, editTestData.organization.description)).toBe(true);
    });

    test('organization edit form handles empty fields appropriately', async ({ page }) => {
      await page.goto('/admin/organizations');
      await page.waitForLoadState('networkidle');

      // Wait for organizations table to be ready
      await page.waitForSelector('table tbody tr:has-text("Test Organization")', {
        state: 'visible',
        timeout: 10000
      });
      const orgRows = page.locator('tbody tr').filter({ hasText: /Test Organization|E2E Demo Company/ });
      await orgRows.first().click();
      await page.waitForLoadState('networkidle');

      // Clear required fields
      await page.fill('input[name="name"], input[placeholder*="name"]', '');
      await page.click('button:has-text("Save"), button:has-text("Update")');

      // Should show validation error for required name field
      await expect(page.locator('text=required, text=Name is required')).toBeVisible();
    });
  });

  test.describe('Project Editing', () => {
    test('admin can edit project details and changes persist', async ({ page }) => {
      // Navigate to projects list
      await page.goto('/admin/projects');
      await page.waitForLoadState('networkidle');

      // Find a project to edit
      // Wait for projects table to be ready
      await page.waitForSelector('table tbody tr:has-text("Test Project Alpha")', {
        state: 'visible',
        timeout: 10000
      });
      const projectRows = page.locator('tbody tr').filter({ hasText: /Test Project Alpha|Demo Showcase/ });
      const firstProject = projectRows.first();
      
      // Click on project to view details
      await firstProject.click();
      await page.waitForLoadState('networkidle');

      // Wait for project detail page to load
      await expect(page.locator('h1')).toContainText(/Project|Details/);

      // Store original values
      const originalTitle = await page.locator('input[name="title"], input[placeholder*="title"]').inputValue();
      const originalDescription = await page.locator('textarea[name="description"], input[name="description"]').inputValue();

      // Edit project details
      await page.fill('input[name="title"], input[placeholder*="title"]', editTestData.project.title);
      await page.fill('textarea[name="description"], input[name="description"]', editTestData.project.description);
      
      // Toggle visibility setting if available
      const publicToggle = page.locator('input[type="checkbox"][name="isPublic"], button:has-text("Public"), button:has-text("Private")');
      if (await publicToggle.count() > 0) {
        if (editTestData.project.isPublic) {
          await publicToggle.check();
        } else {
          await publicToggle.uncheck();
        }
      }

      // Save changes
      await page.click('button:has-text("Save"), button:has-text("Update")');
      
      // Wait for success indication
      await expect(page.locator('text=updated successfully, text=Changes saved')).toBeVisible({ timeout: 10000 });

      // Verify changes are visible immediately
      await expect(page.locator('input[name="title"], input[placeholder*="title"]')).toHaveValue(editTestData.project.title);
      await expect(page.locator('textarea[name="description"], input[name="description"]')).toHaveValue(editTestData.project.description);

      // Navigate away and back to verify persistence
      await page.goto('/admin/projects');
      await page.waitForLoadState('networkidle');
      
      // Find the updated project by title
      await page.click(`text=${editTestData.project.title}`);
      await page.waitForLoadState('networkidle');

      // Verify changes persisted after navigation
      await expect(page.locator('input[name="title"], input[placeholder*="title"]')).toHaveValue(editTestData.project.title);
      await expect(page.locator('textarea[name="description"], input[name="description"]')).toHaveValue(editTestData.project.description);

      // Verify data integrity
      expect(TestDataValidator.hasBeenUpdated(originalTitle, editTestData.project.title)).toBe(true);
      expect(TestDataValidator.hasBeenUpdated(originalDescription, editTestData.project.description)).toBe(true);
    });

    test('project edit form validates required fields', async ({ page }) => {
      await page.goto('/admin/projects');
      await page.waitForLoadState('networkidle');

      // Wait for projects table to be ready
      await page.waitForSelector('table tbody tr:has-text("Test Project Alpha")', {
        state: 'visible',
        timeout: 10000
      });
      const projectRows = page.locator('tbody tr').filter({ hasText: /Test Project Alpha|Demo Showcase/ });
      await projectRows.first().click();
      await page.waitForLoadState('networkidle');

      // Clear title field and try to save
      await page.fill('input[name="title"], input[placeholder*="title"]', '');
      await page.click('button:has-text("Save"), button:has-text("Update")');

      // Should show validation error
      await expect(page.locator('text=required, text=Title is required')).toBeVisible();
    });
  });

  test.describe('Cross-Entity Data Consistency', () => {
    test('changes to entities are reflected across admin sections', async ({ page }) => {
      // Edit an organization name
      await page.goto('/admin/organizations');
      await page.waitForLoadState('networkidle');
      
      const orgName = `Updated Org ${Date.now()}`;
      
      // Wait for organizations table to be ready
      await page.waitForSelector('table tbody tr:has-text("Test Organization")', {
        state: 'visible',
        timeout: 10000
      });
      const orgRows = page.locator('tbody tr').filter({ hasText: /Test Organization|E2E Demo Company/ });
      await orgRows.first().click();
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[name="name"], input[placeholder*="name"]', orgName);
      await page.click('button:has-text("Save"), button:has-text("Update")');
      await expect(page.locator('text=updated successfully, text=Changes saved')).toBeVisible({ timeout: 10000 });

      // Navigate to users section and check if organization appears updated in memberships
      await page.goto('/admin/users');
      await page.waitForLoadState('networkidle');
      
      // Look for users with memberships and verify organization name appears correctly
      const userWithMembership = page.locator('tr').filter({ hasText: /member|admin|owner/ }).first();
      if (await userWithMembership.count() > 0) {
        await userWithMembership.click();
        await page.waitForLoadState('networkidle');
        
        // Check memberships tab or section
        const membershipsTab = page.locator('button:has-text("Memberships"), text="Memberships"');
        if (await membershipsTab.count() > 0) {
          await membershipsTab.click();
          // Organization name should appear in memberships list
          await expect(page.locator(`text=${orgName}`)).toBeVisible();
        }
      }
    });
  });
});
