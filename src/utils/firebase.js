import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxxgnfBjaAi7k74FVCB2ZVUYRw4afxkJA",
  authDomain: "thanhdaigroup-8d243.firebaseapp.com",
  projectId: "thanhdaigroup-8d243",
  storageBucket: "thanhdaigroup-8d243.firebasestorage.app",
  messagingSenderId: "95404399727",
  appId: "1:95404399727:web:4505e9d3224cda06cd419a",
  measurementId: "G-XWMXPBW5D3"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

export { db };
