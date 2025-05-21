import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

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

// GET likes for a post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  
  if (!postId) {
    return jsonResponse({ error: 'Post ID is required' }, 400);
  }
  
  try {
    const likes = await prisma.like.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    return jsonResponse({ likes, count: likes.length });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return jsonResponse({
      error: 'Failed to fetch likes',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// POST a new like
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    // Parse request body
    const body = await request.json();
    const { postId } = body;
    
    // Validate required fields
    if (!postId) {
      return jsonResponse({
        error: 'Missing required fields',
        message: 'PostId is required',
      }, 400);
    }
    
    // Check if user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: authResult.user.id,
      },
    });
    
    if (existingLike) {
      // If like exists, remove it (unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      
      return jsonResponse({ 
        message: 'Post unliked successfully',
        liked: false
      });
    } else {
      // Create a new like
      const like = await prisma.like.create({
        data: {
          post: {
            connect: { id: postId },
          },
          user: {
            connect: { id: authResult.user.id },
          },
        },
      });
      
      return jsonResponse({ 
        like,
        message: 'Post liked successfully',
        liked: true
      }, 201);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return jsonResponse({
      error: 'Failed to toggle like',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
