# Admin Detail Pages - Audit & Design Specification

*Generated: 2025-04-13T12:34:56.789Z*

## Technology Stack Audit

### Current Tech Stack
- **Next.js**: 15.3.4 (App Router architecture)
- **React**: 19.0.0
- **TypeScript**: 5.x with ES modules (esnext)
- **Styled Components**: 6.1.19 with SSR registry
- **Database**: MongoDB with Mongoose 8.16.0
- **Module System**: ES modules (confirmed in tsconfig.json)

### Existing Patterns Analysis

#### 1. Styled Components Patterns
- **Container Pattern**: Main page containers use consistent styling:
  ```tsx
  const Container = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  `;
  ```
- **Header Pattern**: Consistent header with title and actions
- **Card Pattern**: White background cards with shadow and border
- **Form Elements**: Consistent input, button, and form styling
- **Color Scheme**: Blue primary (#0070f3), grays for text, semantic colors for status

#### 2. Hook Patterns
- Standard React hooks (useState, useEffect)
- Custom state management for loading, errors, and data
- Async/await pattern for API calls
- Local state updates after successful API operations

#### 3. Component Architecture
- **Shared Components**: Loading, ErrorMessage, SuccessMessage
- **Page-specific Components**: UsersList, OrganisationForm, etc.
- **Consistent Error Handling**: Try-catch with user-friendly error messages
- **Loading States**: Consistent loading indicators and disabled states

## Low-Fidelity Wireframes

### 1. User Detail Page (`/admin/users/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│ User Management > User Details                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ User Profile ─────────────────────────────────────────┐   │
│ │ Email: user@example.com                [Edit] [Delete] │   │
│ │ Role: Admin ▼                                          │   │
│ │ Last Login: 2025-04-13T12:34:56.789Z                  │   │
│ │ Created: 2025-04-13T12:34:56.789Z                     │   │
│ │ Terms Accepted: 2025-04-13T12:34:56.789Z              │   │
│ │ Privacy Accepted: 2025-04-13T12:34:56.789Z            │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Organization Memberships ─────────────────────────────┐   │
│ │ Current Memberships (2):                               │   │
│ │ • Acme Corp (Owner) - Joined: 2025-04-13T12:34:56.789Z│   │
│ │ • Tech Solutions (Admin) - Joined: 2025-04-13T12:34:.. │   │
│ │                                                        │   │
│ │ Add to Organization:                                   │   │
│ │ Organization: [Select...          ▼] Role: [Member ▼]  │   │
│ │                                    [Add Membership]    │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ [Save Changes]                                   [Cancel]    │
└─────────────────────────────────────────────────────────────┘
```

### 2. Organization Detail Page (`/admin/organizations/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│ Organization Management > Organization Details               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Organization Profile ─────────────────────────────────┐   │
│ │ Name: [Acme Corporation            ] [Edit] [Delete]   │   │
│ │ Slug: /acme-corp (auto-generated)                     │   │
│ │ Description:                                           │   │
│ │ [Large enterprise solutions provider...]               │   │
│ │ Created: 2025-04-13T12:34:56.789Z                     │   │
│ │ Updated: 2025-04-13T12:34:56.789Z                     │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Members (5) ──────────────────────────────────────────┐   │
│ │ │ Email             │ User Role │ Org Role │ Joined    │ │   │
│ │ │ john@acme.com     │ Admin     │ Owner    │ 2025-04.. │ │   │
│ │ │ jane@acme.com     │ User      │ Admin    │ 2025-04.. │ │   │
│ │ │ bob@acme.com      │ User      │ Member   │ 2025-04.. │ │   │
│ │                                                        │   │
│ │ Add Member: [user@example.com] Role: [Member ▼] [Add]  │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Projects (12) ────────────────────────────────────────┐   │
│ │ • Product Demo (Public) - ID: proj_123                │   │
│ │ • Internal Tool (Private) - ID: proj_456              │   │
│ │ • Marketing Landing (Public) - ID: proj_789           │   │
│ │ [View All Projects]                                    │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ [Save Changes]                                   [Cancel]    │
└─────────────────────────────────────────────────────────────┘
```

### 3. Project Detail Page (`/admin/projects/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│ Project Management > Project Details                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Project Configuration ────────────────────────────────┐   │
│ │ Name: [Product Demo            ] [Edit] [Delete]       │   │
│ │ ID: proj_123 (read-only)                              │   │
│ │ Content URL: [https://example.com/demo               ] │   │
│ │ Visibility: Public ●○ Private                         │   │
│ │ Organization: [Acme Corporation    ▼] [Personal]      │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Display Settings ─────────────────────────────────────┐   │
│ │ Original Size: [1920] × [1080] pixels                 │   │
│ │ Aspect Ratio: [16] : [9]                              │   │
│ │ Background Color: [#ffffff] ■                         │   │
│ │ Background Image: [https://...                      ] │   │
│ │ Horizontal Align: ● Left ○ Center ○ Right            │   │
│ │ Vertical Align: ○ Top ● Middle ○ Bottom              │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Project Preview ──────────────────────────────────────┐   │
│ │ ┌───────────────────────────────────────────────────┐ │   │
│ │ │                                                   │ │   │
│ │ │            [Live Preview]                         │ │   │
│ │ │                                                   │ │   │
│ │ └───────────────────────────────────────────────────┘ │   │
│ │ Last Updated: 2025-04-13T12:34:56.789Z               │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ [Save Changes]                         [Test Preview]       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Specifications

### Required Fields & Actions

#### User Detail Page
**Required Fields:**
- User ID (read-only)
- Email (editable)
- Role (admin/user dropdown)
- Last Login (read-only, formatted timestamp)
- Created At (read-only, formatted timestamp)
- Terms/Privacy Acceptance (read-only, formatted timestamps)
- Organization Memberships (editable list)

**Actions:**
- Edit user email
- Change user role (with self-demotion protection)
- Add/remove organization memberships
- Change membership roles
- Delete user (with confirmation)

**API Endpoints:**
- GET `/api/admin/users/[id]` - Fetch user details
- PATCH `/api/admin/users/[id]` - Update user
- DELETE `/api/admin/users/[id]` - Delete user

#### Organization Detail Page
**Required Fields:**
- Organization ID (read-only)
- Name (editable)
- Slug (auto-generated from name)
- Description (editable)
- Created/Updated timestamps (read-only)
- Members list with roles
- Associated projects list

**Actions:**
- Edit organization name/description
- Add/remove members
- Change member roles
- View associated projects
- Delete organization (with confirmation)

**API Endpoints:**
- GET `/api/admin/organizations/[id]` - Fetch organization details
- PATCH `/api/admin/organizations/[id]` - Update organization
- DELETE `/api/admin/organizations/[id]` - Delete organization

#### Project Detail Page
**Required Fields:**
- Project ID (read-only)
- Name (editable)
- Content URL (editable)
- Visibility (public/private toggle)
- Organization assignment (dropdown)
- Display settings (dimensions, colors, alignment)
- Preview capability

**Actions:**
- Edit all project settings
- Toggle visibility
- Change organization assignment
- Preview project
- Delete project (with confirmation)

**API Endpoints:**
- GET `/api/admin/projects/[id]` - Fetch project details
- PATCH `/api/admin/projects/[id]` - Update project
- DELETE `/api/admin/projects/[id]` - Delete project

## Component Tree Specifications

### 1. User Detail Page Component Tree
```
UserDetailPage
├── PageHeader
│   ├── Breadcrumbs
│   └── ActionButtons (Edit, Delete)
├── UserProfileCard
│   ├── UserInfo (email, role, timestamps)
│   └── UserActions (role change, save)
├── MembershipsCard
│   ├── CurrentMembershipsList
│   │   └── MembershipItem (org name, role, actions)
│   └── AddMembershipForm
│       ├── OrganizationSelect
│       ├── RoleSelect
│       └── AddButton
├── ConfirmDialog (for delete confirmation)
├── ErrorMessage
├── SuccessMessage
└── Loading
```

### 2. Organization Detail Page Component Tree
```
OrganizationDetailPage
├── PageHeader
│   ├── Breadcrumbs
│   └── ActionButtons (Edit, Delete)
├── OrganizationProfileCard
│   ├── OrganizationInfo (name, slug, description, timestamps)
│   └── OrganizationActions (save changes)
├── MembersCard
│   ├── MembersTable
│   │   └── MemberRow (email, user role, org role, actions)
│   └── AddMemberForm
│       ├── EmailInput
│       ├── RoleSelect
│       └── AddButton
├── ProjectsCard
│   ├── ProjectsList
│   │   └── ProjectItem (name, visibility, ID)
│   └── ViewAllProjectsButton
├── ConfirmDialog (for delete confirmation)
├── ErrorMessage
├── SuccessMessage
└── Loading
```

### 3. Project Detail Page Component Tree
```
ProjectDetailPage
├── PageHeader
│   ├── Breadcrumbs
│   └── ActionButtons (Edit, Delete)
├── ProjectConfigCard
│   ├── BasicSettings (name, ID, URL, visibility)
│   └── OrganizationSelect
├── DisplaySettingsCard
│   ├── DimensionInputs (width, height, aspect ratio)
│   ├── ColorPicker (background color)
│   ├── ImageInput (background image)
│   └── AlignmentControls (horizontal, vertical)
├── ProjectPreviewCard
│   ├── IframePreview
│   └── PreviewControls
├── ConfirmDialog (for delete confirmation)
├── ErrorMessage
├── SuccessMessage
└── Loading
```

## Shared Components Specifications

### Common Styled Components
- **PageContainer**: Main page wrapper with consistent padding and max-width
- **Card**: White background container with shadow and border
- **Header**: Flex container for title and actions
- **FormGroup**: Consistent form field wrapper
- **Button**: Primary, secondary, and danger button variants
- **Input/Select**: Consistent form input styling
- **Table**: Responsive table styling for data lists

### Common Hooks
- **useAdminDetail**: Generic hook for CRUD operations
- **useConfirmDialog**: Hook for managing confirmation dialogs
- **useToast**: Hook for success/error message management

## Implementation Guidelines

1. **Consistency**: Use existing patterns from admin list pages
2. **Accessibility**: Proper ARIA labels and keyboard navigation
3. **Responsive**: Mobile-friendly layouts
4. **Error Handling**: Comprehensive error states and user feedback
5. **Loading States**: Clear loading indicators for all async operations
6. **Data Validation**: Client and server-side validation
7. **Timestamp Format**: Use ISO 8601 with milliseconds format consistently

## Next Steps

1. Implement User Detail Page component
2. Implement Organization Detail Page component  
3. Implement Project Detail Page component
4. Add routing and navigation
5. Implement shared hooks and utilities
6. Add comprehensive testing
7. Update documentation
