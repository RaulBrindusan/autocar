'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadBlogImage } from '@/lib/firebase/storage';

interface ImageUploaderProps {
  postId: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  aspectRatio?: string;
}

export default function ImageUploader({
  postId,
  currentImageUrl,
  onImageUploaded,
  label = 'Imagine',
  aspectRatio = '16:9',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Tip fișier invalid. Doar JPEG, PNG, GIF și WebP sunt permise.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Fișierul este prea mare. Dimensiunea maximă este 10MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase Storage directly from client
    setUploading(true);
    try {
      const { url, error: uploadError } = await uploadBlogImage(file, postId);

      if (uploadError) {
        throw new Error(uploadError);
      }

      if (url) {
        onImageUploaded(url);
        setPreviewUrl(url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'A apărut o eroare la încărcarea imaginii');
      setPreviewUrl(currentImageUrl || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Preview */}
      {previewUrl && (
        <div className="mb-4 relative rounded-lg overflow-hidden border border-gray-300 max-w-md">
          <div className="relative w-full h-48">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain bg-gray-50"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
            title="Elimină imagine"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${label}`}
        />
        <label
          htmlFor={`file-upload-${label}`}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Se încarcă...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {previewUrl ? 'Schimbă imagine' : 'Încarcă imagine'}
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Help Text */}
      <p className="mt-2 text-xs text-gray-500">
        JPEG, PNG, GIF sau WebP. Max 10MB.
      </p>
    </div>
  );
}
