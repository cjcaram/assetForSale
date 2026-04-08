const galleryItems = [...document.querySelectorAll(".gallery-item")];
const filters = [...document.querySelectorAll(".gallery-filter")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxThumbs = document.getElementById("lightbox-thumbs");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

const imageData = galleryItems.map((item, index) => {
  const image = item.querySelector("img");
  return {
    index,
    src: image.src,
    alt: image.alt || `Imagen ${index + 1} de la propiedad`,
    featured: item.classList.contains("featured")
  };
});

let visibleIndexes = imageData.map(({ index }) => index);
let currentVisibleIndex = 0;

function setActiveFilter(filter) {
  filters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });

  galleryItems.forEach((item) => {
    const shouldShow = filter === "all" || item.classList.contains("featured");
    item.classList.toggle("hidden", !shouldShow);
  });

  visibleIndexes = imageData
    .filter((item) => filter === "all" || item.featured)
    .map((item) => item.index);
}

function buildThumbs() {
  lightboxThumbs.innerHTML = "";

  visibleIndexes.forEach((imageIndex) => {
    const data = imageData[imageIndex];
    const thumbButton = document.createElement("button");
    thumbButton.type = "button";
    thumbButton.className = "lightbox-thumb";
    thumbButton.dataset.index = String(imageIndex);
    thumbButton.setAttribute("aria-label", `Abrir ${data.alt}`);
    thumbButton.innerHTML = `<img src="${data.src}" alt="${data.alt}">`;
    thumbButton.addEventListener("click", () => openLightboxByIndex(imageIndex));
    lightboxThumbs.appendChild(thumbButton);
  });
}

function syncThumbs(activeIndex) {
  [...lightboxThumbs.querySelectorAll(".lightbox-thumb")].forEach((thumb) => {
    const isActive = Number(thumb.dataset.index) === activeIndex;
    thumb.classList.toggle("is-active", isActive);
    if (isActive) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
}

function renderLightbox() {
  const realIndex = visibleIndexes[currentVisibleIndex];
  const image = imageData[realIndex];

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
  lightboxCounter.textContent = `${currentVisibleIndex + 1} / ${visibleIndexes.length}`;
  syncThumbs(realIndex);
}

function openLightboxByIndex(index) {
  const nextVisibleIndex = visibleIndexes.indexOf(index);
  if (nextVisibleIndex === -1) {
    return;
  }

  currentVisibleIndex = nextVisibleIndex;
  buildThumbs();
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
  currentVisibleIndex = (currentVisibleIndex + step + visibleIndexes.length) % visibleIndexes.length;
  renderLightbox();
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightboxByIndex(Number(item.dataset.index));
  });
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
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

setActiveFilter("all");
