"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./mobile-card.js";
import { createSearch } from "./search.js"

// collect genre name & url parameter from local storage
const ganreName = window.localStorage.getItem(`genreName`);
const urlParam = window.localStorage.getItem(`urlParam`);
const pageContent = document.querySelector('[page-content]');


sidebar();

let currentPage = 1;
let totalPages = 0;
const fetchURL = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&inculde_adult=false&page=${currentPage}&${urlParam}`;

const SIGNLOGIN = document.querySelector('.signup');




fetchDataFromServer(fetchURL, function ({ results: movieList, total_pages }) {

    totalPages = total_pages;
    document.title = `${ganreName} Movie - TvFlix`;
    const movieListElement = document.createElement('section');
    movieListElement.classList.add('movie-list', 'genre-list');
    movieListElement.ariaLabel = `${ganreName} Movies`;
    movieListElement.innerHTML = `
                    <div class="title-wrapper">
                    <h3 class="heading">All ${ganreName} Movies</h3>
                    </div>
                    <div class="grid-list">
                    </div>
                    <button class="btn load-more" load-more>Load More</button>`;

    // dadd movie card based on fetched item
    for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        movieListElement.querySelector('.grid-list').appendChild(movieCard);

    }
    pageContent.appendChild(movieListElement);


    // load more button functionality
    document.querySelector('[load-more]').addEventListener('click', function () {
        if (currentPage >= totalPages) {
            // 'this' == loading button
            this.style.display = 'none';
            return this;
        } else {
            currentPage++;
            // 'this' == loading-btn
            this.classList.add('loading');
            fetchDataFromServer(fetchURL, ({ results: movieList }) => {
                // this == loading button
                this.classList.remove('loading');
                for (const movie of movieList) {
                    const movieCard = createMovieCard(movie);
                    movieListElement.querySelector('.grid-list').appendChild(movieCard)
                }
            })
        }
    })

    /**
     * added for loop by myself!!
     */


})




window.addEventListener('load', function () {
    if (window.localStorage.getItem('token')) {
        SIGNLOGIN.classList.add('active');
    }
    else {
        SIGNLOGIN.classList.remove('active');

    }
});


createSearch();
