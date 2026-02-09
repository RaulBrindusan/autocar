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
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-blue-600 sticky top-0 z-10">
                <tr>
                  <th className="px-1 md:px-3 py-2 md:py-4 text-left text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    #
                  </th>
                  <th className="px-1 md:px-3 py-2 md:py-4 text-left text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    Marcă
                  </th>
                  <th className="px-1 md:px-3 py-2 md:py-4 text-left text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    Model
                  </th>
                  <th className="px-1 md:px-4 py-2 md:py-4 text-left text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    An
                  </th>
                  <th className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                    KM
                  </th>
                  <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                    Combustibil
                  </th>
                  <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                    Transmisie
                  </th>
                  <th className="px-1 md:px-4 py-2 md:py-4 text-left text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    Preț
                  </th>
                  <th className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                    Preț Ro
                  </th>
                  <th className="px-1 md:px-4 py-2 md:py-4 text-left text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    Profit
                  </th>
                  <th className="px-1 md:px-3 py-2 md:py-4 text-center text-[9px] md:text-xs font-semibold text-white uppercase tracking-tight whitespace-nowrap">
                    Link
                  </th>
                  <th className="px-0.5 md:px-2 py-2 md:py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-6 md:w-10">
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
                          className="px-1 md:px-3 py-1.5 md:py-4 whitespace-nowrap cursor-pointer"
                        >
                          <div className="text-[9px] md:text-sm font-semibold text-gray-900">{index + 1}</div>
                        </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="px-1 md:px-3 py-1.5 md:py-4 cursor-pointer"
                      >
                        <div className="text-[9px] md:text-sm font-medium text-gray-900 max-w-[45px] md:max-w-none truncate">{priceCheck.make}</div>
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="px-1 md:px-3 py-1.5 md:py-4 cursor-pointer"
                      >
                        <div className="text-[9px] md:text-sm font-medium text-gray-900 max-w-[45px] md:max-w-none truncate">{priceCheck.model}</div>
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="px-1 md:px-4 py-1.5 md:py-4 whitespace-nowrap text-[9px] md:text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.year || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.mileage || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.fuelType || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      >
                        {priceCheck.transmission || '-'}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="px-1 md:px-4 py-1.5 md:py-4 whitespace-nowrap cursor-pointer"
                      >
                        {displayPrice !== undefined && displayPrice !== null ? (
                          <>
                            <div className="md:hidden text-[9px] font-semibold text-blue-600">
                              €{(displayPrice / 1000).toFixed(1)}k
                            </div>
                            <div className="hidden md:block text-sm font-semibold text-blue-600">
                              €{displayPrice.toLocaleString('ro-RO')}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400 text-[9px] md:text-sm">-</span>
                        )}
                      </td>
                      <td
                        onClick={() => setSelectedPriceCheck(priceCheck)}
                        className="hidden md:table-cell px-4 py-4 whitespace-nowrap cursor-pointer"
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
                        className="px-1 md:px-4 py-1.5 md:py-4 whitespace-nowrap cursor-pointer"
                      >
                        {priceCheck.profit !== undefined && priceCheck.profit !== null ? (
                          <>
                            <div className={`md:hidden text-[9px] font-semibold ${priceCheck.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              €{(priceCheck.profit / 1000).toFixed(1)}k
                            </div>
                            <div className={`hidden md:block text-sm font-semibold ${priceCheck.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              €{priceCheck.profit.toLocaleString('ro-RO')}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400 text-[9px] md:text-sm">-</span>
                        )}
                      </td>
                      <td className="px-1 md:px-3 py-1.5 md:py-4 whitespace-nowrap text-center">
                        {priceCheck.url ? (
                          <a
                            href={priceCheck.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 underline text-[9px] md:text-sm font-medium"
                          >
                            Link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-[9px] md:text-sm">-</span>
                        )}
                      </td>
                      <td className="px-0.5 md:px-2 py-1.5 md:py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(priceCheck.id);
                          }}
                          className="text-gray-600 hover:text-gray-900 transition-colors p-0.5 md:p-1 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${priceCheck.id}-expanded`}>
                        <td colSpan={12} className="px-2 md:px-6 py-4 md:py-6 bg-gradient-to-br from-gray-50 to-blue-50">
                          <div className="max-w-6xl mx-auto">
                            <h4 className="text-sm md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                              <span className="w-1 h-4 md:h-6 bg-blue-600 rounded-full"></span>
                              Istoric Prețuri
                            </h4>
                            {priceCheck.priceHistory && priceCheck.priceHistory.length > 0 ? (
                              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 border border-gray-200">
                                {/* Chart */}
                                <div className="mb-4 md:mb-6 -mx-2 md:mx-0">
                                  <ResponsiveContainer width="100%" height={250} className="md:!h-[300px]">
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
                                        tick={{ fontSize: 10 }}
                                        stroke="#6b7280"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                      />
                                      <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#6b7280"
                                        tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                                        width={45}
                                      />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: '#fff',
                                          border: '1px solid #e5e7eb',
                                          borderRadius: '8px',
                                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                          fontSize: '12px'
                                        }}
                                        formatter={(value: any) => `€${value?.toLocaleString('ro-RO')}`}
                                      />
                                      <Legend
                                        wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                                        iconType="line"
                                        iconSize={10}
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
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border-l-4 border-blue-600">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-blue-600 text-white shadow-md">
                                        Preț Curent
                                      </span>
                                      <span className="text-xs md:text-sm text-gray-600 font-medium">
                                        {formatDate(priceCheck.timestamp)}
                                      </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 md:gap-6 text-xs md:text-sm">
                                      {priceCheck.totalInchidereLicitatie && (
                                        <div className="flex items-center gap-1">
                                          <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                                          <span className="text-gray-600 whitespace-nowrap">Total Închidere:</span>
                                          <span className="font-bold text-gray-900">
                                            €{priceCheck.totalInchidereLicitatie.toLocaleString('ro-RO')}
                                          </span>
                                        </div>
                                      )}
                                      {priceCheck.totalMinimum && (
                                        <div className="flex items-center gap-1">
                                          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                                          <span className="text-gray-600 whitespace-nowrap">Total Minim:</span>
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
                              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-6 md:p-8 text-center border border-gray-200">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                  <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </div>
                                <h5 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Nu există istoric de prețuri</h5>
                                <p className="text-xs md:text-sm text-gray-500">Datele istorice vor apărea aici când vor fi disponibile</p>
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
