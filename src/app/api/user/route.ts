export const dynamic = 'force-dynamic';
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

// GET user profile and posts
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    // Get user with posts
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        posts: {
          include: {
            category: true,
            tags: true,
            comments: {
              select: {
                id: true,
              },
            },
            likes: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!user) {
      return jsonResponse({ error: 'User not found' }, 404);
    }
    
    return jsonResponse({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return jsonResponse({
      error: 'Failed to fetch user profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// PUT/UPDATE user profile
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    // Parse request body
    const body = await request.json();
    const { name, image } = body;
    
    // Update user
    const user = await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    
    return jsonResponse({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return jsonResponse({
      error: 'Failed to update user profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
