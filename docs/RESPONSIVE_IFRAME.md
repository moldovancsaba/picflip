# Building a Responsive iFrame: Technical Guide

This guide explains how to create a responsive iframe that maintains aspect ratio and covers the entire viewport without borders, shadows, or rounded corners. This is the core technology behind Picito.

## Core Principles

1. Viewport Coverage
2. Aspect Ratio Maintenance
3. No Visual Artifacts
4. Responsive Scaling

## Implementation

### 1. HTML Structure

```html
<div class="container">
  <div class="iframe-wrapper">
    <iframe
      src="your-content-url"
      class="responsive-iframe"
      frameborder="0"
      scrolling="no"
      allowfullscreen
    ></iframe>
  </div>
</div>
```

### 2. CSS Implementation

```css
/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Container takes full viewport */
.container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000; /* Or any desired background */
}

/* Wrapper for positioning and scaling */
.iframe-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* iframe styling */
.responsive-iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  border: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  transform-origin: center center;
}
```

### 3. JavaScript Scaling Logic

```javascript
class ResponsiveIframe {
  constructor(iframeElement, originalWidth, originalHeight) {
    this.iframe = iframeElement;
    this.originalWidth = originalWidth;
    this.originalHeight = originalHeight;
    
    // Bind methods
    this.updateScale = this.updateScale.bind(this);
    
    // Initial setup
    this.setup();
  }
  
  setup() {
    // Set initial dimensions
    this.iframe.width = this.originalWidth;
    this.iframe.height = this.originalHeight;
    
    // Add resize listener
    window.addEventListener('resize', this.updateScale);
    
    // Initial scale
    this.updateScale();
  }
  
  updateScale() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate scale factors
    const scaleX = viewportWidth / this.originalWidth;
    const scaleY = viewportHeight / this.originalHeight;
    
    // Use the smaller scale to maintain aspect ratio
    const scale = Math.min(scaleX, scaleY);
    
    // Apply transform
    this.iframe.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
  
  cleanup() {
    window.removeEventListener('resize', this.updateScale);
  }
}
```

### 4. Usage

```javascript
// Initialize with your iframe's original dimensions
const iframe = document.querySelector('.responsive-iframe');
const responsiveIframe = new ResponsiveIframe(iframe, 1920, 1080);
```

## React Implementation

Here's how to implement this in a React component:

```tsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #000;
`;

const IframeWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StyledIframe = styled.iframe`
  position: absolute;
  top: 50%;
  left: 50%;
  border: none;
  margin: 0;
  padding: 0;
  transform-origin: center center;
`;

interface ResponsiveIframeProps {
  src: string;
  originalWidth: number;
  originalHeight: number;
}

const ResponsiveIframe: React.FC<ResponsiveIframeProps> = ({
  src,
  originalWidth,
  originalHeight
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateScale = () => {
    if (!iframeRef.current) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scaleX = viewportWidth / originalWidth;
    const scaleY = viewportHeight / originalHeight;
    const scale = Math.min(scaleX, scaleY);

    iframeRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
  };

  useEffect(() => {
    // Set initial dimensions
    if (iframeRef.current) {
      iframeRef.current.width = originalWidth.toString();
      iframeRef.current.height = originalHeight.toString();
    }

    // Initial scale
    updateScale();

    // Add resize listener
    window.addEventListener('resize', updateScale);

    // Cleanup
    return () => window.removeEventListener('resize', updateScale);
  }, [originalWidth, originalHeight]);

  return (
    <Container>
      <IframeWrapper>
        <StyledIframe
          ref={iframeRef}
          src={src}
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        />
      </IframeWrapper>
    </Container>
  );
};

export default ResponsiveIframe;
```

## Common Pitfalls and Solutions

1. **Flickering During Resize**
   - Solution: Add `transform-style: preserve-3d` to force hardware acceleration

2. **White Borders**
   - Solution: Ensure all containing elements have `margin: 0; padding: 0; border: none;`

3. **Scroll Bars Appearing**
   - Solution: Add `overflow: hidden` to all containing elements

4. **Content Not Centered**
   - Solution: Double-check transform origin and centering calculations

5. **Mobile Safari Issues**
   - Solution: Add `-webkit-overflow-scrolling: touch` to container

## Performance Optimization

1. **Debounce Resize Events**
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const debouncedUpdateScale = debounce(updateScale, 16); // ~1 frame at 60fps
window.addEventListener('resize', debouncedUpdateScale);
```

2. **Use RequestAnimationFrame**
```javascript
function updateScale() {
  requestAnimationFrame(() => {
    // scaling logic here
  });
}
```

## Browser Support

This implementation works in all modern browsers. For older browsers, consider these polyfills:

- `position: fixed` fallback for older mobile browsers
- `transform` prefixes for older browsers
- `requestAnimationFrame` polyfill for smoother animations

## Testing

Key scenarios to test:

1. Desktop browser resize
2. Mobile orientation change
3. Different aspect ratios
4. Various content sizes
5. Different browser zoom levels
6. Touch interaction on mobile devices

Use browser dev tools to test different viewport sizes and device emulation.
