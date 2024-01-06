document.addEventListener('DOMContentLoaded', renderLocalStorage);

// render Display
function renderLocalStorage() {
  const movieList = document.getElementById('movie-list');
  const watchlistData = JSON.parse(localStorage.getItem('watchlist')) || [];
  // console.log('watchlistData', watchlistData);

  // render when empty
  if (watchlistData.length === 0) {
    return (movieList.innerHTML = emptyWatchlist());
  }
  const watchlistHTML = watchlistData
    .map(
      (data) => `
      <div class="movie-container">
      <div>
        <img src="${data.poster}" class="poster">
      </div>
      <div class="movies">
        <div class="data-top">
          <h1 class="movie-title">${data.title}</h1>
          <h1 class="movie-year">${data.year}</h1>
          <p class="rating"><i class="fa-solid fa-star" style="color: #FEC654;"></i> ${data.rating}</p>
        </div>
        <div class="data-mid">
          <p class="runtime">${data.runtime}</p>
          <p class="genre">${data.genre}</p>
          <button id="remove-btn"><i class="fa-solid fa-circle-minus"></i> Remove</button> 
        </div>
        <p class="plot">${data.plot}</p>
      </div>
    </div>
    `
    )
    .join('');

  // Display watchlist HTML in the container
  movieList.innerHTML = watchlistHTML;
  // render when empty
}

// remove function
document.addEventListener('click', removeFromTheList);

function removeFromTheList(event) {
  if (event.target.id === 'remove-btn') {
    // 1. get data from localStorage
    const watchlistData = JSON.parse(localStorage.getItem('watchlist')) || [];

    // 2. seperate data by keep the data which not on the remove list
    const removeTarget = event.target.closest('.movie-container');
    const removeByTitle =
      removeTarget.querySelector('.movie-title').textContent;
    const removeByPlot = removeTarget.querySelector('.plot').textContent;

    let keepData = watchlistData.filter(
      (movie) => movie.title !== removeByTitle && movie.plot !== removeByPlot
    );
    console.log('keepdata', keepData);

    // 3. set the new data on the new paper
    localStorage.setItem('watchlist', JSON.stringify(keepData));
    // 4. update on renderLocalStorage()
    renderLocalStorage();
  }
}

function emptyWatchlist() {
  return `
  <p class="empty-notice-text">
    Your watchlist is looking a little empty...</p>
  <div class="add-movie-container">
    <button id="add-movie-btn"><i class="fa-solid fa-circle-plus"></i> <a href="index.html">Let’s add some movies!</a></button>
  </div> 
  `;
}
