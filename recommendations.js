var recommendation = {
    "data":[
        {
            "from":423,
            "to":501,
            "title":"The Darkest Hour",
            "cover":"https://s3.mzstatic.com/us/r30/Video/ab/e9/61/mzl.hzzzynrq.jpg"
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
    send("appUri","",encodeURI('https://www.amazon.de/s?k='+escapeHtml(encRecTitle)+'&i=dvd&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss'));
}
