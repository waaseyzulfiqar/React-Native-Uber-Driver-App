import { collection, query, where, onSnapshot, getFirestore, doc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD20P3W0sWy-8KM1lMoP_40LYhuA9SVlXI",
  authDomain: "uber-clone-82727.firebaseapp.com",
  projectId: "uber-clone-82727",
  storageBucket: "uber-clone-82727.appspot.com",
  messagingSenderId: "125266475510",
  appId: "1:125266475510:web:e5290f0b72f45e87e06fd7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



export {
    collection, query, where, onSnapshot,db, doc, updateDoc
}