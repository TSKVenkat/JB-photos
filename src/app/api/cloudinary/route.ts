// app/api/cloudinary/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResource {
  secure_url: string;
  public_id: string;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing required Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Home/JB pics',
      max_results: 100,
      sort_by: 'created_at',
      direction: 'desc'
    }) as CloudinaryResponse;

    return NextResponse.json({
      success: true,
      images: response.resources.map((resource) => ({
        url: resource.secure_url,
        publicId: resource.public_id
      }))
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch images'
      },
      { status: 500 }
    );
  }
}