import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: "AIzaSyDcRX1OqrNVJ7YEvOt_TgRKFDkJCbz0jR4",
  authDomain: "locallift-f4983.firebaseapp.com",
  projectId: "locallift-f4983",
  storageBucket: "locallift-f4983.appspot.com",
  messagingSenderId: "99005557350",
  appId: "1:99005557350:web:d9fbd656914708665c9ba7",
  measurementId: "G-LP200NWEZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app