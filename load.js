var scrollBehavior = {behavior: "smooth", block: "center", inline: "center"};

var today = new Date();
function generateID () {
    today = new Date();
    var nid = String(today.getFullYear())+String((Number(today.getMonth())+1))+String(today.getDate())+String(today.getHours())+String(today.getMinutes())+String(today.getSeconds())+String(today.getMilliseconds());
    return (nid);
}
var details = new Object;
function resetDetails () {
    details = {
        "cover": "",
        "date": String(String(today.getDate())+"."+String(today.getMonth())+"."+String(today.getFullYear())),
        "typ": "0",
        "fav": "false",
        "watchcount": "0",
        "id": generateID(),
        "title": "",
        "group":"",
        "episode":"",
        "status": "0"
    }
} resetDetails();

var query = "";
var list = "";
var wishList = "";
var lib;
var newRow = true;
var letter = "";
var justFav = false;
var create = false;
var urlParams = new URLSearchParams(window.location.search);
var speed = Number(urlParams.get('speed'));
if (!(speed > 0)) {
    speed  = 500;
}

var theme = urlParams.get('theme');
var quitAsk = urlParams.get('quitAsk');

var transp = "A0";
var transp1 = "75";

function applyTheme() {
    switch (theme) {
        case "light":
        case "1":
            document.documentElement.style.setProperty('--main', colorPref[1].main);
            document.documentElement.style.setProperty('--main-transp', (String(colorPref[1].main) + transp1));
            document.documentElement.style.setProperty('--dark-transp', (String(colorPref[0].main) + transp1));
            document.documentElement.style.setProperty('--dark', (String(colorPref[0].main)));
            document.documentElement.style.setProperty('--light', (String(colorPref[1].main)));
            document.documentElement.style.setProperty('--light-transp', (String(colorPref[1].main) + transp));
            document.documentElement.style.setProperty('--accent', colorPref[1].accent);
            document.documentElement.style.setProperty('--accent1', colorPref[1].accent1);
            document.documentElement.style.setProperty('--accent2', colorPref[1].accent2);
            break;
        default:
        case "dark":
            theme = "0";
        case "0":
            document.documentElement.style.setProperty('--main', colorPref[0].main);
            document.documentElement.style.setProperty('--main-transp', (String(colorPref[0].main) + transp1));
            document.documentElement.style.setProperty('--dark-transp', (String(colorPref[0].main) + transp1));
            document.documentElement.style.setProperty('--dark', (String(colorPref[0].main)));
            document.documentElement.style.setProperty('--light', (String(colorPref[1].main)));
            document.documentElement.style.setProperty('--light-transp', (String(colorPref[1].main) + transp));
            document.documentElement.style.setProperty('--accent', colorPref[0].accent);
            document.documentElement.style.setProperty('--accent1', colorPref[0].accent1);
            document.documentElement.style.setProperty('--accent2', colorPref[0].accent2);
            break;
    }
}
                    
applyTheme();

function CreateList() {
    list="";

    document.getElementById("alphabet").innerHTML = '';
    // document.getElementById("alphabetScroll").max = 0;

    document.getElementById("movieCounter").innerHTML = lib.length;
    document.getElementById("list-view").innerHTML = "";

    list += '<div class="row"><p>&#160;</p><p>&#160;</p></div>';

    {
        if (recommendation.count > 0) {
            list += '<p></p><div class="row"><b>Empfehlungen</b><table id="recommendation">'+recommendation.html+'</table></div>';
        }
    }

    newRow = true;
    letter = "";
    justFav = document.getElementById('favSwitch').checked;
    if (document.getElementById('sortSelect').value != "alpha") {
        list +='<p></p>';
    }
    lib.forEach(element => fillList(element));
    if ( ((list.match(/<div/g) || []).length) > ((list.match(/<\/div>/g) || []).length) ) {
        list += '</div>';
    }
    
    list += '<div class="row"><p>&#160;</p><br/>';
    list += '</div>';

    document.getElementById("list-view").innerHTML = list;

    if (listMode) {
        listView();
    }
    else {
        gridView();
    }
}

function fillList(item) {
    var constructThisItem = false;
    if (query == "") {
        constructThisItem = true;
    }
    else if (item.title.toLowerCase().includes(query)) {
        constructThisItem = true
    }
    else if (typeof item.group !== 'undefined') {
        if (item.group.toLowerCase().includes(query)) {
            constructThisItem = true;
        }
    }
    if (constructThisItem) {
        if ((item.fav == "false") && (justFav)) {
            constructThisItem = false;
        }
    }
    if (((typeof item.group === 'undefined') || item.group=="") && (document.getElementById('sortSelect').value == "group")) {
        constructThisItem = false;
    }
    if (constructThisItem) {
        if (document.getElementById('sortSelect').value == "alpha") {
            var title = item["alpha"];
            if (letter.toUpperCase() != title[0].toUpperCase()) {
                letter = title[0].toUpperCase();
                try {
                    addLetter(letter);
                }
                catch {
                }
            }
        }
        if (document.getElementById('sortSelect').value == "group") {
            var title = item["group"];
            if (letter.toUpperCase() != title[0].toUpperCase()) {
                letter = title[0].toUpperCase();
                try {
                    addLetter(letter);
                }
                catch {
                }
            }
        }
        addToList(item);
    }
}

function addToList (e) {
    var id = e.id;
    if (newRow) {
        list += '<div class="row">';
    }
    list += '<div class="column" id="'+id+'" onClick="detailView(\''+escapeHtml(JSON.stringify(e))+'\')">';
    if (listMode) {
    list += '<table width="100%" height="100%">';
    } else {
    list += '<table width="100%" height="100%" style="transform: translateY(-24px);">';
    }
    list += '<tr>';
    list += '<td>';
    list += '<img src="'+e.cover+'" class="cover" id="'+id+'-cover">';
    list += '</td>';
    if (listMode) {
        list += '<td style="width: 50%; text-align: left;"><b style="font-size: 14px;" id="'+id+'-title">'+((e.fav=="true")?'<nobr>&#x2606;&#160;</nobr>':'')+decodeURI(e.title)+'</b><br></td>';
    }
    list += '<td>';
    switch (e.typ) {
        case "0":
            list += '<svg id="'+id+'-typ" class="typeIcon" version="1.1" id="Layer_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" viewBox="-0.744 82.256 386 207" overflow="visible" xml:space="preserve"><g><path fill="#0095D5" d="M91.59,237.719c-0.693,0-3.053,0.693-5.135,3.746c-2.081,3.053-11.518,18.596-13.183,21.51c-1.805,2.914-1.249,4.164,0.693,4.164c1.665,0,2.082,0,4.163,0c1.943,0,3.747-2.221,4.441-3.748c0.972-1.387,12.073-19.428,13.877-22.063c1.526-2.638,0.556-3.607-0.694-3.607C94.644,237.719,91.59,237.719,91.59,237.719L91.59,237.719z"/><path fill="#0095D5" d="M53.705,267.139c7.078-0.277,11.796-0.557,17.347-10.686c2.359-4.58-4.302-4.72-4.302-4.72c-0.972,0,6.106,0.14,9.853-7.771c3.47-7.217-2.637-6.66-3.746-6.799c-5.274-0.695-15.127-0.418-22.62,0c-1.527,0-3.331,2.08-4.303,3.33c-0.693,1.387-12.212,19.981-13.877,22.619c-1.805,2.774,0,3.887,1.804,4.024C39.134,267.416,45.795,267.416,53.705,267.139L53.705,267.139L53.705,267.139z M59.811,257.424c-1.942,4.025-5.551,4.164-7.632,4.164c-1.942,0-4.857,0-5.551,0s-1.388,0-0.694-1.527c0.972-1.248,2.359-3.469,2.915-4.303c0.555-0.971,1.109-1.248,2.358-1.248c0,0,4.719,0,5.968,0C58.285,254.51,61.199,254.371,59.811,257.424L59.811,257.424L59.811,257.424z M64.945,245.49c-1.942,4.022-5.689,4.022-7.632,4.022c-2.081,0-2.498,0-3.33,0c-0.556,0-1.527,0-0.556-1.248c0.972-1.389,2.081-3.748,2.775-4.58c0.693-0.832,1.249-1.25,2.221-1.25c0,0,2.914,0,4.024,0C63.558,242.436,66.473,242.436,64.945,245.49L64.945,245.49z"/><path fill="#0095D5" d="M284.762,248.82l-9.158,14.57c-1.942,3.053-0.276,3.748,0.693,3.748c0.973,0,2.359,0,4.025,0c1.525,0,2.637-0.139,4.996-3.748l9.158-14.848c2.498-4.025-0.556-3.746-2.498-3.746C288.51,244.934,287.678,244.797,284.762,248.82L284.762,248.82z"/><path fill="#0095D5" d="M322.51,249.791h-10.965c-1.109,0-2.637,0.973-3.469,2.082c-0.693,1.11-0.277,2.221,0.832,2.221c0-0.139,4.44,0,7.771,0c3.47-0.139,4.72,2.221,0.974,7.355c-0.695,1.108-2.222,2.914-3.472,3.606c0,0-3.053,2.498-12.905,2.498c-9.021,0-9.437-0.973-9.437-0.973c-0.832-0.693-1.108-1.941-0.832-2.638c0.416-0.555,1.806-1.108,2.914-1.108H305.3c1.109,0,2.637-0.971,3.33-2.221c0.834-1.109,0.416-2.496-0.693-2.496c0,0-4.44,0-8.464,0c-4.024,0-3.47-2.64-0.416-7.078c0.832-1.25,2.358-2.775,3.469-3.609c0,0,3.33-2.498,13.045-2.498c3.887,0,10.407-0.416,9.992,2.916C325.424,249.375,323.203,249.791,322.51,249.791L322.51,249.791z"/><path fill="#0095D5" d="M351.234,249.93h-8.882c-1.11,0-2.637,0.973-3.329,2.359l-5.273,8.188c-0.695,1.111-0.277,2.359,0.555,2.359c0,0,9.021,0,10.547,0c1.525,0,2.498,0.139,2.359,0.555c-0.139,1.527-2.359,4.164-14.711,4.164c-11.102,0-10.408-1.527-10.27-3.19c0.278-1.806,5.688-10.408,7.354-13.046c1.666-2.774,4.025-6.385,14.988-6.385c10.27,0,9.713,2.359,9.574,2.916C354.148,248.404,353.594,249.93,351.234,249.93L351.234,249.93z"/><path fill="#0095D5" d="M299.75,236.469c0.832,0,1.805,0.834,1.109,2.221c-0.832,1.111-1.109,1.666-1.525,2.498c-0.555,0.832-1.805,1.248-3.33,1.248c-1.527,0-5.135,0-5.689,0c-1.11,0-1.11-0.971-0.557-1.94c0.416-0.832,0.693-1.25,1.111-1.806c0.416-0.692,1.109-2.221,3.33-2.221H299.75L299.75,236.469z"/><path fill="#0095D5" d="M133.777,252.428c-2.081,0-2.914,1.389-3.33,2.082c-0.278,0.555-0.694,0.971-1.249,1.943c-0.417,0.971-0.278,1.94,0.277,1.94c0.693,0,4.44,0,5.967,0c1.805,0,2.775-0.555,3.33-1.387c0.556-0.971,0.694-1.25,1.527-2.637c0.971-1.388-0.278-1.943-0.972-1.943L133.777,252.428L133.777,252.428z"/><path fill="#0095D5" d="M271.719,258.119c3.607-5.83,1.387-2.222,6.521-10.408c4.996-8.328-2.914-9.992-10.686-9.992c-11.935,0-15.544,0.555-15.544,0.555c-1.247,0-2.913,1.109-3.606,2.498l-14.434,23.314c-0.832,1.387-0.556,2.496,0.557,2.774c0,0,3.469,0.277,15.402,0.277C266.307,267.139,267.832,264.086,271.719,258.119L271.719,258.119L271.719,258.119zM266.861,247.711c0,0-6.244,9.852-6.662,10.408c-0.555,0.832-2.498,3.469-5.412,3.469c-1.803,0-4.301,0-6.105,0c-1.111,0-1.666-0.139-0.971-1.25l9.99-15.959c0.418-0.555,1.111-0.971,1.943-0.971c1.666,0,4.719,0,5.967,0C267.555,243.408,268.109,245.49,266.861,247.711L266.861,247.711z"/><path fill="#0095D5" d="M176.103,253.539c-3.469,0-4.579,0.276-7.632,0.416c-1.249,0-2.914,0.971-3.608,2.358l-2.914,4.996c-3.608,5.689,4.163,6.105,10.269,6.105c9.854,0,14.571-2.775,14.571-2.775c1.249-0.555,2.776-2.082,3.47-3.33l6.384-10.408c0.694-1.11,0.973-3.053,0.276-4.163c0,0-0.832-1.941-10.685-1.941c-9.714,0-13.6,1.525-13.6,1.525c-1.11,0.555-2.498,1.526-2.915,2.082c-0.276,0.831,0.278,1.387,1.389,1.387h14.432c1.111,0,1.527,0.973,0.972,1.942c-1.249,1.666-3.33,1.806-3.33,1.806H176.103L176.103,253.539z M181.654,260.338v0.139c-0.972,1.39-2.915,2.638-4.024,2.638h-2.914h-2.637c-1.11,0-1.527-1.248-0.556-2.638v-0.139c0.972-1.525,2.914-2.775,4.024-2.775h5.551C182.209,257.563,182.625,258.813,181.654,260.338L181.654,260.338z"/><path fill="#0095D5" d="M156.953,251.873c0.971-1.388,2.497-2.359,3.607-2.359H165c0.694,0,2.914-0.139,3.054-1.524c0.139-2.222-4.58-2.775-6.384-2.775c-6.522,0-10.131,0.277-13.878,5.828c-2.914,4.438-5.828,9.02-7.771,12.35c-1.665,3.054-0.138,3.748,0.833,3.748c0.972,0,2.498,0,4.024,0s2.637-0.139,4.996-3.748L156.953,251.873L156.953,251.873z"/><path fill="#0095D5" d="M127.949,248.959l-6.245,10.408c-0.833,1.108,0,1.664,0.693,1.664c0.833,0,1.527,0,2.221,0c0.694,0,1.665,0.834,0.832,2.082c-0.693,1.389-0.832,1.942-1.525,2.774c-0.556,0.973-1.527,1.25-3.192,1.25c-1.109,0-1.942,0-2.637,0c-1.804,0-0.833-2.637-0.833-2.637c-2.636,2.914-8.742,2.914-15.126,2.914c-6.105,0-14.016,0-10.407-6.105l7.771-12.49c1.249-2.082,2.22-2.913,3.469-3.469c0,0,0.277-0.418,3.607-0.418c2.221,0,5.135,0,2.638,3.887l-7.078,11.519c-0.832,1.111-0.416,2.221,0.833,2.221h4.856c1.249,0,2.776-1.108,3.747-2.221c0,0,3.608-6.244,6.801-11.379c0.832-1.248,2.914-4.025,4.995-4.025c0,0,1.943,0,3.47,0C128.366,244.934,130.169,245.352,127.949,248.959L127.949,248.959z"/><path fill="#0095D5" d="M191.091,272.967h11.519l2.359,0.139c1.248,0,2.775-1.108,3.469-2.498l2.359-3.469c-1.527,0.277-3.053,0.277-4.857,0.277c-5.828,0-13.876,0-10.27-6.105l7.494-12.073c0.971-1.388,2.498-2.914,3.469-3.47c0-0.276,0.555-0.416,3.748-0.416c2.08,0,5.412-0.555,2.496,3.886l-6.66,11.102c-0.832,1.111-0.555,2.221,0.555,2.221h4.72c0.971,0,2.774-1.108,3.469-2.221l6.938-11.103c0.693-1.387,2.359-2.913,3.47-3.469c0,0,0.557-0.416,3.745-0.416c1.806,0,5.414-0.555,2.5,3.885l-5.829,9.3c-0.277,0.416-0.416,0.555-0.693,1.248l-7.354,11.934c-0.832,1.25-2.359,2.777-3.469,3.471c0,0-4.857,2.775-14.57,2.775c-0.416,0-0.973,0-1.389,0c-9.021-0.277-8.604-0.834-9.159-1.25c-0.556-0.139-1.111-0.971-0.973-2.082C188.315,273.66,189.564,272.967,191.091,272.967L191.091,272.967z"/><path fill="#0095D5" d="M99.501,117.401c-0.278,0-0.278,0.141-0.417,0.278c-12.073,16.93-19.15,28.171-26.645,42.048l-0.832,1.526l-0.14,0.556c-0.693,1.389-0.555,2.914,0.417,4.163c4.44,6.938,29.281,15.126,84.651,15.126c41.354,0,85.345-6.661,85.345-19.149c0-11.797-43.297-18.873-85.345-18.873c-14.017,0-27.755,1.804-31.641,2.498c3.747-5.829,19.567-27.063,19.567-27.2c0.277-0.277,0.277-0.277,0.277-0.416v-0.277c-0.277-0.139-0.416-0.278-0.693-0.278L99.501,117.401L99.501,117.401zM115.598,161.948c0-2.498,15.682-6.106,40.938-6.106c25.256,0,40.8,3.608,40.8,6.106c0,2.774-15.543,6.244-40.8,6.244C131.279,168.193,115.598,164.724,115.598,161.948L115.598,161.948z"/><path fill="#0095D5" d="M130.863,224.258c7.077,0.139,206.217,7.076,210.659-63.559c3.606-58.425-142.938-52.873-142.938-52.873c-0.276,0-1.248,0-1.248,0.693c0,0.833,0.416,0.973,0.972,0.973c40.659,0,106.717,16.235,104.635,51.207c-1.666,28.31-53.289,61.614-172.079,61.614c-0.555,0-1.11,0.556-1.11,0.972C129.753,223.703,130.169,224.119,130.863,224.258L130.863,224.258z"/><polygon fill="#0095D5" points="313.488,219.123 309.604,219.123 309.604,218.291 318.484,218.291 318.484,219.123 314.877,219.123 314.877,226.061 313.488,226.061"/><polygon fill="#0095D5" points="320.428,218.291 322.092,218.291 325.008,224.813 328.061,218.291 329.725,218.291 329.725,226.061 328.615,226.061 328.615,219.678 328.477,219.678 325.563,226.061 324.451,226.061 321.537,219.678 321.537,226.061 320.428,226.061"/></g></svg>';
            break;
        case "1":
            list += '<svg id="'+id+'-typ" class="typeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 107"><title>DVD logo</title><path d="M118.895,20.346c0,0-13.743,16.922-13.04,18.001c0.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H81.81H47.812H22.175l-2.56,11.068h19.299h4.579c12.415,0,19.995,5.132,17.878,14.225c-2.287,9.901-13.123,14.128-24.665,14.128H32.39l5.552-24.208H18.647l-8.192,35.368h27.398c20.612,0,40.166-11.067,43.692-25.288c0.617-2.614,0.53-9.185-1.054-13.053c0-0.093-0.091-0.271-0.178-0.537c-0.087-0.093-0.178-0.722,0.178-0.814c0.172-0.092,0.525,0.271,0.525,0.358c0,0,0.179,0.456,0.351,0.813l17.44,50.315l44.404-51.216l18.761-0.092h4.579c12.424,0,20.09,5.132,17.969,14.225c-2.29,9.901-13.205,14.128-24.75,14.128h-4.405L161,19.987h-19.287l-8.198,35.368h27.398c20.611,0,40.343-11.067,43.604-25.288c3.347-14.225-11.101-25.293-31.89-25.293h-18.143h-22.727C120.923,17.823,118.895,20.346,118.895,20.346L118.895,20.346z"/><path d="M99.424,67.329C47.281,67.329,5,73.449,5,81.012c0,7.558,42.281,13.678,94.424,13.678c52.239,0,94.524-6.12,94.524-13.678C193.949,73.449,151.664,67.329,99.424,67.329z M96.078,85.873c-11.98,0-21.58-2.072-21.58-4.595c0-2.523,9.599-4.59,21.58-4.59c11.888,0,21.498,2.066,21.498,4.59C117.576,83.801,107.966,85.873,96.078,85.873z"/><polygon points="182.843,94.635 182.843,93.653 177.098,93.653 176.859,94.635 179.251,94.635 178.286,102.226 179.49,102.226 180.445,94.635 182.843,94.635"/><polygon points="191.453,102.226 191.453,93.653 190.504,93.653 187.384,99.534 185.968,93.653 185.013,93.653 182.36,102.226 183.337,102.226 185.475,95.617 186.917,102.226 190.276,95.617 190.504,102.226 191.453,102.226"/></svg>';
            break;
        case "2":
            list += '<svg id="'+id+'-typ" class="typeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 48"><g><g><path d="m36 0c-5.9777144-.00416037-11.74048 2.22938396-16.154 6.261-.2640193.24079701-.3795195.60415522-.3029928.95320113.0765267.3490459.3334541.63075112.674.73900001.340546.10824889.7129735.02659588.9769928-.21420114 8.7849351-8.00548375 22.3399602-7.58614656 30.613256.94704927 8.2732959 8.53319583 8.2732959 22.09470563 0 30.62790143-8.2732958 8.5331959-21.8283209 8.952533-30.613256.9470493-.4081384-.3722399-1.0407601-.3431384-1.413.065-.3722399.4081385-.3431384 1.0407601.065 1.413 7.9280374 7.2248574 19.6875759 8.3118758 28.8056514 2.6627129 9.1180754-5.6491629 13.3806015-16.6627557 10.4412976-26.9784153-2.9393039-10.31565969-12.3667048-17.42849793-23.092949-17.4232976z" data-original="#000000" data-old_color="#000000" fill="#FFFFFF"/><path d="m28.993 39c.856 0-.583.772 21.1-13.332.5643341-.3666882.904831-.9939969.904831-1.667s-.3404969-1.3003118-.904831-1.667l-20.014-13.011c-.6124405-.39720101-1.3929705-.42800238-2.0348065-.08029777-.641836.34770462-1.0423775 1.01833287-1.0441935 1.74829777v26.018c.0011038 1.0999224.8930771 1.9910006 1.993 1.991zm.007-27.993 20.005 12.983-20.005 13.019z" data-original="#000000" data-old_color="#000000" fill="#FFFFFF"/><path d="m1 30h11.794c.5081486 2.1092268 1.3267459 4.1312869 2.429 6h-6.223c-.55228475 0-1 .4477153-1 1s.44771525 1 1 1h12c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1h-3.414c-1.2366611-1.8338652-2.157401-3.8619266-2.724-6h3.138c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1h-3.615c-1.0507303-5.5465177.0968191-11.2842646 3.2-16h3.415c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1h-12c-.55228475 0-1 .4477153-1 1s.44771525 1 1 1h6.223c-2.7967074 4.8341948-3.8134745 10.4946935-2.874 16h-11.349c-.55228475 0-1 .4477153-1 1s.44771525 1 1 1z" data-original="#000000" data-old_color="#000000" fill="#FFFFFF"/><path d="m1 20h8c.55228475 0 1-.4477153 1-1s-.44771525-1-1-1h-8c-.55228475 0-1 .4477153-1 1s.44771525 1 1 1z" data-original="#000000" data-old_color="#000000" fill="#FFFFFF"/></g></g> </svg>';
            break;
    }
    list += '</td>';
    list += '</tr>';
    list += '</table>';
    if (!listMode) {
        list += '<p style="transform: translateY(-58px);"><b style="font-size: 14px;" id="'+id+'-title">'+((e.fav=="true")?'<nobr>&#x2606;&#160;</nobr>':'')+decodeURI(e.title)+'</b></p>';
    }
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
    list += '<div class="letter" id="'+e+'" style="background-color: var(--main); text-align: center;">';
    list += '<p style="color: var(--accent)">'+e+'</p>';
    list += '</div>';

    if (query == "") {
        document.getElementById("alphabet").innerHTML += '<tr onmousemove="scrollToLetter(this.innerText)" id="scroll'+e+'" ontouchmove="scrollToLetter(this.innerText)" id="scroll'+e+'" class="alphabeticalScrollLetter"><td class="alphabeticalScrollLetterTxt">'+e+'</td></tr>';
        document.getElementById("alphabet").style.visibility = "visible";
    }
    else {
        document.getElementById("alphabet").style.visibility = "collapse";
    }
}

var sendArr = JSON.parse('[]');
function send (head, table, body) {
    if (table == "") {
        table = "-";
    }
    var str = head+'::'+table+'::'+body;
    pushInterface(str);
}

function SortAlpha() {
    lib.sort((a, b) => {
        if (a["alpha"].toLowerCase() > b["alpha"].toLowerCase())
            return 1;
        if (a["alpha"].toLowerCase() < b["alpha"].toLowerCase())
            return -1;
        return 0;
    });
}

function SortGroup() {
    lib.sort((a, b) => {
        if ((a["group"]+a["episode"]).toLowerCase() > (b["group"]+b["episode"]).toLowerCase())
            return 1;
        if ((a["group"]+a["episode"]).toLowerCase() < (b["group"]+b["episode"]).toLowerCase())
            return -1;
        return 0;
    });
}

function SortNew() {
    lib.sort((a, b) => {
        if (a["date"] < b["date"])
            return 1;
        if (a["date"] > b["date"])
            return -1;

        if (a["title"] > b["title"])
            return 1;
        if (a["title"] < b["title"])
            return -1;
        return 0;
    });
}

function SortOld() {
    lib.sort((a, b) => {
        if (a["date"] > b["date"])
            return 1;
        if (a["date"] < b["date"])
            return -1;

        if (a["title"] > b["title"])
            return 1;
        if (a["title"] < b["title"])
            return -1;
        return 0;
    });
}

function SortSeenMuch() {
    lib.sort((a, b) => {
        var aw = Number(a["watchcount"]);
        if (isNaN(aw)) {
            aw = 0;
        }
        var bw = Number(b["watchcount"]);
        if (isNaN(bw)) {
            aw = 0;
        }
        if (aw < bw)
            return 1;
        if (aw > bw)
            return -1;
        return 0;
    });
}

function SortSeenLess() {
    lib.sort((a, b) => {
        var aw = Number(a["watchcount"]);
        if (isNaN(aw)) {
            aw = 0;
        }
        var bw = Number(b["watchcount"]);
        if (isNaN(bw)) {
            aw = 0;
        }
        if (aw > bw)
            return 1;
        if (aw < bw)
            return -1;
        return 0;
    });
}

function addToWishList (e) {
    var strE = escapeHtml(JSON.stringify(e));
    wishList += '<div id="'+e.title+'">';
    wishList += '<table width="100%" height="100%">';
    wishList += '<tr>';
    wishList += '<td>';
    wishList += '<svg onclick="delWish(\''+strE+'\');" class="wishlistButton" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.001 512.001" xml:space="preserve"><g><g><path d="M505.922,476.567L285.355,256L505.92,35.435c8.106-8.105,8.106-21.248,0-29.354c-8.105-8.106-21.248-8.106-29.354,0L256.001,226.646L35.434,6.081c-8.105-8.106-21.248-8.106-29.354,0c-8.106,8.105-8.106,21.248,0,29.354L226.646,256L6.08,476.567c-8.106,8.106-8.106,21.248,0,29.354c8.105,8.105,21.248,8.106,29.354,0l220.567-220.567l220.567,220.567c8.105,8.105,21.248,8.106,29.354,0S514.028,484.673,505.922,476.567z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
    wishList += '</td><td>';
    wishList += '<nobr>&#160;</nobr>';
    wishList += '</td><td>';
    wishList += '<svg onclick="boughtWish(\''+strE+'\');" class="wishlistButton" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m453.332031 512h-394.664062c-32.363281 0-58.667969-26.304688-58.667969-58.667969v-394.664062c0-32.363281 26.304688-58.667969 58.667969-58.667969h330.835937c21.054688 0 41.683594 8.535156 56.554688 23.445312l42.496094 42.496094c15.125 15.125 23.445312 35.222656 23.445312 56.574219v330.816406c0 32.363281-26.304688 58.667969-58.667969 58.667969zm-394.664062-480c-14.699219 0-26.667969 11.96875-26.667969 26.667969v394.664062c0 14.699219 11.96875 26.667969 26.667969 26.667969h394.664062c14.699219 0 26.667969-11.96875 26.667969-26.667969v-330.816406c0-12.820313-4.992188-24.871094-14.058594-33.941406l-42.496094-42.496094c-8.9375-8.957031-21.289062-14.078125-33.941406-14.078125zm0 0"/><path d="m325.332031 149.332031h-224c-8.832031 0-16-7.167969-16-16v-117.332031c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v101.332031h192v-101.332031c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v117.332031c0 8.832031-7.167969 16-16 16zm0 0"/><path d="m256 416c-52.929688 0-96-43.070312-96-96s43.070312-96 96-96 96 43.070312 96 96-43.070312 96-96 96zm0-160c-35.285156 0-64 28.714844-64 64s28.714844 64 64 64 64-28.714844 64-64-28.714844-64-64-64zm0 0"/></svg>';
    wishList += '</td><td>';
    wishList += '<nobr>&#160;</nobr>';
    wishList += '</td><td>';
    wishList += '<svg onclick="shareWish(\''+strE+'\');" class="wishlistButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551.13 551.13"><g><path d="m465.016 172.228h-51.668v34.446h34.446v310.011h-344.457v-310.011h34.446v-34.446h-51.669c-9.52 0-17.223 7.703-17.223 17.223v344.456c0 9.52 7.703 17.223 17.223 17.223h378.902c9.52 0 17.223-7.703 17.223-17.223v-344.456c0-9.52-7.703-17.223-17.223-17.223z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/><path d="m258.342 65.931v244.08h34.446v-244.08l73.937 73.937 24.354-24.354-115.514-115.514-115.514 115.514 24.354 24.354z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/></g> </svg>';
    wishList += '</td><td>';
    wishList += '<nobr>&#160;</nobr>';
    wishList += '</td>';
    wishList += '<td style="width: 100%; text-align: left;">';
    wishList += '<b style="font-size: 20px;">'+e.title+'</b><br>';
    wishList += '</td>';
    wishList += '</tr>';
    wishList += '</table>';
    wishList += '</div>';
}

function switchWishlistButton(){
    if (wishlist.length > 0 && document.getElementById("addWish").value==="") {
        document.getElementById("addWishToDB").style.display = "none";
        document.getElementById("shareFullWishList").style.display = "block";
    }
    else {
        document.getElementById("addWishToDB").style.display = "block";
        document.getElementById("shareFullWishList").style.display = "none";
    }
}

function loadWishlist () {
    switchWishlistButton();
    document.getElementById("wishList-view").innerHTML = "";
    wishList = "";
    wishlist.forEach(element => addToWishList(element));
    
    document.getElementById("wishList-view").innerHTML = wishList;
}

function createAlphaSeachString (libEl) {
    if (libEl.group !== undefined && libEl.group != "") {
        return String(libEl.group+libEl.episode);
    }
    else {
        return String(libEl.title)
    }
}

function updateStatistics() {
    function getBarDiv(percent, count) {
        let bgc;
        if (percent>20) {
            bgc = 'linear-gradient( to right, var(--accent3), var(--accent2))';
        }
        else {
            bgc = 'var(--accent3)';
        }
        return ('<div style="width:'+String(Math.round(percent))+'%;background:'+bgc+';border-radius:16px;overflow:visible;">&#160;&#160;'+String(count)+'</div>');
    }
    statisticsHtml = ""

    var statiDatas = [
        {name:"Medien",object:document.getElementById("detailTyp").options,id:"typ"},
        {name:"Stati",object:document.getElementById("detailStatus").options,id:"status"}
    ];
    statiDatas.forEach(statiData => {
        if (statisticsHtml!=="") {
            statisticsHtml += '<tr><td>&#160;</td></tr>';
        }
        statisticsHtml += '<tr><td><b>'+statiData.name+'</b></td></tr>';
        for (let i=0; i<statiData.object.length; i++) {
            let counter = 0;
            lib.forEach(libEl => {
                if (libEl[statiData.id] === String(i)) {
                    counter++;
                }
            });
            if (counter>0)
            statisticsHtml += '<tr><td>'+statiData.object[i].text+'</td><td style="width:100%;">'+getBarDiv(((counter/lib.length)*100), counter)+'</td></tr>';
        }
    });

    statisticsHtml += '<tr><td>&#160;</td></tr>';
    
    let counter = 0;
    lib.forEach(libEl => {
        if (libEl.fav === "true") {
            counter++;
        }
    });
    statisticsHtml += '<tr><td><b>Favoriten</b></td><td style="width:100%;">'+getBarDiv(((counter/lib.length)*100), counter)+'</td></tr>';

    document.getElementById("statisticsTable").innerHTML = statisticsHtml;
}

/***********************************************************************************/

document.getElementById("themeSelect").value = theme;
document.getElementById("quitAskSwitch").checked = (quitAsk === "true");

lib = JSON.parse(JSON.stringify(lib).replace(/http:/gi, "https:"));

sort();
CreateList();
loadWishlist();

var updateAlphabeticalScroll = setInterval (()=>{
    var alphaLetters = document.getElementsByClassName("alphabeticalScrollLetter");
    var alphaScrollLetterheight = Number(document.getElementById("list-view").offsetHeight - 199) / Number(alphaLetters.length)
    var fs = (alphaScrollLetterheight/2)+2;
    if (fs>14) {
      fs=14;
    }
    for (var i=0; i<alphaLetters.length; i++) {
        alphaLetters[i].style.height = String(alphaScrollLetterheight)+"px";
        document.getElementsByClassName("alphabeticalScrollLetterTxt")[i].style.fontSize = String(fs)+"px";
    }
}, 500);

var height = 0;
function updateDialogSizeFc () {
    if (height !== window.innerHeight) {
        height = window.innerHeight;
        var dialogs = document.getElementsByClassName("floatingChild2");
        for (var i=0; i<dialogs.length; i++) {
            dialogs[i].style.top = "";
            if ((dialogs[i].offsetHeight + 48) > window.innerHeight ) {
                dialogs[i].style.top = "24px";
            }
        }
    }
}
var updateDialogSize = setInterval (()=>{
    updateDialogSizeFc();
}, 500);

function pushInterface(str){
    if(location.hash === "#null") {
        console.log(str);
        if(history.pushState) {
            history.pushState(null, null, '#'+str);
        }
        else {
            location.hash = '#'+str;
        }
    }
    else {
        sendArr.push(str);
        console.log("[added] "+str)
    }
}

function resetInterface(){
    if(history.pushState) {
        history.pushState(null, null, '#null');
    }
    else {
        location.hash = '#null';
    }
}

var his = location.hash;
var interfaceTimer = setInterval (()=>{
    if (his === location.hash) {
        if (sendArr.length > 0) {
            if(history.pushState) {
                history.pushState(null, null, '#'+sendArr[0]);
            }
            else {
                location.hash = '#'+sendArr[0];
            }
            console.log(sendArr[0]);
            sendArr.shift();
        }
        else {
            resetInterface();
        }
    }
    else {
        his = location.hash;
    }
}, Number(speed));

function dialogOpen(){
    var floatingChild2 = document.getElementsByClassName("floatingChild2");
    for (var i=0; i<floatingChild2.length; i++) {
        if (floatingChild2[i].parentElement.style.cssText != 'transform: translateX(200%);' && floatingChild2[i].parentElement.style.cssText != "") {
            console.log(floatingChild2[i].parentElement.style.cssText)
            return (true);
        }
    }
    return (false);
}

window.addEventListener('popstate', function(event) {
    if (!dialogOpen()) {
        if (quitAsk === "true") {
            doBlur();
            document.getElementById('quitView').style.transform = 'translateX(0)';
        }
        else {
            pushInterface('quit');
        }
    }
    else {
        var floatingChild1 = document.getElementsByClassName("floatingChild1");
        for (var i=0; i<floatingChild1.length; i++) {
            eventFire(floatingChild1[i], 'click');
        }
    }
}, false);

resetInterface();

