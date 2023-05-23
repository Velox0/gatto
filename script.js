const API_URL = `https://api.thecatapi.com/v1/`;
const API_KEY = "live_aEzS71mWErDPX7WUMh46dXQbNqfKbghLM4t3gFVyVM4ehXGIzWDVNe0r4sKgyJmM";
const url = `${API_URL}images/search`;

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
        console.log(data)
        for (i = 0; i < data.length; i++) {
            prefetchdata.push(data[i].url);
            document.getElementById('preloader').innerHTML += '<img src="' + data[i].url + '"/>';
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
        console.log(bgi);
    }
}

function getimage() {

    fetch(url, {
        headers: {
            'x-api-key': API_KEY
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            currentImageToVoteOn = data[0];
            document.getElementById("catbox").innerHTML += '<img id="cat" class="gatto" alt="gatto" src="' + currentImageToVoteOn.url + '"/>'
        });
}
