const driveImages = [
  { id: "11E7g-qqMWzWTp9v6zwpkmEeugKUnNZh8", alt: "Vista del departamento" },
  { id: "12fDPA_zkzHGM601xh7g1MUl6rfVaCoAC", alt: "Ambiente principal del departamento" },
  { id: "1NT1mQ9gniM91VPbrqFugs-SZdDiVhqFm", alt: "Otro ángulo del interior" },
  { id: "1n6bz780F8FeMRXtcwhGGZEE6iN6_TDH5", alt: "Detalle del ambiente principal" },
  { id: "1zEXxOeXA1fp4cLx7kNjYFboPHn4NYmtg", alt: "Vista de cocina comedor" },
  { id: "17iIrlZ1kmunpeKSHlZL9uWxl-f6cJmam", alt: "Detalle de la cocina" },
  { id: "16b_rRt_gh0Z3yLNsApgVoie2rmHlIGDj", alt: "Dormitorio del departamento" },
  { id: "15tHuBzucbRnwrH56359zCZA7cqvdprL1", alt: "Otro dormitorio o ambiente privado" },
  { id: "1qkgPtT0tkBT7-W-w8erRtP0jVa482vk0", alt: "Baño completo" },
  { id: "1L0i44Xf0x6SJ0-92ZXUT6E78JWSB4S7N", alt: "Segundo baño completo" },
  { id: "15yYcwJ72cB2YvHFluOHFzjit_SBLDNCC", alt: "Balcón contrafrente" },
  { id: "1EFvoLbIWW16lNUy1LphvGQTZYGDQ5QrX", alt: "Amenity o vista adicional del edificio" }
].map((image, index) => ({
  ...image,
  index,
  src: `https://drive.google.com/thumbnail?id=${image.id}&sz=w2000`
}));

const galleryGrid = document.getElementById("gallery-grid");
const heroMedia = document.getElementById("hero-media");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxThumbs = document.getElementById("lightbox-thumbs");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let currentIndex = 0;

function renderGallery() {
  galleryGrid.innerHTML = "";

  driveImages.forEach((image) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.dataset.index = String(image.index);
    button.innerHTML = `<img src="${image.src}" alt="${image.alt}" loading="lazy">`;
    button.addEventListener("click", () => openLightbox(image.index));
    galleryGrid.appendChild(button);
  });
}

function buildThumbs() {
  lightboxThumbs.innerHTML = "";

  driveImages.forEach((image) => {
    const thumbButton = document.createElement("button");
    thumbButton.type = "button";
    thumbButton.className = "lightbox-thumb";
    thumbButton.dataset.index = String(image.index);
    thumbButton.setAttribute("aria-label", `Abrir ${image.alt}`);
    thumbButton.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
    thumbButton.addEventListener("click", () => openLightbox(image.index));
    lightboxThumbs.appendChild(thumbButton);
  });
}

function syncThumbs() {
  [...lightboxThumbs.querySelectorAll(".lightbox-thumb")].forEach((thumb) => {
    const isActive = Number(thumb.dataset.index) === currentIndex;
    thumb.classList.toggle("is-active", isActive);
    if (isActive) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
}

function renderLightbox() {
  const image = driveImages[currentIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${driveImages.length}`;
  syncThumbs();
}

function openLightbox(index) {
  currentIndex = index;
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
  currentIndex = (currentIndex + step + driveImages.length) % driveImages.length;
  renderLightbox();
}

heroMedia.style.backgroundImage = `url("${driveImages[0].src}")`;
renderGallery();
buildThumbs();

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

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    stepLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    stepLightbox(1);
  }
});
