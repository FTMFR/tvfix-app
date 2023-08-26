'use strict';


// import all components and functions

import { sidebar } from "./sidebar.js";
import { api_key, fetchDataFromServer, imageBaseURL, } from "./api.js";
import { createMovieCard } from "./mobile-card.js";
import { createSearch } from "./search.js";

const addEventOnElements = function (elements, eventType, callback) {
    for (let elem of elements) {
        elem.addEventListener(eventType, callback)
    }
}

const pageContent = document.querySelector('[page-content]');
sidebar();




// home page section (top rated, upcoming, trending movies)

const homePageSections = [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming"
    },
    {
        title: "Weekly Trending Movies",
        path: "/trending/movie/week"
    },
    {
        title: "Top Rated Movies",
        path: "/movie/top_rated"
    }
]



// fetch all genre : [ { 'id' : '123', 'name' : 'action'} ]
// then change genre formate { 123 : 'action' }


const genreList = {
    // create genre string from genre-id : [23, 43] => "Action , Romance".

    asString(genreIdList) {
        let newGenreList = [];

        for (const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]);
            // this == genreList;
        }

        return newGenreList.join(', ');

    }


};


fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
        for (const { id, name } of genres) {
            genreList[id] = name;
        }
        (
            `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
            heroBanner
        )
    });






const heroBanner = function ({ results: movieList }) {
    const banner = document.createElement('section');
    banner.classList.add('banner');
    banner.ariaLabel = 'Popular Movies';
    banner.innerHTML = `
                        <div class="banner-slider">
                        </div>
                        <div class="slider-control">
                        <div class="control-inner">
                        </div>
                        </div>`;


    let controlItemIndex = 0;
    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement('div');
        sliderItem.classList.add('slider-item');
        sliderItem.setAttribute('slider-item', '');

        sliderItem.innerHTML = `
                    <img
                    src="${imageBaseURL}w1280${backdrop_path}"
                    alt="${title}"
                    class="img-cover"
                    loading=${index === 0 ? 'eager' : 'lazy'}
                    />
                    <div class="banner-content">
                    <h2 class="heading">${title}</h2>
                    <div class="meta-list">
                        <div class="meta-item">${release_date.split('-')[0]}</div>
                        <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                    </div>
                    <div class="genre">${genreList.asString(genre_ids)}</div>
                    <p class="banner-text">${overview}</p>
                    <a href="./detail.html" class="btn" onclick='getMovieDetail(${id})'>
                        <img
                        src="assets/images/play_circle.png"
                        width="24"
                        height="24"
                        aria-hidden="true"
                        alt="Play Circle"
                        />
                        <span class="span">Watch Now</span>
                    </a>
                    </div>   `;

        banner.querySelector('.banner-slider').appendChild(sliderItem);

        const controlItem = document.createElement('button');
        controlItem.classList.add('poster-box', 'slider-item');
        controlItem.classList.add('slider-item');
        controlItem.setAttribute('slider-control', `${controlItemIndex}`);

        controlItemIndex++;

        controlItem.innerHTML = `
        <img
        src="${imageBaseURL}w154${poster_path}"
        alt="Slide to ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
        />     
        `;

        banner.querySelector('.control-inner').appendChild(controlItem);
        // console.log(banner.querySelector('.control-inner'))
    }




    pageContent.appendChild(banner);

    addHeroSlide();


    // fetch data for home page sections (top rated, trending, upcoming)
    for (const { title, path } of homePageSections) {
        (
            `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`
            , createMoviesList, title)
    }



}

// hero slider functionality


const addHeroSlide = function () {
    const sliderItems = document.querySelectorAll('[slider-item]');
    const sliderControls = document.querySelectorAll('[slider-control]');

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderControl.classList.add('active');
    lastSliderItem.classList.add('active');

    const sliderStart = function () {
        lastSliderItem.classList.remove('active');
        lastSliderControl.classList.remove('active');


        // 'this' == slider-control
        sliderItems[Number(this.getAttribute('slider-control'))].classList.add('active');
        this.classList.add('active');
        lastSliderItem = sliderItems[Number(this.getAttribute('slider-control'))];
        lastSliderControl = this;
    }

    addEventOnElements(sliderControls, 'click', sliderStart);

}



const createMoviesList = function ({ results: movieList }, title) {
    const movieListElement = document.createElement('section');
    movieListElement.classList.add('movie-list');
    movieListElement.innerHTML = `
                <div class="title-wrapper">
                <h3 class="heading">${title}</h3>
                </div>
                <div class="slider-list">
                <div class="slider-inner"></div>
                </div>`;
    for (const movie of movieList) {
        /**
         * called from movie-card.js
         */
        const movieCard = createMovieCard(movie);

        movieListElement.querySelector('.slider-inner').appendChild(movieCard);
    }

    pageContent.appendChild(movieListElement);
}


createSearch();