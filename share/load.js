var urlParams = new URLSearchParams(window.location.search);
var obj = urlParams.get('obj').replace("+","%2B");
var titleEl = document.getElementById("title");
var coverEl = document.getElementById("cover");
var backgroundEl = document.getElementById("background");
var buyEl = document.getElementById("buy");

obj = decodeURI(obj).replace("%2B", "+").replace(" ", "+");
console.log(obj);
var decrypted = CryptoJS.AES.decrypt(obj, "Secret Passphrase");
var title = (decrypted.toString(CryptoJS.enc.Utf8))
console.log(title)
titleEl.innerHTML = title;
buyEl.href = "https://www.amazon.de/s?k="+encodeURI(title)+"&i=dvd&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss"

try {
    var request = new XMLHttpRequest();
    request.open('GET', googleApi.query(title+" Movie Cover"), true);
    request.onload = function () {
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 300) {
            ret = (data.items[0].image.thumbnailLink);
            coverEl.src = ret;
            backgroundEl.src = ret;
        }
        else {
            RandomApiKey();
            console.error(data);
        }
    }
    request.send();
}
catch (e) {
    console.error(e);
}
