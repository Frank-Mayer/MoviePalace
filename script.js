function search (q) {
    query = q.toLowerCase();
    sort();
    CreateList();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

var isBlur = false;

function doBlur () {
    document.getElementById('topTools').style.filter = 'blur(4px)';
    document.getElementById('topTools').style.WebkitFilter = 'blur(4px)';
    document.getElementById('list-view').style.filter = 'blur(4px)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(4px)';
    document.getElementById('toolbar').style.filter = 'blur(4px)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(4px)';
    document.getElementById('alphabet').style.filter = 'blur(4px)';
    document.getElementById('alphabet').style.WebkitFilter = 'blur(4px)';
    isBlur = true;
    height = 0;
    updateDialogSizeFc();
}

function unblur () {
    document.getElementById('topTools').style.filter = 'blur(0)';
    document.getElementById('topTools').style.WebkitFilter = 'blur(0)';
    document.getElementById('list-view').style.filter = 'blur(0)';
    document.getElementById('list-view').style.WebkitFilter = 'blur(0)';
    document.getElementById('toolbar').style.filter = 'blur(0)';
    document.getElementById('toolbar').style.WebkitFilter = 'blur(0)';
    document.getElementById('alphabet').style.filter = 'blur(0)';
    document.getElementById('alphabet').style.WebkitFilter = 'blur(0)';
    isBlur = false;
    document.getElementById("detailFavSwitch").checked = false;
    height = 0;
    updateDialogSizeFc();
}

// Get the columns with class="column"
var columns = document.getElementsByClassName("column");
var listMode = (screen.availWidth < 500);
var i = 0;

// List View
function listView() {
    listMode = true;
    for (i = 0; i < columns.length; i++) {
        columns[i].style.width = "calc(100% - 16px)";
        columns[i].style.marginLeft = "8px";
        columns[i].style.marginRight = "8px";
        columns[i].style.height = "116px";
    }
    document.getElementById('gridSwitch').checked = false;
    document.documentElement.style.setProperty('--typeVis', "visible");
}

// Grid View
function gridView() {
    listMode = false;
    for (i = 0; i < columns.length; i++) {
        columns[i].style.width = "calc(50% - 12px)";
        columns[i].style.marginLeft = "8px";
        columns[i].style.marginRight = "0px";
        columns[i].style.height = "164px";
    }
    document.getElementById('gridSwitch').checked = true;
    document.documentElement.style.setProperty('--typeVis', "collapse");
}

function detailsID () {
    return (decodeURI(details.id));
}

function detailView (e) {
    create = false;
    document.getElementById("detailFavSwitchP").style.visibility = "visible";
    document.getElementById("del").style.visibility = "visible";
    document.getElementById("share").style.visibility = "visible";
    document.getElementById("watchCountEditor").style.visibility = "visible";
    resetDetails();
    details = JSON.parse(e);
    document.getElementById("detailFavSwitch").checked = (details.fav == "true");
    document.getElementById('detailCover').src = details.cover;
    document.getElementById('detailTitle').value = decodeURI(details.title);
    if (details.group) { document.getElementById('detailGroup').value = decodeURI(details.group); }
    else { document.getElementById('detailGroup').value = ""; }
    if (details.episode) { document.getElementById('detailGroupEp').value = decodeURI(details.episode); }
    else { document.getElementById('detailGroupEp').value = ""; }
    document.getElementById('detailStatus').value = Number(details.status);
    document.getElementById('detailTyp').value = Number(details.typ);
    document.getElementById("detailWatchCounter").value = details.watchcount;
    document.getElementById("coverSelector").style.display = "none";
    doBlur();
    document.getElementById('detailView').style.transform = 'translateX(0)';
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

function saveDetails () {
    details.title = capitalize(String(document.getElementById('detailTitle').value).replace('\'','`'));
    details.group = capitalize(String(document.getElementById('detailGroup').value).replace('\'','`'));
    details.episode = String(document.getElementById('detailGroupEp').value);
    details.status = String(document.getElementById('detailStatus').value);
    details.typ = String(document.getElementById('detailTyp').value);
    details.alpha = createAlphaSeachString(details);
    if (document.getElementById("detailFavSwitch").checked) {
        details.fav = "true";
    }
    else {
        details.fav = "false";
    }

    if (create) {
        if (details.cover === "") {
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
                    document.getElementById("detailFavSwitchP").style.visibility = "visible";
                    document.getElementById("del").style.visibility = "visible";
                    document.getElementById("share").style.visibility = "visible";
                    document.getElementById("watchCountEditor").style.visibility = "visible";
                    sort();
                    CreateList();
                    send("insert","lib",JSON.stringify(details));
                    document.getElementById(details.id).scrollIntoView(scrollBehavior);
                }
                request.send();
            }
            catch (e) {
                console.error(e);
                details.cover = '../cover/'+details.title+'.jpg';
                send("insert","lib",JSON.stringify(details));
                document.getElementById(details.id).scrollIntoView(scrollBehavior);
            }
        }
        else {
            lib.push(details);
            document.getElementById("detailFavSwitchP").style.visibility = "visible";
            document.getElementById("del").style.visibility = "visible";
            document.getElementById("share").style.visibility = "visible";
            document.getElementById("watchCountEditor").style.visibility = "visible";
            sort();
            CreateList();
            send("insert","lib",JSON.stringify(details));
            document.getElementById(details.id).scrollIntoView(scrollBehavior);
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
        document.getElementById(details.id).scrollIntoView(scrollBehavior);
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
    if (typeof e == 'string') {
        e = JSON.parse(e);
    }
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
    startConfetti();
    setTimeout(()=>{stopConfetti();},3000);
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
    alphabet = document.getElementById("alphabet");
    switch (document.getElementById('sortSelect').value) {
        case "alpha":
            for (var i=0; i<lib.length; i++) {
                lib[i].alpha = (createAlphaSeachString(lib[i]));
            }
            SortAlpha();
            alphabet.style.display = "block";
            break;
        case "group":
            SortGroup();
            alphabet.style.display = "block";
            break;
        case "new":
            SortNew();
            alphabet.style.display = "none";
            break;
        case "old":
            SortOld();
            alphabet.style.display = "none";
            break;
        case "seen much":
            SortSeenMuch();
            alphabet.style.display = "none";
            break;
        case "seen less":
            SortSeenLess();
            alphabet.style.display = "none";
            break;
    }
    delete alphabet;
}

function createDialog () {
    resetDetails();
    document.getElementById("detailViewHeader").innerHTML = "Hinzufügen";
    document.getElementById("detailFavSwitchP").style.visibility = "collapse";
    document.getElementById("del").style.visibility = "collapse";
    document.getElementById("share").style.visibility = "collapse";
    document.getElementById("watchCountEditor").style.visibility = "collapse";
    document.getElementById('detailCover').src = "./tv.svg";
    document.getElementById('detailTitle').value = "";
    document.getElementById('detailGroup').value = "";
    document.getElementById('detailGroupEp').value = "";
    document.getElementById('detailStatus').value = 0;
    document.getElementById('detailTyp').value = 0;
    document.getElementById("coverSelector").style.display = "none";
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
    eventFire(document.getElementById(lib[Math.floor(Math.random() * (lib.length-1))].id), 'click');
}

function findCover () {
    if (document.getElementById("coverSelector").style.display === "block") {
        document.getElementById("coverSelector").scrollTo(0, 0);
        document.getElementById("coverSelector").style.display = "none";
    }
    else {
        if (document.getElementById("detailTitle").value !== "") {
            try {
                document.getElementById("coverSelector").style.display = "none";
                document.getElementById("coverSelect1").src = "";
                document.getElementById("coverSelect2").src = "";
                document.getElementById("coverSelect3").src = "";

                var request = new XMLHttpRequest();
                request.open('GET', googleApi.query(document.getElementById("detailTitle").value+" Movie Cover"), true);
                request.onload = function () {
                    var data = JSON.parse(this.response);
                    if (request.status >= 200 && request.status < 300) {
                        if (Number(data.searchInformation.totalResults) > 0) {
                            document.getElementById("coverSelect1").src = (data.items[0].link).replace("http://", "https://");
                            document.getElementById("coverSelect2").src = (data.items[1].link).replace("http://", "https://");
                            document.getElementById("coverSelect3").src = (data.items[2].link).replace("http://", "https://");
                            document.getElementById("coverSelect4").src = (data.items[3].link).replace("http://", "https://");
                            document.getElementById("coverSelect5").src = (data.items[4].link).replace("http://", "https://");

                            document.getElementById("coverSelect1Src").innerHTML = (data.items[0].displayLink);
                            document.getElementById("coverSelect2Src").innerHTML = (data.items[1].displayLink);
                            document.getElementById("coverSelect3Src").innerHTML = (data.items[2].displayLink);
                            document.getElementById("coverSelect4Src").innerHTML = (data.items[3].displayLink);
                            document.getElementById("coverSelect5Src").innerHTML = (data.items[4].displayLink);

                            document.getElementById("coverSelector").style.display = "block";
                            document.getElementById("coverSelector").scrollTo(0, 0);
                        }
                    }
                    else {
                        RandomApiKey();
                        console.error(data);
                        document.getElementById("coverSelector").style.display = "none";
                    }
                }
                request.send();
            }
            catch (e) {
                console.error(e);
                document.getElementById("coverSelector").style.display = "none";
            }
        }
    }
}

function share () {
    var detailsComp = new Object;
    detailsComp.title=details.title;
    detailsComp.cover=details.cover;
    var cry = encodeURI(btoa(JSON.stringify(detailsComp)));
    send("shareMovieExt",details.title,cry);
    document.getElementById('detailView').style.transform = 'translateX(200%)'; unblur()
}

function changeTheme() {
    send("settings","theme",document.getElementById("themeSelect").value);
    theme = document.getElementById("themeSelect").value;
    applyTheme();
}

function watchSub() {
    if (Number(details.watchcount)>0) {
        details.watchcount = String(Number(details.watchcount) - 1);
    }
    else {
        details.watchcount = "0";
    }
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
    if (!isBlur) {
        document.getElementById(letter).scrollIntoView(scrollBehavior);
    }
    else {
        var floatingChild1 = document.getElementsByClassName("floatingChild1");
        for (var i=0; i<floatingChild1.length; i++) {
            eventFire(floatingChild1[i], 'click');
        }
    }
}

function shareFullWishList() {
    var strShareFullWishList = '🎬 Meine Wunschliste';
    for (var i=0; i<wishlist.length; i++) {
        strShareFullWishList += ('\n'+'•'+wishlist[i].title)
    }
    send("sharePlainText","",encodeURI(strShareFullWishList));
}
