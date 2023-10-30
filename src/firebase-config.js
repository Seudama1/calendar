import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA2du5TBVm4Jcj82-h4w4nfNpWGvIc4-mk",
    authDomain: "coolendar-71254.firebaseapp.com",
    projectId: "coolendar-71254",
    storageBucket: "coolendar-71254.appspot.com",
    messagingSenderId: "910955902467",
    appId: "1:910955902467:web:8368027ecf1aaa1aae4036",
    measurementId: "G-ZJH7GQ2MG1"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);