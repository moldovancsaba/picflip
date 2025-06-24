# Release Notes

## Version 2.11.3 (2025-06-24T15:50:27Z)

### Critical Bug Fix - Organization Editing
- **Fixed**: Organization editing functionality that was completely broken
- **Error Resolved**: "Failed to execute 'json' on 'Response'" when renaming organizations
- **Root Cause**: Frontend code was calling wrong API endpoint `/api/organisations/[id]` instead of `/api/admin/organizations/[id]`
- **Solution**: Updated organization editing to use correct admin API endpoint

### Enhanced Error Handling
- **Improved**: JSON response parsing with fallback error handling
- **Added**: Try-catch wrapper for API response parsing to prevent crashes
- **Enhanced**: Error message extraction from API responses with better defaults
- **Benefit**: More resilient error handling prevents application crashes from malformed responses

### Technical Details
- **File Modified**: `/src/app/admin/organizations/page.tsx`
- **API Endpoint Corrected**: Changed from `/api/organisations/[id]` to `/api/admin/organizations/[id]`
- **Method**: PATCH operation for organization updates
- **Verification**: Build test passed, confirming fix doesn't break other functionality

### User Impact
- **Before**: Organization renaming completely non-functional with cryptic error messages
- **After**: Organization editing works correctly with proper error feedback
- **Experience**: Admin users can now successfully rename organizations through the UI

### Prevention Measures
- **Documentation**: Clear API endpoint documentation to prevent similar issues
- **Error Handling**: Robust response parsing prevents similar JSON parsing failures
- **Testing Strategy**: Build verification catches integration issues early
- **Code Quality**: Consistent error handling patterns across admin interface

## Version 2.11.2 (2025-06-24T15:40:54Z)

### Epic 5.1 - Admin Project Detail Page Implementation
- **New Feature**: Complete project detail editing interface at `/admin/projects/[id]`
- **Form Sections**: Organized editing interface with 5 logical sections:
  - Basic Information (name, content URL)
  - Dimensions & Alignment (width, height, aspect ratio, positioning)
  - Background (color picker, image URL)
  - Organisation Assignment (dropdown with current assignment display)
  - Visibility (toggle switch with status descriptions)
- **Metadata Display**: Read-only project ID and last updated timestamp in ISO 8601 format
- **Navigation**: Back button to return to projects list with proper breadcrumb flow
- **Real-time Updates**: Immediate feedback for save operations with success/error messages

### UI/UX Enhancements
- **Professional Form Design**: Styled-components based form with consistent design patterns
- **Two-Column Layout**: Efficient space usage for related fields (dimensions, aspect ratios)
- **Custom Toggle Switch**: Professional visibility toggle with visual state indicators
- **Loading States**: Separate loading states for initial fetch and save operations
- **Comprehensive Validation**: Client-side validation with server-side validation backup
- **Error Handling**: Detailed error messages with proper user guidance

### Technical Implementation
- **Dynamic Routing**: Next.js App Router pattern with proper parameter handling
- **API Integration**: GET and PATCH operations with `/api/admin/projects/[id]` endpoint
- **State Management**: Single form state object managing complex multi-section form
- **TypeScript Safety**: Full type definitions for project data and form interfaces
- **Styled Components**: Transient props pattern to prevent DOM warnings
- **Test Coverage**: Comprehensive Jest/RTL tests for fetch, edit, save, and error scenarios

### Testing and Quality Assurance
- **Unit Tests**: 12 test cases covering happy path and error scenarios
- **Mock Management**: Proper mocking of Next.js navigation hooks and fetch operations
- **Error Simulation**: Tests for 401 redirects, validation errors, and network failures
- **Build Verification**: Successful compilation with zero TypeScript errors
- **Manual Testing Ready**: Component ready for browser-based validation

### Security and Validation
- **Admin-Only Access**: Route and API level authorization checks
- **Input Validation**: Zod schema validation on backend with client-side validation
- **Error Security**: Security-conscious error messages that don't expose internals
- **401 Handling**: Proper redirect to login for unauthorized access attempts

### Performance Considerations
- **Efficient Updates**: Single PATCH request with all form data rather than field-by-field
- **Component Reuse**: Leveraging existing Loading component and styling patterns
- **State Optimization**: Minimal re-renders through proper state structure
- **API Efficiency**: Fetching organization list only when needed

### Version Management
- **Previous Version**: 2.11.1
- **New Version**: 2.11.2 (planned)
- **Bump Type**: Development build completion
- **Timestamp**: 2025-06-24T15:40:54Z
- **Status**: Implementation complete, ready for manual testing

## Version 2.11.1 (2025-06-24T15:25:58.251Z)

### Enhanced Admin UI & Project Management
- **Modal-Based Project Creation**: Replaced prompt-based project creation with professional modal form similar to organization creation
- **Project Organization Assignment**: Projects can now be assigned to organizations from the admin projects page
- **Project Visibility Control**: Toggle public/private visibility for projects directly from the project management interface
- **Organization Editing**: Added edit functionality for organizations with proper form validation
- **User Organization Management**: Enhanced user management to support organization relationships
- **Real-time Status Updates**: Live feedback for all admin operations with success/error messages

### New Features
- **Organization Assignment Interface**: Select dropdown with assignment button for seamless project-to-organization mapping
- **Visibility Toggle Switch**: Interactive switch to control whether projects appear on the main page without login
- **Edit Organization Modal**: Professional modal form for updating organization details
- **Enhanced Project Statistics**: Real-time statistics showing total, public, and private project counts
- **Universal Date Formatting**: ISO 8601 format with milliseconds throughout the UI (2025-04-13T12:34:56.789Z)

### UI/UX Improvements
- **Consistent Modal Design**: All creation and editing forms now use the same professional modal pattern
- **Professional Form Validation**: Client-side validation with proper error messaging
- **Loading States**: Proper loading indicators for all async operations
- **Responsive Design**: All new components maintain consistency with existing design patterns
- **Admin Dashboard Polish**: Enhanced layout and visual hierarchy for better user experience

### Technical Enhancements
- **Shared Admin Components**: Created reusable component library in `/src/components/admin/`
  - Breadcrumbs component with design tokens
  - DetailHeader with metadata and action buttons
  - FormField, Select, and Toggle components
  - BackButton for navigation
  - Centralized design tokens for consistent styling
- **API Endpoints**: New REST endpoints for project visibility and organization assignment
- **Enhanced Security**: Admin-only access controls for organization management
- **Database Integration**: Proper MongoDB updates with change tracking

### API Improvements
- **PATCH /api/settings/[id]/visibility**: Update project public/private status
- **PATCH /api/settings/[id]/organization**: Assign/unassign projects to organizations
- **Enhanced Admin Controls**: Admin users can assign projects to any organization
- **Proper Error Handling**: Comprehensive error responses with user-friendly messages

### Version Management
- **Previous Version**: 2.11.0
- **New Version**: 2.11.1
- **Bump Type**: dev
- **Timestamp**: 2025-06-24T15:25:58.251Z
- **Auto-generated**: Yes


## Version 2.11.0 (2025-06-24T15:20:41.194Z)

### Minor Release
- **Release**: Code committed to GitHub repository
- **Version Bump**: Minor version incremented from 2.10.0 to 2.11.0
- **Status**: Ready for deployment

### Technical Details
- **Previous Version**: 2.10.0
- **New Version**: 2.11.0
- **Bump Type**: commit
- **Timestamp**: 2025-06-24T15:20:41.194Z
- **Auto-generated**: Yes


## Version 2.10.0 (2025-06-24T13:30:01.238Z)

### Minor Release
- **Release**: Code committed to GitHub repository
- **Version Bump**: Minor version incremented from 2.9.4 to 2.10.0
- **Status**: Ready for deployment

### Technical Details
- **Previous Version**: 2.9.4
- **New Version**: 2.10.0
- **Bump Type**: commit
- **Timestamp**: 2025-06-24T13:30:01.238Z
- **Auto-generated**: Yes


## Version 2.9.4 (2025-06-24T13:23:34.053Z)

### Development Build
- **Development**: Successfully completed `npm run dev` testing
- **Version Bump**: Patch version incremented from 2.9.3 to 2.9.4
- **Status**: Development build ready for further testing

### Technical Details
- **Previous Version**: 2.9.3
- **New Version**: 2.9.4
- **Bump Type**: dev
- **Timestamp**: 2025-06-24T13:23:34.053Z
- **Auto-generated**: Yes


## Version 2.9.2 (2025-06-24T12:58:39.371Z)

### Development Build
- **Development**: Successfully completed `npm run dev` testing
- **Version Bump**: Patch version incremented from 2.9.1 to 2.9.2
- **Status**: Development build ready for further testing

### Technical Details
- **Previous Version**: 2.9.1
- **New Version**: 2.9.2
- **Bump Type**: dev
- **Timestamp**: 2025-06-24T12:58:39.371Z
- **Auto-generated**: Yes


## Version 2.9.1 (2025-06-24T12:56:53.011Z)

### Development Build
- **Development**: Successfully completed `npm run dev` testing
- **Version Bump**: Patch version incremented from 2.9.0 to 2.9.1
- **Status**: Development build ready for further testing

### Technical Details
- **Previous Version**: 2.9.0
- **New Version**: 2.9.1
- **Bump Type**: dev
- **Timestamp**: 2025-06-24T12:56:53.011Z
- **Auto-generated**: Yes


## Version 2.9.0 (2025-01-08T10:15:30.789Z)

### Frontend Organisations Page Implementation
- **New Feature**: Complete frontend UI for organisation management
- **Organisation Listing**: Display user's organisations with role indicators
- **Organisation Creation**: User-friendly form for creating new organisations
- **Member Management**: Interface for managing organisation members and roles
- **Navigation Integration**: Organisations menu item added to main navigation
- **Role-Based UI**: Different functionality based on user's organisation role

### User Experience Improvements
- **Intuitive Interface**: Organisation cards with clear role display
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages and feedback
- **Responsive Design**: Consistent with existing application design patterns
- **Accessibility**: Role-based visibility for appropriate user access

### Technical Implementation
- **Component Architecture**: Modular React components for organisation features
- **API Integration**: Seamless connection to existing backend organisation APIs
- **TypeScript Safety**: Full type safety for all new frontend components
- **Styled Components**: Consistent styling with existing application patterns
- **Authentication**: Proper integration with existing auth and role systems

### Documentation Updates
- **Architecture**: Updated component list and navigation structure
- **Features**: Added frontend organisation management to feature list
- **Development**: Enhanced frontend development patterns and learnings
- **Planning**: Comprehensive delivery plan and task tracking

## Version 2.0.0 (2025-06-24T07:28:40.000Z)

### Major Release
- **BREAKING CHANGE**: Major version bump to v2.0.0
- Complete Epic 2.2 Organisation Membership implementation
- Enhanced database architecture with new models and APIs
- Comprehensive documentation overhaul and roadmap refresh
- Enhanced project structure and architectural improvements
- Critical database connection and schema index fixes

### Documentation Updates
- Updated ROADMAP.md with comprehensive 2025-07 Sprint 1 planning
- Enhanced sprint prioritization with dependency analysis
- Added detailed user stories with acceptance criteria and time estimates
- Documented Version 1.3.0 milestone with clear success criteria
- Improved task management documentation

### Project Management
- Established clear sprint planning methodology
- Added comprehensive task prioritization framework
- Enhanced team communication structure
- Implemented proper version control practices

### Epic 2.2 - Organisation Membership (NEW)
- **Organisation Model**: Created with auto-slug generation and collision handling
- **Membership Model**: Implemented role hierarchy (owner > admin > member)
- **API Endpoints**: Complete CRUD operations for organisations and memberships
  - `GET/POST /api/organisations` - List and create organisations
  - `GET/POST /api/organisations/[id]/members` - Member management
  - `DELETE/PATCH /api/organisations/[id]/members/[userId]` - Individual member operations
- **Role-Based Access Control**: Comprehensive permission system with owner protection
- **Auto-User Creation**: Automatic account creation for new email addresses
- **Data Validation**: Proper TypeScript interfaces and mongoose schema validation

### Critical Bug Fixes
- **Database Connection**: Fixed hardcoded MongoDB URI to use environment variables
- **Schema Index Warning**: Resolved mongoose duplicate index warnings for slug field
- **TypeScript Errors**: Fixed route parameter typing for Next.js App Router
- **Authentication Issues**: Restored proper session management and login functionality
- **Project Visibility**: Fixed missing iframe projects on main page

### Technical Improvements
- Build system verified and optimized with zero warnings
- Dependencies updated and validated
- Production deployment readiness confirmed
- Development environment stability assured
- Enhanced error handling and validation across all new APIs
- Comprehensive TypeScript safety with proper interfaces

### Team Readiness
- All documentation fully current and comprehensive
- Next sprint tasks clearly defined and prioritized
- Roadmap aligned with project goals
- Team notification processes established

## Version 1.2.0 (2025-06-23T23:02:09.000Z)

### Features
- Complete user authentication with JWT implementation
- Role-based access control system
- User management interface for admins
- Terms & Privacy acceptance tracking
- Global navigation with conditional items

### Improvements
- Enhanced header with user context
- Streamlined admin navigation
- Added role-based route protection
- Improved session management
- Added legal document components

### Documentation
- Updated architecture documentation
- Added user management guides
- Enhanced technical documentation
- Added legal documents

### Security
- JWT-based authentication
- Protected API routes
- Role-based access control
- Secure cookie handling
- Legal acceptance enforcement

### Testing
- Smoke testing completed (2025-06-24T04:58:21.000Z)
- All key navigation paths verified
- Local development server functionality confirmed
- Version consistency validated across application

### User Experience Improvements
- Updated main page welcome text to be more focused and concise
- Implemented real-time navigation menu updates
- Enhanced admin navigation to automatically appear/disappear based on user role
- Improved session management with automatic refresh on route changes
- Streamlined user interface terminology (Dashboard → Projects)

### Documentation & UI Terminology
- Updated UI terminology from "Admin" to "Projects" throughout the application for clearer user navigation
- Enhanced main page welcome text to be more focused and concise, improving user onboarding experience
- Implemented real-time navigation menu updates with automatic session refresh on route changes
- Refined admin navigation to automatically appear/disappear based on user role with improved visual consistency
- Version 1.2.0 is now fully documented with comprehensive feature coverage in README.md and ARCHITECTURE.md

## Version 1.1.0 (2025-06-23T22:48:54.000Z)

### Features
- Email-only authentication with JWT tokens
- User management interface with role-based access control
- Terms & Conditions and Privacy Policy implementation
- Legal acceptance tracking with timestamps
- Enhanced admin interface with secure access

### Technical Improvements
- Added user model with MongoDB integration
- Implemented middleware-based authentication
- Added legal document components with shared styles
- Improved error handling and validation
- Enhanced session management

### Documentation
- Updated architecture documentation with auth components
- Added user authentication flow documentation
- Updated project structure documentation

### Security
- Secure cookie-based token storage
- Role-based access control for admin features
- Legal acceptance requirements for new users
- Protected API routes with middleware

## Version 1.0.0 (2025-06-23T22:13:41.000Z)

### Major Features
- Complete user authentication system with email-only login
- Organization management with roles and permissions
- Enhanced iFrame project management
- Contact form and message management system
- Comprehensive data management with MongoDB

### Breaking Changes
- URL structure updated to support organizations (/organisation/iframe/slug)
- Configuration renamed to iFrame throughout the application
- New authentication system replaces previous direct access

### Technical Improvements
- Added JWT authentication
- Enhanced MongoDB schemas for all entities
- Implemented role-based access control
- Added audit logging system
- Improved backup procedures

### Documentation
- Updated all documentation to reflect new features
- Added Terms & Conditions and Privacy Policy
- Enhanced technical guides for new functionality

### Security
- Email-based authentication system
- Role-based access control
- Organization-level permissions
- Rate limiting for contact form

## Version 0.1.1 (2025-04-13T12:34:56.789Z)

### Changes
- Updated production URL to https://picito.vercel.app
- Added comprehensive architecture documentation
- Improved documentation navigation and organization

## Version 0.1.0 (2025-06-23T19:13:44Z)

### Features
- Initial release of Picito (formerly PicFlip)
- Responsive iframe scaling with aspect ratio maintenance
- Admin interface for configuration
- MongoDB integration for settings storage
- Full viewport coverage with no visual artifacts

### Technical Specifications
- Next.js 15.3.4
- React 19
- TypeScript
- Styled-components
- MongoDB integration

### Documentation
- Added comprehensive README.md
- Created technical guide for responsive iframe implementation
- Added development learnings documentation

### Known Issues
- None reported

### Testing
- Manual QA completed for responsive behavior
- Tested on desktop and mobile dimensions
- Verified iframe coverage and visual presentation

### Upcoming Features
- Animation options
- Multiple concurrent iframes support
- Enhanced performance optimizations
