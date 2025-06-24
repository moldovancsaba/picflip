# E2E Testing Documentation

This directory contains end-to-end tests for the Picito admin application using Playwright.

## Test Structure

### Core Test Files

- `admin-edit-flows.spec.ts` - Tests admin editing functionality for users, projects, and organizations
- `breadcrumb-navigation.spec.ts` - Tests breadcrumb navigation across admin pages
- `example.spec.ts` - Basic setup verification tests

### Utilities and Fixtures

- `utils/auth.ts` - Authentication helpers for logging in as admin or user
- `fixtures/testData.ts` - Test data fixtures and validation helpers

## Running Tests

### All E2E Tests
```bash
npm run test:e2e
```

### Specific Test Files
```bash
npm run test:e2e e2e/admin-edit-flows.spec.ts
npm run test:e2e e2e/breadcrumb-navigation.spec.ts
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### Visual Mode
```bash
npm run test:e2e:headed
npm run test:e2e:ui
```

## Test Coverage

### Admin Edit Flows ✅
- **User Editing**: Edit user email, role, and memberships with persistence verification
- **Organization Editing**: Edit organization name, description, and privacy settings
- **Project Editing**: Edit project title, description, and visibility settings
- **Form Validation**: Test required field validation and error handling
- **Data Persistence**: Verify changes persist after navigation and page reload
- **Cross-Entity Consistency**: Ensure changes are reflected across admin sections

### Breadcrumb Navigation ✅
- **Hierarchy Display**: Verify correct breadcrumb hierarchy on all admin pages
- **Navigation Functionality**: Test clicking breadcrumb links for navigation
- **Current Page Indication**: Ensure current page is properly marked with aria-current
- **Accessibility**: Test ARIA attributes and keyboard navigation
- **Visual Consistency**: Verify styling consistency across pages

## Authentication

Tests use the following authentication:
- **Admin Login**: `moldovancsaba@gmail.com` (matches application admin email)
- **Test User**: `test.user@example.com` for user-level testing

Authentication is handled automatically in test setup via API calls rather than UI interaction for reliability.

## Environment Setup

Tests require:
- Application running on `localhost:3000`
- MongoDB connection for data persistence testing
- Environment variables for test configuration

## CI Integration

The GitHub Actions workflow (`.github/workflows/test.yml`) runs:
1. Unit tests first
2. E2E tests with MongoDB service
3. Artifact collection for test reports
4. Status notifications

## Test Artifacts

- **HTML Reports**: Generated in `playwright-report/`
- **Test Results**: JSON results in `test-results/`
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failing tests

## Best Practices

1. **Test Isolation**: Each test is independent with proper setup/teardown
2. **Realistic Data**: Use fixtures that mirror real application data
3. **Error Scenarios**: Test both success and failure paths
4. **Accessibility**: Include ARIA and keyboard navigation tests
5. **Performance**: Use `waitForLoadState('networkidle')` for reliable page loading
6. **Stability**: Robust selectors that won't break with UI changes

## Debugging Tips

1. Use `npm run test:e2e:debug` to step through tests
2. Add `await page.pause()` to inspect page state
3. Use `page.screenshot()` to capture visual state
4. Check browser console with `page.on('console', console.log)`
5. Examine network requests with `page.route()` debugging
