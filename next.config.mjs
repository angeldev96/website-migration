/** @type {import('next').NextConfig} */
// Use an environment variable to control the mount path so local dev doesn't break.
// Set `NEXT_PUBLIC_BASE_PATH` to "/app" (or your mount path) in production/environment
// where the app is hosted under a subpath (e.g., Webflow Cloud). Leave unset for local dev.
const nextConfig = {
  basePath: '/app',
  assetPrefix: '/app',
  
  // Performance optimizations
  experimental: {
    viewTransition: true,
    // Enable PPR (Partial Prerendering) when stable
    // ppr: true,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
        port: '',
        pathname: '**',
      },
    ],
    // Optimize for Cloudflare
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  
  // Compression
  compress: true,
  
  // Headers for caching static assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/app/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/app/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      // Add any legacy URL redirects here
    ];
  },
};

export default nextConfig;
