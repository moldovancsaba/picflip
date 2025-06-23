# Release Notes

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
