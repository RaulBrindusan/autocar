'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import EditCarDialog from '@/components/EditCarDialog';
import AddExpenseDialog from '@/components/AddExpenseDialog';
import EditExpenseDialog from '@/components/EditExpenseDialog';
import AddTodoDialog from '@/components/AddTodoDialog';
import EditTodoDialog from '@/components/EditTodoDialog';
import { getCar, deleteCar, onCarExpensesSnapshot, deleteExpense, calculateTotalExpenses, calculateProfit, onCarTodosSnapshot, updateCarTodo, deleteCarTodo } from '@/lib/firebase/firestore';
import { getDownloadUrlFromPath } from '@/lib/firebase/storage';
import { Car, Expense, Todo } from '@/lib/types';

export default function CarDetailPage() {
  return (
    <ProtectedRoute>
      <CarDetailContent />
    </ProtectedRoute>
  );
}

function CarDetailContent() {
  const params = useParams();
  const carId = params.id as string;
  const router = useRouter();

  const [car, setCar] = useState<Car | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [deleteTodoId, setDeleteTodoId] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load car data
    const loadCar = async () => {
      const { car, error } = await getCar(carId);
      if (error || !car) {
        router.push('/dashboard');
        return;
      }
      setCar(car);
      setLoading(false);

      // Fetch report URL if reportCV path exists
      if (car.reportCV) {
        const url = await getDownloadUrlFromPath(car.reportCV);
        setReportUrl(url);
      }
    };

    loadCar();

    // Set up real-time listener for expenses
    const unsubscribeExpenses = onCarExpensesSnapshot(carId, (updatedExpenses) => {
      setExpenses(updatedExpenses);
    });

    // Set up real-time listener for todos
    const unsubscribeTodos = onCarTodosSnapshot(carId, (updatedTodos) => {
      setTodos(updatedTodos);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeTodos();
    };
  }, [carId, router]);

  const handleDeleteCar = async () => {
    setLoading(true);

    // Delete all expenses first
    for (const expense of expenses) {
      await deleteExpense(expense.id);
    }

    // Delete car
    const { error } = await deleteCar(carId);

    if (!error) {
      router.push('/dashboard');
    } else {
      setLoading(false);
      alert(`Eroare la ștergerea mașinii: ${error}`);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const { error } = await deleteExpense(expenseId);
    if (error) {
      alert(`Eroare la ștergerea cheltuielii: ${error}`);
    }
    setDeleteExpenseId(null);
  };

  const handleToggleTodo = async (todoId: string, currentStatus: boolean) => {
    const { error } = await updateCarTodo(todoId, { status: !currentStatus });
    if (error) {
      alert(`Eroare la actualizarea sarcinii: ${error}`);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    const { error } = await deleteCarTodo(todoId);
    if (error) {
      alert(`Eroare la ștergerea sarcinii: ${error}`);
    }
    setDeleteTodoId(null);
  };

  if (loading || !car) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const totalExpenses = calculateTotalExpenses(expenses);
  const realProfit = calculateProfit(car.askingprice, car.buyingprice, totalExpenses);
  const profitColor = realProfit >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {car.make} {car.model}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditDialog(true)}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Editează</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Șterge</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
          {/* Left Column - Cheltuieli & De Făcut */}
          <div className="order-3 lg:order-1 space-y-6 lg:space-y-5">
            {/* Cheltuieli Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Cheltuieli</h2>
                <button
                  onClick={() => setShowAddExpenseDialog(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Adaugă</span>
                </button>
              </div>

              {expenses.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nicio cheltuială adăugată
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      onEdit={() => setEditingExpense(expense)}
                      onDelete={() => setDeleteExpenseId(expense.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* De Făcut Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">De Făcut</h2>
                <button
                  onClick={() => setShowAddTodoDialog(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Adaugă</span>
                </button>
              </div>

              {todos.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nicio sarcină adăugată
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {todos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onToggle={() => handleToggleTodo(todo.id, todo.status)}
                      onEdit={() => setEditingTodo(todo)}
                      onDelete={() => setDeleteTodoId(todo.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Column - Car Image & Financiar */}
          <div className="order-1 lg:order-2 space-y-6 lg:space-y-5">
            {/* Car Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 sm:h-96 bg-gray-200 relative">
                {car.imageUrl ? (
                  <Image
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    quality={85}
                    loading="eager"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <svg className="w-32 h-32 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Financiar Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Financiar</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preț Cumpărare:</span>
                  <span className="font-semibold text-gray-900">{car.buyingprice} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preț Cerut:</span>
                  <span className="font-semibold text-gray-900">{car.askingprice} €</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="text-gray-600">Total Cheltuieli:</span>
                  <span className="font-semibold text-red-600">-{totalExpenses.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span className="text-gray-900">Profit Real:</span>
                  <span className={profitColor}>
                    {realProfit >= 0 ? '+' : ''}{realProfit.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Specificații & Report Button */}
          <div className="order-5 lg:order-3 space-y-3">
            {/* Specificații Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specificații</h2>
              <div className="grid grid-cols-1 gap-4">
                <DetailRow label="Marcă" value={car.make} />
                <DetailRow label="Model" value={car.model} />
                <DetailRow label="An" value={car.year} />
                <DetailRow label="Kilometri" value={`${car.km} km`} />
                <DetailRow label="Tip Combustibil" value={car.fuel} />
                <DetailRow label="Motor" value={car.engine} />
                {car.transmisie && <DetailRow label="Transmisie" value={car.transmisie} />}
                {car.echipare && <DetailRow label="Echipare" value={car.echipare} />}
              </div>
            </div>

            {/* Report Button */}
            {reportUrl && (
              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-800 text-white text-center py-3 px-6 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Vezi raportul
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Dialogs */}
      {showEditDialog && (
        <EditCarDialog car={car} onClose={() => setShowEditDialog(false)} />
      )}

      {showAddExpenseDialog && (
        <AddExpenseDialog carId={carId} onClose={() => setShowAddExpenseDialog(false)} />
      )}

      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {showAddTodoDialog && (
        <AddTodoDialog carId={carId} onClose={() => setShowAddTodoDialog(false)} />
      )}

      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}

      {/* Delete Car Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Șterge Mașina</h3>
            <p className="text-gray-600 mb-6">
              Ești sigur că vrei să ștergi această mașină? Toate cheltuielile asociate vor fi de asemenea șterse. Această acțiune nu poate fi anulată.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleDeleteCar}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Expense Confirmation */}
      {deleteExpenseId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Șterge Cheltuială</h3>
            <p className="text-gray-600 mb-6">
              Ești sigur că vrei să ștergi această cheltuială?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteExpenseId(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={() => handleDeleteExpense(deleteExpenseId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Todo Confirmation */}
      {deleteTodoId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Șterge Sarcină</h3>
            <p className="text-gray-600 mb-6">
              Ești sigur că vrei să ștergi această sarcină?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTodoId(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={() => handleDeleteTodo(deleteTodoId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Detail Row Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm text-gray-600">{label}:</span>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// Expense Card Component
function ExpenseCard({
  expense,
  onEdit,
  onDelete
}: {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const date = new Date(expense.timestamp).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{expense.type}</p>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-bold text-red-600">{expense.price} €</span>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-700 transition-colors p-1"
            title="Editează"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 transition-colors p-1"
            title="Șterge"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Todo Card Component
function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete
}: {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`border rounded-lg p-3 transition-all ${
      todo.status
        ? 'bg-green-50 border-green-300'
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-center space-x-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            todo.status
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {todo.status && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Todo Text */}
        <p className={`flex-1 ${
          todo.status
            ? 'text-green-700 line-through font-medium'
            : 'text-gray-900 font-medium'
        }`}>
          {todo.name}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-700 transition-colors p-1"
            title="Editează"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 transition-colors p-1"
            title="Șterge"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
