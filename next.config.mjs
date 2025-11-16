/** @type {import('next').NextConfig} */
// Use an environment variable to control the mount path so local dev doesn't break.
// Set `NEXT_PUBLIC_BASE_PATH` to "/app" (or your mount path) in production/environment
// where the app is hosted under a subpath (e.g., Webflow Cloud). Leave unset for local dev.
const mountPath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;
const nextConfig = {
  basePath: mountPath,
  assetPrefix: mountPath,
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
