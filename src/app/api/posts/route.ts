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

// GET all posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  
  try {
    // Build where clause based on query parameters
    const where: any = {
      published: true,
    };
    
    if (category) {
      where.category = {
        name: category
      };
    }
    
    if (tag) {
      where.tags = {
        some: {
          name: tag
        }
      };
    }
    
    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
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
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const total = await prisma.post.count({ where });
    
    return jsonResponse({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return jsonResponse({
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}

// POST a new post
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, content, slug, categoryId, tagIds, authorId, published = false } = body;
    
    // Validate required fields
    if (!title || !content || !slug || !authorId) {
      return jsonResponse({
        error: 'Missing required fields',
        message: 'Title, content, slug, and authorId are required',
      }, 400);
    }
    
    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        published,
        author: {
          connect: { id: authorId },
        },
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        ...(tagIds && tagIds.length > 0 && {
          tags: {
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
    
    return jsonResponse({ post }, 201);
  } catch (error) {
    console.error('Error creating post:', error);
    return jsonResponse({
      error: 'Failed to create post',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
