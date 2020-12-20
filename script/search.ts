/// <reference path="ui.ts"/>
/// <reference path="tmdb.ts"/>

function popupSearchLi(el: tmdb.search.result | Movie): HTMLLIElement {
  const li = document.createElement("li");
  let cover;
  if (Object.keys(el).includes("cover")) {
    cover = cache.img((<Movie>el).cover);
    li.setAttribute(
      "onclick",
      `anim.movieList.scrollToMovie(${el.id}, true);anim.popup.close("searchMovieDialog");`
    );
  } else {
    cover = cache.img(getPosterUrlBypath((<tmdb.search.result>el).poster_path));
    li.setAttribute(
      "onclick",
      `database.movies.add(${el.id.toString()});anim.popup.close("addMovieDialog");`
    );
  }
  li.appendChild(cover);
  const title = document.createElement("span");
  title.innerHTML = `<b>${
    el.title ? el.title : (<tmdb.search.result>el).name
  }</b>`;
  li.appendChild(title);
  return li;
}

searchButton.addEventListener("click", (): void => {
  const view = document.createElement("div");
  view.classList.add("SearchLibView");
  view.classList.add("popup");

  const name = document.createElement("input");
  name.type = "text";
  name.placeholder = "Titel suchen";
  name.autofocus = true;
  view.appendChild(name);
  const resultList = document.createElement("ul");
  resultList.classList.add("searchResults");
  view.appendChild(resultList);
  name.oninput = () => {
    const search = name.value;
    resultList.innerHTML = "";
    if (name.value.length > 0 && search.length > 0) {
      const searchRegExp = new RegExp(search, "i");
      for (const movie of database.movies.storage) {
        if (searchRegExp.test(JSON.stringify(movie))) {
          resultList.appendChild(popupSearchLi(movie));
        }
      }
    }
  };

  const blur = document.createElement("div");
  blur.classList.add("blur");
  blur.appendChild(view);
  blur.id = "searchMovieDialog";
  blur.addEventListener("click", (ev: MouseEvent) => {
    if (ev.target && (<HTMLElement>ev.target).id === "searchMovieDialog") {
      anim.popup.close("searchMovieDialog");
    }
  });
  document.body.appendChild(blur);
  name.focus();
});
