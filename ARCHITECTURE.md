# Project Architecture

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
9. `/src/app/api/settings/route.ts` - API route for settings
10. `/src/app/api/auth/login/route.ts` - Authentication API endpoint

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
31. `/docs/DEVELOPMENT_GUIDE.md` - Implementation best practices and error prevention
32. `/docs/RESPONSIVE_IFRAME.md` - Technical guide for iframe implementation

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
