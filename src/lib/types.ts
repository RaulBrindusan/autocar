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
  status?: string;       // Status: "Stoc" or "Consignatie"
  inmatriculare?: string; // Înmatriculare: "Inmatriculat" or "Neinmatriculat"
  cp?: string;           // CP (Cai Putere / Horsepower)
  co2?: string;          // CO2 Emissions
  vin?: string;          // VIN (Vehicle Identification Number)
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

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  published: boolean;
  timestamp: number;

  // SEO Fields
  slug: string;                    // URL-friendly slug
  metaTitle?: string;             // SEO meta title
  metaDescription?: string;       // SEO meta description
  excerpt?: string;               // Short summary for previews
  keywords?: string[];            // SEO keywords/tags

  // Featured Image
  featuredImage?: string;         // Main image URL
  featuredImageAlt?: string;      // Image alt text for accessibility
  featuredImageWidth?: number;    // Image width for OG tags
  featuredImageHeight?: number;   // Image height for OG tags

  // Open Graph (Social Media)
  ogTitle?: string;               // Open Graph title
  ogDescription?: string;         // Open Graph description
  ogImage?: string;               // Open Graph image URL

  // Twitter Cards
  twitterTitle?: string;          // Twitter card title
  twitterDescription?: string;    // Twitter card description
  twitterImage?: string;          // Twitter card image

  // Article Metadata
  category?: string;              // Blog category
  tags?: string[];                // Blog tags
  dateModified?: number;          // Last modified timestamp
}

export interface PriceCheck {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  make: string;              // Car make/brand
  model: string;             // Car model
  year?: number;             // Car year
  mileage?: string;          // Kilometers
  fuelType?: string;         // Fuel type
  transmission?: string;     // Transmission
  price?: number;            // Price to check or estimated value
  totalMinimum?: number;     // Minimum total price
  totalInchidereLicitatie?: number;  // Auction closing total price
  pretRomania?: number;      // Price in Romania
  profit?: number;           // Calculated profit
  vin?: string;              // Vehicle Identification Number
  url?: string;              // URL link to the listing
  additional_info?: string;  // Any additional details
  status?: string;           // Status of the price check (e.g., "pending", "completed")
  timestamp: any;            // Firebase Timestamp
}
