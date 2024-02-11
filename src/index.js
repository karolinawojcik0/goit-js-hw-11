const searchForm = document.getElementById('search-form');
const galleryContainer = document.getElementById('gallery');
const loadMoreButton = document.getElementById('load-more');
const notificationContainer = document.getElementById('notification-container');
let currentPage = 1;
let currentQuery = '';

const fetchImages = async (query, page = 1) => {
  try {
    const apiKey = '42320821-672b5df2478abbbc9b3da7ab2';
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

const displayImages = (images) => {
  images.forEach((image) => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    galleryContainer.appendChild(card);
  });

  // Initialize SimpleLightbox for image viewing
  const lightbox = new SimpleLightbox('.gallery img');
  lightbox.refresh();
};

const showNotification = (message) => {
  notificationContainer.innerHTML = `<div class="notification">${message}</div>`;
  setTimeout(() => {
    notificationContainer.innerHTML = '';
  }, 3000);
};

const handleSearch = async (event) => {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.target.searchQuery.value.trim();
  galleryContainer.innerHTML = ''; // Clear the gallery
  loadMoreButton.style.display = 'none';

  const data = await fetchImages(currentQuery, currentPage);

  if (data.hits.length > 0) {
    displayImages(data.hits);
    loadMoreButton.style.display = 'block';
    showNotification(`Hooray! We found ${data.totalHits} images.`);
  } else {
    showNotification('Sorry, there are no images matching your search query. Please try again.');
  }
};

const handleLoadMore = async () => {
  currentPage++;
  const data = await fetchImages(currentQuery, currentPage);

  if (data.hits.length > 0) {
    displayImages(data.hits);
  } else {
    loadMoreButton.style.display = 'none';
    showNotification("We're sorry, but you've reached the end of search results.");
  }

  // Smooth scroll to the new images
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchForm.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', handleLoadMore);
