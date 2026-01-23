'use client';

import { useState } from 'react';
import { updateCar } from '@/lib/firebase/firestore';
import { uploadCarImage, uploadCarReport, uploadCarGalleryImages } from '@/lib/firebase/storage';
import { Car } from '@/lib/types';

interface EditCarDialogProps {
  car: Car;
  onClose: () => void;
}

export default function EditCarDialog({ car, onClose }: EditCarDialogProps) {
  const [formData, setFormData] = useState({
    make: car.make,
    model: car.model,
    year: car.year,
    km: car.km,
    fuel: car.fuel,
    engine: car.engine,
    transmisie: car.transmisie || '',
    echipare: car.echipare || '',
    buyingprice: car.buyingprice,
    askingprice: car.askingprice,
    status: car.status || '',
    manualProfit: car.profit || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(car.imageUrl || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(car.images || []);
  // Map preview URLs to File objects for new uploads
  const [previewToFileMap, setPreviewToFileMap] = useState<Map<string, File>>(new Map());
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportFileName, setReportFileName] = useState<string>(car.reportCV ? 'Raport existent' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Te rog să selectezi un fișier imagine');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Imaginea trebuie să fie mai mică de 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Get existing file names from current gallery files
    const existingFileNames = galleryFiles.map(f => f.name);

    // Filter out duplicate files
    const uniqueFiles = files.filter(file => !existingFileNames.includes(file.name));

    if (uniqueFiles.length === 0) {
      setError('Toate imaginile selectate sunt deja adăugate');
      return;
    }

    // Validate all unique files
    for (const file of uniqueFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Toate fișierele trebuie să fie imagini');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`Imaginea ${file.name} trebuie să fie mai mică de 5MB`);
        return;
      }
    }

    // Combine existing files with new unique files
    const allFiles = [...galleryFiles, ...uniqueFiles];
    setGalleryFiles(allFiles);
    setError('');

    // Create previews for new files only
    const previewPromises = uniqueFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(newPreviews => {
      // Keep existing previews and add new ones
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);

      // Build map of preview -> file for proper ordering during upload
      const newMap = new Map(previewToFileMap);
      uniqueFiles.forEach((file, index) => {
        newMap.set(newPreviews[index], file);
      });
      setPreviewToFileMap(newMap);
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    const previewToRemove = galleryPreviews[index];
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(newPreviews);

    // Remove from map if it's a new file
    if (previewToFileMap.has(previewToRemove)) {
      const newMap = new Map(previewToFileMap);
      newMap.delete(previewToRemove);
      setPreviewToFileMap(newMap);

      // Update galleryFiles array
      const newFiles = Array.from(newMap.values());
      setGalleryFiles(newFiles);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (dragIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Reorder previews - this automatically reorders both existing URLs and new files
    const newPreviews = [...galleryPreviews];
    const [draggedPreview] = newPreviews.splice(dragIndex, 1);
    newPreviews.splice(dropIndex, 0, draggedPreview);
    setGalleryPreviews(newPreviews);

    // Update galleryFiles to match the new order (extract files from map in order)
    const newFiles = newPreviews
      .filter(preview => previewToFileMap.has(preview))
      .map(preview => previewToFileMap.get(preview)!);
    setGalleryFiles(newFiles);

    setDraggedIndex(null);
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Te rog să selectezi un fișier PDF');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Raportul trebuie să fie mai mic de 10MB');
        return;
      }

      setReportFile(file);
      setReportFileName(file.name);
      setError('');
    }
  };

  const calculateProfit = () => {
    if (formData.status === 'Consignatie') {
      return parseFloat(formData.manualProfit) || 0;
    }
    const buying = parseFloat(formData.buyingprice) || 0;
    const asking = parseFloat(formData.askingprice) || 0;
    return asking - buying;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploadProgress(0);

    try {
      let imageUrl = car.imageUrl;
      let reportPath = car.reportCV;
      let galleryUrls = car.images || [];

      // Upload new image if selected
      if (imageFile) {
        setUploadProgress(15);
        const { url, error: uploadError } = await uploadCarImage(imageFile);

        if (uploadError) {
          setError(`Eroare la încărcarea imaginii: ${uploadError}`);
          setLoading(false);
          return;
        }

        imageUrl = url || '';
        setUploadProgress(30);
      }

      // Build final gallery URLs preserving the order from galleryPreviews
      const finalGalleryUrls: string[] = [];

      // Separate new files to upload and existing URLs, preserving order
      const filesToUpload: File[] = [];
      const previewToUploadIndexMap = new Map<string, number>();

      galleryPreviews.forEach((preview) => {
        if (previewToFileMap.has(preview)) {
          // This is a new file that needs uploading
          const file = previewToFileMap.get(preview)!;
          previewToUploadIndexMap.set(preview, filesToUpload.length);
          filesToUpload.push(file);
        }
      });

      // Upload new files if any
      let uploadedUrls: string[] = [];
      if (filesToUpload.length > 0) {
        setUploadProgress(35);
        const { urls, error: galleryError } = await uploadCarGalleryImages(
          filesToUpload,
          car.id,
          (progress) => setUploadProgress(35 + progress * 0.3) // 35-65%
        );

        if (galleryError) {
          setError(`Eroare la încărcarea galeriei: ${galleryError}`);
          setLoading(false);
          return;
        }

        uploadedUrls = urls || [];
        setUploadProgress(65);
      }

      // Build final array in the order of galleryPreviews
      for (const preview of galleryPreviews) {
        if (preview.startsWith('http')) {
          // Existing URL - keep it if it's not the primary image
          if (preview !== imageUrl) {
            finalGalleryUrls.push(preview);
          }
        } else if (previewToUploadIndexMap.has(preview)) {
          // New file - use the uploaded URL at the correct index
          const uploadIndex = previewToUploadIndexMap.get(preview)!;
          if (uploadIndex < uploadedUrls.length) {
            const uploadedUrl = uploadedUrls[uploadIndex];
            if (uploadedUrl !== imageUrl) {
              finalGalleryUrls.push(uploadedUrl);
            }
          }
        }
      }

      // Remove any duplicates (safety check)
      galleryUrls = Array.from(new Set(finalGalleryUrls));

      // Upload new report if selected
      if (reportFile) {
        setUploadProgress(70);
        const { path, error: reportError } = await uploadCarReport(reportFile, car.id);

        if (reportError) {
          setError(`Eroare la încărcarea raportului: ${reportError}`);
          setLoading(false);
          return;
        }

        reportPath = path || undefined;
        setUploadProgress(85);
      }

      const profit = calculateProfit();

      // Build update data without undefined values
      const updateData: Partial<Car> = {
        ...formData,
        buyingprice: formData.status === 'Consignatie' ? '' : formData.buyingprice,
        profit: profit.toString(),
        imageUrl: imageUrl
      };

      // Only include optional fields if they have values
      if (galleryUrls.length > 0) {
        updateData.images = galleryUrls;
      }
      if (reportPath) {
        updateData.reportCV = reportPath;
      }

      setUploadProgress(95);
      const { error: updateError } = await updateCar(car.id, updateData);

      if (updateError) {
        setError(`Eroare la actualizarea mașinii: ${updateError}`);
        setLoading(false);
        return;
      }

      setUploadProgress(100);
      onClose();
    } catch (err: any) {
      setError(`Eroare neașteptată: ${err.message}`);
      setLoading(false);
    }
  };

  const profit = calculateProfit();
  const profitColor = profit >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-3xl my-8 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Editează Mașina</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagine Mașină (Principală)
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-sm font-medium">Schimbă Imaginea</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            {/* Gallery Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galerie Imagini (Multiple)
              </label>
              <div className="space-y-3">
                {galleryPreviews.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Trage imaginile pentru a le reordona</p>
                    <div className="grid grid-cols-4 gap-2">
                      {galleryPreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          draggable={!loading}
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={handleDragOver}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => handleDrop(e, idx)}
                          className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 group cursor-move transition-all ${
                            draggedIndex === idx
                              ? 'opacity-50 border-blue-500 scale-95'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                          title="Trage pentru a reordona"
                        >
                          <img src={preview} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {idx + 1}
                          </div>
                          <div className="absolute top-1 left-1 bg-blue-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGalleryImage(idx);
                            }}
                            disabled={loading}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
                            title="Șterge imaginea"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <label className="cursor-pointer bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors border border-green-200 inline-flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {galleryPreviews.length > 0 ? 'Adaugă Mai Multe Imagini' : 'Adaugă Imagini Galerie'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <p className="text-xs text-gray-500">Max 5MB per imagine. Duplicate detectate automat.</p>
              </div>
            </div>

            {/* CarVertical Report Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raport CarVertical (PDF)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {reportFileName || 'Niciun raport încărcat'}
                      </p>
                      <p className="text-xs text-gray-500">PDF, max 10MB</p>
                    </div>
                  </div>
                </div>
                <label className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                  <span className="text-sm font-medium">Alege PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleReportChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            {/* Make and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marcă *</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Year and KM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">An *</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilometri *</label>
                <input
                  type="text"
                  name="km"
                  value={formData.km}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Fuel and Engine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tip Combustibil *</label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                >
                  <option value="">Selectează</option>
                  <option value="Benzină">Benzină</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="GPL">GPL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motor *</label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Transmission and Equipment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmisie</label>
                <select
                  name="transmisie"
                  value={formData.transmisie}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                >
                  <option value="">Selectează</option>
                  <option value="Manuală">Manuală</option>
                  <option value="Automată">Automată</option>
                  <option value="Semiautomată">Semiautomată</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Echipare</label>
                <input
                  type="text"
                  name="echipare"
                  value={formData.echipare}
                  onChange={handleInputChange}
                  placeholder="ex: Bose Edition, Premium"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              >
                <option value="">Selectează</option>
                <option value="Stoc">Stoc</option>
                <option value="Consignatie">Consignatie</option>
              </select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.status === 'Stoc' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preț Cumpărare (€) *</label>
                  <input
                    type="number"
                    name="buyingprice"
                    value={formData.buyingprice}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preț Cerut (€) *</label>
                <input
                  type="number"
                  name="askingprice"
                  value={formData.askingprice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Manual Profit for Consignatie */}
            {formData.status === 'Consignatie' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit (€) - Opțional
                </label>
                <input
                  type="number"
                  name="manualProfit"
                  value={formData.manualProfit}
                  onChange={handleInputChange}
                  placeholder="ex: 3000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            )}

            {/* Profit Display */}
            {((formData.status === 'Stoc' && formData.buyingprice && formData.askingprice) ||
              (formData.status === 'Consignatie' && formData.manualProfit)) && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {formData.status === 'Stoc' ? 'Profit Estimat:' : 'Profit:'}
                  </span>
                  <span className={`text-xl font-bold ${profitColor}`}>
                    {profit >= 0 ? '+' : ''}{profit.toFixed(2)} €
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-blue-700 mb-2">
                  <span>Se actualizează...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Anulează
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Se salvează...</span>
              </>
            ) : (
              <span>Salvează</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
