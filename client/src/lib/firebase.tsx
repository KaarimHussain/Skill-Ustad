// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCc4xTxpIMEYDahqMDx7fbwHr4nH-2i0VM",
    authDomain: "skill-ustad.firebaseapp.com",
    projectId: "skill-ustad",
    storageBucket: "skill-ustad.firebasestorage.app",
    messagingSenderId: "987060303351",
    appId: "1:987060303351:web:03df121969ff24f6156af2",
    measurementId: "G-RVVE86G935"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);