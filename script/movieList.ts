const movieList = {
  update() {
    database.movies.storage.sort((a, b) => {
      if (a.title > b.title) return 1;
      else if (a.title < b.title) return -1;
      else return 0;
    });
    let newMovieList = "";
    for (const el of database.movies.storage) {
      let li = document.createElement("li");
      let cover = cache.img(el.image);
      li.appendChild(cover);
      let title = document.createElement("span");
      title.innerHTML = `<b>${el.title}</b><br/>${el.description}`;
      li.appendChild(title);
      newMovieList += li.outerHTML;
    }
    listView.innerHTML = newMovieList;
  },
};
