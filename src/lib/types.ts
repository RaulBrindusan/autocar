// Data types matching the Android app structure

export interface Car {
  id: string;
  make: string;          // Marcă
  model: string;
  year: string;
  km: string;            // Kilometri
  fuel: string;          // Tip Combustibil
  engine: string;        // Motor
  buyingprice: string;   // Preț Cumpărare (matches Firestore field)
  askingprice: string;   // Preț Cerut (matches Firestore field)
  profit: string;        // Calculated profit
  imageUrl?: string;     // Firebase Storage URL
  timestamp: number;     // For sorting
}

export interface Expense {
  id: string;
  carId: string;         // Reference to Car document (also supports carID for backwards compatibility)
  type: string;          // Expense type (e.g., "Reparații", "Revizie")
  price: string;         // Expense amount in €
  timestamp: number;     // Unix timestamp
}

export interface User {
  uid: string;
  email: string | null;
}
