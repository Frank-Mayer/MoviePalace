var urlParams = new URLSearchParams(window.location.search);
var obj = urlParams.get('obj');
var titleEl = document.getElementById("title");
var coverEl = document.getElementById("cover");
var backgroundEl = document.getElementById("background");
var buyEl = document.getElementById("buy");

var decrypted = JSON.parse(atob(obj));
var title = decrypted.title;
titleEl.innerHTML = title;
buyEl.href = "https://www.amazon.de/s?k="+encodeURI(title)+"&i=dvd&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss"
coverEl.src = decrypted.coverHR;
backgroundEl.src = decrypted.cover;
