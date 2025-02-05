import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVtnAWsoIlU96B5g2SkEfA95sAgoEt1zI",
  authDomain: "speakerrecognitionapp.firebaseapp.com",
  projectId: "speakerrecognitionapp",
  storageBucket: "speakerrecognitionapp.appspot.com",
  messagingSenderId: "783509475498",
  appId: "1:783509475498:web:f620e4f1df5734e70f40d3",
  measurementId: "G-NFR3451J4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
