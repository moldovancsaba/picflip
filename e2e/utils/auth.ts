import { Page, BrowserContext } from '@playwright/test';

/**
 * Authentication utilities for E2E tests
 * Provides functions to simulate admin and user login flows
 */

export interface LoginCredentials {
  email: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
}

/**
 * Logs in as admin user for testing admin functionality
 * Uses the known admin email from the authentication system
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await loginWithCredentials(page, {
    email: 'moldovancsaba@gmail.com',
    termsAccepted: true,
    privacyAccepted: true
  });
}

/**
 * Logs in as a regular user for testing user functionality
 */
export async function loginAsUser(page: Page): Promise<void> {
  await loginWithCredentials(page, {
    email: 'test.user@example.com',
    termsAccepted: true,
    privacyAccepted: true
  });
}

/**
 * Performs login with the provided credentials
 * Handles the login API call and cookie management
 */
export async function loginWithCredentials(
  page: Page, 
  credentials: LoginCredentials
): Promise<void> {
  // Make direct API call to login endpoint
  // This is more reliable than going through the UI for authentication setup
  const response = await page.request.post('/api/auth/login', {
    data: credentials
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${await response.text()}`);
  }

  // The login API sets cookies automatically
  // Navigate to a page to ensure cookies are properly set
  await page.goto('/admin');
  
  // Wait for authentication to be processed
  await page.waitForLoadState('networkidle');
}

/**
 * Checks if user is currently authenticated
 * Useful for test setup verification
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    const response = await page.request.get('/api/admin/users');
    return response.status() === 200;
  } catch {
    return false;
  }
}

/**
 * Logs out the current user
 * Cleans up authentication state for test isolation
 */
export async function logout(page: Page): Promise<void> {
  await page.request.post('/api/auth/logout');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Sets up authenticated context for a test suite
 * Returns a context with admin authentication already configured
 */
export async function createAuthenticatedContext(
  page: Page
): Promise<void> {
  await loginAsAdmin(page);
  
  // Verify admin access by checking admin dashboard loads
  await page.goto('/admin');
  await page.waitForSelector('[data-testid="admin-dashboard"]', { 
    timeout: 5000 
  }).catch(() => {
    // If testid not found, check for admin-specific content
    return page.waitForSelector('text=Admin Dashboard', { timeout: 5000 });
  });
}
