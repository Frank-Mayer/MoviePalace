/// <reference path="ui.ts"/>
/// <reference path="tmdb.ts"/>
/// <reference path="search.ts"/>

wishlistButton.addEventListener("click", (): void => {
  const view = document.createElement("div");
  view.classList.add("WishlistTitleView");
  view.classList.add("popup");

  const name = document.createElement("input");
  name.type = "text";
  name.placeholder = "Wunschliste durchsuchen";
  name.autofocus = true;
  view.appendChild(name);
  const resultList = document.createElement("ul");
  resultList.classList.add("searchResults");
  view.appendChild(resultList);
  const updateList = () => {
    resultList.innerHTML = "";
    const searchRegExp = new RegExp(name.value, "i");
    for (const movie of database.movies.wishlist) {
      if (searchRegExp.test(JSON.stringify(movie))) {
        resultList.appendChild(popupSearchLi(movie, true));
      }
    }
  };
  name.oninput = updateList;

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

  updateList();

  name.focus();
});
