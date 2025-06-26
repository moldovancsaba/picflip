# Project Roadmap

## Version 7.0.0 Milestone (2025-06-27T13:00:00.000Z)

### Major Version Release
- [x] Successfully bumped version from 6.0.0 to 7.0.0
- [x] Updated package.json and MongoDB version records
- [x] Updated UI version display components
- [x] Created comprehensive release notes
- [x] Updated all documentation with new version

## Version 6.0.0 Milestone (2025-06-27T12:00:00.000Z)

### Major Version Release
- [x] Successfully bumped version from 5.0.0 to 6.0.0
- [x] Updated package.json and MongoDB version records
- [x] Updated UI version display components
- [x] Created comprehensive release notes
- [x] Updated all documentation with new version

## Version 5.0.0 Milestone (2025-06-27T11:00:00.000Z)

### Major Version Release
- [x] Successfully bumped version from 4.0.0 to 5.0.0
- [x] Updated package.json and MongoDB version records
- [x] Updated UI version display components
- [x] Created comprehensive release notes
- [x] Updated all documentation with new version

## Version Display System Enhancement

### Phase 1: VersionLabel Component Implementation ✅ COMPLETED
- Create reusable VersionLabel component
- Migrate all version displays to new component
- Implement MongoDB version retrieval
- Add comprehensive component tests

### Phase 2: MongoDB Integration Enhancement
- Strengthen MongoDB version tracking
- Implement version validation logic
- Add data consistency checks
- Monitor version synchronization

## MongoDB Versioning System Refactor (Added: 2024-01-09T14:32:45.789Z)

### Phase 1: MongoDB Version Management Implementation (**TODO**)
- Design and implement MongoDB schema for version tracking
- Create version collections and indexes
- Develop version management functions
- Create data migration tools

### Phase 2: Application Integration (**TODO**)
- Update application code to use MongoDB version source
- Implement version sync validation
- Add conflict resolution logic
- Create automated tests

### Phase 3: Deployment and Monitoring (**TODO**)
- Document new version management system
- Execute zero-downtime migration
- Monitor version consistency
- Validate system integrity

## Current Development Plan (Added: 2025-06-23T22:11:41.000Z)

### Epic 1: User Authentication & Management ✅ COMPLETED
- [x] Implement email-only login system
- [x] Add automatic account creation
- [x] Create user management interface
- [x] Add Terms & Privacy acceptance
- [x] Implement conditional navigation

### Epic 2: Organization Management
- [x] Build organization creation system (Completed: 2025-06-24T11:15:53.000Z)
- [x] Implement organization membership management (Completed: 2025-06-24T11:15:53.000Z)
- [ ] Add organization permissions system
- [x] Frontend Organisations Page (Added: 2025-01-08T10:15:30.789Z)
- [ ] Create organization dashboard
- [ ] Develop organization settings

### Epic 3: iFrame Project Enhancement
- [x] Update iFrame naming convention (Completed: 2025-06-24T05:20:28.000Z)
- [x] Add public/private iFrame settings (Completed: 2025-06-24T11:33:04.000Z)
- [x] Implement organization iFrames (Completed: 2025-06-24T13:23:34.054Z)
- [ ] Add SEO-friendly slugs
- [ ] Create organization URL structure

### Epic 4: Admin Interface Enhancement

- [x] Epic 4.1 - Basic admin interface with project visibility and organization assignment (Completed: 2025-06-24T13:23:34.054Z)
- [x] Epic 4.2 - Enhanced admin detail pages with comprehensive editing (Completed: 2025-06-24T19:52:19.000Z)
  - [x] User Detail Page (`/admin/users/[id]`) - Full CRUD with membership management (Completed: 2025-06-24T19:52:19.000Z)
  - [x] Organization Detail Page (`/admin/organizations/[id]`) - Profile editing and member management (Completed: 2025-06-24T19:52:19.000Z)
  - [x] Project Detail Page (`/admin/projects/[id]`) - Complete configuration editing with preview (Completed: 2025-06-24T15:40:54Z)
  - [x] Navigation Enhancements - Removed redundant breadcrumbs, added View Details buttons, fixed active highlighting (Completed: 2025-06-24T19:52:19.000Z)
  - [x] Shared components and design system through `/components/admin/shared.tsx` (Completed: 2025-06-24T19:52:19.000Z)
|- [ ] Epic 4.3 - Advanced admin features and reporting
|- [ ] Enhance user detail page with comprehensive management options (Added: 2025-04-13T12:34:56.789Z)
|- [ ] Add detailed navigation and error handling for detail pages (Added: 2025-04-13T12:34:56.789Z)
|- [ ] Implement advanced filtering and search capabilities (Added: 2025-04-13T12:34:56.789Z)

### Epic 5: Admin Dashboard & Documentation Management (Added: 2025-06-24T20:16:05.000Z)
- [ ] Epic 5.1 - Admin Dashboard with Analytics (Priority: High)
  - [ ] Transform admin page into dashboard with charts and statistics
  - [ ] Display general numbers: total users, projects, organizations
  - [ ] Add visual charts for data representation
  - [ ] Include activity metrics and growth indicators
- [ ] Epic 5.2 - Documentation Management System (Priority: High)
  - [x] Remove "← Back to Home" from documentation pages (Completed: 2025-06-26T12:12:54Z)
  - [ ] Create editable documentation interface in admin
  - [ ] List all documentation files on documentation page
  - [ ] Enable admin editing of documentation content
- [ ] Epic 5.3 - Individual Project URLs (Priority: Medium)
  - [ ] Create individual project page (`/projects/[id]`) similar to users and organizations
  - [ ] Add project detail view accessible to appropriate users
  - [ ] Implement proper routing and navigation

### Epic 6: UI/UX Enhancements & Mobile Responsiveness (Added: 2025-06-24T20:16:05.000Z)
- [ ] Epic 6.1 - Dark Mode Implementation (Priority: Medium)
  - [ ] Add dark/light theme toggle throughout application
  - [ ] Implement theme persistence and user preferences
  - [ ] Update all components to support both themes
- [ ] Epic 6.2 - Mobile Responsiveness (Priority: High)
  - [ ] Refactor Project Management page for mobile devices
  - [ ] Refactor Users page for mobile devices (follow organization page pattern)
  - [ ] Ensure consistent mobile experience across all admin pages
  - [ ] Test touch interactions and mobile navigation patterns

### Epic 5: Project Detail Enhancement
- [x] Epic 5.1 - Admin Project Detail Page Implementation (Completed: 2025-06-24T15:40:54Z)
  - [x] Dynamic route `/admin/projects/[id]` with Next.js App Router
  - [x] Five-section form: Basic Info, Dimensions, Background, Organization, Visibility
  - [x] Real-time form validation and error handling
  - [x] Professional UI with styled-components and responsive design
  - [x] Integration with existing API endpoints for GET and PATCH operations
  - [x] Comprehensive Jest/RTL test coverage with async mocking
  - [x] ISO 8601 timestamp formatting for metadata display
  - [x] Navigation breadcrumbs with back-to-list functionality

### Epic 5: Contact & Communication
- [ ] Develop contact form
- [ ] Create message management system
- [ ] Add main page contact section

### Epic 5: Data Management
- [ ] Implement user data storage
- [ ] Add organization data storage
- [ ] Update iFrame data storage
- [ ] Create message data storage

## 2025-07 Sprint 1 (2025-07-01T00:00:00.000Z → 2025-07-14T23:59:59.999Z)

### Prioritized Tasks

1. **Epic 2.2 – Organisation Membership** ✅ COMPLETED
   - Actual Completion: 2025-06-24T11:15:53.000Z
   - Priority: Foundation requirement for organization functionality
   - Status: ✅ Completed ahead of schedule

2. **Epic 3.2 – Public/Private Projects** ✅ COMPLETED
   - Actual Completion: 2025-06-24T11:33:04.000Z
   - Priority: Independent feature, no schema changes required
   - Status: ✅ Completed ahead of schedule

3. **Epic 2.3 – Organisation Permissions**
   - Target Completion: 2025-07-10T17:00:00.000Z
   - Priority: Builds on membership foundation
   - Status: Planned

4. **Epic 3.3 – Organisation Projects** ✅ COMPLETED
   - Actual Completion: 2025-06-24T13:23:34.054Z
   - Priority: Requires membership & permissions as dependencies
   - Status: ✅ Completed ahead of schedule

5. **Epic 4.2 – Enhanced Admin Detail Pages** ⚙️ PLANNED
   - Target Completion: 2025-06-24T16:00:00.000Z
   - Priority: Improve admin user experience with detailed editing capabilities
   - Status: Ready to start - builds on Epic 4.1 foundation

### Planned Milestone: Version 1.3.0
- **Target Release Date:** 2025-07-15T00:00:00.000Z
- **Epic 2 Progress Required:** Organisation Membership and Permissions completion
- **Key Features:**
  - Complete organization membership system
  - Role-based permission framework
  - Public/private project visibility
  - Organization project management
  - SEO-friendly URL structure
- **Success Criteria:**
  - All Epic 2.2 and 2.3 user stories completed
  - Epic 3.2 and 3.3 user stories delivered
  - Integration tests passing
  - Documentation updated
  - Production deployment successful

## Next Sprint (2025-07-01 → 2025-07-14)

### Priority Analysis & Dependencies

Based on dependency analysis, the following priority order ensures logical progression:

1. **Epic 2.2 – Organisation Membership** (Foundation requirement)
2. **Epic 3.2 – Public/Private Projects** (Independent feature, no schema changes)
3. **Epic 2.3 – Organisation Permissions** (Builds on membership)
4. **Epic 3.3 – Organisation Projects** (Requires membership & permissions)

### Sprint User Stories

#### Epic 2.2 – Organisation Membership (Days 1-4)

**Story 2.2.1: Organisation Model & Schema** (1 day)
- **As a** system architect
- **I want** to create the Organisation data model
- **So that** organisations can be stored and managed
- **Acceptance Criteria:**
  - Organisation model created with: name, slug, description, createdAt, updatedAt
  - Unique slug validation implemented
  - MongoDB indexes configured
  - Model exports properly typed
- **Estimate:** 1 day

**Story 2.2.2: Organisation Membership Model** (1 day)
- **As a** system architect
- **I want** to create the OrganisationMembership model
- **So that** users can be associated with organisations
- **Acceptance Criteria:**
  - OrganisationMembership model with: userId, organisationId, role, joinedAt
  - Role enum: 'owner', 'admin', 'member'
  - Proper foreign key relationships
  - Compound unique index on userId + organisationId
- **Estimate:** 1 day

**Story 2.2.3: Organisation Creation API** (1 day)
- **As a** user
- **I want** to create a new organisation
- **So that** I can manage projects under an organisation
- **Acceptance Criteria:**
  - POST /api/organisations endpoint
  - Auto-generates unique slug from name
  - Creator becomes organisation owner
  - Returns created organisation data
  - Proper error handling for duplicates
- **Estimate:** 1 day

**Story 2.2.4: Membership Management API** (1 day)
- **As an** organisation owner/admin
- **I want** to manage organisation members
- **So that** I can control access to the organisation
- **Acceptance Criteria:**
  - GET /api/organisations/[id]/members (list members)
  - POST /api/organisations/[id]/members (invite member)
  - DELETE /api/organisations/[id]/members/[userId] (remove member)
  - Role-based access control enforced
- **Estimate:** 1 day

#### Epic 3.2 – Public/Private Projects (Days 5-7)

**Story 3.2.1: Project Visibility Schema Update** (1 day)
- **As a** system architect
- **I want** to add visibility settings to projects
- **So that** projects can be public or private
- **Acceptance Criteria:**
  - Add `isPublic` boolean field to Settings model
  - Default to false (private)
  - Update existing configurations
  - Backward compatibility maintained
- **Estimate:** 1 day

**Story 3.2.2: Project Visibility API** (1 day)
- **As a** project owner
- **I want** to control project visibility
- **So that** I can share projects publicly or keep them private
- **Acceptance Criteria:**
  - PATCH /api/settings/[id]/visibility endpoint
  - Toggle public/private status
  - Only project creators can change visibility
  - Returns updated project data
- **Estimate:** 1 day

**Story 3.2.3: Public Project Access Control** (1 day)
- **As an** anonymous user
- **I want** to view public projects
- **So that** I can see shared content without authentication
- **Acceptance Criteria:**
  - Public projects accessible without login
  - Private projects require authentication
  - Proper 403/401 error handling
  - SEO-friendly public project URLs
- **Estimate:** 1 day

#### Epic 2.3 – Organisation Permissions (Days 8-10)

**Story 2.3.1: Permission Constants & Types** (1 day)
- **As a** developer
- **I want** to define organisation permissions
- **So that** access control is consistent across the app
- **Acceptance Criteria:**
  - Permission constants defined (CREATE_PROJECT, MANAGE_MEMBERS, etc.)
  - TypeScript types for permissions
  - Role-to-permission mapping
  - Permission validation utilities
- **Estimate:** 1 day

**Story 2.3.2: Permission Middleware** (1 day)
- **As a** system architect
- **I want** to implement permission checking middleware
- **So that** API endpoints are properly protected
- **Acceptance Criteria:**
  - Middleware checks user's organisation role
  - Validates required permissions
  - Returns appropriate error responses
  - Integrates with existing auth middleware
- **Estimate:** 1 day

**Story 2.3.3: Organisation Dashboard Permissions** (1 day)
- **As an** organisation member
- **I want** to see appropriate actions based on my role
- **So that** I can only perform actions I'm authorized for
- **Acceptance Criteria:**
  - UI elements hidden/shown based on permissions
  - Role-based navigation
  - Proper error messages for unauthorized actions
  - Admin-only sections clearly marked
- **Estimate:** 1 day

#### Epic 3.3 – Organisation Projects (Days 11-14)

**Story 3.3.1: Project-Organisation Association** (1 day)
- **As a** system architect
- **I want** to link projects to organisations
- **So that** projects can be managed under organisation context
- **Acceptance Criteria:**
  - Add organisationId field to Settings model
  - Foreign key relationship to Organisation
  - Migration for existing projects (null = personal)
  - Updated project creation flow
- **Estimate:** 1 day

**Story 3.3.2: Organisation Project APIs** (1 day)
- **As an** organisation member
- **I want** to manage projects within the organisation
- **So that** I can collaborate on organisation projects
- **Acceptance Criteria:**
  - GET /api/organisations/[id]/projects
  - POST /api/organisations/[id]/projects
  - Permission checks for project operations
  - Project listing includes organisation context
- **Estimate:** 1 day

**Story 3.3.3: Organisation Project UI** (1 day)
- **As an** organisation member
- **I want** to see organisation projects in the interface
- **So that** I can easily access and manage them
- **Acceptance Criteria:**
  - Organisation project listing page
  - Project creation within organisation context
  - Breadcrumb navigation
  - Filter by personal vs organisation projects
- **Estimate:** 1 day

**Story 3.3.4: Organisation URL Structure** (1 day)
- **As a** user
- **I want** SEO-friendly URLs for organisation projects
- **So that** projects are easily shareable and discoverable
- **Acceptance Criteria:**
  - URL pattern: /org/[slug]/project/[project-id]
  - Proper routing configuration
  - 404 handling for invalid organisation slugs
  - Canonical URLs for SEO
- **Estimate:** 1 day

### Sprint Summary
- **Total Duration:** 14 days (2025-07-01 → 2025-07-14)
- **Total Stories:** 14 user stories
- **Average Story Size:** 1 day each
- **Key Deliverables:**
  - Complete organisation membership system
  - Public/private project functionality
  - Role-based permission system
  - Organisation project management
  - SEO-friendly URL structure

### Risk Mitigation
- **Database Migration Risk:** Test all schema changes in development first
- **Breaking Changes:** Maintain backward compatibility for existing users
- **Performance Impact:** Monitor query performance with new relationships
- **User Experience:** Ensure smooth transition with clear migration messaging

## Completed Milestones

### 2025-06-24T00:21:37.000Z

- [x] Successfully reverted application to stable version 1.2.0
  - ✅ Restored working codebase from previous stable state
  - ✅ Verified all core functionality operates correctly
  - ✅ Confirmed version consistency across package.json and application build
  - ✅ Validated production deployment stability

- [x] Code deployment completed successfully (2025-06-23T19:23:40.000Z)
- [x] Step 6: Smoke-test application locally completed (2025-06-24T04:58:21.000Z)
  - ✅ Local dev server verified working on http://localhost:3000
  - ✅ Key navigation paths tested (/, /admin, /login, /docs/guide, /legal/privacy)
  - ✅ Version 1.2.0 confirmed in package.json and build output
  - ✅ All HTTP status codes verified (200 OK, 307 redirects working properly)
