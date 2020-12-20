/// <reference path="ui.ts"/>
/// <reference path="tmdb.ts"/>
/// <reference path="search.ts"/>

addButton.addEventListener("click", (): void => {
  const view = document.createElement("div");
  view.classList.add("AddTitleView");
  view.classList.add("popup");

  const name = document.createElement("input");
  name.type = "text";
  name.placeholder = "Neuen Titel suchen";
  name.autofocus = true;
  view.appendChild(name);
  const resultList = document.createElement("ul");
  resultList.classList.add("searchResults");
  view.appendChild(resultList);
  name.oninput = () => {
    resultList.innerHTML = "";
    retriggerableDelay("addInput", 750, () => {
      if (name.value.length > 0) {
        httpGet(
          `https://api.themoviedb.org/3/search/multi?api_key=${
            api.tmdb
          }&language=de&query=${encodeURIComponent(
            name.value
          )}&include_adult=true&region=de`,
          true
        ).then(async (v) => {
          const response = <tmdb.search.multi>JSON.parse(v);
          if (response.results && response.results.length > 0) {
            const mov = response.results;
            for (const el of mov) {
              if (
                (el.media_type === "movie" || el.media_type === "tv") &&
                !(await database.movies.has(el.id))
              ) {
                if (!cache.tmdb.has(el.id)) {
                  cache.tmdb.set(el.id, el);
                }
                resultList.appendChild(popupSearchLi(el));
              }
            }
          } else {
            console.log("No movies found\n" + v);
          }
        });
      }
    });
  };

  const blur = document.createElement("div");
  blur.classList.add("blur");
  blur.appendChild(view);
  blur.id = "addMovieDialog";
  blur.addEventListener("click", (ev: MouseEvent) => {
    if (ev.target && (<HTMLElement>ev.target).id === "addMovieDialog") {
      anim.popup.close("addMovieDialog");
    }
  });
  document.body.appendChild(blur);
  name.focus();
});
