'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface DigitalSignatureProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
  initialSignature?: string;
  isLoading?: boolean;
}

export default function DigitalSignature({
  onSave,
  onCancel,
  initialSignature,
  isLoading = false
}: DigitalSignatureProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (sigCanvas.current && !isEmpty) {
      const signature = sigCanvas.current.toDataURL();
      onSave(signature);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Semnătură Digitală Prestator
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Desenați semnătura dumneavoastră în zona de mai jos folosind mouse-ul, stylus-ul sau degetul pe dispozitivele touch.
            </div>

            <div className="border-2 border-gray-300 border-dashed rounded-lg p-2 bg-gray-50">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas w-full h-48 bg-white rounded cursor-crosshair'
                }}
                onBegin={handleBegin}
              />
            </div>

            {initialSignature && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Semnătura existentă:
                </div>
                <div className="border rounded-lg p-2 bg-gray-50">
                  <img 
                    src={initialSignature} 
                    alt="Semnătura existentă" 
                    className="max-h-24 mx-auto"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Șterge
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading}
                >
                  Anulează
                </button>
                <button
                  onClick={handleSave}
                  disabled={isEmpty || isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Se salvează...' : 'Salvează Semnătura'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}