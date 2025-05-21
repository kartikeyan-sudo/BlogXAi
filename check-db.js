const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Query all users
    const users = await prisma.user.findMany();
    console.log('Users in database:', users);
    
    // Query all posts
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        category: true,
        tags: true,
      }
    });
    console.log('Posts in database:', posts);
    
    // Query all categories
    const categories = await prisma.category.findMany();
    console.log('Categories in database:', categories);
    
    // Query all tags
    const tags = await prisma.tag.findMany();
    console.log('Tags in database:', tags);
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
