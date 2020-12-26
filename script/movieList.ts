const movieList = {
  update() {
    database.movies.storage.sort((A, B) => {
      let a = sortValue(A);
      let b = sortValue(B);
      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    });
    let newMovieList = new StringBuilder();
    let leterList = new Array<string>();
    for (const el of database.movies.storage) {
      let elCollectionName = "";
      let firstLetter = sortValue(el, true);
      if (el.collection) {
        elCollectionName = collectionName(el.collection);
      }
      if (
        leterList.length === 0 ||
        leterList[leterList.length - 1] != firstLetter
      ) {
        leterList.push(firstLetter);
        let li = document.createElement("li");
        li.classList.add("letter");
        li.id = "letter" + firstLetter;
        li.innerText = firstLetter;
        newMovieList.append(li.outerHTML);
      }
      let li = document.createElement("li");
      // if (el.collection && el.collection.backdrop_path) {
      //   li.style.setProperty(
      //     "--backdrop-path",
      //     `url(${getPosterUrlBypath(el.collection.backdrop_path)})`
      //   );
      //   li.classList.add("backdrop");
      // } else
      if (el.backdropPath && el.backdropPath.length > 0) {
        li.style.setProperty(
          "--backdrop-path",
          `url(${getPosterUrlBypath(el.backdropPath)})`
        );
        li.classList.add("backdrop");
      }
      li.classList.add("movie");
      if (el.fav) {
        li.classList.add("fav");
      }
      li.id = "M" + el.id.toString();
      let id = JSON.stringify(li.id);

      let clicker = document.createElement("section");
      clicker.classList.add("clicker");
      let cover = document.createElement("img");
      cover.src = el.cover;
      lazyLoad(cover);
      cover.classList.add("cover");
      clicker.appendChild(cover);
      let title = document.createElement("span");
      title.classList.add("title");
      if (el.collection) {
        title.innerHTML = `<i>${htmlEscaper(
          elCollectionName
        )}</i><br/>${htmlEscaper(el.title)}`;
      } else {
        title.innerText = el.title;
      }
      clicker.setAttribute("onclick", `anim.movieList.open(${id})`);
      clicker.setAttribute("oncontextmenu", `database.movies.context(${id})`);
      clicker.appendChild(title);
      li.appendChild(clicker);
      if (el.adult) {
        let adult = document.createElement("span");
        adult.innerText = "18+";
        adult.classList.add("adult");
        li.appendChild(adult);
      }

      li.appendChild(
        tsx("a", {
          innerHTML: "&#9654; Ansehen",
          className: "play",
          target: "_blank",
          href: `https://www.themoviedb.org/${el.mediaType}/${
            el.id
          }-${watchTitle(el.original, el.title)}/watch`,
        })
      );

      const typIcon = document.createElement("img");
      switch (el.typ) {
        case MediaType["Blu-Ray"]:
          typIcon.src = "img/bluray.svg";
          break;
        case MediaType["DVD"]:
          typIcon.src = "img/dvd.svg";
          break;
        case MediaType["Prime Video"]:
          typIcon.src = "img/prime.svg";
          break;
        case MediaType["Google Play"]:
          typIcon.src = "img/googleplay.svg";
          break;
        case MediaType["Apple TV"]:
          typIcon.src = "img/appletv.svg";
          break;
        default:
          typIcon.src = "img/popcorn.svg";
          break;
      }
      typIcon.classList.add("typIcon");

      const type = SelectFromEnum(MediaType, el.typ);
      type.setAttribute(
        "onchange",
        `database.movies.setType(${el.id}, Number(this.value))`
      );
      li.appendChild(type);

      const Status = SelectFromEnum(OwningStatus, el.status);
      Status.setAttribute(
        "onchange",
        `database.movies.setStatus(${el.id}, Number(this.value))`
      );
      li.appendChild(Status);

      const watchCounter = document.createElement("div");
      {
        watchCounter.classList.add("WatchCounter");
        const substract = document.createElement("span");
        substract.innerHTML = "-";
        substract.setAttribute(
          "onclick",
          `database.movies.addWatchCount(${el.id}, -1)`
        );
        watchCounter.appendChild(substract);
        const watchInp = document.createElement("input");
        watchInp.type = "number";
        watchInp.min = "0";
        if (el.watchcount) {
          watchInp.setAttribute("value", Math.max(0, el.watchcount).toString());
        } else {
          watchInp.setAttribute("value", "0");
        }
        watchInp.id = "WC" + el.id.toString();
        watchInp.setAttribute(
          "oninput",
          `database.movies.setWatchCount(${el.id}, this.value)`
        );
        watchCounter.appendChild(watchInp);
        const add = document.createElement("span");
        add.innerHTML = "+";
        add.setAttribute(
          "onclick",
          `database.movies.addWatchCount(${el.id}, 1)`
        );
        watchCounter.appendChild(add);
        li.appendChild(watchCounter);
      }

      let info = document.createElement("p");
      info.classList.add("info");
      info.innerText = el.info;
      li.appendChild(info);

      li.appendChild(typIcon);

      if (el.genres && el.genres.length > 0) {
        let genres = document.createElement("p");
        genres.classList.add("genres");
        genres.innerText = "Genres: " + el.genres.join(", ");
        li.appendChild(genres);
      }

      if (el.cast && el.cast.length > 0) {
        let cast = document.createElement("p");
        cast.classList.add("cast");
        const castNameList = new Array<string>();
        el.cast.forEach((actor) => {
          if (actor.character) {
            castNameList.push(`\t${actor.name}: ${actor.character}`);
          } else {
            castNameList.push(`\t${actor.name}`);
          }
        });
        cast.innerText = "Cast: \n" + castNameList.join("\n");
        li.appendChild(cast);
      }
      const close = document.createElement("img");
      close.src = "img/back.svg";
      close.setAttribute("onclick", `anim.movieList.close(${id});`);
      close.classList.add("closeBtn");
      li.appendChild(close);
      const control = document.createElement("section");
      control.classList.add("control");
      control.style.display = "none";
      control.appendChild(
        tsx("span", {
          innerHTML: "Entfernen",
          onclick: `database.movies.remove(${el.id})`,
        })
      );
      control.appendChild(
        tsx("span", {
          innerHTML: "Favorit",
          onclick: `database.movies.toggleFav(${el.id})`,
        })
      );
      li.appendChild(control);
      newMovieList.append(li.outerHTML);
    }
    listView.innerHTML = newMovieList.toString();
    let newScrollBar = "";
    for (const letter of leterList) {
      let li = document.createElement("li");
      li.innerText = letter;
      li.style.height = `${Math.round(99 / leterList.length)}%`;
      newScrollBar += li.outerHTML;
    }
    scrollBar.innerHTML = newScrollBar;
  },
};
