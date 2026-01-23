import { NextResponse } from 'next/server';
import { getDocs, doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export async function POST() {
  try {
    const carsRef = collection(db, 'cars');
    const snapshot = await getDocs(carsRef);

    let cleanedCount = 0;
    let totalDuplicatesRemoved = 0;

    for (const docSnap of snapshot.docs) {
      const carData = docSnap.data();
      const images: string[] = carData.images || [];
      const imageUrl: string = carData.imageUrl;

      if (images.length === 0) continue;

      // Remove duplicates using Set and also remove primary image from gallery
      const uniqueImages = Array.from(new Set(images)).filter(img => img !== imageUrl);

      if (uniqueImages.length !== images.length) {
        const duplicatesRemoved = images.length - uniqueImages.length;

        await updateDoc(doc(db, 'cars', docSnap.id), {
          images: uniqueImages
        });

        console.log(`Cleaned ${carData.make} ${carData.model}: removed ${duplicatesRemoved} duplicates`);
        cleanedCount++;
        totalDuplicatesRemoved += duplicatesRemoved;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned ${cleanedCount} cars, removed ${totalDuplicatesRemoved} duplicate images total`
    });
  } catch (error: any) {
    console.error('Error cleaning duplicates:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
