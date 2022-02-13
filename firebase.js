import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyC3zxuyKIysYiRJINugf3_Ve1bHEGO6FJk",
  authDomain: "whatsappclone-nextjs.firebaseapp.com",
  projectId: "whatsappclone-nextjs",
  storageBucket: "whatsappclone-nextjs.appspot.com",
  messagingSenderId: "373141893887",
  appId: "1:373141893887:web:2c5179bfbe3452f486d2ca",
  measurementId: "G-ZMFPF2553F"
};


const app = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export { db, auth, provider ,storage};