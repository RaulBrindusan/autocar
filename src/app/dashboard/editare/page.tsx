'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface EditHistoryItem {
  id: string;
  originalImage: string;
  editedImage: string;
  prompt: string;
  timestamp: Date;
}

export default function EditarePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editHistory, setEditHistory] = useState<EditHistoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('aspect-square');
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vă rugăm să încărcați doar fișiere imagine');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.onload = () => {
          const ratio = img.width / img.height;

          // Determine aspect ratio class
          if (Math.abs(ratio - 16/9) < 0.1) {
            setImageAspectRatio('aspect-video'); // 16:9
          } else if (Math.abs(ratio - 4/3) < 0.1) {
            setImageAspectRatio('aspect-[4/3]'); // 4:3
          } else if (Math.abs(ratio - 3/2) < 0.1) {
            setImageAspectRatio('aspect-[3/2]'); // 3:2
          } else if (Math.abs(ratio - 1) < 0.1) {
            setImageAspectRatio('aspect-square'); // 1:1
          } else if (Math.abs(ratio - 9/16) < 0.1) {
            setImageAspectRatio('aspect-[9/16]'); // 9:16 (portrait)
          } else if (ratio > 1) {
            setImageAspectRatio('aspect-video'); // Default landscape
          } else {
            setImageAspectRatio('aspect-[9/16]'); // Default portrait
          }
        };
        img.src = reader.result as string;
        setOriginalImage(reader.result as string);
        setEditedImage(null); // Reset edited image when new original is uploaded
        setConversationHistory([]); // Reset conversation history for new image
        setReferenceImage(null); // Reset reference image for new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!originalImage || !editPrompt.trim()) {
      toast.error('Vă rugăm să încărcați o imagine și să introduceți instrucțiuni de editare');
      return;
    }

    setIsLoading(true);

    try {
      // Use edited image if it exists (conversational editing), otherwise use original
      const imageToEdit = editedImage || originalImage;

      // Convert aspect ratio class to Gemini format
      const getGeminiAspectRatio = (aspectClass: string): string => {
        if (aspectClass === 'aspect-video') return '16:9';
        if (aspectClass === 'aspect-[4/3]') return '4:3';
        if (aspectClass === 'aspect-[3/2]') return '3:2';
        if (aspectClass === 'aspect-square') return '1:1';
        if (aspectClass === 'aspect-[9/16]') return '9:16';
        return '16:9'; // default
      };

      const response = await fetch('/api/image-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageToEdit,
          prompt: editPrompt,
          conversationHistory: conversationHistory,
          aspectRatio: getGeminiAspectRatio(imageAspectRatio),
          referenceImage: referenceImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit image');
      }

      const editedImageData = `data:image/png;base64,${data.editedImage}`;

      // Keep the original image reference for history
      const currentOriginal = editedImage ? originalImage : originalImage;

      setEditedImage(editedImageData);

      // Update conversation history for next iteration
      if (data.conversationHistory) {
        setConversationHistory(data.conversationHistory);
      }

      // Add to history
      const newHistoryItem: EditHistoryItem = {
        id: Date.now().toString(),
        originalImage: currentOriginal!,
        editedImage: editedImageData,
        prompt: editPrompt,
        timestamp: new Date(),
      };

      setEditHistory([newHistoryItem, ...editHistory]);
      toast.success('Imaginea a fost editată cu succes!');

      // Clear prompt for next edit
      setEditPrompt('');
    } catch (error) {
      console.error('Error editing image:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la editarea imaginii');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadHistoryItem = (item: EditHistoryItem) => {
    setOriginalImage(item.originalImage);
    setEditedImage(item.editedImage);
    setEditPrompt(item.prompt);
    setConversationHistory([]); // Reset conversation when loading from history
  };

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vă rugăm să încărcați doar fișiere imagine');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        toast.success('Imagine de referință adăugată');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Editare Imagini AI</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1 hidden sm:block">
              Încărcați o imagine și folosiți inteligența artificială pentru a o edita
            </p>
          </div>
          {/* Mobile History Button */}
          <button
            onClick={() => setShowHistoryMobile(true)}
            className="lg:hidden relative p-2 md:p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
            title="Istoric Editări"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {editHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                {editHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left & Center: Image Editor */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
          {/* Upload Section */}
          {!originalImage && (
            <div className="mb-6 flex justify-center">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full max-w-96 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-12 h-12 mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click pentru a încărca</span> sau drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}

          {/* Images Display */}
          {originalImage && (
            <div className={`flex flex-col md:flex-row items-start gap-4 mb-6 ${(isLoading || editedImage) ? '' : 'justify-center'}`}>
              {/* Original Image */}
              <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col w-full ${(isLoading || editedImage) ? 'md:flex-1' : 'md:w-[768px]'}`}>
                <div className="flex items-center justify-between mb-3 h-8">
                  <h3 className="font-semibold text-gray-900">Imaginea Originală</h3>
                  <button
                    onClick={() => {
                      setOriginalImage(null);
                      setEditedImage(null);
                      setSelectedFile(null);
                      setEditPrompt('');
                      setConversationHistory([]);
                      setReferenceImage(null);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Șterge"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className={`relative w-full ${imageAspectRatio} bg-gray-100 rounded-lg overflow-hidden`}>
                  <Image
                    src={originalImage}
                    alt="Original"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => handleDownloadImage(originalImage, 'original.png')}
                  className="mt-3 w-full px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors h-10"
                  title="Descarcă Original"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>

              {/* Edited Image - Only show when loading or edited */}
              {(isLoading || editedImage) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full md:flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3 h-8">
                    <h3 className="font-semibold text-gray-900">Imaginea Editată</h3>
                    <div className="w-9"></div>
                  </div>
                  <div className={`relative w-full ${imageAspectRatio} bg-gray-100 rounded-lg overflow-hidden`}>
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                        <div className="text-center">
                          {/* Animated circles */}
                          <div className="relative w-24 h-24 mx-auto mb-6">
                            {/* Outer rotating ring */}
                            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                            {/* Middle rotating ring */}
                            <div className="absolute inset-2 border-4 border-transparent border-b-pink-500 border-l-indigo-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                          </div>

                          {/* Text with gradient */}
                          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Se procesează imaginea
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    ) : editedImage ? (
                      <Image
                        src={editedImage}
                        alt="Edited"
                        fill
                        className="object-contain"
                      />
                    ) : null}
                  </div>
                  {editedImage ? (
                    <button
                      onClick={() => handleDownloadImage(editedImage, 'edited.png')}
                      className="mt-3 w-full px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-10"
                      title="Descarcă Editat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  ) : (
                    <div className="mt-3 h-10"></div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Edit Controls */}
          {originalImage && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Instrucțiuni de Editare</h3>
                  {/* Reference Image Upload Button */}
                  <label
                    htmlFor="reference-image-upload"
                    className="cursor-pointer p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Adaugă imagine de referință"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      id="reference-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleReferenceImageUpload}
                    />
                  </label>
                </div>
                {editedImage && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                    Mod conversațional
                  </span>
                )}
              </div>

              {/* Reference Image Preview */}
              {referenceImage && (
                <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="relative w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={referenceImage}
                      alt="Reference"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">Imagine de referință</p>
                    <p className="text-xs text-gray-500">Utilizată pentru editare</p>
                  </div>
                  <button
                    onClick={() => setReferenceImage(null)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Șterge"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleEditImage();
                    }
                  }}
                  placeholder="Descrieți cum doriți să editați imaginea..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-black"
                  disabled={isLoading}
                  spellCheck="true"
                  autoComplete="off"
                />
                <button
                  onClick={handleEditImage}
                  disabled={isLoading || !editPrompt.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Se procesează
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Trimite
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Edit History - Desktop */}
        <div className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col">
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Istoric Editări</h2>
            <p className="text-xs text-gray-500 mt-1">
              {editHistory.length} {editHistory.length === 1 ? 'editare' : 'editări'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {editHistory.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-500">Nicio editare încă</p>
              </div>
            ) : (
              editHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => handleLoadHistoryItem(item)}
                >
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                      <Image
                        src={item.originalImage}
                        alt="Original"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                      <Image
                        src={item.editedImage}
                        alt="Edited"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 font-medium mb-1 line-clamp-2">
                    {item.prompt}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString('ro-RO')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile History Overlay */}
        {showHistoryMobile && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={() => setShowHistoryMobile(false)}
            />
            {/* Slide-in Panel */}
            <div className="lg:hidden fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
              <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Istoric Editări</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {editHistory.length} {editHistory.length === 1 ? 'editare' : 'editări'}
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryMobile(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Închide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {editHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">Nicio editare încă</p>
                  </div>
                ) : (
                  editHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                      onClick={() => {
                        handleLoadHistoryItem(item);
                        setShowHistoryMobile(false);
                      }}
                    >
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                          <Image
                            src={item.originalImage}
                            alt="Original"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                          <Image
                            src={item.editedImage}
                            alt="Edited"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mb-1 line-clamp-2">
                        {item.prompt}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString('ro-RO')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
