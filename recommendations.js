var recommendation = {
    "data":[
        {
            "from":229,
            "to":313,
            "title":"Passengers",
            "cover":"https://cdn.cinematerial.com/p/297x/cvwsathm/passengers-movie-poster-md.jpg?v=1478198394"
        },
        {
            "from":229,
            "to":324,
            "title":"Paul - Ein Alien auf der Flucht",
            "cover":"https://de.web.img3.acsta.net/medias/nmedia/18/79/96/08/19660553.jpg"
        },
        {
            "from":229,
            "to":326,
            "title":"Knives Out",
            "cover":"https://media-cache.cinematerial.com/p/500x/xsf7b61u/knives-out-movie-cover.jpg?v=1580267052"
        },
        {
            "from":229,
            "to":328,
            "title":"Valerian – Die Stadt der tausend Planeten",
            "cover":"https://de.web.img3.acsta.net/r_1280_720/pictures/17/03/24/14/15/316061.jpg"
        }
    ],
    "count":0,
    "html":""
}

var d = new Date();
var day = Number(d.getDate())
var month = Number(d.getMonth()+1)
var comp=(month*100)+day;
console.log(comp)

recommendation.html += '<tr>';
recommendation.data.forEach(e => {
    if (e.from <= comp && e.to >= comp) {
        recommendation.count++;
        recommendation.html += '<td><div onclick="useRecommendation(\''+escapeHtml(JSON.stringify(e))+'\')" style=\'background-image: url("'+e.cover+'");\'><p>&#160;</p></img></div></td>';
    }
});
// recommendation.html += '</tr><tr>';
// recommendation.data.forEach(e => {
//     if (e.date.month >= month && e.date.day >= day) {
//         recommendation.html += '<td><p>'+e.title.replace(/ /g, "<br>")+'</p></td>';
//     }
// });
recommendation.html += '</tr>';

var encRecTitle;

function useRecommendation (e) {
    e = JSON.parse(e);
    document.getElementById("recommendationCover").src = e.cover;
    document.getElementById("recommendationTitle").innerHTML = e.title;
    encRecTitle = e.title;
    document.getElementById('recommendations').style.transform = 'translateX(0)';
    doBlur();
}

function buyRec(){
    send("sharePlainText","",encodeURI('https://www.amazon.de/s?k='+escapeHtml(encRecTitle)+'&i=dvd&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss'));
}
