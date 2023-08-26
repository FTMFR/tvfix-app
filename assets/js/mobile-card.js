"use strict";

import { imageBaseURL, api_key } from "./api.js";
import { createSearch } from "./search.js";



// mobile card 

export function createMovieCard(movie) {
    const {
        poster_path,
        title,
        vote_average,
        release_date,
        id
    } = movie;


    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
                <figure class="poster-box card-banner">
                <img
                    src="${imageBaseURL}w342${poster_path}"
                    alt="${title}"
                    class="img-cover"
                    loading=""lazy
                />
                </figure>
                <h4 class="title">${title}</h4>
                <div class="meta-list">
                <div class="meta-item">
                    <img
                    src="assets/images/star.png"
                    alt="rating"
                    width="20"
                    height="20"
                    loading="lazy"
                    />
                    <span class="span">${vote_average.toFixed(1)}</span>
                </div>
                <div class="card-badge">${release_date.split('-')[0]}</div>
                </div>

                <a
                href="./detail.html"
                title="${title}"
                class="card-btn"
                onclick='getMovieDetail(${id})'
                ></a>`;
    return card;
}