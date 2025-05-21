// This script ensures all required dependencies are installed
// and environment variables are set correctly before building

console.log('Starting simplified build process for Netlify deployment...');

// Check if Tailwind CSS is installed
try {
  require.resolve('tailwindcss');
  console.log('✅ Tailwind CSS is installed');
} catch (e) {
  console.error('❌ Tailwind CSS is not installed. Installing...');
  require('child_process').execSync('npm install tailwindcss postcss autoprefixer --save', { stdio: 'inherit' });
}

// Check environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}

console.log('Build preparation complete. Proceeding with Next.js build...');
