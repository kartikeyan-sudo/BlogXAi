// netlify-build.js
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
    console.log('Attempting to load from .env.netlify file...');
    
    // Try to load from .env.netlify file if it exists
    const envFilePath = path.join(process.cwd(), '.env.netlify');
    
    if (fs.existsSync(envFilePath)) {
      const envContent = fs.readFileSync(envFilePath, 'utf8');
      const envVars = envContent.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => {
          const [key, ...valueParts] = line.split('=');
          return { key: key.trim(), value: valueParts.join('=').replace(/^"(.*)"$/, '$1').trim() };
        });
      
      // Set missing environment variables
      envVars.forEach(({ key, value }) => {
        if (missingVars.includes(key) && !process.env[key]) {
          process.env[key] = value;
          console.log(`Set ${key} from .env.netlify file`);
        }
      });
      
      // Check again after loading from file
      const stillMissingVars = requiredVars.filter(varName => !process.env[varName]);
      if (stillMissingVars.length > 0) {
        console.error(`❌ Critical environment variables still missing: ${stillMissingVars.join(', ')}`);
        console.error('Please set these variables in the Netlify UI or in the .env.netlify file');
      } else {
        console.log('✅ All required environment variables are now set');
      }
    } else {
      console.error('❌ .env.netlify file not found. Please create it or set environment variables in the Netlify UI');
    }
  } else {
    console.log('✅ All required environment variables are set');
  }
}

// Run the environment variable check
ensureEnvVars();

// Continue with the build process
console.log('Proceeding with Prisma generate and build...');
