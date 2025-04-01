import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { isSupported, getAnalytics } from 'firebase/analytics';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqrYPwgLf_Jnyqa9RNGNKgopvZ9K7fgSU",
  authDomain: "gym-app-76a84.firebaseapp.com",
  projectId: "gym-app-76a84",
  storageBucket: "gym-app-76a84.firebasestorage.app",
  messagingSenderId: "1016068067501",
  appId: "1:1016068067501:web:1432d00d02da9ff298b624",
  measurementId: "G-SSQKWR5RSD"
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), // Use AsyncStorage for persistence
});

// Optionally initialize Analytics (if supported)
if (isSupported()) {
  const analytics = getAnalytics(app);
}

export { app, auth };
