import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// ======================================
// ASDDW SUPERVISION
// FIREBASE CONFIGURATION
// ======================================

const firebaseConfig = {

    apiKey: "AIzaSyACqvP2NL14qJYGaX0ZPjriGiNkZ8yR6Vg",

    authDomain: "asddw-supervision.firebaseapp.com",

    projectId: "asddw-supervision",

    storageBucket: "asddw-supervision.firebasestorage.app",

    messagingSenderId: "440592118508",

    appId: "1:440592118508:web:6d369f18c2ad6886c2abc9",

    measurementId: "G-6TEB99B7WG"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ======================================
// ELEMENTS
// ======================================

const loginForm =
    document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const biometricBtn =
    document.getElementById("biometricBtn");

const loginMessage =
    document.getElementById("loginMessage");


// ======================================
// PASSWORD SHOW / HIDE
// ======================================

passwordToggle.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        this.innerHTML =
            '<i class="fa-regular fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        this.innerHTML =
            '<i class="fa-regular fa-eye"></i>';
    }

});


// ======================================
// LOGIN
// ======================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value.trim();


    if (!email || !password) {

        showMessage(
            "Please enter your email and password."
        );

        return;
    }


    try {

        showMessage("Signing in...", "loading");


        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        console.log(
            "Firebase User:",
            user.uid
        );


        // Get user profile from Firestore

        const userRef =
            doc(db, "users", user.uid);

        const userSnap =
            await getDoc(userRef);


        if (!userSnap.exists()) {

            showMessage(
                "User profile not found. Please contact your administrator."
            );

            await auth.signOut();

            return;
        }


        const userData =
            userSnap.data();


        // Organization ID

        const organizationId =
            userData.organizationId;


        // User Role

        const role =
            userData.role;


        console.log(
            "Organization:",
            organizationId
        );

        console.log(
            "Role:",
            role
        );


        // Save login information locally

        sessionStorage.setItem(
            "userId",
            user.uid
        );

        sessionStorage.setItem(
            "organizationId",
            organizationId
        );

        sessionStorage.setItem(
            "role",
            role
        );


        // Temporary dashboard redirect

        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);


        let message =
            "Login failed. Please try again.";


        if (error.code === "auth/invalid-credential") {

            message =
                "Incorrect email or password.";

        }

        else if (error.code === "auth/user-not-found") {

            message =
                "No account found with this email.";

        }

        else if (error.code === "auth/wrong-password") {

            message =
                "Incorrect password.";

        }

        else if (error.code === "auth/too-many-requests") {

            message =
                "Too many attempts. Please try again later.";

        }


        showMessage(message);

    }

});


// ======================================
// BIOMETRIC / PASSKEY
// ======================================

biometricBtn.addEventListener(
    "click",
    async function () {

        showMessage(
            "Fingerprint / Passkey will be connected after the main login system is working."
        );

    }
);


// ======================================
// FORGOT PASSWORD
// ======================================

document
    .getElementById("forgotPassword")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showMessage(
                "Password recovery will be connected next."
            );

        }
    );


// ======================================
// MESSAGE
// ======================================

function showMessage(message, type = "error") {

    loginMessage.textContent =
        message;

    loginMessage.style.display =
        "block";


    if (type === "loading") {

        loginMessage.style.background =
            "#f3f4ff";

        loginMessage.style.color =
            "#625df5";

    } else {

        loginMessage.style.background =
            "#fef2f2";

        loginMessage.style.color =
            "#dc2626";
    }

}


// ======================================
// AUTH STATE
// ======================================

onAuthStateChanged(auth, function (user) {

    if (user) {

        console.log(
            "User already logged in:",
            user.email
        );

    }

});
