import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Content-Type', 'application/json'); // Ensure content type is always set
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
  let prismaClient = prisma;
  
  try {
    // Parse the request body
    let email, password;
    try {
      const body = await request.json();
      email = body.email;
      password = body.password;
      
      if (!email || !password) {
        return jsonResponse({ error: 'Email and password are required' }, 400);
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return jsonResponse({ error: 'Invalid request format' }, 400);
    }

    // Check if it's the admin login
    const adminUsername = process.env.ADMIN_USERNAME || 'admin123';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminUsername && password === adminPassword) {
      try {
        const token = jwt.sign(
          { 
            id: 'admin',
            email: adminUsername,
            name: 'Administrator',
            role: 'ADMIN'
          },
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '1d' }
        );

        const response = jsonResponse({
          user: {
            id: 'admin',
            email: adminUsername,
            name: 'Administrator',
            role: 'ADMIN'
          },
          token
        });
        
        // Set cookies for authentication
        response.cookies.set('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Changed from 'strict' to 'lax' for better cross-site compatibility
          maxAge: 86400 // 1 day in seconds
        });
        
        // Set admin flag cookie for middleware
        response.cookies.set('isAdmin', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400 // 1 day in seconds
        });
        
        return response;
      } catch (jwtError) {
        console.error('JWT signing error:', jwtError);
        return jsonResponse({ error: 'Authentication error' }, 500);
      }
    }
    
    // Check for regular user login from database
    try {
      console.log('Attempting to find user with email:', email);
      const user = await prismaClient.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        console.log('User not found with email:', email);
        return jsonResponse({ error: 'Invalid email or password' }, 401);
      }
      
      console.log('User found:', { id: user.id, email: user.email, status: user.status });
      
      // Check if user is blocked
      if (user.status === 'BLOCKED') {
        console.log('User is blocked, rejecting login');
        return jsonResponse({ error: 'Your account has been blocked. Please contact an administrator.' }, 403);
      }
      
      console.log('Verifying password...');
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        console.log('Password verification failed');
        return jsonResponse({ error: 'Invalid email or password' }, 401);
      }
      
      console.log('Password verified successfully');
      
      // Password matches, create token
      try {
        const token = jwt.sign(
          { 
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '1d' }
        );

        const response = jsonResponse({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token
        });
        
        // Set cookies for authentication
        response.cookies.set('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400 // 1 day in seconds
        });
        
        return response;
      } catch (jwtError) {
        console.error('JWT signing error:', jwtError);
        return jsonResponse({ error: 'Authentication error' }, 500);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return jsonResponse({ 
        error: 'Database error', 
        message: 'Could not verify user credentials',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, 500);
    }
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  } finally {
    try {
      await prismaClient.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}
