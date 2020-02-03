var query = "";

function search (q) {
    query = q;
}

function doBlur () {
    document.getElementById('finder').style.filter = 'blur(2px)';
    document.getElementById('finder').style.WebkitFilter = 'blur(2px)';
    document.getElementById('btnContainer').style.filter = 'blur(2px)';
    document.getElementById('btnContainer').style.WebkitFilter = 'blur(2px)';
    document.getElementById('list-view').style.filter = 'blur(2px)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(2px)';
    document.getElementById('toolbar').style.filter = 'blur(2px)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(2px)';
}

function unblur () {
    document.getElementById('finder').style.filter = 'blur(0)';
    document.getElementById('finder').style.WebkitFilter = 'blur(0)';
    document.getElementById('btnContainer').style.filter = 'blur(0)';
    document.getElementById('btnContainer').style.WebkitFilter = 'blur(0)';
    document.getElementById('list-view').style.filter = 'blur(0)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(0)';
    document.getElementById('toolbar').style.filter = 'blur(0)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(0)';
}

// Get the elements with class="column"
var elements = document.getElementsByClassName("column");
var listMode = (screen.availWidth < 500);
var i = 0;

// List View
function listView() {
    listMode = true;
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "calc(100% - 16px)";
        elements[i].style.marginLeft = "8px";
        elements[i].style.marginRight = "8px";
    }
    document.getElementById("btn_grid").className = "btn active";
    document.getElementById("btn_list").className = "btn";
    document.documentElement.style.setProperty('--typeVis', "visible");
}

// Grid View
function gridView() {
    listMode = false;
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "calc(50% - 12px)";
        elements[i].style.marginLeft = "8px";
        elements[i].style.marginRight = "0px";
    }
    document.getElementById("btn_list").className = "btn active";
    document.getElementById("btn_grid").className = "btn";
    document.documentElement.style.setProperty('--typeVis', "collapse");
}

var details;
function detailsID () {
    return (decodeURI(details.id));
}

function detailView (e) {
    details = JSON.parse(e);
    doBlur();
    document.getElementById('detailCover').src = details.cover;
    document.getElementById('detailTitle').value = decodeURI(details.title);
    if (details.group) { document.getElementById('detailGroup').value = decodeURI(details.group); }
    else { document.getElementById('detailGroup').value = ""; }
    document.getElementById('detailStatus').value = details.status;
    document.getElementById('detailView').style.transform = 'translateX(0)';
}

function saveDetails () {
    details.title = document.getElementById('detailTitle').value;
    details.group = document.getElementById('detailGroup').value;
    details.status = document.getElementById('detailStatus').value;
    send("update",JSON.stringify(details));
    document.getElementById('detailView').style.transform = 'translateX(200%)';
    unblur();

    alert(JSON.stringify(details.title))

    console.log(detailsID())
    //Update View
    document.getElementById(detailsID()+"-title").innerHTML = details.title;
    document.getElementById(detailsID()+"-cover").src = details.cover;
}

function sort (value) {
    switch (value) {
        case "alpha":
            SortAlpha();
            break;
        case "new":
            SortNew();
            break;
        case "old":
            SortOld();
            break;
        case "seen much":
            SortSeenMuch();
            break;
        case "seen less":
            SortSeenLess();
            break;
    }
    CreateList();
}