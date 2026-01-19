'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddCarDialog from '@/components/AddCarDialog';
import { onCarsSnapshot, onCarExpensesSnapshot, calculateTotalExpenses, calculateProfit } from '@/lib/firebase/firestore';
import { Car, Expense } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carExpenses, setCarExpenses] = useState<Record<string, Expense[]>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Set up real-time listener for cars
    const unsubscribe = onCarsSnapshot((updatedCars) => {
      setCars(updatedCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Set up real-time listeners for all car expenses
    const unsubscribes = cars.map((car) =>
      onCarExpensesSnapshot(car.id, (expenses) => {
        setCarExpenses((prev) => ({
          ...prev,
          [car.id]: expenses,
        }));
      })
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [cars]);

  const handleCarClick = (carId: string) => {
    router.push(`/dashboard/car/${carId}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
        {/* Breadcrumbs */}
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li className="text-gray-600 font-medium">Home</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Gestionează inventarul de mașini</p>
        </div>

        {/* Add Car Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddDialog(true)}
            className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Adaugă Mașină</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Se încarcă mașinile...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && cars.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nicio mașină adăugată
            </h3>
            <p className="text-gray-600 mb-4">
              Începe prin a adăuga prima ta mașină în inventar
            </p>
            <button
              onClick={() => setShowAddDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adaugă Mașină
            </button>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <CarCard
                key={car.id}
                car={car}
                expenses={carExpenses[car.id] || []}
                onClick={() => handleCarClick(car.id)}
                index={index}
              />
            ))}
          </div>
        )}

      {/* Add Car Dialog */}
      {showAddDialog && (
        <AddCarDialog onClose={() => setShowAddDialog(false)} />
      )}
    </main>
  );
}

// Car Card Component
function CarCard({ car, expenses, onClick, index }: { car: Car; expenses: Expense[]; onClick: () => void; index: number }) {
  const totalExpenses = calculateTotalExpenses(expenses);
  const realProfit = calculateProfit(car.askingprice, car.buyingprice, totalExpenses);
  const profitColor = realProfit >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      {/* Car Image */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {car.imageUrl ? (
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            loading="eager"
            priority={index < 6}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {car.make} {car.model}
        </h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-medium">An:</span> {car.year} • {car.km} km
          </p>
          <p>
            <span className="font-medium">Motor:</span> {car.engine} • {car.fuel}
          </p>
        </div>

        {/* Prices */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Preț Cumpărare:</span>
            <span className="font-semibold text-gray-900">{car.buyingprice} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Preț Cerut:</span>
            <span className="font-semibold text-gray-900">{car.askingprice} €</span>
          </div>
          {totalExpenses > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cheltuieli:</span>
              <span className="font-semibold text-red-600">-{totalExpenses.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t">
            <span className="text-gray-900">Profit Real:</span>
            <span className={profitColor}>{realProfit >= 0 ? '+' : ''}{realProfit.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}

