import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


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

const db = getFirestore(app);


let currentUser = null;

let operators = [];

let editingId = null;


/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    currentUser = user;

    const emailElement =
        document.getElementById("adminEmail");

    if (emailElement) {
        emailElement.textContent =
            user.email;
    }

    await loadOperators();

});


/* =========================
   ELEMENTS
========================= */

const modal =
    document.getElementById("operatorModal");

const openFormBtn =
    document.getElementById("openFormBtn");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const operatorForm =
    document.getElementById("operatorForm");

const tableBody =
    document.getElementById("operatorTableBody");

const searchInput =
    document.getElementById("searchInput");

const shiftFilter =
    document.getElementById("shiftFilter");

const statusFilter =
    document.getElementById("statusFilter");

const operatorCount =
    document.getElementById("operatorCount");

const modalTitle =
    document.getElementById("modalTitle");


/* =========================
   OPEN MODAL
========================= */

openFormBtn.addEventListener("click", () => {

    editingId = null;

    modalTitle.textContent =
        "Add Operator";

    operatorForm.reset();

    document.getElementById("operatorStatus").value =
        "active";

    modal.classList.add("show");

});


/* =========================
   CLOSE MODAL
========================= */

function closeOperatorModal() {

    modal.classList.remove("show");

    operatorForm.reset();

    editingId = null;

}


closeModal.addEventListener(
    "click",
    closeOperatorModal
);

cancelBtn.addEventListener(
    "click",
    closeOperatorModal
);


/* =========================
   SAVE OPERATOR
========================= */

operatorForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (!currentUser) {
            return;
        }


        const name =
            document
                .getElementById("operatorName")
                .value
                .trim();

        const phone =
            document
                .getElementById("operatorPhone")
                .value
                .trim();

        const booth =
            document
                .getElementById("operatorBooth")
                .value
                .trim();

        const shift =
            document
                .getElementById("operatorShift")
                .value;

        const dutyStart =
            document
                .getElementById("dutyStart")
                .value;

        const dutyEnd =
            document
                .getElementById("dutyEnd")
                .value;

        const status =
            document
                .getElementById("operatorStatus")
                .value;


        const operatorData = {

            name: name,

            phone: phone,

            booth: booth,

            shift: shift,

            dutyStart: dutyStart,

            dutyEnd: dutyEnd,

            status: status,

            createdBy:
                currentUser.uid,

            adminEmail:
                currentUser.email,

            updatedAt:
                serverTimestamp()

        };


        try {

            const saveButton =
                operatorForm.querySelector(
                    ".save-btn"
                );

            saveButton.disabled = true;

            saveButton.textContent =
                "Saving...";


            if (editingId) {

                const operatorRef =
                    doc(
                        db,
                        "operators",
                        editingId
                    );

                await updateDoc(
                    operatorRef,
                    operatorData
                );

            } else {

                operatorData.createdAt =
                    serverTimestamp();

                await addDoc(
                    collection(
                        db,
                        "operators"
                    ),
                    operatorData
                );

            }


            closeOperatorModal();

            await loadOperators();


        } catch (error) {

            console.error(error);

            alert(
                "Could not save operator.\n\n" +
                error.message
            );

        } finally {

            const saveButton =
                operatorForm.querySelector(
                    ".save-btn"
                );

            saveButton.disabled = false;

            saveButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Save Operator';

        }

    }
);


/* =========================
   LOAD OPERATORS
========================= */

async function loadOperators() {

    if (!currentUser) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "operators"
                )
            );


        operators = [];


        snapshot.forEach((item) => {

            const data =
                item.data();


            /*
              Only show operators
              created by this admin.
            */

            if (
                data.createdBy ===
                currentUser.uid
            ) {

                operators.push({

                    id: item.id,

                    ...data

                });

            }

        });


        renderOperators();


    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <h3>
                            Unable to load operators
                        </h3>

                        <p>
                            ${error.message}
                        </p>

                    </div>

                </td>

            </tr>

        `;

    }

}


/* =========================
   RENDER
========================= */

function renderOperators() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const shift =
        shiftFilter.value;

    const status =
        statusFilter.value;


    const filtered =
        operators.filter((operator) => {

            const matchesSearch =

                operator.name
                    ?.toLowerCase()
                    .includes(search)

                ||

                operator.phone
                    ?.toLowerCase()
                    .includes(search)

                ||

                operator.booth
                    ?.toLowerCase()
                    .includes(search);


            const matchesShift =

                shift === "all" ||
                operator.shift === shift;


            const matchesStatus =

                status === "all" ||
                operator.status === status;


            return (
                matchesSearch &&
                matchesShift &&
                matchesStatus
            );

        });


    operatorCount.textContent =
        `${filtered.length} Operators`;


    if (filtered.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty">

                        <i class="fa-solid fa-users"></i>

                        <h3>
                            No operators found
                        </h3>

                        <p>
                            Add an operator or change your filters.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    tableBody.innerHTML =
        filtered
            .map(operatorRow)
            .join("");


    attachActionEvents();

}


/* =========================
   OPERATOR ROW
========================= */

function operatorRow(operator) {

    const initials =
        operator.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();


    return `

        <tr>

            <td>

                <div class="operator-name">

                    <div class="operator-avatar">
                        ${initials}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(operator.name)}
                        </strong>

                        <small>
                            Operator
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(operator.phone)}
            </td>


            <td>
                ${escapeHTML(operator.booth)}
            </td>


            <td>

                <span class="shift-badge ${
                    operator.shift === "A"
                        ? "shift-a"
                        : "shift-b"
                }">

                    ${operator.shift} Shift

                </span>

            </td>


            <td>

                ${operator.dutyStart}
                -
                ${operator.dutyEnd}

            </td>


            <td>

                <span class="status ${
                    operator.status
                }">

                    ${
                        operator.status ===
                        "active"
                            ? "Active"
                            : "Inactive"
                    }

                </span>

            </td>


            <td>

                <div class="actions">

                    <button
                        class="action-btn edit"
                        data-id="${operator.id}">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="action-btn delete"
                        data-id="${operator.id}">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =========================
   EDIT / DELETE
========================= */

function attachActionEvents() {

    document
        .querySelectorAll(".action-btn.edit")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editOperator(
                        button.dataset.id
                    );

                }
            );

        });


    document
        .querySelectorAll(".action-btn.delete")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteOperator(
                        button.dataset.id
                    );

                }
            );

        });

}


/* =========================
   EDIT
========================= */

function editOperator(id) {

    const operator =
        operators.find(
            item => item.id === id
        );


    if (!operator) {
        return;
    }


    editingId = id;

    modalTitle.textContent =
        "Edit Operator";


    document.getElementById(
        "operatorName"
    ).value =
        operator.name || "";


    document.getElementById(
        "operatorPhone"
    ).value =
        operator.phone || "";


    document.getElementById(
        "operatorBooth"
    ).value =
        operator.booth || "";


    document.getElementById(
        "operatorShift"
    ).value =
        operator.shift || "";


    document.getElementById(
        "dutyStart"
    ).value =
        operator.dutyStart || "";


    document.getElementById(
        "dutyEnd"
    ).value =
        operator.dutyEnd || "";


    document.getElementById(
        "operatorStatus"
    ).value =
        operator.status || "active";


    modal.classList.add("show");

}


/* =========================
   DELETE
========================= */

async function deleteOperator(id) {

    const operator =
        operators.find(
            item => item.id === id
        );


    if (!operator) {
        return;
    }


    const confirmed =
        confirm(
            `Delete ${operator.name}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "operators",
                id
            )
        );


        await loadOperators();


    } catch (error) {

        console.error(error);

        alert(
            "Delete failed.\n\n" +
            error.message
        );

    }

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    renderOperators
);

shiftFilter.addEventListener(
    "change",
    renderOperators
);

statusFilter.addEventListener(
    "change",
    renderOperators
);


/* =========================
   LOGOUT
========================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        async () => {

            await signOut(auth);

            window.location.href =
                "index.html";

        }
    );


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
