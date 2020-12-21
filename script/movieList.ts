const movieList = {
  update() {
    database.movies.storage.sort((A, B) => {
      let a: string;
      if (A.collection) {
        a =
          collectionName(A.collection.name.toLowerCase()) +
          A.id.toString().padStart(15, "0");
      } else {
        a = A.title.toLowerCase();
      }

      let b: string;
      if (B.collection) {
        b =
          collectionName(B.collection.name.toLowerCase()) +
          B.id.toString().padStart(15, "0");
      } else {
        b = B.title.toLowerCase();
      }

      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    });
    let newMovieList = new StringBuilder();
    let leterList = new Array<string>();
    for (const el of database.movies.storage) {
      let firstLetter: string;
      if (el.collection) {
        firstLetter = el.collection.name[0].toUpperCase();
      } else {
        firstLetter = el.title[0].toUpperCase();
      }
      if (
        leterList.length === 0 ||
        leterList[leterList.length - 1] !== firstLetter
      ) {
        leterList.push(firstLetter);
        let li = document.createElement("li");
        li.classList.add("letter");
        li.id = "letter" + firstLetter;
        li.innerText = firstLetter;
        newMovieList.append(li.outerHTML);
      }
      let li = document.createElement("li");
      if (el.collection && el.collection.backdrop_path) {
        li.style.setProperty(
          "--backdrop-path",
          `url(${getPosterUrlBypath(el.collection.backdrop_path)})`
        );
        li.classList.add("collection");
      }
      li.classList.add("movie");
      if (el.fav) {
        li.classList.add("fav");
      }
      li.id = "M" + el.id.toString();
      let id = JSON.stringify(li.id);

      let clicker = document.createElement("section");
      let cover = document.createElement("img");
      cover.src = el.cover;
      lazyLoad(cover);
      cover.classList.add("cover");
      clicker.appendChild(cover);
      let title = document.createElement("span");
      title.classList.add("title");
      if (el.collection) {
        title.innerHTML = `<i>${collectionName(el.collection.name)}</i><br/>${
          el.title
        }`;
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

      const Type = SelectFromEnum(MediaType, el.typ);
      Type.setAttribute(
        "onchange",
        `database.movies.setType(${el.id}, Number(this.value))`
      );
      li.appendChild(Type);

      const Status = SelectFromEnum(OwningStatus);
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
      close.setAttribute("onclick", `anim.movieList.close(${id})`);
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
