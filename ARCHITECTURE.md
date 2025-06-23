# Project Architecture

## Technology Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: Styled Components
- **Deployment**: Vercel
- **Development Tools**:
  - npm (Package Manager)
  - Turbopack (Build Tool)

## Project Structure

### Core Application Files
1. `/src/app/page.tsx` - Main page component
2. `/src/app/layout.tsx` - Root layout component
3. `/src/app/admin/page.tsx` - Admin interface
4. `/src/app/iframe/[id]/page.tsx` - Dynamic iframe routes
5. `/src/app/docs/guide/page.tsx` - Documentation guide page
6. `/src/app/docs/guide/layout.tsx` - Documentation layout
7. `/src/app/api/settings/route.ts` - API route for settings

### Components
8. `/src/components/IframeViewer.tsx` - Iframe viewing component
9. `/src/components/Loading.tsx` - Loading state component

### Library and Utilities
10. `/src/lib/db.ts` - Database connection utilities
11. `/src/lib/settings-context.tsx` - Settings context provider
12. `/src/lib/styled.tsx` - Styled components utilities
13. `/src/lib/types.ts` - TypeScript type definitions

### Models
14. `/src/models/Settings.ts` - Settings database model

### Configuration Files
15. `/next.config.ts` - Next.js configuration
16. `/tsconfig.json` - TypeScript configuration
17. `/vercel.json` - Vercel deployment configuration
18. `/package.json` - Project dependencies and scripts

### Documentation Files
19. `/README.md` - Project overview and setup instructions
20. `/LEARNINGS.md` - Development learnings and insights
21. `/RELEASE_NOTES.md` - Version history and changes
22. `/ROADMAP.md` - Project roadmap
23. `/TASKLIST.md` - Task tracking
24. `/docs/RESPONSIVE_IFRAME.md` - Technical guide for iframe implementation

## Deployment

The application is deployed to Vercel and is accessible at:
- Production: https://picito.vercel.app
- Admin Interface: https://picito.vercel.app/admin
- Documentation: https://picito.vercel.app/docs/guide

## Application Flow

1. The application serves a main page that provides access to both the admin interface and documentation.
2. The admin interface allows configuration of multiple iframes through a MongoDB-backed API.
3. Each iframe configuration is accessible through a dynamic route at `/iframe/[id]`.
4. All styling is handled through styled-components to ensure consistent theming and responsive design.
5. The application uses a context provider to manage and distribute iframe settings across components.
