var hash = window.location.hash;
var list = "";
var lib;
var newRow = true;

function addToList (e) {
    if (newRow) {
        list = list+'<div class="row">';
    }
    list = list+'<div class="column" style="background-color:#aaa;">';
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

if (hash.indexOf('#')==0) {
    hash = decodeURI(hash.substr(1));
    lib = JSON.parse(hash);
    for(var i = 0; i < lib.length; i++) {
        addToList(lib[i]);
    }
    if ( list.split("<div").length > list.split("</div>").length ) {
        list = list+'</div>';
    }
    document.getElementById("list-view").innerHTML = list;
}
else {
}

listView();

//history.pushState("", document.title, window.location.pathname + window.location.search);

function update () {
    window.location.hash = encodeURI(JSON.stringify(lib));
}
