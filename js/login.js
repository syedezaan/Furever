function toggleLoginPassword() {
    const password = document.getElementById("loginPassword");
    const icon = document.querySelector(".password-toggle i");
    if (password.type === "password") {
        password.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        password.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const savedUser = JSON.parse(localStorage.getItem("furEverUser") || "null");
    if (!savedUser) {
        localStorage.removeItem("fureverLoggedIn");
        window.location.replace("role-selection.html");
        return;
    }

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }
        const currentUser = JSON.parse(localStorage.getItem("furEverUser") || "null");
        if (!currentUser) {
            localStorage.removeItem("fureverLoggedIn");
            window.location.replace("role-selection.html");
            return;
        }
        if (email.toLowerCase() !== currentUser.email.toLowerCase()) {
            alert("Incorrect email address.");
            return;
        }
        if (password !== currentUser.password) {
            alert("Incorrect password.");
            return;
        }
        if (!currentUser.role) {
            alert("Your account has no role. Please select your role and create the account again.");
            localStorage.removeItem("furEverUser");
            localStorage.removeItem("fureverLoggedIn");
            window.location.replace("role-selection.html");
            return;
        }
        localStorage.setItem("fureverSelectedRole", currentUser.role);
        localStorage.setItem("fureverLoggedIn", "true");
        alert(`Welcome back, ${currentUser.firstName}!`);
        window.location.replace("dashboard.html");
    });
});
