import { initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, getFirestore, initializeFirestore } from 'firebase/firestore';
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

// const firebaseConfig = {
//     apiKey: "AIzaSyA_32JVMtsJJ9UFcgtNW64_QE-KH1s6gJc",
//     authDomain: "mycars-5a6ec.firebaseapp.com",
//     projectId: "mycars-5a6ec",
//     storageBucket: "mycars-5a6ec.appspot.com",
//     messagingSenderId: "467977070783",
//     appId: "1:467977070783:web:3bdc6c8c7c3eaec67ffe0a",
//     measurementId: "G-WCCYYJPJG8"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);