import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
    // Verify authentication
    const authResult = await verifyAuth(request);
    
    if (!authResult.success || !authResult.user) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    
    const userId = authResult.user.id;
    
    // Parse the form data
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return jsonResponse({ error: 'No image provided' }, 400);
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(image.type)) {
      return jsonResponse({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' }, 400);
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return jsonResponse({ error: 'Image size exceeds the 5MB limit' }, 400);
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profile-images');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Generate a unique filename
    const fileExtension = image.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);
    
    // Convert the file to a Buffer and save it
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Generate the URL for the image
    const imageUrl = `/uploads/profile-images/${fileName}`;
    
    // Update the user's profile with the new image URL
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl }
    });
    
    return jsonResponse({ 
      success: true, 
      imageUrl 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
