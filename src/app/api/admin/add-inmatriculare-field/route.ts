import { NextResponse } from 'next/server';
import { getDocs, doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export async function POST() {
  try {
    const carsRef = collection(db, 'cars');
    const snapshot = await getDocs(carsRef);

    let updatedCount = 0;

    for (const docSnap of snapshot.docs) {
      const carData = docSnap.data();

      // Only add if the field doesn't exist
      if (!carData.inmatriculare) {
        await updateDoc(doc(db, 'cars', docSnap.id), {
          inmatriculare: 'Neinmatriculat' // Default value
        });

        console.log(`Added inmatriculare field to ${carData.make} ${carData.model}`);
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added inmatriculare field to ${updatedCount} cars`
    });
  } catch (error: any) {
    console.error('Error adding inmatriculare field:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
