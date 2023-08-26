const sendCodeBtn = document.querySelector('#send');
const mobileInput = document.querySelector('#mobile');
const numbers = document.querySelector('.numbers');
const captchaInput = document.querySelector('#captchaInput');
const captchaImg = document.querySelector('.captcha-image');
const captchaReal = document.querySelector('.captcha-real');
const littleBox = document.querySelector('.little-box');
const checkBox = document.querySelector('.bx-check');
const boding = document.querySelector('.boding');
const overlay2 = document.querySelector('.overlay2');
const OTP = document.querySelector('.otp');
const closeBtn = document.querySelector('.bx-x');
const correctNum = document.querySelector('.correct');
const verifyBtn = document.querySelector('.verify');
const finallStep = document.querySelector('.finall-step');
const timerBox = document.querySelector('.timerBox');
const alert = document.querySelector('.alert');
const tooltip = document.querySelector('.tooltip');
const sendAgain = document.querySelector('.send-again a');
const reCaptcha = document.querySelector('.bx-refresh');
const alert2 = document.querySelector('.alert2');
const lds = document.querySelector('.lds-dual-ring');
const nums = document.querySelector('.all input');
const verify = document.querySelector('.verify');
const finall_step = document.querySelector('.finall-step');
const Pass = document.querySelector('#password');
const confirmPass = document.querySelector('#confirm');
const signin = document.querySelector('.signin');
const signinTagA = document.querySelector('.signin a');
const confirmation = document.querySelector('.confirmation')

let matches = [];
let confirmMatch = [];
let isPass = false;


let isPut = false;
let isCaptcha = false;
let isChecked = false;
let isConfirm = false;


const pattern = /^0\d{10}$/;
let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;



const urlCaptcha = 'SOME URL';

const options = {
    method: "GET",
};

function slicing(input, x, y) {
    input.value = input.value.slice(x, y);
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

fetchCaptchaApi(urlCaptcha, options);

reCaptcha.addEventListener('click', function () {
    captchaInput.innerHTML = '';
    fetchCaptchaApi(urlCaptcha, options);
});


captchaReal.addEventListener('input', function (e) {
    window.localStorage.setItem('captcha-digits', captchaReal.value);
    if (captchaReal.value.length > 4) {
        slicing(captchaReal, 0, 4);
        isCaptcha = true;
        alert2.innerHTML = `Your captcha is 4 numbers. You can not type more!`;

    } else if (captchaReal.value.length == 4) {
        isCaptcha = true;
    }
    else {
        isCaptcha = false;
    };
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
        const result = valueInput.slice(0, 4) + modifiedSubstring + valueInput.slice(7);

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

littleBox.addEventListener('click', function () {
    checkBox.classList.toggle('active');
    tooltip.classList.remove('active');
    if (checkBox.classList.contains('active')) {
        isChecked = true;
    } else {
        isChecked = false;
    };
});



/**
 * this API for Signup first step:
 * @returns requestOptions
 */
function setupSignupApi1() {
    var myHeaders = new Headers();
    myHeaders.append("captcha-id", window.localStorage.getItem('captcha-id'));
    myHeaders.append("captcha-digits", window.localStorage.getItem('captcha-digits'));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "user_type": "signup_mobile",
        "user_identifier": `${window.localStorage.getItem('mobile-number')}`
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return requestOptions;
};



sendCodeBtn.addEventListener('click', function (e) {
    if (isPut && isCaptcha && isChecked) {
        fetch("SOME URL", setupSignupApi1())
            .then(response => response.json())
            .then(result => {
                window.localStorage.setItem('temp-code', result.response.extra.temp_code);
                console.log(result)
            })
            .catch(error => console.log('error', error));
        lds.classList.add('active');
        overlay2.classList.add('active');
        boding.classList.add('unactive');
        setTimeout(() => {
            lds.classList.remove('active')
            OTP.classList.add('active');
            countDownFinall;
        }, 1000);

        var countDownDate = new Date().getTime() + 120000;

        const countDownFinall = setInterval(function () {
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
            }
        }, 1000);
    } else if (!isPut && isChecked && isCaptcha) {
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>your mobile number should have exact 11 characters.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    } else if (isPut && !isChecked && isCaptcha) {
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>your password should have exact 4 characters.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    } else if (isPut && isChecked && !isCaptcha) {
        alert2.innerHTML = `<p>Enter your captcha!</p>`;
        e.stopPropagation();
        tooltip.classList.add('active');
        tooltip.innerHTML = `<p>your captcha should have exact 4 characters.</p>`;
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    } else {
        e.stopPropagation();
        tooltip.classList.add('active');
        setTimeout(() => {
            tooltip.classList.remove('active');
        }, 5000);
    }

});



closeBtn.addEventListener('click', function () {
    boding.classList.remove('unactive');
    overlay2.classList.remove('active');
    OTP.classList.remove('active');
});

correctNum.addEventListener('click', function () {
    boding.classList.remove('unactive');
    overlay2.classList.remove('active');
    OTP.classList.remove('active');
});



nums.addEventListener('input', function () {
    window.localStorage.setItem('verify-code', nums.value);
});


/**
 * this is for signup step 2
 * @returns requestOptions
 */
function setupVerifySignupApi2() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "code_type": "signup_sms",
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


verify.addEventListener('click', function () {
    fetch("SOME URL", setupVerifySignupApi2())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(result => {
            window.localStorage.setItem('temp-token', result.response.extra.temp_token);
            console.log(result);
        })
        .catch(error => console.log('error', error));
    console.log(window.localStorage.getItem('mobile-number'));
    console.log(window.localStorage.getItem('temp-code'));
    console.log(window.localStorage.getItem('verify-code'));
    OTP.classList.remove('active');
    boding.classList.add('hide');
    finall_step.classList.add('active');
})

Pass.addEventListener('input', function () {
    window.localStorage.setItem('password', Pass.value);
    if (regex.test(Pass)) {
        isPass = true;
    } else {
        isPass = false;
    }
});

confirmPass.addEventListener('input', function () {
    window.localStorage.setItem('confirm-password', confirmPass.value);
    if (confirmPass == window.localStorage.getItem('password')) {
        isConfirm = true;
    } else {
        isConfirm = false;
    }
});


/**
 * this is for signup step 4 
 * @returns 
 */
function SetSignupPasswordApi3() {
    var myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer " + window.localStorage.getItem('temp-token'));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "password": `${window.localStorage.getItem('password')}`,
        "confirm_password": `${window.localStorage.getItem('confirm-password')}`,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return requestOptions;
};


signin.addEventListener('click', function (e) {
    if (isPass && isConfirm) {
        fetch("SOME URL", SetSignupPasswordApi3())
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

        localStorage.removeItem("captcha-id");
        localStorage.removeItem("mobile-number");
        localStorage.removeItem("password");
        localStorage.removeItem("captcha-digits");
        localStorage.removeItem("temp-code");
        localStorage.removeItem("verify-code");
    } else {
        console.log('something went wrong!');
    }


});



window.addEventListener('keydown', function (e) {
    if (!mobileInput.value && e.key == 'Enter') {
        numbers.innerHTML = '';
    }
})


sendAgain.addEventListener('click', function () {
    console.log('click')
})

