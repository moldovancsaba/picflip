# Picito - Project Content Scaler

Picito is a React-based web application that perfectly scales project content while maintaining aspect ratio. It's specifically designed to handle projects with fixed-size content that needs to be displayed responsively across different screen sizes.

**Live Demo:** [https://picito.vercel.app](https://picito.vercel.app)
**Admin Interface:** [https://picito.vercel.app/admin](https://picito.vercel.app/admin)

## Technologies Used

- **Next.js 15.3.4** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience
- **styled-components** - CSS-in-JS styling solution
- **MongoDB** - Database for storing configurations

## Key Features

### Core Functionality
- Maintains content's natural aspect ratio
- Responsive scaling that works on any screen size
- Perfectly centered content
- Smooth resize handling
- Zero content distortion

### User Management & Authentication
- User authentication with email-only login
- Automatic account creation for new users
- Role-based access control (admin/user roles)
- Real-time navigation updates based on user role with automatic session refresh
- Terms & Conditions and Privacy Policy acceptance

### Organisation Management (NEW in v2.7+)
- **Organisation Creation**: Create and manage organisations with auto-generated slugs
- **Membership System**: Role hierarchy with owner, admin, and member roles
- **Permission Control**: Comprehensive role-based access control
- **Member Management**: Add, remove, and update member roles
- **Owner Protection**: Cannot remove the last owner from an organisation
- **Auto-User Creation**: Automatically create user accounts when adding members via email
- **Frontend Organisations Page**: Complete UI for organisation listing and management (v2.9.0)

### Project Management
- **Admin Projects Page**: Comprehensive project management at `/admin/projects` (NEW in v2.10.0)
- **Project Detail Page**: Full project editing interface at `/admin/projects/[id]` (NEW in v2.11.1)
- **Project Visibility Controls**: Toggle public/private status for projects (NEW)
- **Organization Assignment**: Assign projects to organizations with role-based access (NEW)
- Project configuration with multiple aspect ratios
- Background color and image customization
- Content alignment controls
- Real-time visibility updates and statistics dashboard
- Comprehensive editing forms with validation and error handling

### Technical Features
- MongoDB integration for persistent storage
- **Database-Driven Versioning**: Full database-driven version management (package.json version field removed)
- **Automated Version Control**: Semantic versioning with automated scripts
- Centralized version management stored in database
- Dynamic menu visibility based on authentication state
- RESTful API endpoints for all major functionality

### Version Management
⚠️ **Important**: Version management is now entirely database-driven. The version field has been removed from package.json.

- **Version Storage**: All version information is stored in MongoDB
- **Publishing Control**: npm publish is intentionally disabled
- **Development Builds**: Auto-bump patch version after successful `npm run dev`
- **GitHub Commits**: Auto-bump minor version after commits
- **Major Releases**: Manual major version bumping for breaking changes
- **Release Documentation**: Auto-generated release notes with timestamps
- **Scripts**: `npm run version:dev`, `npm run version:commit`, `npm run version:major`

## Configuration

The application can be configured through the admin interface available at `/admin`. The "Projects" section allows you to modify:

- **Content URL** - The URL of the project content
- **Original Content Size** - The width and height of the original content (e.g., 1920×1080)
- **Aspect Ratio** - The desired aspect ratio for display (e.g., 16:9)
- **Background Color** - The background color in hex format (e.g., #FFFFFF)
- **Background Image URL** - Optional URL for a tiled background image
- **Horizontal Alignment** - Position content left, center, or right
- **Vertical Alignment** - Position content top, middle, or bottom

### Background Settings

You can set either a solid background color or a tiled background image (or both):

1. **Solid Color**
   - Use the color picker or enter a hex code
   - Applied as the base background color

2. **Tiled Image**
   - Enter a URL to an image
   - Image will be tiled (repeated) to cover the entire viewport
   - Leave empty to use only the solid color
   - If both are set, the image is displayed on top of the background color

All settings are automatically saved to MongoDB and persist across deployments.

### Content Alignment

The content can be positioned in 9 different ways using the alignment controls:

```
+-------------------+
| TL    TC     TR  |
|                   |
| ML    MC     MR  |
|                   |
| BL    BC     BR  |
+-------------------+

T = Top    M = Middle    B = Bottom
L = Left   C = Center    R = Right
```

This gives you full control over where the scaled content appears within the viewport while maintaining aspect ratio.

## How It Works

### Responsive Project Container

The application uses a three-layer approach to achieve perfect scaling:

1. **Container Layer** (`Container` styled-component)
   - Fixed positioning to cover the entire viewport
   - Removes any default spacing (margin, padding)
   - Handles overflow management

```typescript
const Container = styled.div`
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  display: block;
  overflow: hidden;
`;
```

2. **Wrapper Layer** (`IframeWrapper` styled-component)
   - Positions content in the center of the viewport
   - Maintains aspect ratio during scaling
   - Handles content overflow

```typescript
const IframeWrapper = styled.div`
  background: transparent;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
`;
```

3. **Project Layer** (`ResponsiveIframe` styled-component)
   - Centers the project content
   - Applies scaling transformation
   - Removes default iframe styling

```typescript
const ResponsiveIframe = styled.iframe`
  border: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  margin: 0;
  padding: 0;
`;
```

### Content Scaling Logic

The application uses a sophisticated scaling algorithm to maintain the aspect ratio while maximizing the content size:

1. **Original Content Dimensions**
   ```typescript
   const ORIGINAL_WIDTH = 1920;
   const ORIGINAL_HEIGHT = 1080;
   ```

2. **Scaling Calculation**
   ```typescript
   // Calculate scales to fit width and height while maintaining aspect ratio
   const scaleToFitWidth = viewportWidth / ORIGINAL_WIDTH;
   const scaleToFitHeight = viewportHeight / ORIGINAL_HEIGHT;

   // Use the smaller scale to ensure content fits within viewport
   const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

   // Calculate final dimensions
   const targetWidth = Math.round(ORIGINAL_WIDTH * scale);
   const targetHeight = Math.round(ORIGINAL_HEIGHT * scale);
   ```

3. **Apply Scaling**
   ```typescript
   const scale = targetWidth / ORIGINAL_WIDTH;
   iframeRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
   ```

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/moldovancsaba/picito.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build and Deployment

1. Create a production build
   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

The project is configured for deployment on Vercel with zero configuration needed.

## Documentation

Detailed project documentation is available in the following files:

### Core Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete technical architecture and file structure
- [README.md](./README.md) - Project overview and setup instructions (this file)

### Development Documentation
- [DELIVERYPLAN.md](./DELIVERYPLAN.md) - Epic implementation plans and delivery tracking
- [LEARNINGS.md](./LEARNINGS.md) - Development insights and key learnings
- [STATUS_REPORT.md](./STATUS_REPORT.md) - Comprehensive project status and deployment reports

### Project Management
- [ROADMAP.md](./ROADMAP.md) - Project development roadmap and milestones
- [TASKLIST.md](./TASKLIST.md) - Task tracking and progress monitoring
- [RELEASE_NOTES.md](./RELEASE_NOTES.md) - Version history and changes

### Technical Guides
- [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) - Implementation best practices and error prevention
- [docs/RESPONSIVE_IFRAME.md](./docs/RESPONSIVE_IFRAME.md) - Technical guide for iframe implementation

## Project Structure

For a complete overview of the project structure and technology stack, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

Key directories:

```
/src
  /app            # Next.js app router components
    /api          # API endpoints
      /organisations  # Organisation management APIs
      /admin      # Admin-specific APIs
      /auth       # Authentication APIs
      /version    # Version management API
  /components     # Reusable React components
  /lib            # Utilities and context providers
  /models         # Database models
    - Organisation.ts          # Organisation model with auto-slug
    - OrganisationMembership.ts # Membership with role hierarchy
    - User.ts                  # User authentication model
    - Settings.ts              # Project configuration model
    - Version.ts               # Application version management
/docs            # Technical documentation
```

## API Endpoints

### Organisation Management
- `GET/POST /api/organisations` - List and create organisations
- `GET/POST /api/organisations/[id]/members` - Manage organisation members
- `DELETE/PATCH /api/organisations/[id]/members/[userId]` - Individual member operations

### User & Authentication
- `POST /api/auth/login` - Email-only authentication
- `POST /api/auth/logout` - User logout
- `GET/PATCH /api/admin/users` - User management (admin only)

### Project Management (NEW in v2.10.0)
- `GET /api/settings` - Project configuration settings
- `GET/PATCH /api/settings/[id]/visibility` - Project visibility management
- `GET/PATCH /api/settings/[id]/organization` - Project organization assignment
- `GET /api/organisations/[id]/projects` - List organization projects

### Application Management
- `GET/POST /api/version` - Version management

### Role Hierarchy
- **Owner**: Full control, can manage all aspects including other owners
- **Admin**: Can manage members and projects, cannot manage owners
- **Member**: Basic access to organisation resources

## Testing

This project includes comprehensive testing with both unit tests and end-to-end tests:

### Unit Tests
Unit tests use Jest and React Testing Library:

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests
E2E tests use Playwright to test complete user workflows:

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with browser UI
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

#### E2E Test Coverage
- **Admin Edit Flows**: Tests editing users, projects, and organizations with persistence verification
- **Breadcrumb Navigation**: Tests navigation functionality across admin pages
- **Form Validation**: Tests required field validation and error handling
- **Data Persistence**: Verifies changes persist after page reload and navigation
- **CI Integration**: Automated testing in GitHub Actions with MongoDB service

See `e2e/README.md` for detailed E2E testing documentation.

Test files are located alongside their corresponding components in `__tests__` directories or with `.test.tsx` extensions.
