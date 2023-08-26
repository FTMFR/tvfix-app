const mobileInput = document.querySelector('.mobile');
const logoutBtn = document.querySelector('#logout');



function LogoutAPI() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + window.localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return requestOptions;
};


logoutBtn.addEventListener('click', function () {
    fetch("SOME URL", LogoutAPI())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(result => {
            window.localStorage.removeItem('token');
            console.log(result);
            window.location.href = "../../index.html";
        })
        .catch(error => console.log('error', error));

})







