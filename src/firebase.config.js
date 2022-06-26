import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD8LW6m8AiX9GIzktpHn6U1Qpa16Y_sltM',
  authDomain: 'interactive-comment-sect-1509.firebaseapp.com',
  projectId: 'interactive-comment-sect-1509',
  storageBucket: 'interactive-comment-sect-1509.appspot.com',
  messagingSenderId: '551986370228',
  appId: '1:551986370228:web:a63f1af27bef314ad3a9e1',
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Init Cloud Firestore
export const db = getFirestore(app);
