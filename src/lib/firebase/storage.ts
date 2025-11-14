import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
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
