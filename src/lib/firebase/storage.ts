import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

// Upload image to Firebase Storage
export const uploadCarImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Only image files are allowed' };
    }

    // Validate file size (5MB max, matching Android app)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { url: null, error: 'Image size must be less than 5MB' };
    }

    // Generate unique filename
    const imageId = uuidv4();
    const storageRef = ref(storage, `cars/${imageId}.jpg`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return { url: downloadURL, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};

// Delete image from Firebase Storage
export const deleteCarImage = async (imageUrl: string): Promise<{ error: string | null }> => {
  try {
    // Extract file path from URL
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

/**
 * Fetch all image URLs from a Firebase Storage folder
 * @param folderPath - The path to the folder (e.g., "selling/car1")
 * @returns Array of image URLs
 */
export const getImagesFromFolder = async (folderPath: string): Promise<string[]> => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    // Get download URLs for all items in the folder in parallel
    const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
    const urls = await Promise.all(urlPromises);

    return urls;
  } catch (error) {
    console.error('Error fetching images from folder:', error);
    return [];
  }
};

/**
 * Fetch and cache image URLs from a folder with client-side caching
 * Uses sessionStorage to avoid repeated Storage API calls during the same session
 * @param folderPath - The path to the folder (e.g., "selling/car1")
 * @returns Array of image URLs
 */
export const getImagesFromFolderCached = async (folderPath: string): Promise<string[]> => {
  try {
    // Check cache first
    const cacheKey = `images_${folderPath}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from Storage
    const urls = await getImagesFromFolder(folderPath);

    // Cache for this session
    if (urls.length > 0) {
      sessionStorage.setItem(cacheKey, JSON.stringify(urls));
    }

    return urls;
  } catch (error) {
    console.error('Error fetching cached images:', error);
    return [];
  }
};

/**
 * Get download URL from a Firebase Storage path
 * @param storagePath - The storage path (e.g., "reports/car1.pdf")
 * @returns Download URL or null if error
 */
export const getDownloadUrlFromPath = async (storagePath: string): Promise<string | null> => {
  try {
    const fileRef = ref(storage, storagePath);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    return null;
  }
};

// Upload CarVertical report PDF to Firebase Storage
export const uploadCarReport = async (file: File, carId: string): Promise<{ path: string | null; error: string | null }> => {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      return { path: null, error: 'Only PDF files are allowed' };
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { path: null, error: 'PDF size must be less than 10MB' };
    }

    // Create storage path
    const storagePath = `reports/${carId}/carvertical-report.pdf`;
    const storageRef = ref(storage, storagePath);

    // Upload file
    await uploadBytes(storageRef, file);

    return { path: storagePath, error: null };
  } catch (error: any) {
    return { path: null, error: error.message };
  }
};
