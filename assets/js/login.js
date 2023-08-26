const mobileInput = document.querySelector('#mobile');
const passwordInput = document.querySelector('#password');
const reCaptcha = document.querySelector('.bx-refresh');
const captchaInput = document.querySelector('#captchaInput');
const captchaImg = document.querySelector('.captcha-image');
const captchaReal = document.querySelector('.captcha-real');
const alert2 = document.querySelector('.alert2');
const sendCode = document.querySelector('.send-code');
const tooltip = document.querySelector('.tooltip');
const boding = document.querySelector('.boding');
const overlay2 = document.querySelector('.overlay2');
const OTP = document.querySelector('.otp');
const closeBtn = document.querySelector('.bx-x');
const correctNum = document.querySelector('.correct');
const verifyBtn = document.querySelector('.verify');
const numbers = document.querySelector('.numbers');
const lds = document.querySelector('.lds-dual-ring');
const allNumInputs = document.querySelector('.all input');


let isMobile = false;
let isPass = false;
let isCaptcha = false;

let pattern = /^0\d{10}$/;
let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;


const urlCaptcha = 'SOME URL';

let options = {
    Method: "GET"
};


function clearLocal() {
    localStorage.clear();
};


async function fetchCaptchaApi(url, options) {
    let response = await fetch(url, options);
    let answer = await response.json();
    const {
        response: {
            extra: {
                captcha_id,
                image,
            }
        }
    } = answer;


    window.localStorage.setItem('captcha-id', answer.response.extra.captcha_id);

    let base64img = `data:image/png;base64,${answer.response.extra.image}`;

    function Base64ToImage(base64img, callback) {
        var img = new Image();
        img.onload = function () {
            callback(img);
        };

        img.src = base64img;
    }


    Base64ToImage(base64img, function (img) {
        captchaInput.appendChild(img);
    });

}

function slicing(input, x, y) {
    input.value = input.value.slice(x, y);
};


fetchCaptchaApi(urlCaptcha, options);



captchaReal.addEventListener('input', function (e) {
    window.localStorage.setItem('captcha-digits', captchaReal.value);
    if (captchaReal.value.length > 4) {
        slicing(captchaReal, 0, 4);
        isCaptcha = true;
        alert2.innerHTML = `Your captcha is 4 numbers. You can type more!`;

    } else if (captchaReal.value.length == 4) {
        isCaptcha = true;
    }
    else {
        isCaptcha = false;
    };
});



reCaptcha.addEventListener('click', function () {
    captchaInput.innerHTML = '';
    captchaReal.value = ''
    fetchDataApi(urlCaptcha, options);
});


mobileInput.addEventListener('click', function () {
    tooltip.classList.remove('active');
});


mobileInput.addEventListener('input', function () {
    window.localStorage.setItem('mobile-number', mobileInput.value);
    if (mobileInput.value.trim() && pattern.test(mobileInput.value)) {

        let valueInput = mobileInput.value.trim();

        const replace = valueInput.slice(4, 7);
        const modifiedSubstring = replace.replace(/./g, '*');
        const result = valueInput.slice(0, 4) + modifiedSubstring + valueInput.slice(7 + 1);

        numbers.innerHTML = `
        We’ve send a code to ${result}.
        `;

    }
    if (!pattern.test(mobileInput.value)) {
        alert.innerHTML = 'Please eneter valide number.';
    }
    if (mobileInput.value.length > 11) {
        alert.innerHTML = 'Your mobile number should be 11 numbers.';
    }
    if (mobileInput.value.length) {
        isPut = true;
    } else {
        isPut = false;
    }
});


passwordInput.addEventListener('input', function () {
    window.localStorage.setItem('password', this.value);
    if (regex.test(passwordInput.value)) {
        isPass = true;
    } else {
        isPass = false;
    }
});


function setupLoginAPI() {
    var myHeaders = new Headers();
    myHeaders.append("captcha-id", window.localStorage.getItem('captcha-id'));
    myHeaders.append("captcha-digits", window.localStorage.getItem('captcha-digits'));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "user_type": "login_mobile",
        "user_identifier": `${window.localStorage.getItem('mobile-number')}`,
        "password": `${window.localStorage.getItem('password')}`
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return requestOptions;
};


sendCode.addEventListener('click', function (e) {
    if (isMobile && isPass && isCaptcha) {
        fetch("SOME URL", setupLoginAPI())
            .then(response => response.json())
            .then(result => {
                window.localStorage.setItem('temp-code', result.response.extra.temp_code);
                console.log(result)
            })
            .catch(error => console.log('error', error));
        overlay2.classList.add('active');
        boding.classList.add('unactive');
        lds.classList.add('active');

        setTimeout(() => {
            OTP.classList.add('active');
            lds.classList.remove('active')
        }, 1000)

        const timerBox = document.querySelector('.timerBox');

        var countDownDate = new Date().getTime() + 122000;
        const countDownFinal = setInterval(function () {
            let countdown = 60;
            let now = new Date().getTime();
            let distance = countDownDate - now;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timerBox.innerHTML = minutes + ":" + seconds;

            if (minutes == 0) {
                timerBox.style.background = '#df1818'
            }

            if (seconds < 10) {
                timerBox.innerHTML = minutes + ':0' + seconds;
            }

            if (distance < 0) {
                timerBox.innerHTML = "0:00";
                clearInterval(countDownFinal);
                countdown = 60;
            }
        }, 1000);

    } else if (!isMobile && isPass && isCaptcha) {
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>your mobile number should have exact 11 characters.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    }
    else if (isMobile && !isPass && isCaptcha) {
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>your password should have exact 4 characters.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    }
    else if (isMobile && isPass && !isCaptcha) {
        alert2.innerHTML = `<p>Enter your captcha!</p>`;
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>your captcha should have exact 4 characters.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    }

    else {
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>You should fill all of the inputs.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    }

});





allNumInputs.addEventListener('input', function () {
    window.localStorage.setItem('verify-code', this.value);
});


function setupVerifyLoginAPI() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "code_type": "login_sms",
        "user_identifier": `${window.localStorage.getItem('mobile-number')}`,
        "temp_code": `${window.localStorage.getItem('temp-code')}`,
        "verify_code": `${window.localStorage.getItem('verify-code')}`

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return requestOptions;
};


verifyBtn.addEventListener('click', function () {
    fetch("SOME URL", setupVerifyLoginAPI())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(result => {
            window.localStorage.setItem('token', result.response.extra.token);
            console.log(result);
            window.location.href = "../../index.html";
        })
        .catch(error => console.log('error', error));


    console.log(window.localStorage.getItem('token'));

    localStorage.removeItem("captcha-id");
    localStorage.removeItem("mobile-number");
    localStorage.removeItem("password");
    localStorage.removeItem("captcha-digits");
    localStorage.removeItem("temp-code");
    localStorage.removeItem("verify-code");

})