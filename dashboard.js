import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
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


// =====================================
// CHECK LOGIN
// =====================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        // Not logged in
        window.location.href = "index.html";

        return;
    }


    // User is logged in

    console.log(
        "Logged in:",
        user.email
    );


    // Show email

    const adminName =
        document.getElementById("adminName");

    if (adminName) {

        adminName.textContent =
            user.email;
    }

});


// =====================================
// LOGOUT
// =====================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


// =====================================
// MOBILE SIDEBAR
// =====================================

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.querySelector(".sidebar");


if (mobileMenu && sidebar) {

    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "show"
            );

        }
    );

}


// =====================================
// CLOSE SIDEBAR
// =====================================

document.addEventListener(
    "click",
    (event) => {

        if (
            window.innerWidth <= 900 &&
            sidebar &&
            !sidebar.contains(event.target) &&
            !mobileMenu.contains(event.target)
        ) {

            sidebar.classList.remove(
                "show"
            );

        }

    }
);


// =====================================
// QUICK ACTION DEMO
// =====================================

const actionCards =
    document.querySelectorAll(".action-card");


actionCards.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            alert(
                "This feature will be connected in the next step."
            );

        }
    );

});
