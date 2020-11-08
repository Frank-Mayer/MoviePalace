/// <reference path="ui.ts"/>
/// <reference path="tmdb.ts"/>

addButton.addEventListener("click", (): void => {
  const view = document.createElement("div");
  view.classList.add("AddTitleView");
  view.classList.add("popup");

  const name = document.createElement("input");
  name.type = "text";
  name.placeholder = "Titel suchen";
  name.autofocus = true;
  view.appendChild(name);
  const resultList = document.createElement("ul");
  resultList.classList.add("searchResults");
  view.appendChild(resultList);
  let nameChangeTimeout: number | undefined;
  name.oninput = () => {
    resultList.innerHTML = "";
    if (nameChangeTimeout) {
      clearTimeout(nameChangeTimeout);
    }
    nameChangeTimeout = window.setTimeout(() => {
      if (name.value.length > 0) {
        httpGet(
          `https://api.themoviedb.org/3/search/multi?api_key=${
            api.tmdb
          }&language=de&query=${encodeURIComponent(
            name.value
          )}&include_adult=true&region=de`
        ).then((v) => {
          const response = <tmdb.search.multi>JSON.parse(v);
          if (response.results && response.results.length > 0) {
            const mov = response.results;
            for (const el of mov) {
              if (el.media_type === "movie" || el.media_type === "tv") {
                cache.tmdb.set(el.id, el);
                const li = document.createElement("li");
                const cover = cache.img(getPosterUrlBypath(el.poster_path));
                li.appendChild(cover);
                const title = document.createElement("span");
                title.innerHTML = `<b>${el.title ? el.title : el.name}</b>`;
                li.appendChild(title);
                li.setAttribute(
                  "onclick",
                  `database.movies.add(${el.id.toString()});anim.popup.close("addMovieDialog");`
                );
                resultList.appendChild(li);
              }
            }
          } else {
            console.error("Something went wrong\n\n" + v);
          }
        });
      }
    }, 750);
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
