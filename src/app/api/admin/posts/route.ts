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

// Get all posts (admin access)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin status
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    if (!isAdmin(authResult.user)) {
      return jsonResponse({ error: 'Admin access required' }, 403);
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    const categoryId = searchParams.get('categoryId');
    const published = searchParams.get('published');
    
    // Build the where clause based on filters
    const where: any = {};
    
    if (authorId) {
      where.authorId = authorId;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (published !== null) {
      where.published = published === 'true';
    }
    
    // Fetch posts with author and category information
    const posts = await prisma.post.findMany({
      where,
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
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return jsonResponse(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
