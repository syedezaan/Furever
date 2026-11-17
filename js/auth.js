document.addEventListener("DOMContentLoaded", function () {

    const authArea = document.getElementById("userAuthArea");

    if (!authArea) {
        console.log("userAuthArea NOT FOUND");
        return;
    }

    const username = localStorage.getItem("fc_username");

    console.log("Username:", username);

    if (username && username.trim() !== "") {

        const firstName = username.trim().split(/\s+/)[0];

        authArea.innerHTML = `
            <div class="furever-user-menu">

                <div class="furever-welcome">
                    <i class="bi bi-person-heart"></i>

                    <div>
                        <small>Welcome</small>
                        <strong>${firstName}</strong>
                    </div>
                </div>

                <button
                    type="button"
                    class="furever-logout-btn"
                    id="fureverLogoutBtn"
                    title="Logout">

                    <i class="bi bi-box-arrow-right"></i>

                </button>

            </div>
        `;

        const logoutBtn = document.getElementById("fureverLogoutBtn");

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {

                localStorage.removeItem("fc_username");
                sessionStorage.removeItem("fc_just_logged_in");

                window.location.href = "login.html";

            });
        }

    } else {

        authArea.innerHTML = `
            <div class="furever-auth-buttons">

                <a href="login.html" class="furever-login-btn">
                    <i class="bi bi-box-arrow-in-right"></i>
                    Login
                </a>

                <a href="signup.html" class="furever-signup-btn">
                    <i class="bi bi-person-plus"></i>
                    Sign Up
                </a>

            </div>
        `;
    }

});