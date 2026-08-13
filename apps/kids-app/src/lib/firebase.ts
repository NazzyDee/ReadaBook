import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZfqUAWqIZkrJALLwLGBXb7XuOqJMeEUo",
  authDomain: "readabook-b8675.firebaseapp.com",
  projectId: "readabook-b8675",
  storageBucket: "readabook-b8675.firebasestorage.app",
  messagingSenderId: "760892805875",
  appId: "1:760892805875:web:1ad90b5435d54356341d86",
  measurementId: "G-DV0Z3DGLYJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
