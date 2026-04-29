import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { updateProfile, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, setDoc, onSnapshot, serverTimestamp, doc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js'
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

manualElement("/room <name>", "changes the active chat room");
manualElement("/message-spacing <# of pixels, default=12>", "increases the margin above and below messages");
manualElement("/icon-width <# of pixels, default=22>", "sets the width (and height) of user avatars");

changeTheme("brown"); // i like this one :)

sendMessage(`/message-spacing ${localStorage.getItem("--message-spacing") != null ? localStorage.getItem("--message-spacing") : 12 }`);
sendMessage(`/icon-width ${localStorage.getItem("--icon-size") != null ? localStorage.getItem("--icon-size") : 22 }`);

const bio = document.getElementById("bio");
const av = document.getElementById("avatar");

auth.onAuthStateChanged(async function(u) {
  if(u) {
    user = u;
    console.log(user);
    document.querySelector(".signinstuff").classList.add("invis");
    document.getElementById("main").classList.remove("invis");
    displayName = user.displayName;
    document.getElementById("username").value = displayName;

    receiveChat();

    const userDoc = await getUserDoc(user.uid);
    if(userDoc == "nonexistent") {
      await updateUserProfile();
    } else if(userDoc.bio)   {
      bio.value = userDoc.bio;
    }

  } else {
    console.log("not logged in");
  }
}) // yesterday i was going to spend more time on this project but i walked into a small cactus i kid you not

let customAvatarURL;

if(localStorage.getItem('customavatar')) {
  customAvatarURL = localStorage.getItem('customavatar');
}

async function updateUserProfile() {
  const newUser = await setDoc(doc(db, "users", user.uid), {
    joined_At: serverTimestamp(),
    displayName: user.displayName,
    avatar: !customAvatarURL ? user.photoURL : customAvatarURL,
    bio: bio.value,
  });
  return newUser;
}

async function getUserDoc(id) {
  const docRef = doc(db, "users", id);
  const userDoc = await getDoc(docRef);

  if(userDoc.exists()) {
    return userDoc.data();
  } else {
    return "nonexistent";
  }
}

document.getElementById("username").addEventListener("change", async function(event) {
  if(!event.target.value) {
    event.target.value = displayName;
  }
  displayName = event.target.value;
  updateProfile(auth.currentUser, {
    displayName: displayName,
  }).then(() => {
    updateUserProfile();
  }).catch((err) => {
    alert('your username failed to update ' + err); //hope noone ever gets this error
  })
});

bio.addEventListener("change", async function(event) {
  updateUserProfile();
});

function getAvatarBase64() {
  const avatarFile = av['files'][0];
  const reader = new FileReader();
  let base64String;
  let imageBase64Stringsep;
  let output;
  reader.onload = function() {
    console.log(reader.result);
    customAvatarURL = reader.result;
    console.log(customAvatarURL);
  }
  return reader.readAsDataURL(avatarFile);
}

av.addEventListener('change', async function(event) {
  const confirmImage = document.querySelector("#confirmImage");
  confirmImage.src="";
  getAvatarBase64();
  setTimeout(function() {
    confirmImage.src=customAvatarURL;
    document.querySelector(".confirmAvatar").classList.remove("invis");
  }, 250);
})

document.getElementById("okay").addEventListener("click", async function() {
  updateUserProfile();
  localStorage.setItem("customavatar", customAvatarURL);
  document.querySelector(".confirmAvatar").classList.add("invis");
})

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
  if(text.length > 1024) return alert("message too long (must be < 1025 characters)");

  if(checkCommands(text) == true) return;

  const message = {
    content: text,
    author: {
      name: displayName,
      id: user.uid,
      avatar: customAvatarURL ? customAvatarURL : user.photoURL
    },
  }
  //messageElement(message)
  writeMessage(message);
}

async function writeMessage(message) {
  const doc = await addDoc(collection(db, "chats", room, "messages"), {
    content: message.content,
    author: {
      name: message.author.name,
      id: message.author.id,
      avatar: message.author.avatar,
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
          name: "PoutineBot",
          id:"69420",
          avatar: "/poutine.jpg"
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


document.querySelector("#manualtoggle").addEventListener("click", function() {
  const manual = document.querySelector(".manual");
  if(manual.classList.contains("invis")) {
    manual.classList.remove("invis");
  } else {
    manual.classList.add("invis");
  }
});

function checkCommands(text) {
  if(text.startsWith("/room")) {
    const arg = text.split(" ")[1];
    if(!arg) {
      alert("select a room to switch to");
      return;
    }
    if(arg.length>64) return alert("room name too long"); // ok im not gonna enforce this in firebase rules ill just hope you guys dont blow it up
    room = arg;
    document.getElementById("messagebox").placeholder = `message '${arg}'`;
    document.getElementById("chatname").textContent = `#${arg}`;
    receiveChat();
    return true;
  }

  if(text.startsWith("/message-spacing")) {
    const arg = text.split(" ")[1];
    if(!Number(arg)) {
      alert("invalid input");
      return;
    }
    localStorage.setItem("--message-spacing", arg);
    document.documentElement.style.setProperty("--y-padding", arg+"px");
    scrollToBottom(true);
    return true;
  }

//   if(text.startsWith("/change-font")) {
//     const link = text.split(" ")[1];
//     if(!link) {
//       alert("invalid input");
//       return true;
//     }
//     const fontName = text.split(" ")[1];
//     if(!fontName) {
//       alert("invalid input");
//       return true;
//     }
// //    localStorage.setItem("--font", arg);
//     document.querySelector("head").innerHTML += `<link href="${link}" rel="stylesheet">`;
//     document.documentElement.style.setProperty("--font", fontName);
//     return true;
//   }
  
  if(text.startsWith("/icon-width")) {
    const arg = text.split(" ")[1];
    if(!Number(arg)) {
      alert("invalid input");
      return true;
    }
    localStorage.setItem("--icon-size", arg);
    document.documentElement.style.setProperty("--icon-size", arg+"px");
    scrollToBottom(true);
    return true;
  }
}

const profileDiv = document.querySelector(".profile");

document.addEventListener("click", async function(event) {
  const element = event.target;
  if(element.classList.contains("author") || element.classList.contains("avatar")) {
    const user = await getUserDoc(element.id);
    if(user == "nonexistent") {
      return alert("this user doesn't have a profile, maybe their account was created before the update :((");
    }
    let date = user.joined_At.toDate()
    let timeInfo = `${date.toLocaleDateString("en-US", {dateStyle: "short"})}`;
    // timeInfo = timeInfo.replace(`${new Date().toLocaleDateString("en-US", {dateStyle: "short"})} `, "")
    console.log(date)
    document.getElementById("profileAvatar").src=user.avatar;
    document.getElementById("profileUsername").textContent="@"  +user.displayName;
    document.getElementById("profileBio").textContent=user.bio;
    document.getElementById("joinedAt").textContent="Joined at "+timeInfo;
    profileDiv.classList.remove("invis");
  }
  if(element.classList.contains("close")) {
    profileDiv.classList.add("invis");
  }
})

