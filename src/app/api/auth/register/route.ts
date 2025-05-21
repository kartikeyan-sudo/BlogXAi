import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let name, email, password;
    try {
      const body = await request.json();
      name = body.name;
      email = body.email;
      password = body.password;
      
      if (!name || !email || !password) {
        return jsonResponse({ error: 'Name, email, and password are required' }, 400);
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return jsonResponse({ error: 'Invalid request format' }, 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return jsonResponse({ error: 'User with this email already exists' }, 409);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return jsonResponse({ 
      message: 'User registered successfully',
      user
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return jsonResponse({
      error: 'Failed to register user',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}
