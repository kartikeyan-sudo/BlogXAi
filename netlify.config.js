// netlify.config.js
// This file is used to configure the Netlify build process

module.exports = {
  // Configure build settings
  build: {
    // Command to run before the build
    command: "npm install && npx prisma generate && next build",
    // Directory to publish
    publish: ".next",
    // Environment variables
    environment: {
      NODE_VERSION: "18",
      NODE_ENV: "production",
      // Database connection
      DATABASE_URL: "postgresql://postgres:Gorakhpur%40123%23@db.kdlwxtjtonjckrtaepdr.supabase.co:5432/postgres",
      // Authentication
      NEXTAUTH_SECRET: "30497cff2393258c951611f3e346b20fbb9d0d9844d484db8b17de191e3bdf4e",
      NEXTAUTH_URL: "https://fullstack-ai-blog-site.windsurf.build",
      // Admin credentials
      ADMIN_USERNAME: "admin123",
      ADMIN_PASSWORD: "admin123"
    }
  },
  // Configure plugins
  plugins: [
    {
      package: "@netlify/plugin-nextjs"
    }
  ],
  // Configure redirects
  redirects: [
    {
      from: "/api/*",
      to: "/.netlify/functions/nextjs-server/api/:splat",
      status: 200
    },
    {
      from: "/*",
      to: "/.netlify/functions/nextjs-server",
      status: 200
    }
  ]
};
