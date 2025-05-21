const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get the test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' }
    });
    
    if (!testUser) {
      console.error('Test user not found');
      return;
    }
    
    console.log('Test user found:', {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      status: testUser.status,
      password: testUser.password.substring(0, 20) + '...' // Show just part of the hashed password
    });
    
    // Test login API directly
    console.log('\nTesting login API...');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testpassword123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('Login successful:', {
        status: loginResponse.status,
        user: loginData.user,
        tokenReceived: !!loginData.token
      });
    } else {
      console.error('Login failed:', {
        status: loginResponse.status,
        error: loginData
      });
      
      // Additional debugging - verify password manually
      console.log('\nVerifying password manually...');
      const passwordMatch = await bcrypt.compare('testpassword123', testUser.password);
      console.log('Password match result:', passwordMatch);
      
      // Check if user is blocked
      if (testUser.status === 'BLOCKED') {
        console.log('⚠️ User is BLOCKED - this might be causing the login failure');
      }
    }
  } catch (error) {
    console.error('Error debugging login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
