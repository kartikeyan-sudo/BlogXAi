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

// GET all tags
export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return jsonResponse({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return jsonResponse({
      error: 'Failed to fetch tags',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// POST a new tag (admin only)
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name } = body;
    
    // Validate required fields
    if (!name) {
      return jsonResponse({
        error: 'Missing required fields',
        message: 'Name is required',
      }, 400);
    }
    
    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive', // Case insensitive
        },
      },
    });
    
    if (existingTag) {
      return jsonResponse({
        error: 'Tag already exists',
        message: `A tag with the name "${name}" already exists`,
      }, 409);
    }
    
    // Create the tag
    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });
    
    return jsonResponse({ tag }, 201);
  } catch (error) {
    console.error('Error creating tag:', error);
    return jsonResponse({
      error: 'Failed to create tag',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
