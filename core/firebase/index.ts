// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
	apiKey: "AIzaSyAzhrVLPXciR4dgeHl3QFoaILOQdt2Cvm4",
	authDomain: "secondbrain-97721.firebaseapp.com",
	projectId: "secondbrain-97721",
	storageBucket: "secondbrain-97721.appspot.com",
	messagingSenderId: "738669475071",
	appId: "1:738669475071:web:d5c122839a1e6f19e7c8ca"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
