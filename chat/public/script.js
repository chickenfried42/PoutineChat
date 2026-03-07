import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { updateProfile, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, serverTimestamp, doc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js'
import { changeTheme, manualElement, messageElement, scrollToBottom } from "./stuff.js";

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
let room = "chat1";

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
  if(text.length > 256) return alert("message too long (must be < 256 characters)");

  if(text.startsWith("/room")) {
    const arg = text.split(" ")[1];
    if(!arg) {
      alert("select a room to switch to");
      return;
    }
    if(arg.length>64) return alert("room name too long");
    room = arg;
    document.getElementById("messagebox").placeholder = `message '${arg}'`;
    receiveChat();
    return;
  }

  const message = {
    content: text,
    author: {
      name: displayName,
      id: user.uid
    },
  }
  //messageElement(message
  writeMessage(message);
}

async function writeMessage(message) {
  const doc = await addDoc(collection(db, "chats", room, "messages"), {
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
  const q = query(collection(db, "chats", room, "messages"), orderBy("created_at", "desc"), limit(32));
  let firstTime = true;

  snapshotListener = onSnapshot(q, async(snapshot) => {
    if(firstTime) {
      document.querySelector(".chatbox").innerHTML = "";
      messageElement({
        content: `room has been changed to ${room}`,
        author: {
          name: "???",
          id:"67!!!!",
        }
      })
      const messages = snapshot.docs.map(m => m.data()).reverse();
      messages.forEach(message => {
        messageElement(message);
      })
      scrollToBottom(true);
      firstTime = false;
      return;
    }
    snapshot.docChanges().forEach(change => {
      if(change.type == "added") {
        const message = change.doc.data();
        // if(message.author.id == user.uid) return;
        messageElement(message);
        scrollToBottom();
      }
    });
  })
}

receiveChat();

document.querySelector("#logout").addEventListener("click", async function() {
  signOut(auth).then(() => {
    window.location.reload();
  }).catch((err) => {
    alert(err); //hope nobody ever gets this error
  }) 
});

const themeButtons = document.querySelectorAll(".themeswitcher");
themeButtons.forEach(button => { 
  console.log(button);
  button.addEventListener("click", function(element) {
    let color = button.id; //red, blue, green, random??
    console.log("button");
    changeTheme(color);
  })
});


manualElement("/room <name>", "changes the active chat room");
  document.querySelector("#manualtoggle").addEventListener("click", function() {
  const manual = document.querySelector(".manual");
  if(manual.classList.contains("invis")) {
    manual.classList.remove("invis");
  } else {
    manual.classList.add("invis");
  }
});