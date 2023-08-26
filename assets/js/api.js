'use strict';


const api_key = '7c903fe09c7024a53e3273c6acd5100e';
const imageBaseURL = 'https://image.tmdb.org/t/p/';


// this for image: https://api.themoviedb.org/3/movie/movie_id/images?api_key=${api_key}

// fetch data from a server using the 'url' and passes
// result in JSON data to a 'callback' function
// along with a optional parameter if has 'optionalParam'


const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data, optionalParam))
        .catch(error => console.log('this is an error: ' + error))
}



export { imageBaseURL, api_key, fetchDataFromServer };

