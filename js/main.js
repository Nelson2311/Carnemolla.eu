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

// Cookie consent banner
(function () {
  const CONSENT_KEY = "cc_consent";
  const CONSENT_DURATION_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mesi

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > CONSENT_DURATION_MS) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(choice) {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ choice, timestamp: Date.now(), policyVersion: "1.0" })
    );
  }

  function applyConsent(choice) {
    document.dispatchEvent(new CustomEvent("cc_consent_change", { detail: choice }));
  }

  function buildBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Informativa cookie");
    banner.innerHTML = `
      <p>Utilizziamo cookie tecnici necessari al funzionamento del sito. Previo tuo consenso, potremmo utilizzare cookie analitici o di terze parti, secondo quanto descritto nella <a href="cookie-policy.html">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button type="button" data-action="reject">Rifiuta tutti</button>
        <button type="button" data-action="accept" class="btn-accept">Accetta tutti</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('[data-action="accept"]').addEventListener("click", () => {
      writeConsent("accepted");
      applyConsent("accepted");
      banner.setAttribute("hidden", "");
    });
    banner.querySelector('[data-action="reject"]').addEventListener("click", () => {
      writeConsent("rejected");
      applyConsent("rejected");
      banner.setAttribute("hidden", "");
    });
    return banner;
  }

  const existingConsent = readConsent();
  const banner = buildBanner();
  if (existingConsent) {
    banner.setAttribute("hidden", "");
  }

  const manageBtn = document.querySelector("#manage-cookies");
  if (manageBtn) {
    manageBtn.addEventListener("click", () => {
      banner.removeAttribute("hidden");
    });
  }
})();

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
