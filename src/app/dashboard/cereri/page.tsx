'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { onCarRequestsSnapshot, deleteCarRequest } from '@/lib/firebase/firestore';
import { CarRequest } from '@/lib/types';
import { MoreVertical, Trash2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export default function CereriPage() {
  return (
    <ProtectedRoute>
      <CereriContent />
    </ProtectedRoute>
  );
}

function CereriContent() {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CarRequest | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Set up real-time listener for car requests
    const unsubscribe = onCarRequestsSnapshot((updatedRequests) => {
      setRequests(updatedRequests);
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

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    try {
      const result = await deleteCarRequest(deleteConfirmId);
      if (result.error) {
        alert('Eroare la ștergerea cererii: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('A apărut o eroare la ștergerea cererii.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6" />

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Cereri Mașini</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Vizualizează și gestionează cererile clienților</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Se încarcă cererile...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Nicio cerere găsită
          </h3>
          <p className="text-gray-600 text-lg">
            Nu există cereri de mașini momentan
          </p>
        </div>
      )}

      {/* Requests Table */}
      {!loading && requests.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Mașină
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Buget
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request, index) => (
                  <tr
                    key={request.id}
                    className="hover:bg-blue-50 transition-all hover:shadow-sm"
                  >
                    <td
                      onClick={() => setSelectedRequest(request)}
                      className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap cursor-pointer"
                    >
                      <div className="text-xs md:text-sm font-semibold text-gray-900">{index + 1}</div>
                    </td>
                    <td
                      onClick={() => setSelectedRequest(request)}
                      className="px-3 md:px-6 py-3 md:py-4 cursor-pointer"
                    >
                      <div className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">{request.contact_name}</div>
                      <div className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-none">{request.contact_email}</div>
                    </td>
                    <td
                      onClick={() => setSelectedRequest(request)}
                      className="px-3 md:px-6 py-3 md:py-4 cursor-pointer"
                    >
                      <div className="text-xs md:text-sm font-medium text-gray-900">{request.brand} {request.model}</div>
                      <div className="text-xs md:text-sm text-gray-500">An: {request.year}</div>
                    </td>
                    <td
                      onClick={() => setSelectedRequest(request)}
                      className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap cursor-pointer"
                    >
                      <div className="text-xs md:text-sm font-semibold text-gray-900">
                        €{request.max_budget.toLocaleString('ro-RO')}
                      </div>
                    </td>
                    <td
                      onClick={() => setSelectedRequest(request)}
                      className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                    >
                      {formatDate(request.timestamp)}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right relative">
                      <button
                        id={`menu-btn-${request.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === request.id ? null : request.id);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <>
          {/* Backdrop with blur */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setSelectedRequest(null)} />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-[90%] md:w-full md:max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto pointer-events-auto">
            {/* Modal Header */}
            <div className="bg-blue-600 px-3 md:px-6 py-2 md:py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-base md:text-2xl font-bold text-white">Detalii Cerere</h2>
              <button
                onClick={() => setSelectedRequest(null)}
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
                    <p className="text-xs md:text-base font-semibold text-gray-900">{selectedRequest.contact_name}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-500">Email</label>
                    <p className="text-xs md:text-base text-gray-900">{selectedRequest.contact_email}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-500">Telefon</label>
                    <p className="text-xs md:text-base text-gray-900">{selectedRequest.contact_phone}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-500">Data</label>
                    <p className="text-xs md:text-base text-gray-900">{formatDate(selectedRequest.timestamp)}</p>
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
                    <p className="text-xs md:text-base font-semibold text-gray-900">{selectedRequest.brand}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-500">Model</label>
                    <p className="text-xs md:text-base font-semibold text-gray-900">{selectedRequest.model}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-500">An</label>
                    <p className="text-xs md:text-base text-gray-900">{selectedRequest.year}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-500">Buget</label>
                    <p className="text-xs md:text-base font-semibold text-blue-600">
                      €{selectedRequest.max_budget.toLocaleString('ro-RO')}
                    </p>
                  </div>
                  {selectedRequest.fuel_type && (
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Combustibil</label>
                      <p className="text-xs md:text-base text-gray-900">{selectedRequest.fuel_type}</p>
                    </div>
                  )}
                  {selectedRequest.transmission && (
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Transmisie</label>
                      <p className="text-xs md:text-base text-gray-900">{selectedRequest.transmission}</p>
                    </div>
                  )}
                  {selectedRequest.mileage_max && (
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Max KM</label>
                      <p className="text-xs md:text-base text-gray-900">
                        {selectedRequest.mileage_max.toLocaleString('ro-RO')} km
                      </p>
                    </div>
                  )}
                  {selectedRequest.preferred_color && (
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Culoare</label>
                      <p className="text-xs md:text-base text-gray-900">{selectedRequest.preferred_color}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Requirements */}
              {selectedRequest.additional_requirements && (
                <div>
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 border-b border-blue-100 pb-1">
                    Cerințe Suplimentare
                  </h3>
                  <p className="text-xs md:text-base text-gray-900 bg-gray-50 p-2 md:p-4 rounded-lg">
                    {selectedRequest.additional_requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-3 md:px-6 py-2 md:py-4 flex justify-end rounded-b-xl">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 md:px-6 py-1.5 md:py-2 bg-blue-600 text-white text-xs md:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Dropdown Menu Portal */}
      {openMenuId && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpenMenuId(null)}
          />
          <div
            className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-40"
            style={{
              top: `${(document.getElementById(`menu-btn-${openMenuId}`) as HTMLElement)?.getBoundingClientRect().bottom + 4}px`,
              left: `${(document.getElementById(`menu-btn-${openMenuId}`) as HTMLElement)?.getBoundingClientRect().right - 192}px`
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmId(openMenuId);
                setOpenMenuId(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Șterge Cererea
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setDeleteConfirmId(null)} />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto">
              {/* Modal Header */}
              <div className="bg-red-600 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-white">Confirmare Ștergere</h2>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-900 text-base mb-2">
                  Ești sigur că vrei să ștergi această cerere?
                </p>
                <p className="text-gray-600 text-sm">
                  Această acțiune nu poate fi anulată. Cererea va fi ștearsă permanent din baza de date.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Anulează
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Se șterge...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Șterge
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
