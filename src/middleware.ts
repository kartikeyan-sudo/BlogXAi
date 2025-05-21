import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAdmin } from './lib/auth';

// This function handles CORS and authentication
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCors(request);
  }

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path === '/login' || 
                       path === '/register' || 
                       path.startsWith('/posts') || 
                       path.startsWith('/api/auth');

  // Check if the request is for an admin path
  const isAdminPath = path.startsWith('/admin') || path.startsWith('/api/admin');

  // If it's a public path, allow access but still apply CORS headers
  if (isPublicPath) {
    const response = NextResponse.next();
    return applyCorsHeaders(response, request);
  }

  // For protected paths, verify authentication
  const authResult = await verifyAuth(request);
  
  if (!authResult.success) {
    // For API routes, return JSON error instead of redirecting
    if (path.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    // Redirect to login page if not authenticated (for non-API routes)
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For admin paths, check if user is an admin
  if (isAdminPath && !isAdmin(authResult.user)) {
    // For API routes, return JSON error instead of redirecting
    if (path.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    // Redirect to home page if not an admin (for non-API routes)
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access for authenticated users with CORS headers
  const response = NextResponse.next();
  return applyCorsHeaders(response, request);
}

// Helper function to handle CORS preflight requests
function handleCors(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// Helper function to apply CORS headers to a response
function applyCorsHeaders(response: NextResponse, request: NextRequest) {
  const headers = getCorsHeaders(request);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Helper function to get CORS headers
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export const config = {
  matcher: ['/admin/:path*']
};
