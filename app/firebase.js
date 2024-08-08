import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  browserLocalPersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZDegtiXy18M26dydEzMc7-ScbLMKn9T0",
  authDomain: "gamesayar-c465a.firebaseapp.com",
  projectId: "gamesayar-c465a",
  storageBucket: "gamesayar-c465a.appspot.com",
  messagingSenderId: "529012181123",
  appId: "1:529012181123:web:5dd9b1c9a0a731e54373b6",
  measurementId: "G-BVLMC1HQP7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // Initialize Firebase Auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export {auth,db,storage};

