
(function() {
    "use strict";

    const el = document.querySelector(".typed-text");
    if (!el) return;

   

    const phrases = [
        "Happy Hearts.",
        "Healthy Paws.",
        "Forever Love.",
        "Warm Homes."
    ];

    const TYPE_SPEED = 90;
    const DELETE_SPEED = 45; 
    const HOLD_TIME = 1500; 
    const GAP_TIME = 400; 

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        el.textContent = phrases[0];
        return;
    }

    function tick() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);

            if (charIndex === current.length) {
                deleting = true;
                setTimeout(tick, HOLD_TIME);
                return;
            }
            setTimeout(tick, TYPE_SPEED);
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);

            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(tick, GAP_TIME);
                return;
            }
            setTimeout(tick, DELETE_SPEED);
        }
    }


    el.textContent = "";
    setTimeout(tick, 600);
})();