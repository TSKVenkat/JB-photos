// app/jb-gallery/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Image {
  url: string;
  publicId: string;
}

interface ApiResponse {
  success: boolean;
  images?: Image[];
  error?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/cloudinary');
        const data: ApiResponse = await response.json();
        
        if (!data.success || !data.images) {
          throw new Error(data.error || 'Failed to fetch images');
        }

        setImages(data.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (error) return <div>Error: {error}</div>;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Image src="/vishal.jpg" width={150} height={150} alt='vishal loading'></Image>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">JB Gallery</h1>
          <Link 
            href="/jb-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Upload New Image
          </Link>
        </div>

        {error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No images found. Start by uploading some!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.publicId} 
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200"
              >
                <Image
                  src={image.url}
                  alt={image.publicId.split('/').pop() || 'Gallery image'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm truncate">
                      {image.publicId.split('/').pop()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}