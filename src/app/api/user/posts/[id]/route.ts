import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
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

// Get a single post by ID (user must be the author)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    const postId = params.id;
    const userId = authResult.user.id;
    
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
        }
      }
    });
    
    if (!post) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    // Check if the user is the author of the post
    if (post.author.id !== userId) {
      return jsonResponse({ error: 'You do not have permission to access this post' }, 403);
    }
    
    return jsonResponse(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// Update a post (user must be the author)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    const postId = params.id;
    const userId = authResult.user.id;
    
    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true
      }
    });
    
    if (!existingPost) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    if (existingPost.authorId !== userId) {
      return jsonResponse({ error: 'You do not have permission to update this post' }, 403);
    }
    
    const { title, content, slug, excerpt, published, categoryId, tags } = await request.json();
    
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

// Delete a post (user must be the author)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    const postId = params.id;
    const userId = authResult.user.id;
    
    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true
      }
    });
    
    if (!existingPost) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }
    
    if (existingPost.authorId !== userId) {
      return jsonResponse({ error: 'You do not have permission to delete this post' }, 403);
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
