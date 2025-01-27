import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Types for strong typing
interface CloudinaryResource {
  secure_url: string;
  public_id: string;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

// Initialize cloudinary configuration
const configureCloudinary = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary environment variables');
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return true;
};

export async function GET() {
  // Configure Cloudinary and check if successful
  if (!configureCloudinary()) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Cloudinary configuration missing or invalid'
      },
      { status: 500 }
    );
  }

  try {
    // Fetch resources from Cloudinary
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Home/JB pics',
      max_results: 100,
      sort_by: 'created_at',
      direction: 'desc'
    }) as CloudinaryResponse;

    // Transform and return the data
    const images = resources.map((resource) => ({
      url: resource.secure_url,
      publicId: resource.public_id
    }));

    // Return success response with cache headers
    return NextResponse.json(
      { 
        success: true,
        images 
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
        },
      }
    );

  } catch (error) {
    console.error('Error fetching images:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch images'
      },
      { status: 500 }
    );
  }
}