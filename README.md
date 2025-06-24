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

- Maintains content's natural aspect ratio
- Responsive scaling that works on any screen size
- Perfectly centered content
- Smooth resize handling
- Zero content distortion
- Admin interface for project management (/admin)
- User authentication with email-only login
- Real-time navigation updates based on user role with automatic session refresh
- Terms & Conditions and Privacy Policy acceptance
- Role-based access control with dynamic menu visibility
- MongoDB integration for persistent storage

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

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete technical architecture and file structure
- [LEARNINGS.md](./LEARNINGS.md) - Development insights and key learnings
- [RELEASE_NOTES.md](./RELEASE_NOTES.md) - Version history and changes
- [ROADMAP.md](./ROADMAP.md) - Project development roadmap
- [TASKLIST.md](./TASKLIST.md) - Task tracking and progress
- [docs/RESPONSIVE_IFRAME.md](./docs/RESPONSIVE_IFRAME.md) - Technical guide for iframe implementation

## Project Structure

For a complete overview of the project structure and technology stack, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

Key directories:

```
/src
  /app            # Next.js app router components
  /components     # Reusable React components
  /lib            # Utilities and context providers
  /models         # Database models
/docs            # Technical documentation
```
