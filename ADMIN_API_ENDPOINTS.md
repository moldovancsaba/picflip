# Admin API Endpoints Documentation

This document describes the new admin-only API endpoints created for managing projects, organizations, and users.

## Authentication

All endpoints require admin-level authentication. The `getSession()` function validates the JWT token and ensures the user has the `admin` role.

## Dependencies

- **zod**: Added for input validation (version ^3.25.67)
- **jose**: Existing JWT library for token verification
- **mongoose**: Existing for database operations

## Endpoints

### 1. Projects - `/api/admin/projects/[id]`

#### GET `/api/admin/projects/[id]`
Retrieves detailed information about a specific project including all available organizations.

**Response:**
```json
{
  "project": {
    "id": "project-123",
    "name": "Project Name",
    "contentUrl": "https://example.com",
    "originalWidth": 1920,
    "originalHeight": 1080,
    "aspectRatioX": 16,
    "aspectRatioY": 9,
    "backgroundColor": "#ffffff",
    "backgroundImageUrl": "",
    "horizontalAlignment": "center",
    "verticalAlignment": "middle",
    "isPublic": false,
    "organisationId": "org-123",
    "currentOrganisation": {...},
    "organisations": [...],
    "updatedAt": "2025-01-13T12:34:56.789Z"
  }
}
```

#### PATCH `/api/admin/projects/[id]`
Updates any editable field of a project.

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "isPublic": true,
  "organisationId": "org-123"
}
```

**Validation Rules:**
- `name`: 1-100 characters
- `contentUrl`: Valid URL
- `originalWidth/Height`: Positive numbers
- `aspectRatioX/Y`: Positive numbers
- `backgroundColor`: Valid hex color (#RRGGBB)
- `backgroundImageUrl`: Valid URL or empty string
- `horizontalAlignment`: "left", "center", or "right"
- `verticalAlignment`: "top", "middle", or "bottom"
- `isPublic`: Boolean
- `organisationId`: Valid ObjectId or null

### 2. Organizations - `/api/admin/organizations/[id]`

#### GET `/api/admin/organizations/[id]`
Retrieves detailed organization information including members and associated projects.

**Response:**
```json
{
  "organization": {
    "_id": "org-123",
    "name": "Organization Name",
    "slug": "organization-name",
    "description": "Organization description",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z",
    "members": [
      {
        "_id": "mem-1",
        "userId": "user-1",
        "email": "user@example.com",
        "userRole": "user",
        "membershipRole": "owner",
        "joinedAt": "2025-01-01T00:00:00.000Z",
        "lastLoginAt": "2025-01-01T10:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "projects": [
      {
        "id": "project-1",
        "name": "Project Name",
        "isPublic": true,
        "contentUrl": "https://example.com"
      }
    ]
  }
}
```

#### PATCH `/api/admin/organizations/[id]`
Updates organization name and/or description.

**Request Body:**
```json
{
  "name": "Updated Organization Name",
  "description": "Updated description"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `description`: 0-500 characters

### 3. Users - `/api/admin/users/[id]`

#### GET `/api/admin/users/[id]`
Retrieves detailed user information including membership summary and all available organizations.

**Response:**
```json
{
  "user": {
    "_id": "user-123",
    "email": "user@example.com",
    "role": "user",
    "lastLoginAt": "2025-01-01T10:00:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z",
    "termsAcceptedAt": "2025-01-01T00:00:00.000Z",
    "privacyAcceptedAt": "2025-01-01T00:00:00.000Z",
    "memberships": [
      {
        "_id": "mem-1",
        "organisationId": "org-1",
        "organisationName": "Organization Name",
        "organisationSlug": "organization-name",
        "role": "member",
        "joinedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "allOrganizations": [...]
  }
}
```

#### PATCH `/api/admin/users/[id]`
Updates user information and manages organization memberships.

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "role": "admin",
  "memberships": [
    {
      "organisationId": "org-123",
      "role": "member",
      "action": "add"
    },
    {
      "organisationId": "org-456",
      "role": "owner",
      "action": "remove"
    }
  ]
}
```

**Validation Rules:**
- `email`: Valid email format
- `role`: "admin" or "user"
- `memberships`: Array of membership actions
  - `organisationId`: Valid ObjectId
  - `role`: "owner", "admin", or "member"
  - `action`: "add" or "remove"

**Business Rules:**
- Admins cannot demote themselves
- Cannot remove the last owner from an organization
- Adding membership to existing organization updates the role

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Invalid request data / Business rule violation
- `401`: Unauthorized (not admin)
- `404`: Resource not found
- `500`: Internal server error

## Time Format

All timestamps are returned in ISO 8601 format with milliseconds in UTC:
`YYYY-MM-DDTHH:MM:SS.sssZ`

Example: `2025-01-13T12:34:56.789Z`

## Testing

Each endpoint includes comprehensive Jest tests covering:
- Success scenarios for admin users
- Authentication failures (401 responses)
- Validation errors (400 responses)
- Resource not found errors (404 responses)
- Business rule violations

Tests are located in `__tests__/route.test.ts` files adjacent to each route implementation.

## Implementation Details

- Built with Next.js 15 App Router
- Uses ES modules throughout
- Follows existing API patterns and response formats
- Integrates with existing authentication middleware
- Maintains consistency with current codebase style
