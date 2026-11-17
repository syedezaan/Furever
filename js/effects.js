(function() {
    "use strict";

    var preloader = document.getElementById("preloader");

    if (preloader) {
        document.body.classList.add("no-scroll");

        var dotsEl = preloader.querySelector(".dots");
        var dotFrames = [".", "..", "..."];
        var dotIndex = 0;

        var dotTimer = setInterval(function() {
            dotIndex = (dotIndex + 1) % dotFrames.length;

            if (dotsEl) {
                dotsEl.textContent = dotFrames[dotIndex];
            }
        }, 400);

        window.addEventListener("load", function() {

            setTimeout(function() {

                clearInterval(dotTimer);

                preloader.classList.add("hide");

                document.body.classList.remove("no-scroll");

            }, 700);
        });
    }

    var particleHost = document.getElementById("heroParticles");

    if (particleHost) {

        var colors = ["var(--peach)", "var(--hover)"];

        for (var i = 0; i < 22; i++) {

            var dot = document.createElement("div");

            dot.className = "hero-particle";

            var size = Math.random() * 3 + 2;

            dot.style.width = size + "px";
            dot.style.height = size + "px";
            dot.style.left = Math.random() * 100 + "%";
            dot.style.top = Math.random() * 100 + "%";
            dot.style.background = colors[i % 2];
            dot.style.animationDuration =
                (6 + Math.random() * 8) + "s";
            dot.style.animationDelay =
                (Math.random() * 6) + "s";

            particleHost.appendChild(dot);
        }
    }

    var tiltSelector =
        ".role-card, .content-card, .product-card, .vet-card, .pet-card, .story-card, .event-card";

    var tiltCards =
        document.querySelectorAll(tiltSelector);

    tiltCards.forEach(function(card) {

        card.addEventListener("mousemove", function(e) {

            var rect = card.getBoundingClientRect();

            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            card.style.setProperty("--mx", x + "px");
            card.style.setProperty("--my", y + "px");

            var midX = rect.width / 2;
            var midY = rect.height / 2;

            var rotateY =
                ((x - midX) / midX) * 5;

            var rotateX =
                ((midY - y) / midY) * 5;

            card.style.transform =
                "perspective(900px) rotateX(" +
                rotateX +
                "deg) rotateY(" +
                rotateY +
                "deg) translateY(-6px)";
        });

        card.addEventListener("mouseleave", function() {
            card.style.transform = "";
        });
    });

})();