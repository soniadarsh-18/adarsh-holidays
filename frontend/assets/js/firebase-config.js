// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcO7zNtptf8Hyld82Eab5xnjiou4sAU24",
    authDomain: "adarsh-holidays-46e87.firebaseapp.com",
    projectId: "adarsh-holidays-46e87",
    storageBucket: "adarsh-holidays-46e87.firebasestorage.app",
    messagingSenderId: "1003712775317",
    appId: "1:1003712775317:web:c0998f6d42f8da46a5879c",
    measurementId: "G-XD6SMY7WDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 