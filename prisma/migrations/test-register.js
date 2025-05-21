const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE'
      }
    });
    
    console.log('Test user created:', user);
    
    // Verify the user was created
    const allUsers = await prisma.user.findMany();
    console.log('All users:', allUsers);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
