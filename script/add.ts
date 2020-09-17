/// <reference path="ui.ts"/>
addButton.addEventListener("click", () => {
  let view = document.createElement("div");
  view.classList.add("AddTitleView");

  let name = document.createElement("input");
  name.type = "text";
  name.placeholder = "Titel suchen";
  view.appendChild(name);
  let resultList = document.createElement("ul");
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
          `https://imdb-api.com/de/API/Search/${api.imdb}/${encodeURIComponent(
            name.value
          )}`
        ).then((v) => {
          let response = <imdbSearchRes>JSON.parse(v);
          if (response.results.length > 0) {
            let mov = response.results;
            for (let el of mov) {
              cache.imdb.set(el.id, el);
              let li = document.createElement("li");
              let cover = cache.img(el.image);
              li.appendChild(cover);
              let title = document.createElement("span");
              title.innerHTML = `<b>${el.title}</b>\n${el.description}`;
              li.appendChild(title);
              li.setAttribute(
                "onclick",
                `database.movies.add("${el.id}");anim.rem("addMovieDialog");`
              );
              resultList.appendChild(li);
            }
          } else {
            console.error(response.errorMessage);
          }
        });
      }
    }, 750);
  };

  let blur = document.createElement("div");
  blur.classList.add("blur");
  blur.appendChild(view);
  blur.id = "addMovieDialog";
  blur.addEventListener("click", (ev: MouseEvent) => {
    if (ev.target && (<HTMLElement>ev.target).id === "addMovieDialog") {
      anim.rem("addMovieDialog");
    }
  });
  document.body.appendChild(blur);
});
