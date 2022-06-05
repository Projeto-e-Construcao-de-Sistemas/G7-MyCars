import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC8veSXxLhSS0SPUel2SySwKboHoPjLMUg",
    authDomain: "carnow-15c72.firebaseapp.com",
    projectId: "carnow-15c72",
    storageBucket: "carnow-15c72.appspot.com",
    messagingSenderId: "495421121819",
    appId: "1:495421121819:web:0f70a82a40fcbcd3189fbe",
    measurementId: "G-5CX15Y06V9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);