const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

async function main() {
  try {
    // Test credentials
    const email = 'testuser@example.com';
    const password = 'testpassword123';
    
    console.log('Attempting to log in with:', { email, password });
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    console.log('User found:', { id: user.id, name: user.name, email: user.email, role: user.role });
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.error('Password does not match');
      return;
    }
    
    console.log('Password verified successfully');
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.NEXTAUTH_SECRET || '30497cff2393258c951611f3e346b20fbb9d0d9844d484db8b17de191e3bdf4e',
      { expiresIn: '1d' }
    );
    
    console.log('Login successful, token generated:', token);
  } catch (error) {
    console.error('Error during login test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
