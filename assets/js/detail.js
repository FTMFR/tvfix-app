"use strict";

import { api_key, fetchDataFromServer, imageBaseURL } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./mobile-card.js";
import { createSearch } from "./search.js"


const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector('[page-content]');

sidebar();


const getGenre = function (genreList) {
    const newGenreList = [];
    for (const { name } of genreList) {
        newGenreList.push(name);
    }
    return newGenreList.join(', ');
}

const getCasts = function (castList) {
    const newCastList = [];
    for (let i = 0; ((i < castList.length) && i < 10); i++) {
        const { name } = castList[i];
        newCastList.push(name);
    }
    return newCastList.join(', ');
}



// return all trailers and teasers as array
const filtervideos = function (videoList) {
    return videoList.filter(({ type, site }) => (type == "Trailer" || type == "Teaser") && site == 'YouTube')
}





const getDirectors = function (crewList) {
    const directors = crewList.filter(({ job }) => job === 'Director');

    const directorList = [];

    for (const { name } of directors) {
        directorList.push(name)
    }

    return directorList.join(', ')

}

fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=casts%2Cvideos%2Cimages%2Crelease&language=en-US&api_key=${api_key}`,
    function (movie) {
        const {
            backdrop_path,
            poster_path,
            title,
            release_date,
            runtime,
            vote_average,
            popularity,
            // certification,
            // releases: { countries: [{ certification }] },
            genres,
            overview,
            casts: { cast, crew },
            videos: { results: videos },
        } = movie;

        document.title = `${title} - TvFlix`;

        const movieDetail = document.createElement('div');
        movieDetail.classList.add('movie-detail');
        movieDetail.innerHTML = `
                        <div
                        class="backdrop-image"
                        style="background-image: url(${imageBaseURL}${'w1280' || 'original'}${backdrop_path || poster_path})"
                        ></div>
                        <figure class="poster-box movie-poster">
                        <img
                        src="${imageBaseURL}w342${poster_path}"
                        alt="${title}"
                        class="img-cover"
                        />
                        </figure>
                        <div class="detail-box">
                        <div class="detail-content">
                        <h1 class="heading">${title}</h1>
                        <div class="meta-list">
                            <div class="meta-item">
                            <img
                                src="assets/images/star.png"
                                width="20"
                                height="20"
                                alt="rating"
                            />
                            <span class="span">${vote_average.toFixed(1)}</span>
                            </div>
                            <div class="separator"></div>
                            <div class="meta-item">${runtime}m</div>
                            <div class="separator"></div>
                            <div class="meta-item">${release_date.split('-')[0]}</div>
                            <div class="meta-item card-badge" title='popularity'>${popularity.toFixed(0)}</div>
                        </div>

                        <p class="genre">${getGenre(genres)}</p>

                        <p class="overview">${overview}</p>

                        <ul class="detail-list">
                            <div class="list-item">
                            <p class="list-name">Starring</p>
                            <p>${getCasts(cast)}</p>
                            </div>

                            <div class="list-item">
                            <p class="list-name">Directed By</p>
                            <p>${getDirectors(crew)}</p>
                            </div>
                        </ul>
                        </div>

                        <div class="title-wrapper">
                        <h3 class="heading">Trailers and Clips</h3>
                        </div>

                        <div class="slider-list">
                        <div class="slider-inner"></div>
                        </div>
                    </div>`;

        for (const { key, name } of filtervideos(videos)) {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');

            videoCard.innerHTML = `
            <iframe
            src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
            width="500" height="294" frameborder="0" allowfullscreen="1" title="${name}"
            class="img-cover" loading="lazy">
            </iframe> `;

            movieDetail.querySelector('.slider-inner').appendChild(videoCard);
        }

        pageContent.appendChild(movieDetail);




        fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`, addsuggestedMovie)
    })


const addsuggestedMovie = function ({ results: movieList }, title) {
    const movieListElement = document.createElement('section');
    movieListElement.classList.add('movie-list');
    movieListElement.ariaLabel = 'You may also like';
    movieListElement.innerHTML = `
                    <div class="title-wrapper">
                    <h3 class="heading">You may also like</h3>
                    </div>
                    <div class="slider-list">
                    <div class="slider-inner"></div>
                    </div>`;

    for (const movie of movieList) {
        // called from movie-card.js
        const movieCard = createMovieCard(movie);

        movieListElement.querySelector('.slider-inner').appendChild(movieCard);
    }
    // console.log(createMovieCard())
    pageContent.appendChild(movieListElement);
}

