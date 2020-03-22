import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBhNSHUPFFZCPnxoShwPQVfIqMNgdxn3wI",
  authDomain: "my-project-1559612665398.firebaseapp.com",
  databaseURL: "https://my-project-1559612665398.firebaseio.com",
  projectId: "my-project-1559612665398",
  storageBucket: "my-project-1559612665398.appspot.com",
  messagingSenderId: "660762728641",
  appId: "1:660762728641:web:6e6827d438ce73a5e4dc40",
  measurementId: "G-3R22DXBXNY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
