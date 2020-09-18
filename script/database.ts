class Movie {
  cover: string;
  title: string;
  info: string;
  constructor(data: imdbSearchResEl) {
    this.cover = data.image;
    this.title = data.title;
    this.info = data.description;
  }
}

const database = {
  movies: {
    storage: new Array<Movie>(),
    add(imdbid: string) {
      if (cache.imdb.has(imdbid)) {
        this.storage.push(new Movie(<imdbSearchResEl>cache.imdb.get(imdbid)));
        movieList.update();
      }
    },
  },
};
