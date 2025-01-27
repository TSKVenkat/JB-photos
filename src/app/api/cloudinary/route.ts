import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Simple environment variable check
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Log environment status (remove in production)
console.log('Cloudinary Config Status:', {
  cloudName: cloudName ? 'Present' : 'Missing',
  apiKey: apiKey ? 'Present' : 'Missing',
  apiSecret: apiSecret ? 'Present' : 'Missing'
});

// Configure cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function GET() {
  // Verify configuration
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      success: false,
      error: 'Missing Cloudinary credentials'
    }, { status: 500 });
  }

  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Home/JB pics',
      max_results: 100,
      sort_by: 'created_at',
      direction: 'desc'
    });

    return NextResponse.json({
      success: true,
      images: resources.map((resource: any) => ({
        url: resource.secure_url,
        publicId: resource.public_id
      }))
    });

  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch images'
    }, { status: 500 });
  }
}