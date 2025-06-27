# Testing Strategy

## Overview
As of 2025-06-27T14:28:43Z, this project has moved away from end-to-end (e2e) testing in favor of comprehensive unit testing. This decision was made to streamline our testing process and focus on more maintainable and faster-running tests.

## Current Testing Approach
- **Unit Tests**: We use Jest for unit testing our components, functions, and API routes
- **Coverage**: We maintain high test coverage through unit tests
- **No E2E Tests**: We have explicitly removed e2e testing (previously using Playwright) from our testing strategy

## Running Tests
To run the test suite:
```bash
npm run test        # Run all unit tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Writing New Tests
When adding new features or making changes:
1. Write comprehensive unit tests
2. Ensure test coverage remains at 100% for new changes
3. Focus on testing business logic and component behavior
4. Use Jest and React Testing Library for all tests

## What Was Removed
The following e2e testing related items have been removed:
- Playwright configuration
- E2E test directory and all e2e test files
- E2E related npm scripts
- Playwright and related dependencies

## Rationale
The decision to remove e2e tests was made to:
- Reduce maintenance overhead
- Speed up the test suite execution
- Focus testing efforts on unit tests
- Simplify the testing infrastructure

## Test Coverage Requirements
- All new changes must maintain 100% test coverage
- Coverage is tracked through Jest's coverage reporting
- Run `npm run test:coverage` to verify coverage metrics
