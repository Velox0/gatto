const API_URL = `https://api.thecatapi.com/v1/`;
const API_KEY = "live_aEzS71mWErDPX7WUMh46dXQbNqfKbghLM4t3gFVyVM4ehXGIzWDVNe0r4sKgyJmM";
const url = `${API_URL}images/search`;

numberofcats = 0;
const prefetchcats = 10;

const prefetchdata = [];
url2 = url + "?limit=" + prefetchcats;

var re = 0;
var maxX;
var minX = 10;
var minY = 10;
var maxY;

function preload() {
    fetch(url2, {
        headers: {
            'x-api-key': API_KEY
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // customlog(data);
            for (i = 0; i < data.length; i++) {
                prefetchdata.push(data[i].url);
                document.getElementById('preloader').innerHTML += '<img min-width="100px" min-height="100px" width="100px" src="' + data[i].url + '"/>';
            }
        })
        .catch(err => {
            console.log('oppsie!');
            if (re < 5) {
                setTimeout(preload, 1000);
                re++;
            }
            else {
                console.log('You seem to be offline');
            }
        });
}

var i = 0;

window.onload = function () {
    document.getElementById("loadbutton").addEventListener("mouseenter", buttonbg);
    preload();
    setLimit();
}

function setLimit() {
    maxX = parseInt(document.getElementById('catbox').getBoundingClientRect().width) - 270;
    maxY = parseInt(document.getElementById('catbox').getBoundingClientRect().height) - 250;
}

function resetposition() {
    for (tempnum = 0; tempnum < numberofcats; tempnum++) {
        boxwidth = document.getElementById('catbox').getBoundingClientRect().width;
        boxheight = document.getElementById('catbox').getBoundingClientRect().height;
        currentx = document.getElementsByClassName('gattospace')[tempnum].dataset.x;
        currenty = document.getElementsByClassName('gattospace')[tempnum].dataset.y;
        document.getElementsByClassName('gattospace')[tempnum].style.transform = "translate("
            + Math.min((boxwidth * currentx), maxX) + "px, "
            + Math.min((boxheight * currenty), maxY) + "px)";
    }
}

window.onresize = function () {
    setLimit();
    resetposition();
    // customlog(maxX + ',' + maxY)
}

function buttonbg() {
    if (prefetchdata.length > 0) {
        bgi = "url('" + prefetchdata[i % 10] + "')"
        const mybutton = document.getElementById("loadbutton");
        mybutton.style.backgroundImage = bgi;
        mybutton.style.backgroundSize = "cover";
        mybutton.style.backgroundPosition = "center";
        i = (i + 1) % 10;
        // customlog(bgi);
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
        .then((newgatto) => {
            // customlog(data);
            newgatto = newgatto[0].url;
            document.getElementById("catbox").innerHTML
                += '<div class="gattospace">'
                + '<img draggable="false" (dragstart)="false;" class="gatto" alt="gatto" src="'
                + newgatto
                + '"/></div>';
            initializecat(numberofcats);
            numberofcats++;
        })
        .catch(err => console.log('oppsie!\nan image didnt load'));
}

function initializecat() {
    gattospace = document.getElementsByClassName("gattospace")[numberofcats];

    randomX = Math.random() * .6 + .1;
    randomY = Math.random() * .6 + .1;

    actualX = document.getElementById('catbox').getBoundingClientRect().width * (randomX);
    actualY = document.getElementById('catbox').getBoundingClientRect().height * (randomY);

    gattospace.style.transform = "translate(" + actualX + "px, " + actualY + "px)";

    gattospace.dataset.x = randomX;
    gattospace.dataset.y = randomY;

    for (index = 0; index <= numberofcats; index++) {
        document.getElementsByClassName("gattospace")[index].addEventListener('mousedown', trackcat);
        document.getElementsByClassName("gattospace")[index].addEventListener('mouseup', donttrackcat);
        document.getElementsByClassName("gattospace")[index].addEventListener('mouseout', donttrackcat);
    }
}

var tracking;
var trackfromX = 0;
var trackfromY = 0;
var deltaX = 0;
var deltaY = 0;
var newX = 0;
var newY = 0;

function trackcat(e) {
    trackfromX = e.clientX;
    trackfromY = e.clientY;
    tracking = this;
    this.style.zIndex = 3;

    this.addEventListener("mousemove", moveitmoveit);
}

function moveitmoveit(e) {
    deltaX = e.clientX - trackfromX;
    deltaY = e.clientY - trackfromY;
    newX = (parseFloat(this.dataset.x) * parseInt(document.getElementById('catbox').getBoundingClientRect().width)) + deltaX;
    newX = Math.min(newX, maxX);
    newX = Math.max(newX, minX);

    newY = (parseFloat(this.dataset.y) * parseInt(document.getElementById('catbox').getBoundingClientRect().height)) + deltaY;
    newY = Math.min(newY, maxY);
    newY = Math.max(newY, minY);

    this.style.transform = 'translate(' + newX + 'px, ' + newY + 'px)';

    // customlog(
    //     this.dataset.x + ', ' + this.dataset.y + ', ' +
    //     document.getElementById('catbox').getBoundingClientRect().width + ', ' + document.getElementById('catbox').getBoundingClientRect().height + ', ' +
    //     deltaX + ', ' + deltaY + ', '
    //     +
    //     newX + ", " + newY
    // );

}

function donttrackcat() {
    tracking.removeEventListener("mousemove", moveitmoveit);
    this.dataset.x = newX / document.getElementById('catbox').getBoundingClientRect().width;
    this.dataset.y = newY / document.getElementById('catbox').getBoundingClientRect().height;
    this.style.zIndex = 1;
}

function limiter() {
    getimage = function () { };
}

function customlog(txt) {
    document.getElementById('customlog').innerHTML = txt;
}