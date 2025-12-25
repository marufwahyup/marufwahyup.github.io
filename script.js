const toggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Scroll animation
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll(".fade-in").forEach(section => {
    observer.observe(section);
});

// Animate floating buttons on page load
window.addEventListener("load", () => {
    const floating = document.querySelector(".floating-social");
    if (floating) {
        floating.style.opacity = "1";
        floating.style.transform = "translateY(0)";
    }
});

// =====================
// Advanced Lightbox Gallery
// =====================
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxCaption = document.querySelector(".lightbox-caption");
const closeBtn = document.querySelector(".lightbox-close");
const nextBtn = document.querySelector(".lightbox-nav.next");
const prevBtn = document.querySelector(".lightbox-nav.prev");

let currentIndex = 0;
let slideshowInterval = null;

const images = Array.from(galleryItems).map(img => ({
    src: img.src,
    caption: img.dataset.caption || "",
    focusX: img.dataset.focusX,
    focusY: img.dataset.focusY
}));

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        currentIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.classList.add("active", "loading");
    showImage();
    startSlideshow();
}

// Show image with loader
function showImage() {
    lightbox.classList.add("loading");
    const img = new Image();

    img.onload = () => {
        // Set image source
        lightboxImg.src = img.src;

        // ✅ SET FOCUS POINT (THIS IS THE PART YOU ASKED ABOUT)
        lightboxImg.style.setProperty(
            "--focus-x",
            images[currentIndex].focusX || "50%"
        );
        lightboxImg.style.setProperty(
            "--focus-y",
            images[currentIndex].focusY || "50%"
        );

        // Set caption
        lightboxCaption.textContent = images[currentIndex].caption;

        lightbox.classList.remove("loading");
    };

    img.src = images[currentIndex].src;
}


// Navigation
nextBtn.addEventListener("click", () => {
    nextImage();
    stopSlideshow();
});

prevBtn.addEventListener("click", () => {
    prevImage();
    stopSlideshow();
});

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
}

// Close
closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

function closeLightbox() {
    lightbox.classList.remove("active");
    stopSlideshow();
}

// =====================
// Auto-Play Slideshow
// =====================
function startSlideshow() {
    stopSlideshow();
    slideshowInterval = setInterval(() => {
        nextImage();
    }, 4000); // 4 seconds per image
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// =====================
// Keyboard Controls
// =====================
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    switch (e.key) {
        case "ArrowRight":
            nextImage();
            stopSlideshow();
            break;

        case "ArrowLeft":
            prevImage();
            stopSlideshow();
            break;

        case "Escape":
            closeLightbox();
            break;
    }
});

// =====================
// Touch Swipe Support (Mobile)
// =====================
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // minimum px distance for swipe

lightbox.addEventListener("touchstart", (e) => {
    if (!lightbox.classList.contains("active")) return;
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
    if (!lightbox.classList.contains("active")) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) < swipeThreshold) return;

    if (diff < 0) {
        // Swipe left → next
        nextImage();
        stopSlideshow();
    } else {
        // Swipe right → previous
        prevImage();
        stopSlideshow();
    }
}

// Disable image dragging globally
document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});


lightboxCaption.textContent = images[currentIndex].caption;

// =====================
// Focus-Point Cropping
// =====================
document.querySelectorAll("img[data-focus-x]").forEach(img => {
    img.style.setProperty("--focus-x", img.dataset.focusX);
    img.style.setProperty("--focus-y", img.dataset.focusY);
});


