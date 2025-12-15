'use client';

import { useState } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackHeight?: string;
  fallbackWidth?: string;
}

export default function BlogImage({ 
  src, 
  alt, 
  className = "", 
  fallbackHeight = "h-64", 
  fallbackWidth = "w-full" 
}: BlogImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`${fallbackHeight} ${fallbackWidth} bg-gray-200 rounded-2xl flex items-center justify-center`}>
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
