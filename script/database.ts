const database = {
  movies: {
    storage: new Array<imdbSearchResEl>(),
    add(imdbid: string) {
      if (cache.imdb.has(imdbid)) {
        this.storage.push(cache.imdb.get(imdbid));
        movieList.update();
      }
    },
  },
};
