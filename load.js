var hash = "";
var list = "";
var lib;
var newRow = true;

function addToList (e) {
    if (newRow) {
        list = list+'<div class="row">';
    }
    list = list+'<div class="column">';
    list = list+'<table>';
    list = list+'<tr>';
    list = list+'<td>';
    list = list+'<img src="'+e.cover+'" height="100" width="70">';
    list = list+'</td>';
    list = list+'<td>';
    list = list+'<b>'+e.title+'</b><br>';
    list = list+'<nobr>Some text..</nobr>';
    list = list+'</td>';
    list = list+'</table>';
    list = list+'</div>';
    if (!newRow) {
        list = list+'</div>';
    }
    newRow = (!newRow);
}

/***********************************************************************************/

if (window.location.hash.length > 0) {
    hash = window.location.hash;
    hash = '[{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229201971ktz31RKHL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647158066","title":"Hangover 2","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229201951cqDiFHd7L._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647185811","title":"Hangover","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292020image.jpeg.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647216724","title":"Plötzlich Prinzessin ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202020451248.jpg-c_215_290_x-f_jpg-q_x-xxyxx.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647255015","title":"Beautiful creatures ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202161XVtbw-hDL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647290342","title":"Nachts im Museum","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292025Aquaman_deutsches_Kinoposter_2.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577647546910","title":"Aquaman","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202681yas-rNNOL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577647579351","title":"Baymax","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292026510UhtwhEjL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647619480","title":"Camp Rock","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292028910QaFueqoL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577647738750","title":"Charlie und die Schokoladenfabrik ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229203220272546.jpg-c_215_290_x-f_jpg-q_x-xxyxx.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577647958217","title":"Das Schwergewicht","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229203351dL5SVWwiL._SY445_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577648012256","title":"Die Schlümpfe","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292037die-tribute-von-panem-mockingjay-teil-1-und-2-148802859.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577648277097","title":"Die Tribute von Panem 3 - Mockingjay Teil 1+2","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229203871WJmPbCniL._RI_.jpg","date":"29.12.2019","alpha":"false","typ":"1","fav":"false","id":"1577648374066","title":"Die Twilight saga 4 - Biss zum Ende der Nacht Teil 1","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/2019122920500136386.jpg","date":"29.12.2019","alpha":"false","typ":"0","fav":"false","id":"1577649093984","title":"Drei Schritte zu dir","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/201912292021MV5BNzI3NjYwNzE2OF5BMl5BanBnXkFtZTgwMzAzOTE0NTE@._V1_UY1200_CR108,0,630,1200_AL_.jpg","date":"29.12.2019","watchcount":"0","alpha":"false","typ":"1","fav":"false","id":"1577647349861","title":"Abschuss Fahrt ","status":"0"},{"cover":"file:///storage/emulated/0/Android/data/io.frankmayer.library/files/.covers/20191229202228973471z.jpg","date":"29.12.2019","watchcount":"0","alpha":"false","typ":"1","fav":"false","id":"1577647392622","title":"Alice im Wunderland ","status":"0"}]';
    if (hash.indexOf('#') == 0) {
        hash = decodeURI(hash.substr(1));
    }
    
    lib = JSON.parse(hash);
    for(var i = 0; i < lib.length; i++) {
        addToList(lib[i]);
    }
    
    if ( list.split("<div").length > list.split("</div>").length ) {
        list = list+'</div>';
    }
    
    document.getElementById("list-view").innerHTML = list;
    
    listView();

    if(history.pushState) {
        history.pushState(null, null, '#finished');
    }
    else {
        location.hash = '#finished';
    }
}