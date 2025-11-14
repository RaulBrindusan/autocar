'use client';

import { useState } from 'react';
import { updateExpense } from '@/lib/firebase/firestore';
import { Expense } from '@/lib/types';

interface EditExpenseDialogProps {
  expense: Expense;
  onClose: () => void;
}

export default function EditExpenseDialog({ expense, onClose }: EditExpenseDialogProps) {
  const [type, setType] = useState(expense.type);
  const [price, setPrice] = useState(expense.price);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!type || !price) {
        setError('Te rog să completezi toate câmpurile');
        setLoading(false);
        return;
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        setError('Prețul trebuie să fie un număr valid mai mare decât 0');
        setLoading(false);
        return;
      }

      const updateData: Partial<Expense> = {
        type,
        price
      };

      const { error: updateError } = await updateExpense(expense.id, updateData);

      if (updateError) {
        setError(`Eroare la actualizarea cheltuielii: ${updateError}`);
        setLoading(false);
        return;
      }

      onClose();
    } catch (err: any) {
      setError(`Eroare neașteptată: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Editează Cheltuială</h2>
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Cheltuială *
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                placeholder="ex: Reparații, Revizie, Anvelope"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preț (€) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                step="0.01"
                min="0"
                placeholder="ex: 250.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
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
