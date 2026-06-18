// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle) {
  toggle.addEventListener("click", () => {
    links.classList.toggle("nav-links--open");
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Header background on scroll
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.style.background = "rgba(11, 12, 14, 0.92)";
  } else {
    header.style.background = "rgba(11, 12, 14, 0.7)";
  }
});

// Contact form (placeholder submit handler)
const form = document.querySelector("#contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.textContent = "Messaggio inviato";
    form.reset();
    setTimeout(() => (button.textContent = "Invia messaggio"), 3000);
  });
}
