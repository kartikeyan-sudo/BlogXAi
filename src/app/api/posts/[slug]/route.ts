import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Content-Type', 'application/json');
  return response;
}

// Helper function to create a JSON response with CORS headers
function jsonResponse(data: any, status: number = 200) {
  const response = NextResponse.json(data, { status });
  return setCorsHeaders(response);
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// GET a single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    
    if (!post) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    return jsonResponse({ post });
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return jsonResponse({
      error: 'Failed to fetch post',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// PUT/UPDATE a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    const body = await request.json();
    const { title, content, categoryId, tagIds, published } = body;
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });
    
    if (!existingPost) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    // Update the post
    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        ...(tagIds && tagIds.length > 0 && {
          tags: {
            set: [], // Clear existing tags
            connect: tagIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: true,
      },
    });
    
    return jsonResponse({ post });
  } catch (error) {
    console.error(`Error updating post with slug ${slug}:`, error);
    return jsonResponse({
      error: 'Failed to update post',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });
    
    if (!existingPost) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    // Delete the post
    await prisma.post.delete({
      where: { slug },
    });
    
    return jsonResponse({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`Error deleting post with slug ${slug}:`, error);
    return jsonResponse({
      error: 'Failed to delete post',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
