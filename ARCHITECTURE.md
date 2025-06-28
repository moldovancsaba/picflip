# Project Architecture

## Version 4.0.0 (Updated: 2025-06-28T17:30:45.789Z)

Latest version includes enhanced admin interface with improved organization management,
project controls, and user interface updates. All changes maintain backward compatibility
while improving overall system usability and control.

## Technology Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: Styled Components
- **Authentication**: JWT (jose)
- **Deployment**: Vercel
- **Development Tools**:
  - npm (Package Manager)
  - Turbopack (Build Tool)

## Project Structure

### Core Application Files
1. `/src/app/page.tsx` - Main page component
2. `/src/app/layout.tsx` - Root layout component
3. `/src/app/admin/page.tsx` - Admin interface
4. `/src/app/iframe/[id]/page.tsx` - Dynamic project routes
5. `/src/app/login/page.tsx` - Login page component
6. `/src/app/login/layout.tsx` - Login page layout
7. `/src/app/docs/guide/page.tsx` - Documentation guide page
8. `/src/app/docs/guide/layout.tsx` - Documentation layout
9. `/src/app/organizations/page.tsx` - Organization listing page (Added: 2025-01-08T10:15:30.789Z)
10. `/src/app/organizations/[id]/page.tsx` - Organization detail page (Added: 2025-01-08T10:15:30.789Z)
11. `/src/app/admin/projects/page.tsx` - Admin projects management page
12. `/src/app/admin/projects/[id]/page.tsx` - Admin project detail page (Added: 2025-06-24T15:40:54Z)
13. `/src/app/api/settings/route.ts` - API route for settings
14. `/src/app/api/auth/login/route.ts` - Authentication API endpoint
15. `/src/app/api/admin/users/route.ts` - User management API endpoint
16. `/src/app/api/admin/projects/[id]/route.ts` - Project detail API endpoint (Added: 2025-06-24T15:40:54Z)
17. `/src/app/api/organizations/route.ts` - Organization management API
18. `/src/app/api/organizations/[id]/members/route.ts` - Organization member management API
19. `/src/app/api/organizations/[id]/members/[userId]/route.ts` - Individual member operations API
20. `/src/app/api/organizations/[id]/projects/route.ts` - Organization projects API
21. `/src/app/api/organizations/membership/[id]/route.ts` - Organization membership management API
20. `/src/app/api/version/route.ts` - Application version management API

### Components
11. `/src/components/IframeViewer.tsx` - Project viewing component
12. `/src/components/Loading.tsx` - Loading state component
13. `/src/components/LoginForm.tsx` - Email login form component
14. `/src/components/Header.tsx` - Navigation header with real-time updates

### Library and Utilities
14. `/src/lib/db.ts` - Database connection utilities
15. `/src/lib/auth.ts` - Authentication utilities
16. `/src/lib/settings-context.tsx` - Settings context provider
17. `/src/lib/styled.tsx` - Styled components utilities
18. `/src/lib/types.ts` - TypeScript type definitions

### Models
19. `/src/models/Settings.ts` - Settings database model
20. `/src/models/User.ts` - User database model
21. `/src/models/Organisation.ts` - Organisation database model with auto-slug generation
22. `/src/models/OrganisationMembership.ts` - Organisation membership model with role hierarchy
23. `/src/models/Version.ts` - Application version management model

### Configuration Files
21. `/next.config.ts` - Next.js configuration
22. `/tsconfig.json` - TypeScript configuration
23. `/vercel.json` - Vercel deployment configuration
24. `/package.json` - Project dependencies and scripts
25. `/src/middleware.ts` - Authentication middleware

### Documentation Files
26. `/README.md` - Project overview and setup instructions
27. `/LEARNINGS.md` - Development learnings and insights
28. `/RELEASE_NOTES.md` - Version history and changes
29. `/ROADMAP.md` - Project roadmap
30. `/TASKLIST.md` - Task tracking
31. `/STATUS_REPORT.md` - Comprehensive project status documentation
32. `/docs/DEVELOPMENT_GUIDE.md` - Implementation best practices and error prevention
33. `/docs/RESPONSIVE_IFRAME.md` - Technical guide for iframe implementation

## Deployment

The application is deployed to Vercel and is accessible at:
- Production: https://picito.vercel.app
- Admin Interface: https://picito.vercel.app/admin
- Documentation: https://picito.vercel.app/docs/guide

## Application Flow

1. Users can access the application through email-only authentication at `/login`.
2. New users are automatically registered on first login with default user role.
3. Authentication is handled via JWT tokens stored in HTTP-only cookies.
4. Protected routes (admin, users, organizations) require valid authentication.
5. The main page provides access to the admin interface and documentation.
6. Legal acceptance for Terms & Conditions and Privacy Policy enforced.
7. The admin interface allows configuration of multiple projects through a MongoDB-backed API with "Projects" navigation.
8. Each project configuration is accessible through a dynamic route at `/iframe/[id]`.
9. All styling is handled through styled-components to ensure consistent theming and responsive design.
10. The application uses a context provider to manage and distribute project settings across components.
11. Real-time navigation updates are implemented using `usePathname` and `useRouter` hooks with automatic session refresh.
12. The Header component provides dynamic menu visibility based on user authentication state and role.
13. **Organisation System**: Complete organisation membership functionality with role hierarchy (owner > admin > member).
14. **Version Management**: Automatic semantic versioning system with database storage and API access.
15. **Automated Versioning**: Scripts and npm commands for dev/commit/major version bumping with release notes.
15. **Role-Based Access Control**: Comprehensive permission system with owner protection and member management.
16. **Auto-User Creation**: New users automatically created when added to organisations via email.
17. **Project Visibility Management**: Admin interface for controlling public/private project settings via toggle controls.
18. **Organization Project Assignment**: Full system for assigning projects to organizations with role-based access control.
19. **Enhanced Admin Interface**: Comprehensive project and organization management with real-time updates.

## Enhanced Features (Epic 4.1 - 2025-06-24T13:23:34.054Z)

### Admin Project Management

**Location:** `/src/app/admin/projects/page.tsx`
**Features:**
- Comprehensive project dashboard with statistics (total, public, private counts)
- Real-time project visibility toggle controls
- Organization assignment functionality with dropdown selection
- Professional UI with loading states and feedback messages
- Integration with existing visibility and organization APIs

### Organization Project Integration

**Enhanced Location:** `/src/app/admin/organizations/page.tsx`
**New Features:**
- Expandable project sections for each organization
- Project count display and visibility status indicators
- Real-time project loading with proper error handling
- Organization-to-project relationship visualization

### Enhanced API Endpoints

#### Project Organization Management
- `GET /api/settings/[id]/organization` - Get project organization assignment
- `PATCH /api/settings/[id]/organization` - Update project organization assignment
- `GET /api/organisations/[id]/projects` - List projects assigned to organization

#### Security Enhancements
- Role-based access control for project assignments (owners/admins only)
- Membership validation for organization project operations
- Proper error handling and validation for all operations

### Database Schema Updates

#### Settings Model Enhancement
```typescript
// Added to IframeConfig interface and Settings model
organisationId?: string; // Optional organization association
```

**Migration Strategy:**
- Backward compatible - existing projects remain personal (organisationId = undefined)
- New projects can be assigned to organizations
- No breaking changes to existing functionality

### MongoDB Version Display Implementation (Added: 2025-06-27T14:00:00.000Z)

**Component Structure:**
1. Footer component with version display
2. MongoDB version fetching service
3. Real-time update subscription
4. Error handling and fallback display

**Technical Features:**
- Automatic version refresh on database updates
- Loading states during version fetches
- Error handling with fallback display
- Consistent timestamp formatting
- Integration with existing MongoDB connections

**Implementation Benefits:**
1. Single source of truth for version information
2. Real-time updates across all components
3. Professional UI with proper loading states
4. Consistent error handling

### Technical Achievements

1. **Zero Breaking Changes**: All existing functionality preserved
2. **Professional UI**: Consistent with existing admin interface design
3. **Type Safety**: Full TypeScript support with proper interface updates
4. **Error Handling**: Comprehensive error states and user feedback
5. **Performance**: Efficient API calls with proper loading states
6. **Security**: Role-based access control throughout the system
