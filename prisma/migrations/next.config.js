/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Configure images
  images: {
    unoptimized: true,
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

  // Configure trailing slash for consistent URLs
  trailingSlash: false,

  // Handle TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure build output directory
  distDir: '.next',

  // Configure external packages for server components
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // Output configuration for Netlify
  output: 'standalone',
};

module.exports = nextConfig;
