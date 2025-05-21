// netlify-build-fix.js
const fs = require('fs');
const path = require('path');

// Function to ensure environment variables are properly set
function ensureEnvVars() {
  console.log('Checking environment variables for Netlify build...');
  
  // Critical environment variables that must be present
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD'
  ];
  
  // Check if each required variable is set
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    
    // Create a .env file for the build process
    const envContent = `
DATABASE_URL="postgresql://postgres:Gorakhpur%40123%23@db.kdlwxtjtonjckrtaepdr.supabase.co:5432/postgres"
NEXTAUTH_SECRET="30497cff2393258c951611f3e346b20fbb9d0d9844d484db8b17de191e3bdf4e"
NEXTAUTH_URL="https://fullstack-ai-blog-site.windsurf.build"
ADMIN_USERNAME="admin123"
ADMIN_PASSWORD="admin123"
NODE_ENV="production"
    `.trim();
    
    fs.writeFileSync('.env.production', envContent);
    console.log('Created .env.production file with required environment variables');
    
    // Load the variables into the current process
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
        process.env[key.trim()] = value;
      }
    });
    
    console.log('Loaded environment variables into the current process');
  } else {
    console.log('✅ All required environment variables are set');
  }
}

// Function to ensure all dependencies are installed
function ensureDependencies() {
  console.log('Checking package.json for required dependencies...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found!');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Ensure tailwindcss is in the dependencies
  if (!packageJson.dependencies.tailwindcss && !packageJson.devDependencies.tailwindcss) {
    console.log('Adding tailwindcss to devDependencies...');
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    packageJson.devDependencies.tailwindcss = '^3.4.1';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with tailwindcss dependency');
  }
}

// Function to ensure the prisma client is properly configured
function ensurePrismaConfig() {
  console.log('Checking Prisma configuration...');
  
  // Create a prisma directory if it doesn't exist
  const prismaDir = path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }
  
  // Ensure the schema.prisma file exists
  const schemaPath = path.join(prismaDir, 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.warn('⚠️ schema.prisma not found, creating a basic one...');
    const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
    `.trim();
    
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('Created basic schema.prisma file');
  }
}

// Run all the checks
function runChecks() {
  console.log('Running pre-build checks for Netlify deployment...');
  ensureEnvVars();
  ensureDependencies();
  ensurePrismaConfig();
  console.log('Pre-build checks completed. Ready to proceed with the build.');
}

// Execute the checks
runChecks();
