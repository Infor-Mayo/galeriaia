const GITHUB_FOLDER_URL = "https://api.github.com/repos/Infor-Mayo/galeriaia/contents/docs/img?ref=main";
const IMAGE_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];

const carousel = document.getElementById("carousel");
let currentIndex = 0;

function fetchImages() {
  if ("caches" in window) {
    caches.match(GITHUB_FOLDER_URL)
      .then(response => {
        if (response) {
          response.json().then(data => {
            const imageUrls = data.filter(file => {
              const extension = file.name.split(".").pop().toLowerCase();
              return IMAGE_FILE_EXTENSIONS.includes(extension);
            }).map(file => file.download_url);
            createCarousel(imageUrls);
          });
        } else {
          fetchImagesFromAPI();
        }
      })
      .catch(error => {
        console.error(error);
        fetchImagesFromAPI();
      });
  } else {
    fetchImagesFromAPI();
  }
}

function fetchImagesFromAPI() {
  fetch(GITHUB_FOLDER_URL)
    .then(response => response.json())
    .then(data => {
      const imageUrls = data.filter(file => {
        const extension = file.name.split(".").pop().toLowerCase();
        return IMAGE_FILE_EXTENSIONS.includes(extension);
      }).map(file => file.download_url);
      createCarousel(imageUrls);
      cacheImages(imageUrls);
    })
    .catch(error => console.error(error));
}

function cacheImages(imageUrls) {
  if ("caches" in window) {
    caches.open("github-carousel").then(cache => {
      imageUrls.forEach(url => {
        cache.add(url);
      });
    });
  }
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
