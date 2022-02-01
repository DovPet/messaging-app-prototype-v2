import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import 'firebase/compat/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAhZqQbn2lkPrwMssDE8iq3wM_lMuT3j20",
    authDomain: "messaging-prototype-v2.firebaseapp.com",
    projectId: "messaging-prototype-v2",
    storageBucket: "messaging-prototype-v2.appspot.com",
    messagingSenderId: "42210042384",
    appId: "1:42210042384:web:903c61f7808c70a7cd6095"
  };

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider }