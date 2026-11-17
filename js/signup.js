function toggleSignupPassword() {
    const password = document.getElementById("signupPassword");
    const icon = document.querySelector(".password-toggle i");
    if (password.type === "password") {
        password.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const selectedRole = localStorage.getItem("fureverSelectedRole");
  if (!selectedRole) {
    window.location.replace("index.html");
    return;
}

    const roleNames = { owner: "Pet Owner", vet: "Veterinarian", shelter: "Animal Shelter" };
    const roleBadge = document.getElementById("selectedRole");
    if (roleBadge) roleBadge.textContent = roleNames[selectedRole] || selectedRole;

    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;

    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }
        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        if (!terms) {
            alert("Please accept the Terms & Conditions.");
            return;
        }

        const user = { firstName, lastName, email, phone, password, role: selectedRole };
        localStorage.setItem("furEverUser", JSON.stringify(user));
        localStorage.removeItem("fureverLoggedIn");
        alert(`Welcome to FurEver Care, ${firstName}! Your account has been created.`);
        window.location.href = "login.html";
    });
});
