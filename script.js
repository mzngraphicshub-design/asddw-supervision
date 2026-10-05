import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyACqvP2NL14qJYGaX0ZPjriGiNkZ8yR6Vg",
    authDomain: "asddw-supervision.firebaseapp.com",
    projectId: "asddw-supervision",
    storageBucket: "asddw-supervision.firebasestorage.app",
    messagingSenderId: "440592118508",
    appId: "1:440592118508:web:6d369f18c2ad6886c2abc9",
    measurementId: "G-6TEB99B7WG"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


const loginForm = document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const biometricBtn =
    document.getElementById("biometricBtn");

const loginMessage =
    document.getElementById("loginMessage");


/* PASSWORD SHOW / HIDE */

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


/* LOGIN */

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showMessage(
            "Email and password are required."
        );

        return;
    }


    try {

        showMessage(
            "Signing in...",
            "loading"
        );


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        /* LOGIN SUCCESS */

        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);

        showMessage(
            "Incorrect email or password."
        );

    }

});


/* FINGERPRINT */

biometricBtn.addEventListener(
    "click",
    function () {

        showMessage(
            "Fingerprint / Passkey will be added after login is working."
        );

    }
);


/* FORGOT PASSWORD */

document
    .getElementById("forgotPassword")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showMessage(
                "Password recovery will be added soon."
            );

        }
    );


/* MESSAGE */

function showMessage(message, type = "error") {

    loginMessage.textContent = message;

    loginMessage.style.display = "block";


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
