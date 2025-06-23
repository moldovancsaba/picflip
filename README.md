# PicFlip - Responsive iFrame Content Scaler

PicFlip is a React-based web application that perfectly scales iframe content while maintaining aspect ratio. It's specifically designed to handle iframes with fixed-size content that needs to be displayed responsively across different screen sizes.

**Live Demo:** [https://picflip-2cjlj0odg-narimato.vercel.app](https://picflip-2cjlj0odg-narimato.vercel.app)

## Technologies Used

- **Next.js 15.3.4** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience
- **styled-components** - CSS-in-JS styling solution

## Key Features

- Maintains content's natural aspect ratio
- Responsive scaling that works on any screen size
- Perfectly centered content
- Smooth resize handling
- Zero content distortion
- Admin interface for configuration (/admin)

## Configuration

The application can be configured through the admin interface available at `/admin`. This page allows you to modify:

- **Content URL** - The URL of the iframe content
- **Original Content Size** - The width and height of the original content (e.g., 1400×1244)
- **Aspect Ratio** - The desired aspect ratio for display (e.g., 9:8)
- **Background Color** - The background color in hex format (e.g., #FF0000)

Settings are automatically saved to localStorage and persist across page reloads.

## How It Works

### Responsive iFrame Container

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

3. **iFrame Layer** (`ResponsiveIframe` styled-component)
   - Centers the iframe content
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
   const ORIGINAL_WIDTH = 1400;
   const ORIGINAL_HEIGHT = 1244;
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
   git clone https://github.com/moldovancsaba/picflip.git
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

## Project Structure

```
/src
  /app
    /page.tsx     # Main component with iframe scaling logic
    /admin
      /page.tsx   # Admin interface for configuration
    /layout.tsx   # Root layout with styled-components setup
  /lib
    /styled.tsx   # Styled-components registry for Next.js
    /settings-context.tsx # Settings management and persistence
```
