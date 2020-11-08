const movieList = {
  update() {
    database.movies.storage.sort((A, B) => {
      let a: string;
      if (A.collection) {
        a = collectionName(A.collection.name.toLowerCase()) + A.id;
      } else {
        a = A.title.toLowerCase();
      }

      let b: string;
      if (B.collection) {
        b = collectionName(B.collection.name.toLowerCase()) + B.id;
      } else {
        b = B.title.toLowerCase();
      }

      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    });
    let newMovieList = "";
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
        newMovieList += li.outerHTML;
      }
      let li = document.createElement("li");
      li.classList.add("movie");
      li.id = "M" + el.id.toString();
      let id = JSON.stringify(li.id);

      let clicker = document.createElement("section");
      let cover = document.createElement("img");
      cover.src = el.cover;
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
      clicker.appendChild(title);
      li.appendChild(clicker);
      if (el.adult) {
        let adult = document.createElement("span");
        adult.innerText = "18+";
        adult.classList.add("adult");
        li.appendChild(adult);
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
          castNameList.push(actor.name);
        });
        cast.innerText = "Cast: " + castNameList.join(", ");
        li.appendChild(cast);
      }
      let close = document.createElement("img");
      close.src = "img/back.svg";
      close.setAttribute("onclick", `anim.movieList.close(${id})`);
      close.classList.add("closeBtn");
      li.appendChild(close);
      newMovieList += li.outerHTML;
    }
    listView.innerHTML = newMovieList;
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
