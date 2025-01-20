// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-danfo">JB PHOTO RESERVOIR</h1>
        <div className="space-x-4">
          <Link 
            href="/jb-upload" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-londrina"
          >
            Upload Images
          </Link>
          <Link 
            href="/jb-gallery" 
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-londrina"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </main>
  );
}