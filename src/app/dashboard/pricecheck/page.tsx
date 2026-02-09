'use client';

import { useEffect, useState, Fragment } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { onPriceCheckSnapshot } from '@/lib/firebase/firestore';
import { PriceCheck } from '@/lib/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PriceCheckPage() {
  return (
    <ProtectedRoute>
      <PriceCheckContent />
    </ProtectedRoute>
  );
}

function PriceCheckContent() {
  const [priceChecks, setPriceChecks] = useState<PriceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceCheck, setSelectedPriceCheck] = useState<PriceCheck | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (priceCheckId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(priceCheckId)) {
        newSet.delete(priceCheckId);
      } else {
        newSet.add(priceCheckId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Set up real-time listener for price check requests
    const unsubscribe = onPriceCheckSnapshot((updatedPriceChecks) => {
      setPriceChecks(updatedPriceChecks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6" />

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Auto1 - Verificări Preț</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Gestionează cererile de verificare preț Auto1</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Se încarcă cererile...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && priceChecks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Nicio cerere găsită
          </h3>
          <p className="text-gray-600 text-lg">
            Nu există cereri de verificare preț momentan
          </p>
        </div>
      )}

      {/* Price Checks Table */}
      {!loading && priceChecks.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Marcă
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Model
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    An
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    KM
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Combustibil
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Transmisie
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Preț
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Preț Ro
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-2 py-3 md:py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-10">
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {priceChecks.map((priceCheck, index) => {
                  // Calculate which price to display - prioritize totalInchidereLicitatie
                  const displayPrice = priceCheck.totalInchidereLicitatie || priceCheck.totalMinimum || priceCheck.price;
                  const isExpanded = expandedRows.has(priceCheck.id);

                  return (
                    <Fragment key={priceCheck.id}>
                      <tr
                        className="hover:bg-blue-50 transition-all hover:shadow-sm"
                      >
                        <td
                          onClick={() => setSelectedPriceCheck(priceCheck)}
                          className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap cursor-pointer"
                        >
                          <div className="text-xs md:text-sm font-semibold text-gray-900">{index + 1}</div>
                        </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="px-3 md:px-6 py-3 md:py-4 cursor-pointer"
                      >
                        <div className="text-xs md:text-sm font-medium text-gray-900">{priceCheck.make}</div>
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="px-3 md:px-6 py-3 md:py-4 cursor-pointer"
                      >
                        <div className="text-xs md:text-sm font-medium text-gray-900">{priceCheck.model}</div>
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.year || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.mileage || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.fuelType || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.transmission || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-6 py-4 whitespace-nowrap cursor-pointer"
                      >
                        {displayPrice !== undefined && displayPrice !== null ? (
                          <div className="text-xs md:text-sm font-semibold text-blue-600">
                            €{displayPrice.toLocaleString('ro-RO')}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-6 py-4 whitespace-nowrap cursor-pointer"
                      >
                        {priceCheck.pretRomania !== undefined && priceCheck.pretRomania !== null ? (
                          <div className="text-xs md:text-sm font-semibold text-blue-600">
                            €{priceCheck.pretRomania.toLocaleString('ro-RO')}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-6 py-4 whitespace-nowrap cursor-pointer"
                      >
                        {priceCheck.profit !== undefined && priceCheck.profit !== null ? (
                          <div className={`text-xs md:text-sm font-semibold ${priceCheck.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            €{priceCheck.profit.toLocaleString('ro-RO')}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-left">
                        {priceCheck.url ? (
                          <a
                            href={priceCheck.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 underline text-xs md:text-sm font-medium"
                          >
                            Link
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-2 py-3 md:py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(priceCheck.id);
                          }}
                          className="text-gray-600 hover:text-gray-900 transition-colors p-1 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${priceCheck.id}-expanded`}>
                        <td colSpan={12} className="px-6 py-6 bg-gradient-to-br from-gray-50 to-blue-50">
                          <div className="max-w-6xl mx-auto">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                              Istoric Prețuri
                            </h4>
                            {priceCheck.priceHistory && priceCheck.priceHistory.length > 0 ? (
                              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                {/* Chart */}
                                <div className="mb-6">
                                  <ResponsiveContainer width="100%" height={300}>
                                    <LineChart
                                      data={[
                                        ...priceCheck.priceHistory.map((h) => ({
                                          date: formatDate(h.date),
                                          'Total Închidere': h.totalInchidereLicitatie || null,
                                          'Total Minim': h.totalMinimum || null,
                                          tag: h.tag || '',
                                        })),
                                        {
                                          date: formatDate(priceCheck.timestamp),
                                          'Total Închidere': priceCheck.totalInchidereLicitatie || null,
                                          'Total Minim': priceCheck.totalMinimum || null,
                                          tag: 'Curent',
                                        }
                                      ]}
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                      <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        stroke="#6b7280"
                                      />
                                      <YAxis
                                        tick={{ fontSize: 12 }}
                                        stroke="#6b7280"
                                        tickFormatter={(value) => `€${value.toLocaleString('ro-RO')}`}
                                      />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: '#fff',
                                          border: '1px solid #e5e7eb',
                                          borderRadius: '8px',
                                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        formatter={(value: any) => `€${value?.toLocaleString('ro-RO')}`}
                                      />
                                      <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="line"
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey="Total Închidere"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={{ fill: '#2563eb', r: 4 }}
                                        activeDot={{ r: 6 }}
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey="Total Minim"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        activeDot={{ r: 6 }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Current Price Badge */}
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
                                  <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white shadow-md">
                                        Preț Curent
                                      </span>
                                      <span className="text-sm text-gray-600 font-medium">
                                        {formatDate(priceCheck.timestamp)}
                                      </span>
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                      {priceCheck.totalInchidereLicitatie && (
                                        <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                          <span className="text-gray-600">Total Închidere:</span>
                                          <span className="font-bold text-gray-900">
                                            €{priceCheck.totalInchidereLicitatie.toLocaleString('ro-RO')}
                                          </span>
                                        </div>
                                      )}
                                      {priceCheck.totalMinimum && (
                                        <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                          <span className="text-gray-600">Total Minim:</span>
                                          <span className="font-bold text-gray-900">
                                            €{priceCheck.totalMinimum.toLocaleString('ro-RO')}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </div>
                                <h5 className="text-lg font-semibold text-gray-900 mb-1">Nu există istoric de prețuri</h5>
                                <p className="text-sm text-gray-500">Datele istorice vor apărea aici când vor fi disponibile</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Price Check Details Modal */}
      {selectedPriceCheck && (
        <>
          {/* Backdrop with blur */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setSelectedPriceCheck(null)} />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-[90%] md:w-full md:max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Modal Header */}
              <div className="bg-blue-600 px-3 md:px-6 py-2 md:py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-base md:text-2xl font-bold text-white">Detalii Verificare Preț</h2>
                <button
                  onClick={() => setSelectedPriceCheck(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-3 md:p-6 space-y-2 md:space-y-4">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 border-b border-blue-100 pb-1">
                    Informații Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Nume</label>
                      <p className="text-xs md:text-base font-semibold text-gray-900">{selectedPriceCheck.contact_name}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Email</label>
                      <p className="text-xs md:text-base text-gray-900">{selectedPriceCheck.contact_email}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Telefon</label>
                      <p className="text-xs md:text-base text-gray-900">{selectedPriceCheck.contact_phone}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Data</label>
                      <p className="text-xs md:text-base text-gray-900">{formatDate(selectedPriceCheck.timestamp)}</p>
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div>
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 border-b border-blue-100 pb-1">
                    Detalii Mașină
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Marcă</label>
                      <p className="text-xs md:text-base font-semibold text-gray-900">{selectedPriceCheck.make}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Model</label>
                      <p className="text-xs md:text-base font-semibold text-gray-900">{selectedPriceCheck.model}</p>
                    </div>
                    {selectedPriceCheck.year && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">An</label>
                        <p className="text-xs md:text-base text-gray-900">{selectedPriceCheck.year}</p>
                      </div>
                    )}
                    {selectedPriceCheck.mileage && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Kilometri</label>
                        <p className="text-xs md:text-base text-gray-900">{selectedPriceCheck.mileage}</p>
                      </div>
                    )}
                    {selectedPriceCheck.fuelType && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Combustibil</label>
                        <p className="text-xs md:text-base text-gray-900">{selectedPriceCheck.fuelType}</p>
                      </div>
                    )}
                    {selectedPriceCheck.transmission && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Transmisie</label>
                        <p className="text-xs md:text-base text-gray-900">{selectedPriceCheck.transmission}</p>
                      </div>
                    )}
                    {selectedPriceCheck.totalMinimum !== undefined && selectedPriceCheck.totalMinimum !== null && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Total Minim</label>
                        <p className="text-xs md:text-base font-semibold text-blue-600">
                          €{selectedPriceCheck.totalMinimum.toLocaleString('ro-RO')}
                        </p>
                      </div>
                    )}
                    {selectedPriceCheck.totalInchidereLicitatie !== undefined && selectedPriceCheck.totalInchidereLicitatie !== null && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Total Închidere Licitație</label>
                        <p className="text-xs md:text-base font-semibold text-blue-600">
                          €{selectedPriceCheck.totalInchidereLicitatie.toLocaleString('ro-RO')}
                        </p>
                      </div>
                    )}
                    {selectedPriceCheck.price !== undefined && selectedPriceCheck.price !== null && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Preț</label>
                        <p className="text-xs md:text-base font-semibold text-blue-600">
                          €{selectedPriceCheck.price.toLocaleString('ro-RO')}
                        </p>
                      </div>
                    )}
                    {selectedPriceCheck.pretRomania !== undefined && selectedPriceCheck.pretRomania !== null && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Preț România</label>
                        <p className="text-xs md:text-base font-semibold text-blue-600">
                          €{selectedPriceCheck.pretRomania.toLocaleString('ro-RO')}
                        </p>
                      </div>
                    )}
                    {selectedPriceCheck.profit !== undefined && selectedPriceCheck.profit !== null && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-500">Profit</label>
                        <p className={`text-xs md:text-base font-semibold ${selectedPriceCheck.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          €{selectedPriceCheck.profit.toLocaleString('ro-RO')}
                        </p>
                      </div>
                    )}
                    {selectedPriceCheck.url && (
                      <div className="col-span-2">
                        <label className="text-xs md:text-sm font-medium text-gray-500">Link Anunț</label>
                        <p className="text-xs md:text-base">
                          <a
                            href={selectedPriceCheck.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline break-all"
                          >
                            {selectedPriceCheck.url}
                          </a>
                        </p>
                      </div>
                    )}
                    {selectedPriceCheck.vin && (
                      <div className="col-span-2">
                        <label className="text-xs md:text-sm font-medium text-gray-500">VIN</label>
                        <p className="text-xs md:text-base text-gray-900 font-mono">{selectedPriceCheck.vin}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                {selectedPriceCheck.additional_info && (
                  <div>
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 border-b border-blue-100 pb-1">
                      Informații Suplimentare
                    </h3>
                    <p className="text-xs md:text-base text-gray-900 bg-gray-50 p-2 md:p-4 rounded-lg">
                      {selectedPriceCheck.additional_info}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-3 md:px-6 py-2 md:py-4 flex justify-end rounded-b-xl">
                <button
                  onClick={() => setSelectedPriceCheck(null)}
                  className="px-4 md:px-6 py-1.5 md:py-2 bg-blue-600 text-white text-xs md:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Închide
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </main>
  );
}
