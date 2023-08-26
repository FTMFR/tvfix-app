"use strict";


import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./mobile-card.js";


export function createSearch() {
    const searchWrapper = document.querySelector('[search-wrapper]');
    const searchField = document.querySelector('[search-field]');
    const searchResultModal = document.createElement('div');
    searchResultModal.classList.add('search-modal');
    document.querySelector('main').appendChild(searchResultModal);


    let searchTimeOut;

    searchField.addEventListener('input', function () {
        if (!searchField.value.trim()) {
            searchResultModal.classList.remove('active');
            searchWrapper.classList.remove('searching');
            clearTimeout(searchTimeOut);
            return;
        }

        searchWrapper.classList.add('searching');
        clearTimeout(searchTimeOut);

        searchTimeOut = setTimeout(function () {
            fetchDataFromServer(
                `https://api.themoviedb.org/3/search/movie?query=${searchField.value}&include_adult=false&page=1&api_key=${api_key}`,
                function ({ results: movieList }) {
                    searchWrapper.classList.remove('searching');
                    searchResultModal.classList.add('active');
                    // remove old result;
                    searchWrapper.innerHTML = '';
                    searchResultModal.innerHTML = `
                        <p class="label">Results for</p>
                        <h1 class="heading">${searchField.value}</h1>
                        <div class="movie-list">
                        <div class="grid-list"></div>
                        </div>`;

                    for (const movie of movieList) {
                        const movieCard = createMovieCard(movie);
                        searchResultModal.querySelector('.grid-list').appendChild(movieCard);
                    }


                })
        }, 500);
    })


   
}