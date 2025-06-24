# Organizations Page UI/UX Design Contract

## Overview
This document defines the minimal but functional interface design for the Organizations page that meets parity with the current Admin navigation patterns. The design follows the established UI patterns from the existing Users page and maintains consistency with the current admin interface.

## Component Hierarchy

```
OrganizationsPage (src/app/admin/organizations/page.tsx)
├── OrganizationTable (src/components/OrganizationTable.tsx)
│   ├── OrganizationRow (src/components/OrganizationRow.tsx) [per organization]
│   └── EmptyState (when no organizations)
├── CreateOrganizationModal (src/components/CreateOrganizationModal.tsx)
└── Loading (src/components/Loading.tsx) [shared component]
```

## Data Structure

Based on the `IOrganisation` model, each organization record contains:
- `_id`: string (MongoDB ObjectId)
- `name`: string (required, 2-100 chars)
- `slug`: string (auto-generated, unique)
- `description`: string (optional, max 500 chars)
- `createdAt`: Date
- `updatedAt`: Date
- `memberCount`: number (calculated from OrganisationMembership)

## UI Specifications

### 1. Organizations Page Layout
```typescript
// Pattern matches existing admin/users/page.tsx
const OrganizationsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
```

### 2. Organization Table
```typescript
// Reuses styling patterns from UsersList component
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Column Headers:
// - Name
// - Slug  
// - Members
// - Created At
// - Actions
```

### 3. Organization Row Actions
Each row includes action buttons:
- **Open Members**: Links to `/admin/organizations/{id}` (future implementation)
- **Delete**: Confirmation dialog before deletion

```typescript
const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &.danger {
    color: #dc2626;
    border-color: #fca5a5;
    
    &:hover {
      background: #fef2f2;
      border-color: #f87171;
    }
  }
`;
```

### 4. Create Organization Modal
Modal form with:
- **Name** (required): Text input, 2-100 characters
- **Slug** (optional): Text input with auto-generation from name
- **Description** (optional): Textarea, max 500 characters

```typescript
// Modal follows existing form patterns from admin/page.tsx
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;
```

### 5. Loading States
- **Initial Load**: Full-page loading spinner using shared `Loading` component
- **Create Action**: Modal shows loading state during creation
- **Delete Action**: Row shows loading state during deletion
- **Table Refresh**: Skeleton loading for table rows

### 6. Error States
- **API Errors**: Error banner above table (consistent with users page)
- **Validation Errors**: Inline form validation messages
- **Network Errors**: Retry functionality with error message

```typescript
const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 4px;
  margin-bottom: 1rem;
`;
```

### 7. Empty State
When no organizations exist:
```typescript
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
```

## Date Formatting

Following the established rule, all dates use ISO 8601 format with milliseconds:
```typescript
// Format: 2025-04-13T12:34:56.789Z
const formatDate = (date: Date | string) => {
  return new Date(date).toISOString().slice(0, -1) + '.000Z';
};
```

## API Integration

### Admin Organizations API Endpoint
- **GET /api/admin/organizations**: List all organizations with member counts
- **POST /api/admin/organizations**: Create new organization
- **DELETE /api/admin/organizations/[id]**: Delete organization

### Data Fetching Pattern
```typescript
// Follows pattern from admin/users/page.tsx
const fetchOrganizations = async () => {
  try {
    const response = await fetch('/api/admin/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    const data = await response.json();
    setOrganizations(data.organizations);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

## Responsive Design

- **Desktop**: Full table layout with all columns
- **Tablet**: Condensed table, hide description column
- **Mobile**: Card-based layout stacking organization info

## Accessibility

- **Keyboard Navigation**: Tab through table rows and actions
- **Screen Readers**: Proper ARIA labels for actions and status
- **Focus Management**: Modal focus trapping
- **Color Contrast**: Meets WCAG 2.1 AA standards

## Implementation Priority

1. **High Priority**: Organization listing, basic CRUD operations
2. **Medium Priority**: Search/filter functionality, pagination
3. **Low Priority**: Bulk actions, advanced sorting

## Future Enhancements

- Search and filter functionality
- Pagination for large organization lists
- Bulk organization management
- Organization settings and configuration
- Advanced member management per organization

---

This design maintains consistency with the existing admin interface while providing a complete organization management experience. The component hierarchy allows for maintainable code and easy future enhancements.
