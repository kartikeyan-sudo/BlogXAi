import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// In a real application, you would use a database or Redis to track online users
// For this demo, we'll use an in-memory store
const onlineUsers = new Map<string, { lastActive: Date }>();

// Update user status (called when a user logs in or performs an action)
export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify token
    jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret');

    const { userId } = await request.json();
    
    // Update user's online status
    onlineUsers.set(userId, { lastActive: new Date() });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Get all user statuses (online/offline)
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify token and check if user is admin
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
    
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // For now, return mock data since the database isn't set up yet
    const usersData = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image: null,
        role: 'USER',
        status: 'ACTIVE'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: null,
        role: 'USER',
        status: 'ACTIVE'
      }
    ];
    
    // Consider a user online if they've been active in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Combine database users with online status
    const usersWithStatus = usersData.map(user => {
      const onlineStatus = onlineUsers.get(user.id);
      const isOnline = onlineStatus && onlineStatus.lastActive > fiveMinutesAgo;
      
      return {
        ...user,
        isOnline: isOnline || false,
        lastActive: onlineStatus?.lastActive || null
      };
    });
    
    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error('Error fetching user statuses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
