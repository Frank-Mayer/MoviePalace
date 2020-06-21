var googleApi = {
    key: 'AIzaSyCv_kCFsLFw_kFmM1i_zMPx3wpJpkTZghE',
    cx: '010303739914940808961:mavrshfxmwd',
    url: 'https://www.googleapis.com/customsearch/v1?',
    altUrl: 'https://www.googleapis.com/customsearch/v1/siterestrict?',
    query(q) {
        var _url = (this.altUrl+'key='+this.key+'&cx='+this.cx+'&q='+encodeURI(q)+'&num=5&searchType=image');
        console.log(_url);
        return (_url);
    }
}

function RandomApiKey() {
    let i = Math.floor(Math.random()*4);
    switch (i) {
        case 0:
            googleApi.key = 'AIzaSyCv_kCFsLFw_kFmM1i_zMPx3wpJpkTZghE';
            break;
        case 1:
            googleApi.key = 'AIzaSyAESoLTiR2RvR8RqGAjSYm1v-_XPfUK0wQ';
            break;
        case 2:
            googleApi.key = 'AIzaSyA3cusDzE84DTiZ9UMLN00unuNhP5DEXpg';
            break;
        case 3:
            googleApi.key = 'AIzaSyCK5fpVyJ63Xc8wt199vFj3IcAbmWlocBc';
            break;
        case 4:
            googleApi.key = 'AIzaSyB6gBuLxAoLPlX969OOVedPD567vA25SDk';
            break;
    }
} RandomApiKey();

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
