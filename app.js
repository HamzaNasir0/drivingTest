// ========= CONFIG (edit these) =========
const CONFIG = {
  whatsappNumber: "+447460898989", // <-- REPLACE with your number (UK format, no +, no spaces)
  whatsappDefaultText: "Hi! I'm interested in driving lessons with British Driving School.",
  // Google:
  googlePlaceEmbedSrc: "", // <-- paste your Google "Place" embed iframe src here
  googleWriteReviewUrl: "", // <-- paste your "Write a review" link here
  // Success photos (replace with your real images)
  galleryItems: [
    { src: "images/pass1.jpg", caption: "Congratulations on passing! " },
    { src: "images/pass2.jpg", caption: "First-time pass  well done! " },
    { src: "images/pass3.jpg", caption: "Amazing drive on test day " },
    { src: "images/pass4.jpg", caption: "Pass certificate moment " },
    { src: "images/pass5.jpg", caption: "Hard work paid off! " },
    { src: "images/pass6.jpg", caption: "So proud  safe driving ahead " },
  ],
  galleryBatchSize: 6,
};

// ========= WhatsApp helpers =========
function whatsappLink(message) {
  const text = encodeURIComponent(message || CONFIG.whatsappDefaultText);
  // wa.me works on mobile/desktop
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function setWhatsAppLinks() {
  const heroBtn = document.getElementById("whatsappHero");
  const contactBtn = document.getElementById("whatsappContact");
  const floatBtn = document.getElementById("whatsappFloat");

  const base = whatsappLink(CONFIG.whatsappDefaultText);
  [heroBtn, contactBtn, floatBtn].forEach(el => {
    if (el) el.href = base;
  });
}

// ========= Quote form -> WhatsApp =========
function setupQuoteForm() {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const area = document.getElementById("area").value.trim();
    const type = document.getElementById("type").value;
    const msg = document.getElementById("message").value.trim();

    const composed =
      `Hi, I'm ${name}.%0A` +
      `Area: ${area}%0A` +
      `Lesson type: ${type}%0A` +
      (msg ? `Message: ${encodeURIComponent(msg)}` : "");

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${composed}`, "_blank", "noopener");
  });
}

// ========= Google reviews embed =========
function setupGoogle() {
  const iframe = document.getElementById("googleEmbed");
  const writeReview = document.getElementById("googleWriteReview");

  if (iframe && CONFIG.googlePlaceEmbedSrc) iframe.src = CONFIG.googlePlaceEmbedSrc;
  if (writeReview && CONFIG.googleWriteReviewUrl) writeReview.href = CONFIG.googleWriteReviewUrl;
}

// ========= Optional: review cards (manual/your backend) =========
// If you can't/shouldn't fetch reviews directly in the browser, you can still
// show a few "featured" reviews that you have permission to display.
const FEATURED_REVIEWS = [
  // Example:
  // { name: "Ayesha", rating: 5, text: "Super patient and clear explanations. Passed first time!" },
];

function renderReviewCards() {
  const wrap = document.getElementById("reviewCards");
  if (!wrap || FEATURED_REVIEWS.length === 0) return;

  wrap.innerHTML = FEATURED_REVIEWS.map(r => {
    const stars = "".slice(5 - r.rating, 10 - r.rating);
    return `
      <article class="card">
        <h3>${escapeHtml(r.name)}</h3>
        <p class="muted">${stars}</p>
        <p>${escapeHtml(r.text)}</p>
      </article>
    `;
  }).join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ========= Gallery =========
let galleryIndex = 0;

function renderNextGalleryBatch() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const next = CONFIG.galleryItems.slice(galleryIndex, galleryIndex + CONFIG.galleryBatchSize);
  galleryIndex += next.length;

  const html = next.map(item => `
    <div class="photo">
      <img src="${item.src}" alt="Passed student photo" loading="lazy" />
      <div class="cap">${escapeHtml(item.caption || "")}</div>
    </div>
  `).join("");

  gallery.insertAdjacentHTML("beforeend", html);

  const btn = document.getElementById("loadMore");
  if (btn) btn.style.display = (galleryIndex >= CONFIG.galleryItems.length) ? "none" : "inline-flex";
}

function setupLoadMore() {
  const btn = document.getElementById("loadMore");
  if (!btn) return;
  btn.addEventListener("click", renderNextGalleryBatch);
}

// ========= Mobile menu (simple) =========
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.querySelector(".navlinks");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.style.display === "flex";
    nav.style.display = open ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.gap = "10px";
    nav.style.position = "absolute";
    nav.style.right = "4%";
    nav.style.top = "64px";
    nav.style.padding = "12px";
    nav.style.border = "1px solid rgba(255,255,255,.12)";
    nav.style.borderRadius = "14px";
    nav.style.background = "rgba(10,15,25,.9)";
    btn.setAttribute("aria-expanded", String(!open));
  });
}

// ========= init =========
document.getElementById("year").textContent = new Date().getFullYear();
setWhatsAppLinks();
setupQuoteForm();
setupGoogle();
renderReviewCards();
renderNextGalleryBatch();
setupLoadMore();
setupMobileMenu();
