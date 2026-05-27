const driveImages = [
  { id: "1HQe1R-n5fH6ETMHjxS0Qt5dyVPlf6jin", alt: "Vista exterior de la casa", category: "exterior", featured: true },
  { id: "1p6eENDvXVW1ht_sDkkeJYSNIJwRBKjZP", alt: "Galería y sector exterior", category: "exterior", featured: true },
  { id: "15crjMdOiUNJC6HgutzQwVadHjfiMmP_u", alt: "Vista exterior y entorno", category: "exterior", featured: true },
  { id: "1LtWM-9one4KKRzpDD1uu_DG0rFp8KD2_", alt: "Frente y acceso de la propiedad", category: "exterior", featured: true },
  { id: "1fsJFi3VryvAvsYi5zP6o0MQ1eJxXCTV9", alt: "Vista exterior lateral", category: "exterior" },
  { id: "1EBTtMcdLegFjjvzpLDztiI6VSYsGDaau", alt: "Detalle exterior de la vivienda", category: "exterior" },
  { id: "14R2Tm23a6WoNWuc8M8ixlR88x8L-VbHu", alt: "Vista exterior del lote", category: "exterior" },
  { id: "1_ZKuXlFAHaTElRs1t5L8Xl75zOvEze3Y", alt: "Exterior con vistas abiertas", category: "exterior" },
  { id: "1SV5BaBgdCf3NgyKO6sZGnhBZ5CZwLSXj", alt: "Sector exterior y galería", category: "exterior" },
  { id: "1zdcM4ubVMpIi3JtR55r8B5j2IqjKsOrH", alt: "Vista general exterior", category: "exterior" },
  { id: "1068BUF-Ox8P3Bdo4JjE5-0TRDgBubbI4", alt: "Interior de la vivienda", category: "interior", featured: true },
  { id: "1m-tfXt_dD8-KeMIMunjl9aMcweT9RFTg", alt: "Ambiente principal interior", category: "interior", featured: true },
  { id: "1PHBCfZHd2WY4Ewq1gB1CXXw3ufmOH62F", alt: "Vista interior de ambiente", category: "interior" },
  { id: "1MhDu_W5wQBwS_PixOtmqlZ4yXpPyHo87", alt: "Interior luminoso", category: "interior" },
  { id: "1pSzIQ-9sxozvECP5XNrIb61qRYm6ZtpJ", alt: "Cocina y estar comedor", category: "interior" },
  { id: "1prS2R6dKOzymktLEyjzvto7ni4pVQeNR", alt: "Detalle de cocina", category: "interior" },
  { id: "1qlZwBJjNFkc4uVFp2HAyjhoHi_1UptK6", alt: "Dormitorio de la casa", category: "interior" },
  { id: "1OIUQVuAXWRET-74tktV2s0PNlnJeaDiw", alt: "Ambiente privado", category: "interior" },
  { id: "19bAMViI6JSgH2nSmpSc-Qbr9MBixlHxw", alt: "Baño completo", category: "interior" },
  { id: "1WNHkBlHqD5C0iBBCz49lxKb5RMFq8VV9", alt: "Toilette o baño", category: "interior" },
  { id: "1ZC9R-adqRXHgJTwKxWJaY9TmZQ7ZKttq", alt: "Detalle interior", category: "interior" },
  { id: "178QVjY4Gz9aPluXA86sP-zinr5lp8TBX", alt: "Interior con terminaciones", category: "interior" },
  { id: "1fmglvjqTLkCAiX1QFGk9khk7qE8YcVvt", alt: "Vista interior adicional", category: "interior" },
  { id: "1XtF2H5s_utvnH89HH_rZtfQSTGCTCblP", alt: "Lavadero o sector de servicio", category: "interior" },
  { id: "1e16bPvJGUWbK3L7MUljYDO8pVakx3Ezs", alt: "Detalle de aberturas y terminaciones", category: "interior" }
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
