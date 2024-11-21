import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuOL6jjDaYrygscK_vktmgn9cvnl71THI",
  authDomain: "finalyearproject-95f9a.firebaseapp.com",
  projectId: "finalyearproject-95f9a",
  storageBucket: "finalyearproject-95f9a.appspot.com",
  messagingSenderId: "975119814140",
  appId: "1:975119814140:web:a942cb5e907e1bc56ab679"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export const db = firebase.firestore();

export default firebase;
