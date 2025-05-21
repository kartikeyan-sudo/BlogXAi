import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

// Get a single post by ID (admin access)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin status
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    if (!isAdmin(authResult.user)) {
      return jsonResponse({ error: 'Admin access required' }, 403);
    }
    
    const postId = params.id;
    
    // Fetch the post with author and category information
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
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
    
    if (!post) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    return jsonResponse(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// Update a post (admin access)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin status
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    if (!isAdmin(authResult.user)) {
      return jsonResponse({ error: 'Admin access required' }, 403);
    }
    
    const postId = params.id;
    const { title, content, slug, excerpt, published, categoryId, tags } = await request.json();
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!existingPost) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    // Build update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (published !== undefined) updateData.published = published;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    // Handle tags if provided
    const tagsConnect = tags?.map((tagId: string) => ({ id: tagId }));
    
    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...updateData,
        ...(tagsConnect && {
          tags: {
            set: [], // First clear existing tags
            connect: tagsConnect // Then add new ones
          }
        })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    return jsonResponse(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a post (admin access)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin status
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    if (!isAdmin(authResult.user)) {
      return jsonResponse({ error: 'Admin access required' }, 403);
    }
    
    const postId = params.id;
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!existingPost) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    // Delete the post
    await prisma.post.delete({
      where: { id: postId }
    });
    
    return jsonResponse({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
