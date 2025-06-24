# Tech Stack Audit - Picito Project

**Audit Date**: 2025-01-27T20:13:45.678Z

## Technology Stack Versions ✅

### Core Framework & Runtime
- **Next.js**: 15.3.4 ✅ (Confirmed - matches requirement)
- **React**: 19.1.0 
- **React DOM**: 19.1.0
- **TypeScript**: 5.8.3 ✅ (Confirmed - TypeScript 5.x)
- **Node.js**: Minimum npm >=10.9.2 (as per engines in package.json)

### Database & Data Layer
- **MongoDB**: 6.17.0 ✅ (Confirmed)
- **Mongoose**: 8.16.0 (ORM for MongoDB)

### Styling & UI
- **Styled-Components**: 6.1.19 ✅ (Confirmed - matches requirement)
- **@types/styled-components**: 5.1.34

### Authentication & Security
- **Jose**: 6.0.11 (JWT handling)

### Additional Libraries
- **Marked**: 15.0.12 (Markdown parsing)

### Development Dependencies
- **@types/node**: 20.19.1
- **@types/react**: 19.1.8
- **@types/react-dom**: 19.1.6

## Development Configuration

### TypeScript Configuration (tsconfig.json)
- **Target**: ES2017
- **Module System**: ESNext with bundler resolution
- **JSX**: Preserve (for Next.js)
- **Strict Mode**: Enabled
- **Path Mapping**: `@/*` → `./src/*`

### Next.js Configuration
- **Turbopack**: Enabled for development (`--turbopack` flag)
- **App Router**: Confirmed (using `src/app` directory structure)

## Existing Helper Utilities & Architecture

### Database Layer (`src/lib/db.ts`)
- **Connection Management**: Mongoose with connection caching
- **Environment**: Uses `MONGODB_URI` from environment variables
- **Pattern**: Singleton pattern with global caching for serverless environments

### Authentication Layer (`src/lib/auth.ts`)
- **JWT Implementation**: Using Jose library
- **Token Management**: HTTP-only cookies with secure settings
- **User Interface**: `UserJwtPayload` with email and role
- **Session Handling**: Request-based session validation

### Type Definitions (`src/lib/types.ts`)
- **IframeConfig Interface**: Core configuration structure
- **Alignment Types**: Horizontal and vertical alignment enums

### Styled Components Setup (`src/lib/styled.tsx`)
- **SSR Support**: Proper server-side rendering with `useServerInsertedHTML`
- **Registry Pattern**: StyleSheetManager for consistent styling

### Data Models
- **Organisation** (`src/models/Organisation.ts`): Organization management with slug generation
- **OrganisationMembership** (`src/models/OrganisationMembership.ts`): Role-based membership system
- **User Model**: Referenced in admin pages

### Context & State Management (`src/lib/settings-context.tsx`)
- **Settings Provider**: React Context for configuration management
- **CRUD Operations**: Create, read, update, delete configurations
- **API Integration**: `/api/settings` endpoints
- **Loading States**: Built-in loading state management

## Coding Conventions & Patterns

### File Structure Conventions
- **App Router**: Using Next.js 13+ app directory structure
- **Page Components**: Located at `src/app/[route]/page.tsx`
- **Layout Components**: Shared layouts at `src/app/[route]/layout.tsx`
- **Library Code**: Utilities in `src/lib/`
- **Models**: Database models in `src/models/`
- **Components**: Reusable components in `src/components/`

### TypeScript Conventions
- **Interface Naming**: Prefixed with `I` (e.g., `IOrganisation`, `IUser`)
- **Type Exports**: Both interfaces and default mongoose models exported
- **Strict Typing**: Full TypeScript strict mode enabled

### React/Next.js Conventions
- **"use client"**: Client components explicitly marked
- **Styled Components**: Extensive use with TypeScript generics (`<{ $active: boolean }>`)
- **Hook Patterns**: Custom hooks like `useSettings()`
- **Error Handling**: Try-catch patterns with user-friendly error states

### Styled Components Patterns
- **Container Components**: Consistent naming (Container, Grid, Form, etc.)
- **Prop-based Styling**: Using `$active`, `$primary` prefix for transient props
- **Color Scheme**: Consistent blue theme (`#0070f3`, `#0051cc`)
- **Responsive Design**: Grid layouts with gap spacing

### Database Conventions
- **Schema Validation**: Comprehensive validation rules
- **Indexing**: Performance indexes on commonly queried fields
- **Timestamps**: Automatic `createdAt`/`updatedAt` timestamps
- **Pre-save Hooks**: Business logic validation in schema hooks

### API Route Conventions
- **RESTful Patterns**: Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **Error Responses**: Consistent error handling
- **Authentication**: JWT-based session validation

## New Admin Organizations Page Plan

### File Location ✅
**Path**: `/src/app/admin/organizations/page.tsx`
- Follows existing admin page structure pattern
- Consistent with existing `/src/app/admin/users/page.tsx`
- Will integrate with existing admin layout at `/src/app/admin/layout.tsx`

### Reusable Components & Utilities ✅
The new page will reuse these existing utilities:

#### Database Layer
- `src/lib/db.ts` - MongoDB connection management
- `src/models/Organisation.ts` - Organization data model
- `src/models/OrganisationMembership.ts` - Membership management

#### Authentication
- `src/lib/auth.ts` - JWT session validation
- Existing admin route protection patterns

#### UI Components & Patterns
- Styled-components patterns from existing admin pages
- Layout structure from `src/app/admin/layout.tsx`
- Loading component from `src/components/Loading.tsx`
- Same color scheme and component naming conventions

#### React Hooks & State Management
- `useState`, `useEffect` patterns from existing admin pages
- `useRouter` for navigation
- Error handling patterns from `src/app/admin/users/page.tsx`

### No New External Libraries ✅
- Will use only existing dependencies
- Leverages established styled-components for styling
- Uses existing TypeScript interfaces and patterns
- Follows established API route patterns

## ISO 8601 Time Format Rule ✅
As per established rule: All timestamps will use ISO 8601 format with milliseconds:
**Format**: `2025-04-13T12:34:56.789Z`
- Applied in UI displays
- Used in documentation
- Consistent across all components

## Conclusion

The existing tech stack is well-established and follows consistent patterns. The new admin organizations page at `/src/app/admin/organizations/page.tsx` will seamlessly integrate with:

1. ✅ **Confirmed Versions**: Next.js 15.3.4, TypeScript 5.x, Styled-Components 6.x, MongoDB 6.x
2. ✅ **Existing Architecture**: Database layer, authentication, models, and UI patterns
3. ✅ **No New Dependencies**: Will reuse all existing helper utilities
4. ✅ **Consistent Conventions**: Following established coding patterns and file structure

The codebase is ready for the new organizations management page implementation using the documented patterns and utilities.
