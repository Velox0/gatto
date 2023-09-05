const API_URL = `https://api.thecatapi.com/v1/`;
const API_KEY =
  "live_aEzS71mWErDPX7WUMh46dXQbNqfKbghLM4t3gFVyVM4ehXGIzWDVNe0r4sKgyJmM";
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

// CAT API

function preload() {
  fetch(url2, {
    headers: {
      "x-api-key": API_KEY,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // customlog(data);
      for (i = 0; i < data.length; i++) {
        prefetchdata.push(data[i].url);
        document.getElementById("preloader").innerHTML +=
          '<img min-width="100px" min-height="100px" width="100px" src="' +
          data[i].url +
          '"/>';
      }
    })
    .catch((err) => {
      console.log("oppsie!");
      if (re < 5) {
        setTimeout(preload, 1000);
        re++;
      } else {
        console.log("You seem to be offline");
      }
    });
}

function getimage() {
  fetch(url, {
    headers: {
      "x-api-key": API_KEY,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((newgatto) => {
      // customlog(data);
      newgatto = newgatto[0].url;
      document.getElementById("catbox").innerHTML +=
        '<div class="gattospace">' +
        '<img draggable="false" (dragstart)="false;" class="gatto" alt="gatto" src="' +
        newgatto +
        '"/></div>';
      initializecat(numberofcats);
      numberofcats++;
    })
    .catch((err) => console.log("oppsie!\nan image didnt load"));
}

window.onload = function () {
  document
    .getElementById("loadbutton")
    .addEventListener("mouseenter", buttonbg);
  document
    .getElementById("loadbutton")
    .addEventListener("touchstart", buttonbg);
  preload();
  setLimit();
};

// RESPONSIVE JS

window.onresize = function () {
  setLimit();
  reposition();
  // customlog(maxX + ',' + maxY)
};

function setLimit() {
  maxX =
    parseInt(document.getElementById("catbox").getBoundingClientRect().width) -
    270;
  maxY =
    parseInt(document.getElementById("catbox").getBoundingClientRect().height) -
    250;
}

function reposition() {
  for (tempnum = 0; tempnum < numberofcats; tempnum++) {
    boxwidth = document.getElementById("catbox").getBoundingClientRect().width;
    boxheight = document
      .getElementById("catbox")
      .getBoundingClientRect().height;
    currentx = document.getElementsByClassName("gattospace")[tempnum].dataset.x;
    currenty = document.getElementsByClassName("gattospace")[tempnum].dataset.y;
    document.getElementsByClassName("gattospace")[tempnum].style.transform =
      "translate(" +
      Math.min(boxwidth * currentx, maxX) +
      "px, " +
      Math.min(boxheight * currenty, maxY) +
      "px)";
  }
}

// BUTTON BACKGROUND CYCLE

var backgroundIndex = 0;

function buttonbg() {
  if (prefetchdata.length > 0) {
    bgi = "url('" + prefetchdata[backgroundIndex % 10] + "')";
    const mybutton = document.getElementById("loadbutton");
    mybutton.style.backgroundImage = bgi;
    mybutton.style.backgroundSize = "cover";
    mybutton.style.backgroundPosition = "center";
    backgroundIndex = (backgroundIndex + 1) % 10;
    // customlog(bgi);
  }
}

function initializecat() {
  gattospace = document.getElementsByClassName("gattospace")[numberofcats];

  randomX = Math.random() * (maxX - minX) + minX;
  randomY = Math.random() * (maxY - minY) + minY;

  relativeX =
    randomX / document.getElementById("catbox").getBoundingClientRect().width;
  relativeY =
    randomY / document.getElementById("catbox").getBoundingClientRect().height;

  gattospace.style.transform =
    "translate(" + randomX + "px, " + randomY + "px)";

  gattospace.dataset.x = relativeX;
  gattospace.dataset.y = relativeY;

  for (index = 0; index <= numberofcats; index++) {
    document
      .getElementsByClassName("gattospace")
      [index].addEventListener("mousedown", trackcat);
    document
      .getElementsByClassName("gattospace")
      [index].addEventListener("mouseup", donttrackcat);
    document
      .getElementsByClassName("gattospace")
      [index].addEventListener("touchstart", trackcat);
    document
      .getElementsByClassName("gattospace")
      [index].addEventListener("touchend", donttrackcat);
  }
}

// INTERACTION

var trackfromX = 0;
var trackfromY = 0;
var deltaX = 0;
var deltaY = 0;
var newX = 0;
var newY = 0;

function trackcat(e) {
  this.style.transition = "0s";
  this.style.zIndex = 3;

  if (e.type == "mousedown") {
    console.log(e);
    trackfromX = e.clientX;
    trackfromY = e.clientY;

    this.addEventListener("mousemove", moveitmoveit);
  } else {
    document.getElementById("envelope").style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";
    trackfromX = e.touches[0].clientX;
    trackfromY = e.touches[0].clientY;

    this.addEventListener("touchmove", moveitmoveit);
  }
}

function moveitmoveit(e) {
  if (e.type == "mousemove") {
    deltaX = e.clientX - trackfromX;
    deltaY = e.clientY - trackfromY;
  } else {
    deltaX = e.touches[0].clientX - trackfromX;
    deltaY = e.touches[0].clientY - trackfromY;
  }
  newX =
    parseFloat(this.dataset.x) *
      parseInt(
        document.getElementById("catbox").getBoundingClientRect().width
      ) +
    deltaX;
  newY =
    parseFloat(this.dataset.y) *
      parseInt(
        document.getElementById("catbox").getBoundingClientRect().height
      ) +
    deltaY;

  this.style.transform = "translate(" + newX + "px, " + newY + "px)";
}

function donttrackcat(e) {
  if (e.type == "touchend") {
    document.getElementById("envelope").style.overflowY = "visible";
    document.body.style.overflowY = "visible";
  }
  newX =
    parseFloat(this.dataset.x) *
      parseInt(
        document.getElementById("catbox").getBoundingClientRect().width
      ) +
    deltaX;
  newX = Math.min(newX, maxX);
  newX = Math.max(newX, minX);

  newY =
    parseFloat(this.dataset.y) *
      parseInt(
        document.getElementById("catbox").getBoundingClientRect().height
      ) +
    deltaY;
  newY = Math.min(newY, maxY);
  newY = Math.max(newY, minY);

  this.style.transition = ".2s ease-out";
  this.style.transform = "translate(" + newX + "px, " + newY + "px)";

  this.removeEventListener("mousemove", moveitmoveit);

  this.dataset.x =
    newX / document.getElementById("catbox").getBoundingClientRect().width;
  this.dataset.y =
    newY / document.getElementById("catbox").getBoundingClientRect().height;
  this.style.zIndex = 1;

  deltaX = 0;
  deltaY = 0;
  newX = 0;
  newY = 0;
}

// MISC

function limiter() {
  getimage = function () {};
}

function customlog(txt) {
  document.getElementById("customlog").innerHTML = txt;
}
