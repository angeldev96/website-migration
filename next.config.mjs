/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANT: set `basePath` and `assetPrefix` to the mount path
  // you will configure in Webflow Cloud for this environment.
  // Example: if you mount the app at `/app` in Webflow Cloud, set both to '/app'
  // Replace '/app' below with your actual mount path before deploying.
  basePath: '/app',
  assetPrefix: '/app',
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
