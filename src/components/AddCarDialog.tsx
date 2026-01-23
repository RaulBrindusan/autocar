'use client';

import { useState } from 'react';
import { addCar } from '@/lib/firebase/firestore';
import { uploadCarImage, uploadCarReport } from '@/lib/firebase/storage';
import { Car } from '@/lib/types';

interface AddCarDialogProps {
  onClose: () => void;
}

export default function AddCarDialog({ onClose }: AddCarDialogProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    km: '',
    fuel: '',
    engine: '',
    transmisie: '',
    echipare: '',
    buyingprice: '',
    askingprice: '',
    status: '',
    manualProfit: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportFileName, setReportFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Te rog să selectezi un fișier imagine');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Imaginea trebuie să fie mai mică de 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    // For Consignatie, use manual profit if provided
    if (formData.status === 'Consignatie') {
      return parseFloat(formData.manualProfit) || 0;
    }
    // For Stoc, calculate from prices
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
      // Validate required fields
      const requiredFieldsValid = formData.make && formData.model && formData.year && formData.km &&
          formData.fuel && formData.engine && formData.askingprice && formData.status;

      // For Stoc status, buying price is required
      const buyingPriceValid = formData.status === 'Consignatie' || formData.buyingprice;

      if (!requiredFieldsValid || !buyingPriceValid) {
        setError('Te rog să completezi toate câmpurile obligatorii');
        setLoading(false);
        return;
      }

      let imageUrl = '';

      // Upload image if selected
      if (imageFile) {
        setUploadProgress(20);
        const { url, error: uploadError } = await uploadCarImage(imageFile);

        if (uploadError) {
          setError(`Eroare la încărcarea imaginii: ${uploadError}`);
          setLoading(false);
          return;
        }

        imageUrl = url || '';
        setUploadProgress(40);
      }

      // Calculate profit
      const profit = calculateProfit();

      // Create car document first to get the ID
      const carData: Omit<Car, 'id'> = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        km: formData.km,
        fuel: formData.fuel,
        engine: formData.engine,
        transmisie: formData.transmisie || undefined,
        echipare: formData.echipare || undefined,
        buyingprice: formData.status === 'Consignatie' ? '' : formData.buyingprice,
        askingprice: formData.askingprice,
        profit: profit.toString(),
        imageUrl: imageUrl,
        status: formData.status || undefined,
        timestamp: Date.now()
      };

      setUploadProgress(60);
      const { id: carId, error: addError } = await addCar(carData);

      if (addError || !carId) {
        setError(`Eroare la adăugarea mașinii: ${addError}`);
        setLoading(false);
        return;
      }

      // Upload report if selected (now that we have the car ID)
      if (reportFile) {
        setUploadProgress(75);
        const { path, error: reportError } = await uploadCarReport(reportFile, carId);

        if (reportError) {
          setError(`Eroare la încărcarea raportului: ${reportError}`);
          setLoading(false);
          return;
        }

        // Update car with report path
        if (path) {
          const { updateCar } = await import('@/lib/firebase/firestore');
          await updateCar(carId, { reportCV: path });
        }
        setUploadProgress(90);
      }

      setUploadProgress(100);
      // Success - close dialog
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
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Adaugă Mașină</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagine Mașină
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
                  <span className="text-sm font-medium">Alege Imagine</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Max 5MB, format: JPG, PNG</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marcă *
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: BMW"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: X5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
                />
              </div>
            </div>

            {/* Year and KM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  An *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: 2020"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometri *
                </label>
                <input
                  type="text"
                  name="km"
                  value={formData.km}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: 50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
                />
              </div>
            </div>

            {/* Fuel and Engine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip Combustibil *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motor *
                </label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: 3.0 TDI"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
                />
              </div>
            </div>

            {/* Transmission and Equipment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmisie
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Echipare
                </label>
                <input
                  type="text"
                  name="echipare"
                  value={formData.echipare}
                  onChange={handleInputChange}
                  placeholder="ex: Bose Edition, Premium"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț Cumpărare (€) *
                  </label>
                  <input
                    type="number"
                    name="buyingprice"
                    value={formData.buyingprice}
                    onChange={handleInputChange}
                    required
                    placeholder="ex: 15000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preț Cerut (€) *
                </label>
                <input
                  type="number"
                  name="askingprice"
                  value={formData.askingprice}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: 18000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-900"
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
                  <span>Se încarcă...</span>
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

        {/* Footer */}
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
