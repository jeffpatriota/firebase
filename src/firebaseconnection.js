import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {getAuth} from 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyD4ESEzgkjNNU2E02n5odTXC4xoNq4MIOo",
    authDomain: "curso-d1abe.firebaseapp.com",
    projectId: "curso-d1abe",
    storageBucket: "curso-d1abe.appspot.com",
    messagingSenderId: "1085695608343",
    appId: "1:1085695608343:web:c84ecf3fa59b0433a7be52",
    measurementId: "G-L59HFND72W"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };