const GITHUB_FOLDER_URL = "https://api.github.com/repos/Infor-Mayo/galeriaia/contents/docs/img?ref=main";
const IMAGE_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];

const carousel = document.getElementById("carousel");
let currentIndex = 0;

function fetchImages() {
  fetch(GITHUB_FOLDER_URL)
    .then(response => response.json())
    .then(data => {
      const imageUrls = data.filter(file => {
        const extension = file.name.split(".").pop().toLowerCase();
        return IMAGE_FILE_EXTENSIONS.includes(extension);
      }).map(file => file.download_url);
      createCarousel(imageUrls);
    })
    .catch(error => console.error(error));
}

function createCarousel(imageUrls) {
  setInterval(() => {
    currentIndex++;
    if (currentIndex >= imageUrls.length) {
      currentIndex = 0;
    }
    carousel.style.backgroundImage = `url(${imageUrls[currentIndex]})`;
  }, 15000);
}

fetchImages();
