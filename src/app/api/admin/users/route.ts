// Force this API route to use Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // If no Authorization header, try to get from cookies
      token = request.cookies.get('authToken')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and check if user is admin
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (status && (status === 'ACTIVE' || status === 'BLOCKED')) {
      query.status = status;
    }

    // Mock data
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image: null,
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        _count: {
          posts: 5,
          comments: 10,
          likes: 15
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: null,
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        _count: {
          posts: 3,
          comments: 7,
          likes: 12
        }
      }
    ];

    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
