import { getApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { updateProfile, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const app = getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let user;

document.querySelector("#signin").addEventListener("click", async function() {
  alert("d");
});

//how the heck do i setup firebase bruh