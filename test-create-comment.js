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
    
    // Get the test post
    const post = await prisma.post.findFirst({
      where: { title: 'Test Post Title' }
    });
    
    if (!post) {
      console.error('Test post not found');
      return;
    }
    
    // Create a test comment
    const comment = await prisma.comment.create({
      data: {
        content: 'This is a test comment on the post.',
        post: {
          connect: { id: post.id }
        },
        author: {
          connect: { id: user.id }
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
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });
    
    console.log('Test comment created:', comment);
    
    // Create a test like
    const like = await prisma.like.create({
      data: {
        post: {
          connect: { id: post.id }
        },
        user: {
          connect: { id: user.id }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });
    
    console.log('Test like created:', like);
    
    // Get the post with comments and likes
    const postWithCommentsAndLikes = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    console.log('Post with comments and likes:', postWithCommentsAndLikes);
    console.log('Number of comments:', postWithCommentsAndLikes.comments.length);
    console.log('Number of likes:', postWithCommentsAndLikes.likes.length);
  } catch (error) {
    console.error('Error creating test comment and like:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
