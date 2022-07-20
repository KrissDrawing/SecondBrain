// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
	apiKey: "AIzaSyAzhrVLPXciR4dgeHl3QFoaILOQdt2Cvm4",
	authDomain: "secondbrain-97721.firebaseapp.com",
	projectId: "secondbrain-9772a1",
	storageBucket: "secondbrain-97721.appspot.com",
	messagingSenderId: "738669475071",
	appId: "1:738669475071:web:d5c122839a1e6f19e7c8ca"
};


// This is from your snippet up above:
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import {getReactNativePersistence, initializeAuth} from 'firebase/auth/react-native';
//
// initializeAuth(app, {
// 	persistence: getReactNativePersistence(AsyncStorage);
// });
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const db = getFirestore(app)
// export const db = initializeFirestore(app, {
// 	experimentalForceLongPolling: true,
// })
