// Select all images in the gallery
const images = document.querySelectorAll(".gallery img");
let currentIndex = 0; // Track the currently displayed image

// Create a modal to display images
const modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
modal.style.display = "none";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.zIndex = "1000";
document.body.appendChild(modal);

// Add a close button
const closeButton = document.createElement("span");
closeButton.textContent = "✖";
closeButton.style.position = "absolute";
closeButton.style.top = "10px";
closeButton.style.right = "10px";
closeButton.style.color = "white";
closeButton.style.fontSize = "24px";
closeButton.style.cursor = "pointer";
modal.appendChild(closeButton);

// Add the image to the modal
const modalImage = document.createElement("img");
modalImage.style.maxWidth = "90%";
modalImage.style.maxHeight = "90%";
modal.appendChild(modalImage);

// Add navigation arrows
const leftArrow = document.createElement("span");
leftArrow.textContent = "◀";
leftArrow.style.position = "absolute";
leftArrow.style.left = "20px";
leftArrow.style.color = "white";
leftArrow.style.fontSize = "36px";
leftArrow.style.cursor = "pointer";
leftArrow.style.userSelect = "none";
modal.appendChild(leftArrow);

const rightArrow = document.createElement("span");
rightArrow.textContent = "▶";
rightArrow.style.position = "absolute";
rightArrow.style.right = "20px";
rightArrow.style.color = "white";
rightArrow.style.fontSize = "36px";
rightArrow.style.cursor = "pointer";
rightArrow.style.userSelect = "none";
modal.appendChild(rightArrow);

// Event listeners for image clicks
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index; // Set the current index
    showImage(currentIndex);
    modal.style.display = "flex"; // Show the modal
  });
});

// Show the image in the modal
function showImage(index) {
  modalImage.src = images[index].src; // Set the modal image source
}

// Close the modal
closeButton.addEventListener("click", () => {
  modal.style.display = "none"; // Hide the modal
});

// Navigate left
leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length; // Wrap around to last image
  showImage(currentIndex);
});

// Navigate right
rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length; // Wrap around to first image
  showImage(currentIndex);
});
