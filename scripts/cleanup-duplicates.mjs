#!/usr/bin/env node
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupCarDuplicates(carId) {
  try {
    const carRef = doc(db, 'cars', carId);
    const carSnap = await getDoc(carRef);

    if (!carSnap.exists()) {
      console.log(`Car ${carId} not found`);
      return;
    }

    const carData = carSnap.data();
    const images = carData.images || [];
    const imageUrl = carData.imageUrl;

    console.log(`\nProcessing: ${carData.make} ${carData.model}`);
    console.log(`Total images before cleanup: ${images.length}`);

    // Remove duplicates using Set and also remove primary image from gallery
    const uniqueImages = Array.from(new Set(images)).filter(img => img !== imageUrl);

    console.log(`Total unique images after cleanup: ${uniqueImages.length}`);

    if (uniqueImages.length !== images.length) {
      await updateDoc(carRef, { images: uniqueImages });
      console.log(`✓ Cleaned up ${images.length - uniqueImages.length} duplicate/primary images`);
    } else {
      console.log('✓ No duplicates found');
    }
  } catch (error) {
    console.error(`Error cleaning up car ${carId}:`, error);
  }
}

async function cleanupAllCars() {
  // Known cars with issues
  const carIds = [
    'jtn1mcUBiHqmVRrf4XCy', // Ford Kuga
    'gWTAkdKmiJF1ZyZhzFhe', // Audi SQ5
  ];

  console.log('Starting duplicate cleanup...\n');

  for (const carId of carIds) {
    await cleanupCarDuplicates(carId);
  }

  console.log('\n✅ Cleanup complete!');
  process.exit(0);
}

cleanupAllCars();
