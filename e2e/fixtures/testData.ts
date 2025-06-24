/**
 * Test data fixtures for E2E tests
 * Provides consistent test data for admin functionality testing
 */

export interface TestUser {
  _id?: string;
  email: string;
  role: 'admin' | 'user';
  memberships?: TestMembership[];
}

export interface TestOrganization {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  isPublic?: boolean;
}

export interface TestProject {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  isPublic?: boolean;
  organisationId?: string;
}

export interface TestMembership {
  organisationId: string;
  organisationName?: string;
  role: 'owner' | 'admin' | 'member';
}

/**
 * Sample test users for E2E scenarios
 */
export const testUsers: TestUser[] = [
  {
    email: 'admin.test@example.com',
    role: 'admin'
  },
  {
    email: 'user.test@example.com',
    role: 'user',
    memberships: [
      {
        organisationId: 'test-org-1',
        organisationName: 'Test Organization',
        role: 'member'
      }
    ]
  },
  {
    email: 'manager.test@example.com',
    role: 'user',
    memberships: [
      {
        organisationId: 'test-org-1',
        organisationName: 'Test Organization',
        role: 'admin'
      }
    ]
  }
];

/**
 * Sample test organizations for E2E scenarios
 */
export const testOrganizations: TestOrganization[] = [
  {
    name: 'Test Organization',
    slug: 'test-organization',
    description: 'A test organization for E2E testing',
    isPublic: true
  },
  {
    name: 'Private Test Org',
    slug: 'private-test-org',
    description: 'A private organization for testing privacy features',
    isPublic: false
  },
  {
    name: 'E2E Demo Company',
    slug: 'e2e-demo-company',
    description: 'Demo company for end-to-end test scenarios',
    isPublic: true
  }
];

/**
 * Sample test projects for E2E scenarios
 */
export const testProjects: TestProject[] = [
  {
    title: 'Test Project Alpha',
    slug: 'test-project-alpha',
    description: 'First test project for E2E scenarios',
    isPublic: true
  },
  {
    title: 'Private Beta Project',
    slug: 'private-beta-project',
    description: 'Private project for testing access controls',
    isPublic: false
  },
  {
    title: 'Demo Showcase',
    slug: 'demo-showcase',
    description: 'Showcase project for demonstration purposes',
    isPublic: true
  }
];

/**
 * Form data for testing edit functionality
 */
export interface EditTestData {
  user: {
    email: string;
    role: 'admin' | 'user';
  };
  organization: {
    name: string;
    description: string;
    isPublic: boolean;
  };
  project: {
    title: string;
    description: string;
    isPublic: boolean;
  };
}

/**
 * Updated test data for edit operations
 */
export const editTestData: EditTestData = {
  user: {
    email: 'updated.email@example.com',
    role: 'user'
  },
  organization: {
    name: 'Updated Organization Name',
    description: 'This organization has been updated via E2E test',
    isPublic: false
  },
  project: {
    title: 'Updated Project Title',
    description: 'This project has been updated through automated testing',
    isPublic: false
  }
};

/**
 * Breadcrumb test scenarios
 */
export interface BreadcrumbTestScenario {
  path: string;
  expectedBreadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
}

export const breadcrumbScenarios: BreadcrumbTestScenario[] = [
  {
    path: '/admin',
    expectedBreadcrumbs: [
      { label: 'Admin Dashboard' }
    ]
  },
  {
    path: '/admin/users',
    expectedBreadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users' }
    ]
  },
  {
    path: '/admin/organizations',
    expectedBreadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Organizations' }
    ]
  },
  {
    path: '/admin/projects',
    expectedBreadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Projects' }
    ]
  }
];

/**
 * Validation helper functions for test assertions
 */
export class TestDataValidator {
  /**
   * Validates that an email has the expected format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates that a slug has the expected format (lowercase, hyphens)
   */
  static isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug);
  }

  /**
   * Validates that text content has been properly updated
   */
  static hasBeenUpdated(original: string, updated: string): boolean {
    return original !== updated && updated.length > 0;
  }
}
