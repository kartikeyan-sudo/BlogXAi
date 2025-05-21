const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users
    console.log('Current users in the database:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });
    
    console.log(users);
    
    // Find the test user
    const testUser = users.find(user => user.email === 'testuser@example.com');
    
    if (!testUser) {
      console.error('Test user not found');
      return;
    }
    
    // Update the user status (simulating what the admin portal would do)
    const newStatus = testUser.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    console.log(`Updating test user status from ${testUser.status} to ${newStatus}`);
    
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { status: newStatus },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });
    
    console.log('User after update:', updatedUser);
    
    // Verify the update in the database
    const verifiedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });
    
    console.log('Verified user from database:', verifiedUser);
    
    // Now let's fix the admin API endpoint by updating the file
    console.log('\nThe admin API endpoint needs to be updated to actually modify the database instead of returning mock data.');
    console.log('Please update src/app/api/admin/users/[id]/route.ts to use Prisma to update the user status.');
    
  } catch (error) {
    console.error('Error testing admin user update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
