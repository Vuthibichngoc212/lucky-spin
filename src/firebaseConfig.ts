import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIxkmoHbJkjn_kyoB1twin9cR9UWKOX-Y",
  authDomain: "login-lucky-spin.firebaseapp.com",
  projectId: "login-lucky-spin",
  storageBucket: "login-lucky-spin.appspot.com",
  messagingSenderId: "70471878780",
  appId: "1:70471878780:web:895780a6570129d86ba1f9",
};

const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore(app);
