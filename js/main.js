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

// Google Analytics, caricato solo previo consenso (cookie analitici, vedi Cookie Policy)
const GA_MEASUREMENT_ID = "G-P4VKHGDKT5";
function loadAnalytics() {
  if (window.gtagLoaded) return;
  window.gtagLoaded = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

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
    if (existingConsent.choice === "accepted") loadAnalytics();
  }

  document.addEventListener("cc_consent_change", (e) => {
    if (e.detail === "accepted") loadAnalytics();
  });

  const manageBtn = document.querySelector("#manage-cookies");
  if (manageBtn) {
    manageBtn.addEventListener("click", () => {
      banner.removeAttribute("hidden");
    });
  }
})();

// Contact form submission via FormSubmit
const form = document.querySelector("#contact-form");
if (form) {
  const status = form.querySelector("#form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Invio in corso...";
    if (status) status.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Invio non riuscito");
      button.textContent = "Messaggio inviato";
      if (status) status.textContent = "Grazie, il messaggio è stato inviato. Vi risponderemo al più presto.";
      form.reset();
    } catch (err) {
      button.textContent = originalText;
      if (status) status.textContent = "Si è verificato un errore nell'invio. Riprova oppure scrivici direttamente via email.";
    } finally {
      button.disabled = false;
      setTimeout(() => (button.textContent = originalText), 3000);
    }
  });
}
