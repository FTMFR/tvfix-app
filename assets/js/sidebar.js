// 'use strict';

import { api_key, fetchDataFromServer } from "./api.js";



export function sidebar() {

    // fetch all genre : [ { 'id' : '123', 'name' : 'action'} ]
    // then change genre formate { 123 : 'action' }


    const genreList = {};


    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
        for (const { id, name } of genres) {
            genreList[id] = name;
        }

        createGenre();
    });

    const sidebarInner = document.createElement('div');
    sidebarInner.classList.add('sidebar-inner');
    sidebarInner.innerHTML = `
                <div class="sidebar-list">
                <p class="title">Genre</p>
                </div>
                <div class="sidebar-list">
                <p class="title">Language</p>
                <a href="./movie-list.html" class="sidebar-link" manu-close onclick='getMovieList("with_original_language=en", "English")'
                >English</a
                >
                <a href="./movie-list.html" class="sidebar-link" manu-close onclick='getMovieList("with_original_language=hi", "hindi")'>Hindi</a>
                <a href="./movie-list.html" class="sidebar-link" manu-close  onclick='getMovieList("with_original_language=bn", "Bangali")'
                >Bengali</a
                >
                </div>

                <div class="logout sidebar-list title show">
                <a href='logout.html'>
                <i class='bx bx-log-out-circle'></i>
                <div>Log Out</div>
                </a>
                </div>

                <div class="sidebar-footer">
                <p class="copyright">
                Copyright 2023 <a href="https://github.com/FTMFR">FTMFR</a>
                </p>
                <img
                src="assets/images/tmdb-logo.svg"
                width="130"
                height="17"
                alt="the movie database logo"
                />
                </div>`;


    function createGenre() {
        for (const [genreId, genreName] of Object.entries(genreList)) {
            const link = document.createElement('a');
            link.classList.add('sidebar-link');
            link.setAttribute('href', './movie-list.html');
            link.setAttribute('menu-close', '');
            link.setAttribute('onclick', `getMovieList("with-genre =${genreId}", "${genreName}")`);
            link.textContent = genreName;
            sidebarInner.querySelectorAll('.sidebar-list')[0].appendChild(link);
        }

        const sidebar = document.querySelector('[sidebar]');
        sidebar.appendChild(sidebarInner);
        toggleSidebar(sidebar);
    }

    const toggleSidebar = function (sidebar) {
        // toggle sidebar in mobile screen 
        const sidebarBtn = document.querySelector('[menu-btn]');
        const sidebarTogglers = document.querySelectorAll('[menu-toggler]');
        const sidebarClose = document.querySelectorAll('[menu-close]');
        const overlay = document.querySelector('[overlay]');
        addEventOnElements(sidebarTogglers, 'click', function () {
            sidebar.classList.toggle('active');
            sidebarBtn.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        addEventOnElements(sidebarClose, 'click', function () {
            sidebar.classList.remove('active');
            sidebarBtn.classList.remove('active');
            overlay.classList.remove('active');
        });
    }


}