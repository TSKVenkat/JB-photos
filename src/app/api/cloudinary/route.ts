// app/api/cloudinary/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResource {
  secure_url: string;
  public_id: string;
  created_at: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Home/JB pics',
      max_results: 100,
      sort_by: 'created_at',
      direction: 'desc'
    }) as { resources: CloudinaryResource[] };

    const images = resources.map((resource) => ({
      url: resource.secure_url,
      publicId: resource.public_id
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}