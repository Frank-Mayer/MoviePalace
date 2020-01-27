var hash = "";
var list = "";
var lib;
var newRow = true;
var letter = "";
var justFav = false;
// var speed = Number(getUrlParam('speed','500'));
const queryString = window.location.search;
console.log(queryString);
new URLSearchParams(queryString);
console.log(urlParams.get('speed'));

function CreateList() {
    document.getElementById("list-view").innerHTML = "";
    list = "";
    newRow = true;
    letter = "";
    justFav = document.getElementById('favSwitch').checked;
    lib.forEach(element => fillList(element));
    if ( list.split("<div").length > list.split("</div>").length ) {
        list += '</div>';
    }
    
    document.getElementById("list-view").innerHTML = list;
    
    if (listMode) {
        listView();
    }
    else {
        gridView();
    }
}

function fillList(item) {
    var make = (item.fav == true || justFav == false);
    if (make == true) {
        var title = item["title"];
        if (letter != title[0]) {
            letter = title[0];
            addLetter(letter);
        }
        addToList(item);
    }
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }



function addToList (e) {
    if (newRow) {
        list += '<div class="row">';
    }
    list += '<div class="column" onClick="detailView(\''+escapeHtml(JSON.stringify(e))+'\')">';
    list += '<table width="100%" height="100%">';
    list += '<tr>';
    list += '<td>';
    list += '<img src="'+e.cover+'" class="cover">';
    list += '</td>';
    list += '<td>';
    list += '<b>'+e.title+'</b><br>';
    list += '<nobr>Some text..</nobr>';
    list += '</td>';
    list += '</table>';
    list += '</div>';
    if (!newRow) {
        list +='</div>';
    }
    newRow = (!newRow);
}

function addLetter (e) {
    if (!newRow) {
        list +='</div>';
        newRow = true;
    }
    list += '<div class="letter" style="background-color: var(--main); text-align: center;">';
    list += '<p style="color: var(--accent)">'+e+'</p>';
    list += '</div>';
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function send (str) {
    if(history.pushState) {
        history.pushState(null, null, '#'+str);
    }
    else {
        location.hash = '#'+str;
    }

    setTimeout(function() {
        if(history.pushState) {
            history.pushState(null, null, '#null');
        }
        else {
            location.hash = '#null';
        }
        }, speed);
}

/***********************************************************************************/

if (window.location.hash.length > 0) {
    hash = window.location.hash;
    if (hash.indexOf('#') == 0) {
        hash = decodeURI(hash.substr(1));
    }
    hash = '[{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229201971ktz31RKHL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647158066","title":"Hangover 2","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229201951cqDiFHd7L._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647185811","title":"Hangover","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292020image.jpeg.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647216724","title":"Plötzlich Prinzessin ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202020451248.jpg-c_215_290_x-f_jpg-q_x-xxyxx.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647255015","title":"Beautiful creatures ","status":"0"},{"cover":"http://is4.mzstatic.com/image/thumb/Video69/v4/4d/72/54/4d725404-25a9-a325-ad7e-279b916b6e54/source/1200x630bb.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"true","id":"1577647290342","title":"Nachts im Museum","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292025Aquaman_deutsches_Kinoposter_2.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577647546910","title":"Aquaman","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202681yas-rNNOL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577647579351","title":"Baymax","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292026510UhtwhEjL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647619480","title":"Camp Rock","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292028910QaFueqoL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577647738750","title":"Charlie und die Schokoladenfabrik ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229203220272546.jpg-c_215_290_x-f_jpg-q_x-xxyxx.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647958217","title":"Das Schwergewicht","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229203351dL5SVWwiL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577648012256","title":"Die Schlümpfe","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292037die-tribute-von-panem-mockingjay-teil-1-und-2-148802859.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577648277097","title":"Die Tribute von Panem 3 - Mockingjay Teil 1+2","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229203871WJmPbCniL._RI_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577648374066","title":"Die Twilight saga 4 - Biss zum Ende der Nacht Teil 1","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/2019122920500136386.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577649093984","title":"Drei Schritte zu dir","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292021MV5BNzI3NjYwNzE2OF5BMl5BanBnXkFtZTgwMzAzOTE0NTE@._V1_UY1200_CR108,0,630,1200_AL_.jpg","date":"29.12.2019","watchcount":"0","alpha":"false","typ":"1","fav":"false","id":"1577647349861","title":"Abschuss Fahrt ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202228973471z.jpg","date":"29.12.2019","watchcount":"0","alpha":"false","typ":"1","fav":"false","id":"1577647392622","title":"Alice im Wunderland ","status":"0"}]';
    hash = hash.replace('"true"', 'true');
    hash = hash.replace('"false"', 'false');
    
    lib = JSON.parse(hash);
    lib.sort((a,b) => {
        if(a["title"] > b["title"]) return 1;
        if(a["title"] < b["title"]) return -1;
        return 0;
    });

    CreateList();

    send("msg:finished loading");
}
