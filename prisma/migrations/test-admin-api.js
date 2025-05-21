const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }
    
    // Get the test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' }
    });
    
    if (!testUser) {
      console.error('Test user not found');
      return;
    }
    
    console.log('Current test user status:', testUser.status);
    
    // Generate JWT token for admin
    const token = jwt.sign(
      { 
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      },
      process.env.NEXTAUTH_SECRET || '30497cff2393258c951611f3e346b20fbb9d0d9844d484db8b17de191e3bdf4e',
      { expiresIn: '1d' }
    );
    
    // Determine new status (toggle between ACTIVE and BLOCKED)
    const newStatus = testUser.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    console.log(`Updating test user status to: ${newStatus}`);
    
    // Make API call to update user status
    const response = await fetch(`http://localhost:3000/api/admin/users/${testUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API call failed:', errorData);
      return;
    }
    
    const updatedUserFromAPI = await response.json();
    console.log('API response:', updatedUserFromAPI);
    
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
    
    console.log('Verified user from database after API call:', verifiedUser);
    
    if (verifiedUser.status === newStatus) {
      console.log('✅ SUCCESS: User status was successfully updated in the database through the API');
    } else {
      console.log('❌ FAILURE: User status was not updated correctly');
    }
    
  } catch (error) {
    console.error('Error testing admin API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
