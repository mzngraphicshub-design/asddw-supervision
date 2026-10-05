const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const biometricBtn = document.getElementById("biometricBtn");
const loginMessage = document.getElementById("loginMessage");


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


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value.trim();

    if (!email || !password) {

        showMessage(
            "Please enter your username and password."
        );

        return;
    }

    showMessage(
        "Authentication system will be connected in the next step."
    );

});


biometricBtn.addEventListener("click", async function () {

    showMessage(
        "Fingerprint / Passkey will be activated after secure authentication setup."
    );

});


document
    .getElementById("forgotPassword")
    .addEventListener("click", function (event) {

        event.preventDefault();

        showMessage(
            "Password recovery will be connected with Firebase."
        );

    });


function showMessage(message) {

    loginMessage.textContent = message;

    loginMessage.style.display = "block";

}
