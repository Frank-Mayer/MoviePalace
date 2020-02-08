function search (q) {
    query = q.toLowerCase();
    SortAlpha();
    CreateList();
}

function doBlur () {
    document.getElementById('finder').style.filter = 'blur(2px)';
    document.getElementById('finder').style.WebkitFilter = 'blur(2px)';
    document.getElementById('list-view').style.filter = 'blur(2px)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(2px)';
    document.getElementById('toolbar').style.filter = 'blur(2px)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(2px)';
}

function unblur () {
    document.getElementById('finder').style.filter = 'blur(0)';
    document.getElementById('finder').style.WebkitFilter = 'blur(0)';
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
    document.getElementById('gridSwitch').checked = false;
    //document.documentElement.style.setProperty('--typeVis', "visible");
}

// Grid View
function gridView() {
    listMode = false;
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "calc(50% - 12px)";
        elements[i].style.marginLeft = "8px";
        elements[i].style.marginRight = "0px";
    }
    document.getElementById('gridSwitch').checked = true;
    //document.documentElement.style.setProperty('--typeVis', "collapse");
}

function detailsID () {
    return (decodeURI(details.id));
}

function detailView (e) {
    document.getElementById("del").style.visibility = "visible";
    document.getElementById("share").style.visibility = "visible";
    resetDetails();
    details = JSON.parse(e);
    doBlur();
    document.getElementById('detailCover').src = details.cover;
    document.getElementById('detailTitle').value = decodeURI(details.title);
    if (details.group) { document.getElementById('detailGroup').value = decodeURI(details.group); }
    else { document.getElementById('detailGroup').value = ""; }
    document.getElementById('detailStatus').value = Number(details.status);
    document.getElementById('detailTyp').value = Number(details.typ);
    document.getElementById('detailView').style.transform = 'translateX(0)';
}

function saveDetails () {
    if (create) {
        resetDetails();
    }
    details.title = String(document.getElementById('detailTitle').value);
    details.group = String(document.getElementById('detailGroup').value);
    details.status = String(document.getElementById('detailStatus').value);
    details.typ = String(document.getElementById('detailTyp').value);
    if (create) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', googleApi.query(details.title+" Movie Cover"), true);
            request.onload = function () {
                var data = JSON.parse(this.response);

                if (request.status >= 200 && request.status < 300) {
                    details.cover = (data.items[0].image.thumbnailLink);
                }
                else {
                    RandomApiKey();
                    console.error(data);
                    details.cover = '../cover/'+details.title+'.jpg';
                }
                lib.push(details);
                document.getElementById("del").style.visibility = "visible";
                document.getElementById("share").style.visibility = "visible";
                SortAlpha();
                CreateList();
                send("insert",JSON.stringify(details));
            }
            request.send();
        }
        catch (e) {
            console.error(e);
            details.cover = '../cover/'+details.title+'.jpg';
            send("insert",JSON.stringify(details));
        }
    }
    else {
        for (var i = 0; lib.length; i++) {
            if (lib[i].id == details.id) {
                lib[i] = details;
                break;
            }
        }
        SortAlpha();
        CreateList();
        send("update",JSON.stringify(details));
    }
    create = false;
    document.getElementById('detailView').style.transform = 'translateX(200%)';
    unblur();
}

function del () {
    for( var i = 0; i < lib.length; i++){ 
        if (lib[i].id == detailsID()) {
            lib.splice(i, 1); 
            break;
        }
    }
    send("delete",JSON.stringify(details));
    document.getElementById('detailView').style.transform = 'translateX(200%)';
    unblur();
    SortAlpha();
    CreateList();
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

function createDialog () {
    resetDetails();
    document.getElementById("detailViewHeader").innerHTML = "Hinzufügen";
    document.getElementById("del").style.visibility = "collapse";
    document.getElementById("share").style.visibility = "collapse";
    document.getElementById('detailCover').src = "";
    document.getElementById('detailTitle').value = "";
    document.getElementById('detailGroup').value = "";
    document.getElementById('detailStatus').value = 0;
    document.getElementById('detailTyp').value = 0;
    doBlur();
    create = true;
    document.getElementById('detailView').style.transform = 'translateX(0)';
}

function eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

function random () {
    eventFire(document.getElementById(lib[Math.floor(Math.random() * lib.length)].id), 'click');
}

function findCover (img, searchQuery) {
    var ret = "";
    try {
        var request = new XMLHttpRequest();
        request.open('GET', googleApi.query(searchQuery+" Movie Cover"), true);
        request.onload = function () {
            var data = JSON.parse(this.response);

            if (request.status >= 200 && request.status < 300) {
                ret = (data.items[0].image.thumbnailLink);
                img.src = ret;
                details.cover = ret;
            }
            else {
                RandomApiKey();
                console.error(data);
                img.src = "";
            }
        }
        request.send();
    }
    catch (e) {
        console.error(e);
        img.src = "";
        details.cover = "";
    }
}

function share () {
    var cry = encodeURI(btoa(JSON.stringify(details)));
    send("shareMovieExt",cry);
}
