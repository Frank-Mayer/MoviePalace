const movieList = {
  update() {
    database.movies.storage.sort((a, b) => {
      let A = a.title.toLowerCase();
      let B = b.title.toLowerCase();
      if (A > B) return 1;
      else if (A < B) return -1;
      else return 0;
    });
    let newMovieList = "";
    let leterList = new Array<string>();
    for (const el of database.movies.storage) {
      let firstLetter = el.title[0].toUpperCase();
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
      li.id = el.title + Math.round(Math.random() * 100).toString();
      let id = JSON.stringify(li.id);

      let clicker = document.createElement("section");
      let cover = document.createElement("img");
      cover.src = el.cover;
      cover.classList.add("cover");
      clicker.appendChild(cover);
      let title = document.createElement("span");
      title.classList.add("title");
      title.innerText = el.title;
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
      let close = document.createElement("img");
      close.src = "img/back.svg";
      close.setAttribute("onclick", `anim.movieList.close(${id})`);
      close.classList.add("closeBtn");
      li.appendChild(close);
      newMovieList += li.outerHTML;
    }
    listView.innerHTML = newMovieList;
    for (const letter of leterList) {
      let li = document.createElement("li");
      li.innerText = letter;
      li.style.height = `${Math.round(99 / leterList.length)}%`;
      scrollBar.appendChild(li);
    }
  },
};
