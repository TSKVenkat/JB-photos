import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Define interfaces for type safety
interface CloudinaryResource {
  secure_url: string;
  public_id: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

interface ImageResponse {
  url: string;
  publicId: string;
}

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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

    const images: ImageResponse[] = response.resources.map((resource) => ({
      url: resource.secure_url,
      publicId: resource.public_id
    }));

    return NextResponse.json({
      success: true,
      images
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch images'
    }, { status: 500 });
  }
}