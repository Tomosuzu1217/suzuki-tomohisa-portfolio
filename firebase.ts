import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD77uULgtPj3GUBVtGPUpXl6ufHTyseAxE",
    authDomain: "profile-dad75.firebaseapp.com",
    projectId: "profile-dad75",
    storageBucket: "profile-dad75.firebasestorage.app",
    messagingSenderId: "469075508054",
    appId: "1:469075508054:web:a32dd37a2ab7d03b62b4f7",
    measurementId: "G-8G5XG7JXRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics = null;
isSupported().then(supported => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { app, analytics };
