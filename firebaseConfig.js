import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBZEDZpYK2G6ZYt-3PjzTMW-SfLAbd5uz4",
  authDomain: "uasprojeck-7e531.firebaseapp.com",
  projectId: "uasprojeck-7e531",
  storageBucket: "uasprojeck-7e531.firebasestorage.app",
  messagingSenderId: "564465721136",
  appId: "1:564465721136:web:808d080f91927f0e82b2f5"
};

const app = initializeApp(firebaseConfig); // Inisialisasi Firebase
const auth = getAuth(app); // Inisialisasi Auth
const firestore = getFirestore(app); // Inisialisasi Firestore
export { app, auth, firestore };
