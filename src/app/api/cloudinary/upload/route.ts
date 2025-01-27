import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Types for Cloudinary upload response
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
}

// Configure allowed file types
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Initialize Cloudinary configuration
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

export async function POST(req: Request) {
  // Check Cloudinary configuration
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
    const data = await req.formData();
    const file = data.get('file') as File;

    // Validate file existence
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only JPG, PNG, and GIF files are allowed'
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'Home/JB pics',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
          transformation: [
            { quality: 'auto:good' }, // Optimize image quality
            { fetch_format: 'auto' }  // Automatically select best format
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
    });

    // Return success response
    return NextResponse.json({
      success: true,
      image: {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        format: uploadResponse.format,
        size: uploadResponse.bytes,
        width: uploadResponse.width,
        height: uploadResponse.height
      }
    });

  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      },
      { status: 500 }
    );
  }
}

// Configure API route options
export const config = {
  api: {
    bodyParser: false,
  },
};