const API_URL = `https://api.thecatapi.com/v1/`;
const API_KEY = "live_aEzS71mWErDPX7WUMh46dXQbNqfKbghLM4t3gFVyVM4ehXGIzWDVNe0r4sKgyJmM";
const url = `${API_URL}images/search`;

numberofcats = 0;

const prefetchdata = [];
url2 = url + "?limit=10";

fetch(url2, {
    headers: {
        'x-api-key': API_KEY
    }
})
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // console.log(data);
        for (i = 0; i < data.length; i++) {
            prefetchdata.push(data[i].url);
            document.getElementById('preloader').innerHTML += '<img min-width="100px" min-height="100px" width="100px" src="' + data[i].url + '"/>';
        }
    });

var i = 0;

window.onload = function () {
    document.getElementById("loadbutton").addEventListener("mouseenter", buttonbg);
}


function buttonbg() {
    if (prefetchdata.length > 0) {
        bgi = "url('" + prefetchdata[i % 10] + "')"
        const mybutton = document.getElementById("loadbutton");
        mybutton.style.backgroundImage = bgi;
        mybutton.style.backgroundSize = "cover";
        mybutton.style.backgroundPosition = "center";
        i = (i + 1) % 10;
        // console.log(bgi);
    }
}

function getimage() {
    buttonbg();
    fetch(url, {
        headers: {
            'x-api-key': API_KEY
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            newgatto = data[0];
            document.getElementById("catbox").innerHTML += '<div class="gattospace"><img class="gatto" alt="gatto" src="' + newgatto.url + '"/></div>';
            document.getElementsByClassName("gattospace")[numberofcats].addEventListener('mousedown', catheld(numberofcats));
            numberofcats++;
        });
}

function catheld(i) {
    randomX = document.getElementById('catbox').getBoundingClientRect().width * (Math.random() * .6 + .1);
    randomY = document.getElementById('catbox').getBoundingClientRect().height * (Math.random() * .6 + .1);
    document.getElementsByClassName("gattospace")[i].style.transform = "translateX(" + randomX + "px) translateY(" + randomY + "px)";
}