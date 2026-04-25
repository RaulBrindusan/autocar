'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCarRequest, deleteCarRequest, updateCarRequest, createSentRequest, getSentRequestsByRequestId } from '@/lib/firebase/firestore';
import { uploadOfferPdf } from '@/lib/firebase/storage';
import { CarRequest, SentRequest } from '@/lib/types';
import { ArrowLeft, Trash2, Upload, FileText, Send, X } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export default function CerereDetaliuPage() {
  return (
    <ProtectedRoute>
      <CerereDetaliuContent />
    </ProtectedRoute>
  );
}

function CerereDetaliuContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<CarRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Offer form state
  const [offerPrice, setOfferPrice] = useState('');
  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [sentOffers, setSentOffers] = useState<SentRequest[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const [requestResult, offersResult] = await Promise.all([
        getCarRequest(id),
        getSentRequestsByRequestId(id),
      ]);
      if (requestResult.error || !requestResult.data) {
        setNotFound(true);
      } else {
        setRequest(requestResult.data);
      }
      if (!offersResult.error) {
        setSentOffers(offersResult.data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type !== 'application/pdf') {
      setOfferError('Doar fișierele PDF sunt acceptate.');
      return;
    }
    setOfferError(null);
    setOfferFile(file);
  };

  const handleSendOffer = async () => {
    if (!offerFile) { setOfferError('Selectează un fișier PDF.'); return; }
    if (!offerPrice || isNaN(Number(offerPrice)) || Number(offerPrice) <= 0) {
      setOfferError('Introdu un preț valid.');
      return;
    }

    setIsSendingOffer(true);
    setOfferError(null);

    const { url, path, error: uploadError } = await uploadOfferPdf(offerFile, id);
    if (uploadError || !url || !path) {
      setOfferError(uploadError ?? 'Eroare la încărcare.');
      setIsSendingOffer(false);
      return;
    }

    const { error: saveError } = await createSentRequest({
      request_id: id,
      price: Number(offerPrice),
      pdf_url: url,
      pdf_path: path,
      timestamp: null,
    });

    if (saveError) {
      setOfferError(saveError);
      setIsSendingOffer(false);
      return;
    }

    // Update request status to offer_sent
    await updateCarRequest(id, { status: 'offer_sent' });
    setRequest(prev => prev ? { ...prev, status: 'offer_sent' } : prev);

    // Refresh sent offers list
    const { data } = await getSentRequestsByRequestId(id);
    setSentOffers(data);

    setOfferSuccess(true);
    setOfferPrice('');
    setOfferFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsSendingOffer(false);
    setTimeout(() => setOfferSuccess(false), 4000);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDelete = async () => {
    if (!request) return;
    setIsDeleting(true);
    try {
      const result = await deleteCarRequest(request.id);
      if (result.error) {
        alert('Eroare la ștergerea cererii: ' + result.error);
        setIsDeleting(false);
        setDeleteConfirm(false);
      } else {
        router.push('/dashboard/cereri');
      }
    } catch {
      alert('A apărut o eroare la ștergerea cererii.');
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
      <Breadcrumbs className="mb-6" />

      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard/cereri')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Înapoi la cereri
      </button>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="mt-6 text-lg font-medium text-gray-700">Se încarcă cererea...</p>
        </div>
      )}

      {/* Not found */}
      {!loading && notFound && (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Cererea nu a fost găsită</h3>
          <p className="text-gray-600">ID-ul cererii nu există sau a fost ștearsă.</p>
        </div>
      )}

      {/* Content */}
      {!loading && request && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Detalii Cerere</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{formatDate(request.timestamp)}</p>
            </div>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Șterge
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-100">
            {/* Contact Information */}
            <div className="px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Informații Contact</h2>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Nume:</span>
                  <span className="text-xs font-semibold text-gray-900">{request.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Email:</span>
                  <span className="text-xs text-gray-900">{request.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Telefon:</span>
                  <span className="text-xs text-gray-900">{request.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    request.status === 'offer_sent'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {request.status === 'offer_sent' ? 'În Ofertare' : request.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Car Details */}
            <div className="p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Detalii Mașină</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Marcă</p>
                  <p className="text-sm font-semibold text-gray-900">{request.brand}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Model</p>
                  <p className="text-sm font-semibold text-gray-900">{request.model}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">An</p>
                  <p className="text-sm text-gray-900">{request.year}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Buget maxim</p>
                  <p className="text-sm font-semibold text-blue-600">€{request.max_budget.toLocaleString('ro-RO')}</p>
                </div>
                {request.fuel_type && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Combustibil</p>
                    <p className="text-sm text-gray-900">{request.fuel_type}</p>
                  </div>
                )}
                {request.transmission && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Transmisie</p>
                    <p className="text-sm text-gray-900">{request.transmission}</p>
                  </div>
                )}
                {request.mileage_max && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Max KM</p>
                    <p className="text-sm text-gray-900">{request.mileage_max.toLocaleString('ro-RO')} km</p>
                  </div>
                )}
                {request.preferred_color && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Culoare preferată</p>
                    <p className="text-sm text-gray-900">{request.preferred_color}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Requirements */}
            {request.additional_requirements && (
              <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Cerințe Suplimentare</h2>
                <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {request.additional_requirements}
                </p>
              </div>
            )}
          </div>

          {/* Send Offer Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Trimite Ofertă</h2>
              <p className="text-xs text-gray-500 mt-1">Încarcă un PDF și specifică prețul oferit</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Price field */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Preț Ofertă (€)</label>
                <input
                  type="number"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="ex: 15000"
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* PDF uploader */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fișier PDF</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full md:w-96 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-900 truncate">
                    {offerFile ? offerFile.name : 'Selectează fișier PDF...'}
                  </span>
                  {offerFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOfferFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Error */}
              {offerError && (
                <p className="text-sm text-red-600">{offerError}</p>
              )}

              {/* Submit */}
              <button
                onClick={handleSendOffer}
                disabled={isSendingOffer}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSendingOffer ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Trimite Oferta
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sent Offers History */}
          {sentOffers.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Oferte Trimise</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preț</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sentOffers.map((offer, index) => (
                      <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">€{offer.price.toLocaleString('ro-RO')}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{formatDate(offer.timestamp)}</td>
                        <td className="px-6 py-3 text-right">
                          <a
                            href={offer.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Vezi PDF
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Toast */}
          {offerSuccess && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg pointer-events-none">
              <Send className="w-4 h-4" />
              Oferta a fost trimisă cu succes!
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setDeleteConfirm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto">
              <div className="bg-red-600 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-white">Confirmare Ștergere</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-900 text-base mb-2">Ești sigur că vrei să ștergi această cerere?</p>
                <p className="text-gray-600 text-sm">Această acțiune nu poate fi anulată. Cererea va fi ștearsă permanent din baza de date.</p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => setDeleteConfirm(false)}
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
