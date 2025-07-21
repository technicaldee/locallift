import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../src/lib/firebase.config.js';

async function main() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 1. Create
    const testBusiness = {
        ownerId: 'test-user',
        name: 'Test Business',
        type: 'Retail',
        location: {
            address: '123 Main St',
            coordinates: [0, 0],
            city: 'Testville',
            country: 'Testland',
        },
        monthlyRevenue: 1000,
        yearsInOperation: 2,
        employeeCount: 5,
        verificationStatus: 'pending',
        documentsHash: '',
        description: 'A test business for CRUD.',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const ref = await addDoc(collection(db, 'businesses'), testBusiness);
    console.log('Created business with ID:', ref.id);

    // 2. Read
    const snap = await getDoc(doc(db, 'businesses', ref.id));
    console.log('Read business:', snap.data());

    // 3. Update
    await updateDoc(doc(db, 'businesses', ref.id), { verificationStatus: 'verified' });
    const updatedSnap = await getDoc(doc(db, 'businesses', ref.id));
    console.log('Updated business:', updatedSnap.data());

    // 4. Delete
    await deleteDoc(doc(db, 'businesses', ref.id));
    console.log('Deleted business with ID:', ref.id);
}

main().catch(console.error); 