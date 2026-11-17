const petSlides = [
    "images/slide1.jfif",
    "images/slide2.jfif",
    "images/slide3.jfif",
    "images/slide4.jfif",
    "images/slide5.jfif",
    "images/slide6.jfif",
    "images/slide7.jfif"
];

(function initPetSlider() {

    const track = document.getElementById("petSliderTrack");
    const prevBtn = document.getElementById("petPrevBtn");
    const nextBtn = document.getElementById("petNextBtn");
    const dotsWrap = document.getElementById("petSliderDots");

    if (!track) return;

    let current = 0;
    let autoplayTimer;

    petSlides.forEach((src, index) => {

        const slide = document.createElement("div");

        slide.className = "pet-slide";
        slide.dataset.index = index;

        const img = document.createElement("img");

        img.src = src;
        img.alt = "Happy Pet " + (index + 1);
        img.draggable = false;

        slide.appendChild(img);
        track.appendChild(slide);
    });

    const slides = [...track.querySelectorAll(".pet-slide")];

    if (dotsWrap) {

        dotsWrap.innerHTML = "";

        slides.forEach((_, index) => {

            const dot = document.createElement("span");

            dot.addEventListener("click", () => {
                current = index;
                render();
                restartAutoplay();
            });

            dotsWrap.appendChild(dot);
        });
    }

    const dots = dotsWrap ? [...dotsWrap.children] : [];

    function render() {

        slides.forEach((slide, index) => {

            let distance = index - current;

            if (distance > slides.length / 2) {
                distance -= slides.length;
            }

            if (distance < -slides.length / 2) {
                distance += slides.length;
            }

            const abs = Math.abs(distance);

            if (distance === 0) {

                slide.style.transform =
                    "translate3d(0, 0, 120px) rotateY(0deg) scale(1)";

                slide.style.opacity = "1";
                slide.style.filter = "brightness(1)";
                slide.style.zIndex = "50";

                slide.classList.add("is-active");

                return;
            }

            const x = distance * 210;
            const z = -abs * 100;
            const rotate = distance * -22;
            const y = abs * 8;

            const scale = Math.max(
                0.72,
                1 - abs * 0.10
            );

            slide.style.transform =
                `translate3d(${x}px, ${y}px, ${z}px)
                 rotateY(${rotate}deg)
                 scale(${scale})`;

            slide.style.opacity = abs > 3 ? "0" : "1";

            slide.style.filter =
                `brightness(${Math.max(
                    0.55,
                    1 - abs * 0.15
                )})`;

            slide.style.zIndex =
                String(50 - abs);

            slide.classList.remove("is-active");
        });

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === current
            );

        });
    }

    function goNext() {

        current++;

        if (current >= slides.length) {
            current = 0;
        }

        render();
    }

    function goPrev() {

        current--;

        if (current < 0) {
            current = slides.length - 1;
        }

        render();
    }

    function startAutoplay() {

        clearInterval(autoplayTimer);

        autoplayTimer = setInterval(() => {
            goNext();
        }, 1200);
    }

    function restartAutoplay() {

        clearInterval(autoplayTimer);
        startAutoplay();
    }

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            goNext();
            restartAutoplay();

        });
    }

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            goPrev();
            restartAutoplay();

        });
    }

    track.addEventListener("click", (e) => {

        const slide =
            e.target.closest(".pet-slide");

        if (!slide) return;

        const index =
            Number(slide.dataset.index);

        if (index !== current) {

            current = index;

            render();
            restartAutoplay();
        }
    });

    document.addEventListener("keydown", (e) => {

        if (e.key === "ArrowRight") {

            goNext();
            restartAutoplay();
        }

        if (e.key === "ArrowLeft") {

            goPrev();
            restartAutoplay();
        }
    });

    render();
    startAutoplay();

})();