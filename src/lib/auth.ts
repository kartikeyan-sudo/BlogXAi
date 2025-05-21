import { NextRequest } from 'next/server';

// Use dynamic import for jsonwebtoken to avoid Edge Runtime issues during static export
let jwt: any = null;

// This will be used during runtime, not during static export
if (typeof window === 'undefined') {
  try {
    // Only import in server context
    jwt = require('jsonwebtoken');
  } catch (e) {
    console.warn('jsonwebtoken not available in this environment');
  }
}

type AuthResult = {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
};

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // If no Authorization header, try to get from cookies
      const cookies = request.cookies;
      token = cookies.get('authToken')?.value;
    }
    
    if (!token) {
      return { success: false, error: 'Missing token' };
    }
    
    // Check if jwt is available (will be null during static export)
    if (!jwt) {
      console.warn('JWT verification skipped - not available in this environment');
      return { success: false, error: 'Authentication not available in this environment' };
    }
    
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
    
    return {
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false, error: 'Invalid or expired token' };
  }
}

export function isAdmin(user: any): boolean {
  return user && user.role === 'ADMIN';
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    // Try to get from cookie first
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    if (authCookie) {
      return authCookie.split('=')[1];
    }
    // Fallback to localStorage
    return localStorage.getItem('authToken');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    // Set in cookie (secure, httpOnly in production)
    document.cookie = `authToken=${token}; path=/; max-age=86400; samesite=strict`;
    // Also set in localStorage as fallback
    localStorage.setItem('authToken', token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    // Remove from cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Also remove from localStorage
    localStorage.removeItem('authToken');
  }
}

export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function setCurrentUser(user: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

export function removeCurrentUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
}

export function logout(): void {
  removeAuthToken();
  removeCurrentUser();
}
