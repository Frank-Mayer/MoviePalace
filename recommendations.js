var recommendation = {
    "data":[
        {
            "from":408,
            "to":415,
            "title":"Die Insel der besonderen Kinder",
            "cover":"https://is3-ssl.mzstatic.com/image/thumb/Video52/v4/00/a7/d9/00a7d984-a010-f420-6b37-5d224257cd36/MissPeregrines_2000x3000_DE.lsr/268x0w.png"
        },
        {
            "from":408,
            "to":412,
            "title":"Phantastische Tierwesen und wo sie zu finden sind",
            "cover":"https://image.tmdb.org/t/p/w500/wtbpEoZMfzzgZxMdiFkCXQzqUjl.jpg"
        },
        {
            "from":408,
            "to":416,
            "title":"Die Känguru Chroniken",
            "cover":"https://static.kino.de/wp-content/uploads/2018/03/Die-Kaenguru-Chroniken-Poster-2020-rcm175x260u.jpg"
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
