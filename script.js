function search (q) {
    query = q.toLowerCase();
    sort();
    CreateList();
}

var blur = false;

function doBlur () {
    document.getElementById('topToolHead').style.filter = 'blur(4px)';
    document.getElementById('topToolHead').style.WebkitFilter = 'blur(4px)';
    document.getElementById('list-view').style.filter = 'blur(4px)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(4px)';
    document.getElementById('toolbar').style.filter = 'blur(4px)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(4px)';
    document.getElementById('alphabet').style.filter = 'blur(4px)';
    document.getElementById('alphabet').style.WebkitFilter = 'blur(4px)';
    blur = true;
}

function unblur () {
    document.getElementById('topToolHead').style.filter = 'blur(0)';
    document.getElementById('topToolHead').style.WebkitFilter = 'blur(0)';
    document.getElementById('list-view').style.filter = 'blur(0)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(0)';
    document.getElementById('toolbar').style.filter = 'blur(0)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(0)';
    document.getElementById('alphabet').style.filter = 'blur(0)';
    document.getElementById('alphabet').style.WebkitFilter = 'blur(0)';
    blur = false;
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
    document.getElementById('gridSwitch').checked = true;
    document.documentElement.style.setProperty('--typeVis', "collapse");
}

function detailsID () {
    return (decodeURI(details.id));
}

function detailView (e) {
    document.getElementById("del").style.visibility = "visible";
    document.getElementById("share").style.visibility = "visible";
    document.getElementById("watchCountEditor").style.visibility = "visible";
    resetDetails();
    details = JSON.parse(e);
    doBlur();
    document.getElementById('detailCover').src = details.cover;
    document.getElementById('detailTitle').value = decodeURI(details.title);
    if (details.group) { document.getElementById('detailGroup').value = decodeURI(details.group); }
    else { document.getElementById('detailGroup').value = ""; }
    if (details.episode) { document.getElementById('detailGroupEp').value = decodeURI(details.episode); }
    else { document.getElementById('detailGroupEp').value = ""; }
    document.getElementById('detailStatus').value = Number(details.status);
    document.getElementById('detailTyp').value = Number(details.typ);
    document.getElementById("detailWatchCounter").value = details.watchcount;
    document.getElementById('detailView').style.transform = 'translateX(0)';
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

function saveDetails () {
    if (create) {
        details.id = generateID();
        // resetDetails();
    }
    details.title = capitalize(String(document.getElementById('detailTitle').value));
    details.group = capitalize(String(document.getElementById('detailGroup').value));
    details.episode = String(document.getElementById('detailGroupEp').value);
    details.status = String(document.getElementById('detailStatus').value);
    details.typ = String(document.getElementById('detailTyp').value);
    details.sort = details.group+details.episode+details.title;

    if (create) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', googleApi.query(details.title+" Movie Cover"), true);
            request.onload = function () {
                var data = JSON.parse(this.response);

                if (request.status >= 200 && request.status < 300) {
                    if (Number(data.searchInformation.totalResults) > 0) {
                        details.cover = (data.items[0].link);
                    }
                }
                else {
                    RandomApiKey();
                    console.error(data);
                    details.cover = '../cover/'+details.title+'.jpg';
                }
                lib.push(details);
                document.getElementById("del").style.visibility = "visible";
                document.getElementById("share").style.visibility = "visible";
                document.getElementById("watchCountEditor").style.visibility = "visible";
                sort();
                CreateList();
                send("insert","lib",JSON.stringify(details));
                document.getElementById(details.id).scrollIntoView({behavior: "smooth"});
            }
            request.send();
        }
        catch (e) {
            console.error(e);
            details.cover = '../cover/'+details.title+'.jpg';
            send("insert","lib",JSON.stringify(details));
            document.getElementById(details.id).scrollIntoView({behavior: "smooth"});
        }
    }
    else {
        for (var i = 0; lib.length; i++) {
            if (lib[i].id == details.id) {
                lib[i] = details;
                break;
            }
        }
        sort();
        CreateList();
        send("update","lib",JSON.stringify(details));
        document.getElementById(details.id).scrollIntoView({behavior: "smooth"});
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
    send("delete","lib",JSON.stringify(details));
    document.getElementById('detailView').style.transform = 'translateX(200%)';
    unblur();
    sort();
    CreateList();
}

function delWish (e) {
    e = JSON.parse(e);
    for (var i=0; i<wishlist.length; i++){
        if (wishlist[i].title == e.title) {
            wishlist.splice(i, 1); 
            break;
        }
    }
    loadWishlist();
    send('delete','wishlist',JSON.stringify(e));
}

function boughtWish (e) {
    e = JSON.parse(e);
    document.getElementById('wishlistView').style.transform = 'translateX(200%)';
    createDialog();
    details.title=e["title"];
    document.getElementById("detailTitle").value = details.title;
    document.getElementById("confetti").style.visibility = "visible";
    setTimeout(()=>{document.getElementById("confetti").style.visibility = "collapse";},2000);
    delWish(e);
}

function shareWish (e) {
    e = JSON.parse(e);
    var request = new XMLHttpRequest();
    request.open('GET', googleApi.query(e.title+" Movie Cover"), true);
    request.onload = function () {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 300) {
            if (Number(data.searchInformation.totalResults) > 0) {
                e.cover = (data.items[0].link).replace("http://", "https://");
                var cry = encodeURI(btoa(JSON.stringify(e)));
                send("shareMovieExt",e.title,cry);
            }
        }
        else {
            RandomApiKey();
            console.error(data);
        }
    }
    request.send();
}

function addWishToDB () {
    var e = {
        "title": document.getElementById("addWish").value
    }
    wishlist.push(e);
    loadWishlist();
    send("insert","wishlist",JSON.stringify(e));
    document.getElementById("addWish").value = '';
}

function sort() {
    switch (document.getElementById('sortSelect').value) {
        case "alpha":
            SortAlpha();
            break;
        case "group":
            SortGroup();
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

}

function createDialog () {
    resetDetails();
    document.getElementById("detailViewHeader").innerHTML = "Hinzufügen";
    document.getElementById("del").style.visibility = "collapse";
    document.getElementById("share").style.visibility = "collapse";
    document.getElementById("watchCountEditor").style.visibility = "collapse";
    document.getElementById('detailCover').src = "";
    document.getElementById('detailTitle').value = "";
    document.getElementById('detailGroup').value = "";
    document.getElementById('detailGroupEp').value = "";
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
                if (Number(data.searchInformation.totalResults) > 0) {
                    ret = (data.items[0].link).replace("http://", "https://");
                    img.src = ret;
                    details.cover = ret;
                }
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
    send("shareMovieExt",details.title,cry);
    document.getElementById('detailView').style.transform = 'translateX(200%)'; unblur()
}

function changeTheme() {
    send("settings","theme",document.getElementById("themeSelect").value);
}

function watchSub() {
    details.watchcount = String(Number(details.watchcount) - 1);
    document.getElementById("detailWatchCounter").value = details.watchcount;
}

function watchAdd() {
    details.watchcount = String(Number(details.watchcount) + 1);
    document.getElementById("detailWatchCounter").value = details.watchcount;
}

function getScrollPercent() {
    var containeR = document.getElementById("list-view");
    var scrollPercentage = 100 * containeR.scrollTop / (containeR.scrollHeight-containeR.clientHeight);
    return scrollPercentage;
}

function scrollToLetter(letter) {
    if (!blur) {
        document.getElementById(letter).scrollIntoView({behavior: "smooth"});
    }
}
