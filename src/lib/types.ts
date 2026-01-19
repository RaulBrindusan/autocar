// Data types matching the Android app structure

export interface Car {
  id: string;
  make: string;          // Marcă
  model: string;
  year: string;
  km: string;            // Kilometri
  fuel: string;          // Tip Combustibil
  engine: string;        // Motor
  transmisie?: string;   // Transmisie (e.g., "Automată", "Manuală")
  echipare?: string;     // Echipare (e.g., "Bose Edition", "Premium")
  dotari?: string;       // Dotări complete (features list)
  reportCV?: string;     // Storage path to vehicle report PDF
  buyingprice: string;   // Preț Cumpărare (matches Firestore field)
  askingprice: string;   // Preț Cerut (matches Firestore field)
  profit: string;        // Calculated profit
  imageUrl?: string;     // Firebase Storage URL (primary image)
  images?: string[];     // Array of image URLs for gallery
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

export interface Todo {
  id: string;
  carId: string;         // Reference to Car document
  name: string;          // To-do item description
  status: boolean;       // true = done, false = not done
  timestamp: number;     // Unix timestamp
  userId: string;        // User who created it
}

export interface CarRequest {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  brand: string;
  model: string;
  year: number;
  max_budget: number;
  preferred_color?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  mileage_max?: number | null;
  additional_requirements?: string | null;
  status: string;
  timestamp: any;  // Firebase Timestamp
}
