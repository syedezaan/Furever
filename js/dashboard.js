const FC_AUTH_KEY = 'fc_username';
const FC_JUST_LOGGED_IN_KEY = 'fc_just_logged_in';

function fcInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return '🐾';

    const first = parts[0][0] || '';
    const second = parts.length > 1 ? parts[1][0] : '';

    return (first + second).toUpperCase();
}

function fcGreetingWord() {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';

    return 'Good evening';
}

function fcInitLoginPage() {

    const form = document.getElementById('loginForm');

    if (!form) return;

    form.addEventListener('submit', function (e) {

        e.preventDefault();

        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        const email = emailInput.value.trim();
        const password = passwordInput.value;
cal
      
        const savedUser = localStorage.getItem('furEverUser');

        if (!savedUser) {
            alert('No account found. Please create an account first.');
            return;
        }

        const user = JSON.parse(savedUser);

    
        if (email.toLowerCase() !== user.email.toLowerCase()) {
            alert('Invalid email or password.');
            return;
        }

        
        if (password !== user.password) {
            alert('Invalid email or password.');
            return;
        }

        
        const fullName =
            `${user.firstName} ${user.lastName}`.trim();

        localStorage.setItem('fc_username', fullName);

        sessionStorage.setItem(
            'fc_just_logged_in',
            '1'
        );

        const btn = form.querySelector(
            'button[type="submit"]'
        );

        if (btn) {
            btn.disabled = true;
            btn.innerHTML =
                '<i class="bi bi-hourglass-split me-1"></i> Signing you in...';
        }

        setTimeout(function () {
            window.location.href = 'dashboard.html';
        }, 500);
    });
}

function fcInitDashboardPage() {

    const greetName =
        document.getElementById('dashUserName');

    if (!greetName) return;

    const name =
        localStorage.getItem(FC_AUTH_KEY);

    if (!name) {

        window.location.href = 'login.html';

        return;
    }

    const initials = fcInitials(name);

    greetName.textContent =
        name.split(' ')[0];

    const greetWordEl =
        document.getElementById('dashGreetWord');

    if (greetWordEl) {
        greetWordEl.textContent =
            fcGreetingWord();
    }

    const dateEl =
        document.getElementById('dashToday');

    if (dateEl) {

        dateEl.textContent =
            new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
    }

    document
        .querySelectorAll('.js-user-initials')
        .forEach(el => {
            el.textContent = initials;
        });

    document
        .querySelectorAll('.js-user-name')
        .forEach(el => {
            el.textContent = name;
        });

    document
        .querySelectorAll('.js-logout')
        .forEach(el => {

            el.addEventListener('click', () => {

                localStorage.removeItem(FC_AUTH_KEY);
                sessionStorage.removeItem(
                    FC_JUST_LOGGED_IN_KEY
                );

                window.location.href = 'login.html';
            });
        });

    const justLoggedIn =
        sessionStorage.getItem(
            FC_JUST_LOGGED_IN_KEY
        );

    if (justLoggedIn) {

        sessionStorage.removeItem(
            FC_JUST_LOGGED_IN_KEY
        );

        fcShowWelcomePopup(name);
    }
}

function fcShowWelcomePopup(name) {

    const overlay =
        document.getElementById('welcomePopup');

    if (!overlay) return;

    const nameEl =
        document.getElementById('welcomePopupName');

    if (nameEl) {
        nameEl.textContent =
            name.split(' ')[0];
    }

    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    if (window.confetti) {

        setTimeout(() => {

            window.confetti({
                particleCount: 90,
                spread: 75,
                startVelocity: 32,
                origin: {
                    y: 0.35
                },
                colors: [
                    '#FF9F7A',
                    '#F47F5A',
                    '#FFD700',
                    '#5B3A29',
                    '#FFE4D6'
                ]
            });

        }, 200);
    }

    const close = () => {
        overlay.classList.remove('active');
    };

    document
        .getElementById('btnCloseWelcomePopup')
        ?.addEventListener(
            'click',
            close,
            { once: true }
        );

    document
        .getElementById('btnWelcomePopupGo')
        ?.addEventListener(
            'click',
            close,
            { once: true }
        );

    overlay.addEventListener(
        'click',
        (e) => {

            if (e.target === overlay) {
                close();
            }

        },
        { once: true }
    );
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        fcInitLoginPage();
        fcInitDashboardPage();

    }
);