import { Page } from '@playwright/test';

/**
 * Seeds test data needed for e2e tests
 */
export async function seedTestData(page: Page) {
  // Seed test user
  const testUser = {
    email: 'test.user@example.com',
    role: 'user'
  };
  
  // Seed test organizations
  const testOrgs = [
    {
      name: 'Test Organization',
      slug: 'test-org',
      description: 'Organization for e2e testing'
    },
    {
      name: 'E2E Demo Company',
      slug: 'e2e-demo',
      description: 'Another test organization'
    }
  ];

  // Seed test projects
  const testProjects = [
    {
      name: 'Test Project Alpha',
      description: 'Project for e2e testing',
      public: true
    },
    {
      name: 'Demo Showcase',
      description: 'Demo project for tests',
      public: false
    }
  ];

  // Create test user via API
  await page.request.post('/api/admin/users', {
    data: testUser
  });

  // Create test organizations and wait for each to complete
  for (const org of testOrgs) {
    const response = await page.request.post('/api/organisations', {
      data: org
    });
    expect(response.ok()).toBeTruthy();
  }

  // Create test projects and wait for each to complete
  for (const project of testProjects) {
    const response = await page.request.post('/api/settings', {
      data: project
    });
    expect(response.ok()).toBeTruthy();
  }

  // Wait for a short period to ensure data is reflected in the database
  await page.waitForTimeout(2000);
}
