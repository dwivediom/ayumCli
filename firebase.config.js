import { initializeApp } from 'firebase/app';
import {getAuth}from  'firebase/auth'
import "firebase/messaging";
import firebase from 'firebase/app';

import { getMessaging } from "firebase/messaging";


// TODO: Replace the following with your app's Firebase project configuration
export const firebaseConfig = {
  // databaseURL: "https://ayumNotification.firebaseio.com",
  apiKey: "AIzaSyDSynbYEEylMVxN7X4jxbRQryhfieREV_Y",
  authDomain: "ayum-b51f8.firebaseapp.com",
  projectId: "ayum-b51f8",
  storageBucket: "ayum-b51f8.appspot.com",
  messagingSenderId: "209089073971",
  appId: "1:209089073971:web:e8ef81ad5627698759a446",
  measurementId: "G-1RJPF2S40R"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const authentication= getAuth(firebaseApp)

// export const messaging = getMessaging(firebaseApp);

