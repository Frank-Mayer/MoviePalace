var query = "";

function search (q) {
    query = q;
}

function open (id) {
    document.getElementById(id).style.visibility = "visible";
}

function close (id) {
    document.getElementById(id).style.visibility = "collapse";
}

// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i = 0;

// List View
function listView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "100%";
    }
    document.getElementById("btn_grid").className = "btn active";
    document.getElementById("btn_list").className = "btn";
}

// Grid View
function gridView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "50%";
    }
    document.getElementById("btn_list").className = "btn active";
    document.getElementById("btn_grid").className = "btn";
}
