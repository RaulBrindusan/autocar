import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Car, Expense, Todo, CarRequest, BlogPost, PriceCheck } from '../types';

// Cars Collection

export const carsCollection = collection(db, 'cars');

// Add a new car
export const addCar = async (carData: Omit<Car, 'id'>) => {
  try {
    const docRef = await addDoc(carsCollection, carData);
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Update a car
export const updateCar = async (carId: string, carData: Partial<Car>) => {
  try {
    const carRef = doc(db, 'cars', carId);
    await updateDoc(carRef, carData);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Delete a car
export const deleteCar = async (carId: string) => {
  try {
    const carRef = doc(db, 'cars', carId);
    await deleteDoc(carRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get a single car
export const getCar = async (carId: string) => {
  try {
    const carRef = doc(db, 'cars', carId);
    const carSnap = await getDoc(carRef);
    if (carSnap.exists()) {
      return { car: { id: carSnap.id, ...carSnap.data() } as Car, error: null };
    } else {
      return { car: null, error: 'Car not found' };
    }
  } catch (error: any) {
    return { car: null, error: error.message };
  }
};

// Real-time listener for all cars
export const onCarsSnapshot = (callback: (cars: Car[]) => void) => {
  const q = query(carsCollection, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Car[];
    callback(cars);
  });
};

// Expenses Collection

export const expensesCollection = collection(db, 'expenses');

// Add a new expense
export const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
  try {
    const docRef = await addDoc(expensesCollection, {
      ...expenseData,
      // Support both carId and carID for backwards compatibility
      carID: expenseData.carId
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Update an expense
export const updateExpense = async (expenseId: string, expenseData: Partial<Expense>) => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId);
    const updateData: any = { ...expenseData };
    if (expenseData.carId) {
      updateData.carID = expenseData.carId;
    }
    await updateDoc(expenseRef, updateData);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Delete an expense
export const deleteExpense = async (expenseId: string) => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId);
    await deleteDoc(expenseRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get expenses for a specific car
export const getCarExpenses = async (carId: string) => {
  try {
    const q = query(expensesCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    // Filter client-side to support both carId and carID fields
    const expenses = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((exp: any) => exp.carId === carId || exp.carID === carId) as Expense[];
    return { expenses, error: null };
  } catch (error: any) {
    return { expenses: [], error: error.message };
  }
};

// Real-time listener for car expenses
export const onCarExpensesSnapshot = (carId: string, callback: (expenses: Expense[]) => void) => {
  const q = query(expensesCollection, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    // Filter client-side to support both carId and carID fields
    const expenses = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((exp: any) => exp.carId === carId || exp.carID === carId) as Expense[];
    callback(expenses);
  });
};

// Calculate total expenses for a car
export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => {
    const price = parseFloat(expense.price) || 0;
    return total + price;
  }, 0);
};

// Calculate profit for a car
export const calculateProfit = (askingPrice: string, buyingPrice: string, totalExpenses: number): number => {
  const asking = parseFloat(askingPrice) || 0;
  const buying = parseFloat(buyingPrice) || 0;
  return asking - buying - totalExpenses;
};

// Todos Collection

export const todosCollection = collection(db, 'todos');

// Add a new todo
export const addCarTodo = async (carId: string, name: string, userId: string) => {
  try {
    const docRef = await addDoc(todosCollection, {
      carId,
      name,
      status: false,
      userId,
      timestamp: Date.now()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Update a todo
export const updateCarTodo = async (todoId: string, updates: Partial<Todo>) => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, updates);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Delete a todo
export const deleteCarTodo = async (todoId: string) => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await deleteDoc(todoRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get todos for a specific car
export const getCarTodos = async (carId: string) => {
  try {
    const q = query(todosCollection, where('carId', '==', carId), orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    const todos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Todo[];
    return { todos, error: null };
  } catch (error: any) {
    return { todos: [], error: error.message };
  }
};

// Real-time listener for car todos
export const onCarTodosSnapshot = (carId: string, callback: (todos: Todo[]) => void) => {
  const q = query(todosCollection, where('carId', '==', carId), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const todos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Todo[];
    callback(todos);
  });
};

// Car Requests Collection

export const carRequestsCollection = collection(db, 'car_requests');

// Real-time listener for all car requests
export const onCarRequestsSnapshot = (callback: (requests: CarRequest[]) => void) => {
  const q = query(carRequestsCollection, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CarRequest[];
    callback(requests);
  });
};

// Delete a car request
export const deleteCarRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, 'car_requests', requestId);
    await deleteDoc(requestRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Blog Posts Collection

export const blogPostsCollection = collection(db, 'blog_posts');

// Add a new blog post
export const addBlogPost = async (blogPostData: Omit<BlogPost, 'id'>, customId?: string) => {
  try {
    if (customId) {
      // Use custom ID (for posts with pre-uploaded images)
      const docRef = doc(db, 'blog_posts', customId);
      await setDoc(docRef, blogPostData);
      return { id: customId, error: null };
    } else {
      // Auto-generate ID
      const docRef = await addDoc(blogPostsCollection, blogPostData);
      return { id: docRef.id, error: null };
    }
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Update a blog post
export const updateBlogPost = async (postId: string, postData: Partial<BlogPost>) => {
  try {
    const postRef = doc(db, 'blog_posts', postId);
    await updateDoc(postRef, postData);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Delete a blog post
export const deleteBlogPost = async (postId: string) => {
  try {
    const postRef = doc(db, 'blog_posts', postId);
    await deleteDoc(postRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Real-time listener for all blog posts
export const onBlogPostsSnapshot = (callback: (posts: BlogPost[]) => void) => {
  const q = query(blogPostsCollection, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
    callback(posts);
  });
};

// Price Check Collection

export const priceCheckCollection = collection(db, 'pricecheck');

// Real-time listener for all price check requests
export const onPriceCheckSnapshot = (callback: (priceChecks: PriceCheck[]) => void) => {
  const q = query(priceCheckCollection, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const priceChecks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PriceCheck[];
    callback(priceChecks);
  });
};

// Delete a price check request
export const deletePriceCheck = async (priceCheckId: string) => {
  try {
    const priceCheckRef = doc(db, 'pricecheck', priceCheckId);
    await deleteDoc(priceCheckRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update a price check request
export const updatePriceCheck = async (priceCheckId: string, priceCheckData: Partial<PriceCheck>) => {
  try {
    const priceCheckRef = doc(db, 'pricecheck', priceCheckId);
    await updateDoc(priceCheckRef, priceCheckData);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
