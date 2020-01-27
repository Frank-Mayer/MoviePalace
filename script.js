var query = "";

function search (q) {
    query = q;
}

// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i = 0;

// List View
function listView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "calc(100% - 8px)";
    }
    document.getElementById("btn_grid").className = "btn active";
    document.getElementById("btn_list").className = "btn";
}

// Grid View
function gridView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "calc(50% - 8px)";
    }
    document.getElementById("btn_list").className = "btn active";
    document.getElementById("btn_grid").className = "btn";
}
