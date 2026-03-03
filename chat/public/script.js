import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { updateProfile, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, serverTimestamp, doc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js'
import { messageElement } from "./stuff.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

let user;
let displayName;
let snapshotListener;

auth.onAuthStateChanged(function(u) {
  if(u) {
    user = u;
    console.log(user);
    document.querySelector(".signinstuff").classList.add("invis");
    document.getElementById("main").classList.remove("invis");
    displayName = user.displayName;
    document.getElementById("username").value = displayName;
  } else {
    console.log("not logged in");
  }
}) // yesterday i was going to spend more time on this project but i walked into a small cactus i kid you not

document.getElementById("username").addEventListener("change", function(event) {
  if(!event.target.value) {
    event.target.value = displayName;
  }
  displayName = event.target.value;
  updateProfile(auth.currentUser, {
    displayName: displayName
  }).then(() => {

  }).catch((err) => {
    alert('your username failed to update ' + err); //hope noone ever gets this error
  })
});

document.addEventListener("keydown", async function(event) {
  const messagebox = document.getElementById("messagebox");
  if(event.key == "Enter") {
    if(messagebox == document.activeElement && messagebox.value) {
      sendMessage(messagebox.value);
      messagebox.value = "";
    }
  }
})

function sendMessage(text) {
//  if(!text.length || text.length > 256) return;
  if(text.length > 256) return;
  const message = {
    content: text,
    author: {
      name: displayName,
      id: user.uid
    },
  }
  //messageElement(message);
  writeMessage(message);
}

async function writeMessage(message) {
  const doc = await addDoc(collection(db, "chats", "main", "messages"), {
    content: message.content,
    author: {
      name: message.author.name,
      id: message.author.id,
    },
    created_at: serverTimestamp(),
  }).then(() => {
    console.log("message written yay");
  });
}

async function receiveChat() {
  if(snapshotListener) snapshotListener(); 
  //i always found removing the listener by calling it as a function seemed weird, something like snapshotListener.unsubscribe() would be more intuitive but what can I say I'm not google and I'm sure they had their reasons.
  const q = query(collection(db, "chats", "main", "messages"), orderBy("created_at", "desc"), limit(32));
  let firstTime = true;

  snapshotListener = onSnapshot(q, async(snapshot) => {
    if(firstTime) {
      const messages = snapshot.docs.map(m => m.data()).reverse();
      messages.forEach(message => {
        messageElement(message);
      })
      firstTime = false;
      return;
    }
    snapshot.docChanges().forEach(change => {
      if(change.type == "added") {
        const message = change.doc.data();
        // if(message.author.id == user.uid) return;
        messageElement(message);
      }
    })
  })
}

receiveChat();