// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqrYPwgLf_Jnyqa9RNGNKgopvZ9K7fgSU",
  authDomain: "gym-app-76a84.firebaseapp.com",
  projectId: "gym-app-76a84",
  storageBucket: "gym-app-76a84.firebasestorage.app",
  messagingSenderId: "1016068067501",
  appId: "1:1016068067501:web:1432d00d02da9ff298b624",
  measurementId: "G-SSQKWR5RSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const analytics = getAnalytics(app);

export { app, analytics, auth };