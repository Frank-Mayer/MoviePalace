var googleApi = {
    key: 'AIzaSyB6gBuLxAoLPlX969OOVedPD567vA25SDk',
    cx: '010303739914940808961:mavrshfxmwd',
    url: 'https://www.googleapis.com/customsearch/v1?',
    altUrl: 'https://www.googleapis.com/customsearch/v1/siterestrict?',
    query(q) {
        var _url = (this.altUrl+'key='+this.key+'&cx='+this.cx+'&q='+encodeURI(q)+'&num=1&searchType=image');
        // console.log(_url);
        return (_url);
    }
}

RandomApiKey();

function RandomApiKey() {
    if (Math.random() >= 0.5) {
        googleApi.key = 'AIzaSyAESoLTiR2RvR8RqGAjSYm1v-_XPfUK0wQ';
    }
    else if (Math.random() >= 0.5) {
        googleApi.key = 'AIzaSyA3cusDzE84DTiZ9UMLN00unuNhP5DEXpg';
    }
    else if (Math.random() >= 0.5) {
        googleApi.key = 'AIzaSyCK5fpVyJ63Xc8wt199vFj3IcAbmWlocBc';
    }
    else if (Math.random() >= 0.5) {
        googleApi.key = 'AIzaSyB6gBuLxAoLPlX969OOVedPD567vA25SDk';
    }
}

function request (uri) {
    var request = new XMLHttpRequest();

    request.open('GET', uri, true);
    request.onload = function() {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 300) {
            return (data);
        } else {
            return (null);
        }
    }
    request.send();
}