const driveImages = [
  { id: "1zdSXwFMoLi-aZzNL1BlmGAeQogzF14JS", alt: "Vista exterior de la casa", category: "exterior", featured: true },
  { id: "1KexdVYolFG5zHK6VfIiRtU1T9u9S81XO", alt: "Galería y sector exterior", category: "exterior", featured: true },
  { id: "1bPnta__TD4Emozk2MIZaHUNzeyEDFmlt", alt: "Vista exterior y entorno", category: "exterior", featured: true },
  { id: "1g0o18JGfgae8GzwMdt_hySd0UxGPJur9", alt: "Frente y acceso de la propiedad", category: "exterior", featured: true },
  { id: "1Hk01WSt3G3eOOPsVTEIFJHBLy_l1VXpP", alt: "Vista exterior lateral", category: "exterior" },
  { id: "12eOzYAQKKrCk_nNMIs_wErNZqmc4F5z_", alt: "Detalle exterior de la vivienda", category: "exterior" },
  { id: "1LLHSjGCB6BwpzLhl2uvVr3veAazF_E5f", alt: "Vista exterior del lote", category: "exterior" },
  { id: "1iKr3PJ83fYMBElMghNLfQ8D07lFEsRBD", alt: "Exterior con vistas abiertas", category: "exterior" },
  { id: "1fPVPTDn-KTZyyCwFhqI1dZ5FqR5DZASH", alt: "Sector exterior y galería", category: "exterior" },
  { id: "13Dv4Yn1nqSo7T_ounD8OtqRaV-3n8LKe", alt: "Vista general exterior", category: "exterior" },
  { id: "1W9vhezuBqrWo2mnucXgTwfk9D4jyM1JY", alt: "Interior de la vivienda", category: "interior", featured: true },
  { id: "13bsOdcoDIxbyVNwMBEcLzjG4K3M6pIaJ", alt: "Ambiente principal interior", category: "interior", featured: true },
  { id: "1ynL7wN09m3Xk0osgbVE32N6IN2UZ99_6", alt: "Vista interior de ambiente", category: "interior" },
  { id: "1Dv8NfgJ4f9iVk4GdfWAdl_S90AEMA-2L", alt: "Interior luminoso", category: "interior" },
  { id: "1mVn9U1CfZsJOoAb5tnvJWz51p-26UL7n", alt: "Cocina y estar comedor", category: "interior" },
  { id: "1TQTpFWpJWbpNOPNcp2gEW6aRF1DQmB7B", alt: "Detalle de cocina", category: "interior" },
  { id: "1dm0L-2AW9Qr5lvJcLo4kwKbRRhu8b2IH", alt: "Dormitorio de la casa", category: "interior" },
  { id: "1KJOoGcfcRl121R5jNKMefVODl2k1laKK", alt: "Ambiente privado", category: "interior" },
  { id: "12tFEVHJQxElPmjK0GBtADt0esCD3ro5t", alt: "Baño completo", category: "interior" },
  { id: "1MuiqVUFLT9t1mVSwoSRLesdU0dzrM7y1", alt: "Toilette o baño", category: "interior" },
  { id: "1EiEnyB1rXSBNrIjrPoagWqoc3Cvz3vPu", alt: "Detalle interior", category: "interior" },
  { id: "1G3vRy4jGFVFtaSxw9jcdKYyt84C-ffWz", alt: "Interior con terminaciones", category: "interior" },
  { id: "1GG_YB9Dsqe2uHcyb-YolEy1H1p0zlqrr", alt: "Vista interior adicional", category: "interior" },
  { id: "1oZhcKB1eMsnzKOjyQIwttXb4z4UPSp0e", alt: "Lavadero o sector de servicio", category: "interior" },
  { id: "1OCANStbf-hFulUUVhx2LvPWVdFdQhc4p", alt: "Detalle de aberturas y terminaciones", category: "interior" }
].map((image, index) => ({
  ...image,
  index,
  src: `https://drive.google.com/thumbnail?id=${image.id}&sz=w2000`
}));

const heroMedia = document.getElementById("hero-media");
const galleryGrid = document.getElementById("gallery-grid");
const filters = [...document.querySelectorAll(".gallery-filter")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxThumbs = document.getElementById("lightbox-thumbs");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let activeImages = [...driveImages];
let currentIndex = 0;

function imageMarkup(image, loading = "lazy") {
  return `<img src="${image.src}" alt="${image.alt}" loading="${loading}">`;
}

function renderGallery(filter = "all") {
  activeImages = filter === "all" ? [...driveImages] : driveImages.filter((image) => image.category === filter);
  galleryGrid.innerHTML = "";

  activeImages.forEach((image, position) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `gallery-item ${image.featured ? "featured" : ""}`;
    item.dataset.position = String(position);
    item.innerHTML = imageMarkup(image, position < 4 ? "eager" : "lazy");
    item.addEventListener("click", () => openLightbox(position));
    galleryGrid.appendChild(item);
  });
}

function renderThumbs() {
  lightboxThumbs.innerHTML = "";

  activeImages.forEach((image, position) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "lightbox-thumb";
    thumb.dataset.position = String(position);
    thumb.setAttribute("aria-label", `Abrir ${image.alt}`);
    thumb.innerHTML = imageMarkup(image);
    thumb.addEventListener("click", () => openLightbox(position));
    lightboxThumbs.appendChild(thumb);
  });
}

function syncThumbs() {
  [...lightboxThumbs.querySelectorAll(".lightbox-thumb")].forEach((thumb) => {
    const isActive = Number(thumb.dataset.position) === currentIndex;
    thumb.classList.toggle("is-active", isActive);
    if (isActive) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
}

function renderLightbox() {
  const image = activeImages[currentIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
  syncThumbs();
}

function openLightbox(position) {
  currentIndex = position;
  renderThumbs();
  renderLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function stepLightbox(step) {
  currentIndex = (currentIndex + step + activeImages.length) % activeImages.length;
  renderLightbox();
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("is-active", item === button));
    renderGallery(button.dataset.filter);
  });
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => stepLightbox(-1));
nextButton.addEventListener("click", () => stepLightbox(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});

heroMedia.style.backgroundImage = `url("${driveImages[0].src}")`;
renderGallery();
