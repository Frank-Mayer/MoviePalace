var recommendation = {
    "data":[
        {
            "from":324,
            "to":405,
            "title":"Cargo",
            "cover":"https://upload.wikimedia.org/wikipedia/en/7/7e/Cargo2017poster.jpg"
        },
        {
            "from":324,
            "to":403,
            "title":"Rango",
            "cover":"https://media-cache.cinematerial.com/p/500x/o6pesrwp/rango-blu-ray-movie-cover.jpg?v=1456710663"
        },
        {
            "from":324,
            "to":329,
            "title":"John Wick",
            "cover":"https://cdn.cinematerial.com/p/500x/f0sh3dxo/john-wick-british-movie-poster.jpg?v=1456374794"
        },
        {
            "from":324,
            "to":327,
            "title":"Kingsman - The Golden Circle",
            "cover":"https://cdn.cinematerial.com/p/297x/eyina6l7/kingsman-the-golden-circle-british-movie-poster-md.jpg?v=1502991973"
        }
    ],
    "count":0,
    "html":""
}

var d = new Date();
var day = Number(d.getDate())
var month = Number(d.getMonth()+1)
var comp=(month*100)+day;

recommendation.html += '<tr>';
recommendation.data.forEach(e => {
    if (e.from <= comp && e.to >= comp) {
        recommendation.count++;
        recommendation.html += '<td><div onclick="useRecommendation(\''+escapeHtml(JSON.stringify(e))+'\')" style=\'background-image: url("'+e.cover+'");\'><p>&#160;</p></img></div></td>';
    }
});
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
