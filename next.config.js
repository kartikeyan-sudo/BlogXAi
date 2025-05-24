/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Configure images for static exports
  images: {
    unoptimized: true, // Required for static exports
    domains: ['picsum.photos', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Pass environment variables to the browser
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },

  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,

  // Handle trailing slashes consistently
  trailingSlash: true, // Set to true for better compatibility with static exports

  // Handle TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure build output for static exports
 // output: 'export', // Required for static site generation

  // Configure base path if your site is served from a subdirectory
  // basePath: '/your-base-path',

  // Configure external packages for server components
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // Note: API routes won't work with static exports
  // For API routes, consider using Netlify Functions or Vercel Serverless Functions
};

module.exports = nextConfig;
