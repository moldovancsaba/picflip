import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: {
      // Enable server-side rendering
      ssr: true,
      // Enable client-side rendering
      displayName: true,
      // Enable minification
      minify: true,
      // Enable transpilation
      transpileTemplateLiterals: true
    }
  }
};

export default nextConfig;
