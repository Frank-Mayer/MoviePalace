var query = "";

function search (q) {
    query = q;
}

function doBlur () {
    document.getElementById('finder').style.filter = 'blur(4px)';
    document.getElementById('finder').style.WebkitFilter = 'blur(4px)';
    document.getElementById('btnContainer').style.filter = 'blur(4px)';
    document.getElementById('btnContainer').style.WebkitFilter = 'blur(4px)';
    document.getElementById('list-view').style.filter = 'blur(4px)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(4px)';
    document.getElementById('toolbar').style.filter = 'blur(4px)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(4px)';
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
var listMode = true;
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
}


document.addEventListener('backbutton', function(){
    if(true) {
        alert("backBlocked");
     return false;
    }
    else //nothing is visible, exit the app
    {
        alert("backallowed");
      navigator.app.exitApp();
    }
});

function detailView (e) {
    var details = JSON.parse(e);
    doBlur();
    document.getElementById('detailView').style.transform = 'translateX(0)';
    document.getElementById('detailCover').src = details.cover;
    document.getElementById('detailTitle').value = details.title;
}
