// app/jb-upload/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size before uploading (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      router.push('/jb-gallery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-danfo">Upload Images</h1>
          <Link 
            href="/jb-gallery"
            className="text-blue-500 hover:text-blue-600 font-londrina"
          >
            View Gallery
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <label className="block text-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <span className="block text-gray-600 mb-2 font-londrina">
                Click to upload an image (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            {uploading && (
              <div className="text-center text-gray-600">
                Uploading...
              </div>
            )}

            {error && (
              <div className="text-center text-red-500 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}