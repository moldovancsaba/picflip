# Project Roadmap

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
- [ ] Add public/private iFrame settings
- [ ] Implement organization iFrames
- [ ] Add SEO-friendly slugs
- [ ] Create organization URL structure

### Epic 4: Contact & Communication
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

2. **Epic 3.2 – Public/Private Projects**
   - Target Completion: 2025-07-07T17:00:00.000Z  
   - Priority: Independent feature, no schema changes required
   - Status: Planned

3. **Epic 2.3 – Organisation Permissions**
   - Target Completion: 2025-07-10T17:00:00.000Z
   - Priority: Builds on membership foundation
   - Status: Planned

4. **Epic 3.3 – Organisation Projects**
   - Target Completion: 2025-07-14T17:00:00.000Z
   - Priority: Requires membership & permissions as dependencies
   - Status: Planned

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
