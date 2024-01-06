const movieList = document.getElementById('movie-list');
const movieInput = document.getElementById('movie-input');
const searchBtn = document.getElementById('search-btn');

let movieTitles = [
  'Corpse+Bride',
  '3+idiots',
  'the+Truman+show',
  'glass+onion',
  'IDIOCRACY',
];
// console.log('movieTitles', movieTitles);

function renderPage() {
  Promise.all(
    movieTitles.map((title) =>
      fetch(`https://www.omdbapi.com/?t=${title}&apikey=3a02b4a`).then((res) =>
        res.json()
      )
    )
  )
    .then((movies) => {
      // console.log('movies', movies);
      const validMovies = movies.filter(
        (data) =>
          data &&
          data.Title &&
          data.Year &&
          data.Ratings &&
          data.Ratings.length > 0 &&
          data.Runtime &&
          data.Genre &&
          data.Plot &&
          data.Poster
      );
      // console.log('validMovies', validMovies);
      const movieHTML = validMovies
        .map(
          (data) => `
          <div class="movie-container">
            <div>
              <img src="${data.Poster}" class="poster">
            </div>
            <div class="movies">
              <div class="data-top">
                <h1 class="movie-title">${data.Title}</h1>
                <h1 class="movie-year">${data.Year}</h1>
                <p class="rating"><i class="fa-solid fa-star" style="color: #FEC654;"></i> ${data.Ratings[0].Value}</p>
              </div>
              <div class="data-mid">
                <p class="runtime">${data.Runtime}</p>
                <p class="genre">${data.Genre}</p>
                <button id="watch-list-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</button> 
              </div>
              <p class="plot">${data.Plot}</p>
            </div>
          </div>
          `
        )
        .join('');
      movieList.innerHTML = movieHTML;
    })
    .catch((error) => {
      console.error('Error fetching movie data:', error);
      movieList.innerHTML = `<p class="notice-text">Unable to find what you’re looking for. Please try another search.</p>`;
    });
}

searchBtn.addEventListener('click', function renderFromInput() {
  movieTitles = [movieInput.value];
  // console.log('movieTitles', movieTitles);
  renderPage();
});

const watchlistBtn = document.getElementById('watch-list-btn');
document.addEventListener('click', function (event) {
  if (event.target.id === 'watch-list-btn') {
    const movieContainer = event.target.closest('.movie-container');

    // console.log(movieContainer);
    if (movieContainer) {
      const movieData = {
        title: movieContainer.querySelector('.movie-title').textContent,
        year: movieContainer.querySelector('.movie-year').textContent,
        rating: movieContainer.querySelector('.rating').textContent,
        runtime: movieContainer.querySelector('.runtime').textContent,
        genre: movieContainer.querySelector('.genre').textContent,
        plot: movieContainer.querySelector('.plot').textContent,
        poster: movieContainer.querySelector('.poster').src,
      };
      // Store the movie data in localStorage
      addToWatchlist(movieData);
    }
  }
});

function addToWatchlist(movieData) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  if (!watchlist.some((movie) => movie.title === movieData.title)) {
    watchlist.push(movieData);
    // Update the localStorage with the new watchlist
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    // console.log(`${movieData.title} added to Watchlist!`);

    const notification = document.createElement('div');
    notification.className = 'notification-style';

    notification.innerHTML = `<b>${movieData.title}</b> added to Watchlist!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  } else {
    const notification = document.createElement('div');
    notification.className = 'notification-style';

    notification.innerHTML = `<b>${movieData.title}</b> is already in your Watchlist!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}

renderPage();
