import { getApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { updateProfile, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const app = getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let user;

auth.onAuthStateChanged(function(u) {
  if(u) {
    user = u;
    // console.log(user);
    // document.querySelector(".signinstuff").classList.add("invis");
    // document.getElementById("main").classList.remove("invis");
    // document.getElementById("username").value = user.displayName;
  } else {
    console.log("not logged in");
  }
})

document.querySelector("#signin").addEventListener("click", async function() {
  await signInWithPopup(auth, provider).then(result => {
    const cred = GoogleAuthProvider.credentialFromResult(result);
    const token = cred.accessToken;
    const a = result.user;
    console.log(result);
    console.log(token);
    console.log(a); //got so confused as to why it wasn't working but i realized I forgot to enable google as an auth method
  }).catch(err => {
    console.log(err.message);
  })
});