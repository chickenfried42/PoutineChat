import { updateProfile, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, setDoc, onSnapshot, serverTimestamp, doc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyAJCNAJjc3IEGKEtpdZ59QrsabG2IH_yc8",
  authDomain: "poutinechat.firebaseapp.com",
  projectId: "poutinechat",
  storageBucket: "poutinechat.firebasestorage.app",
  messagingSenderId: "899736004935",
  appId: "1:899736004935:web:58e2e9b9de178e36584462",
  measurementId: "G-HZ8DD87MQ8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.querySelector("button").addEventListener("click", async function() {  
  const email = document.querySelector("#e").value;
  const password = document.querySelector("#p").value;
  signInWithEmailAndPassword(auth, email, password)
  .then(async (cred) => {
    const user = cred.user;
    
    const newUser = await setDoc(doc(db, "users", user.uid), {
      joined_At: serverTimestamp(),
      displayName: "newuser",
      avatar: "/default.png",
      bio: "say hi",
    });

    // await updateProfile(user, {
    //   displayName: "newuser",
    //   photoURL: "/default.png",
    // });

    if(user) {
      window.location.replace("/")
    }
  })
  .catch((err) => {
    alert(err.message); //hope nobody gets this error
  })
})

