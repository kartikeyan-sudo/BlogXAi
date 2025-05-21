const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get the test user
    const user = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' }
    });
    
    if (!user) {
      console.error('Test user not found');
      return;
    }
    
    // Get a category
    const category = await prisma.category.findFirst({
      where: { name: 'Technology' }
    });
    
    if (!category) {
      console.error('Category not found');
      return;
    }
    
    // Get some tags
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          in: ['JavaScript', 'React']
        }
      }
    });
    
    if (tags.length === 0) {
      console.error('Tags not found');
      return;
    }
    
    // Create a test post
    const post = await prisma.post.create({
      data: {
        title: 'Test Post Title',
        content: 'This is a test post content with some details about the topic.',
        slug: 'test-post-title',
        published: true,
        author: {
          connect: { id: user.id }
        },
        category: {
          connect: { id: category.id }
        },
        tags: {
          connect: tags.map(tag => ({ id: tag.id }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true,
        tags: true
      }
    });
    
    console.log('Test post created:', post);
    
    // Verify the post was created
    const allPosts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true,
        tags: true
      }
    });
    
    console.log('All posts:', allPosts);
  } catch (error) {
    console.error('Error creating test post:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
