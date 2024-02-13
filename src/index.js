import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    let currentPage = 1;
    let currentQuery = '';
    let isLoading = false;
    let lightbox = new SimpleLightbox('.gallery a', {});

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        currentQuery = event.target.elements.searchQuery.value;
        currentPage = 1;
        gallery.innerHTML = '';
        fetchImages(currentQuery, currentPage);
    });

    async function fetchImages(query, page) {
        isLoading = true;
        const apiKey = '42320821-672b5df2478abbbc9b3da7ab2';
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.hits.length === 0) {
                Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
                isLoading = false;
                return;
            }

            if (page === 1) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            }

            data.hits.forEach(image => {
                const photoCard = document.createElement('div');
                photoCard.className = 'photo-card';

                const link = document.createElement('a');
                link.href = image.largeImageURL;
                link.setAttribute('data-lightbox', 'gallery');

                const img = document.createElement('img');
                img.src = image.webformatURL;
                img.alt = image.tags;
                link.appendChild(img);

                const description = document.createElement('div');
                description.className = 'photo-description';
                description.innerHTML = `
                    <p>Lubi: ${image.likes}</p>
                    <p>Odsłony: ${image.views}</p>
                    <p>Komentarze: ${image.comments}</p>
                    <p>Pobrania: ${image.downloads}</p>
                `;

                photoCard.appendChild(link);
                photoCard.appendChild(description);
                gallery.appendChild(photoCard);
            });

            lightbox.refresh();
            isLoading = false;
        } catch (error) {
            console.error('Błąd podczas pobierania obrazków:', error);
            Notiflix.Notify.failure('We are sorry, but you\'ve reached the end of search results.');
            isLoading = false;
        }
    }

    function isScrollNearBottom() {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    }

    window.addEventListener('scroll', () => {
        if (isScrollNearBottom() && !isLoading) {
            currentPage++;
            fetchImages(currentQuery, currentPage);
        }
    });
});




