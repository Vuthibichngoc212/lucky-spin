// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCIxkmoHbJkjn_kyoB1twin9cR9UWKOX-Y",
//   authDomain: "login-lucky-spin.firebaseapp.com",
//   projectId: "login-lucky-spin",
//   storageBucket: "login-lucky-spin.appspot.com",
//   messagingSenderId: "70471878780",
//   appId: "1:70471878780:web:895780a6570129d86ba1f9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

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
