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
