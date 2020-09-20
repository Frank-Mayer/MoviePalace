class Movie {
  cover: string;
  title: string;
  info: string;
  adult: boolean;
  genres: Array<string>;
  id: number;
  constructor(data: tmdb.search.result) {
    this.cover = getPosterUrlBypath(data.poster_path);
    this.title = data.title ? data.title : data.name ? data.name : "";
    this.info = data.overview;
    this.adult = data.adult === true;
    this.genres = new Array<string>();
    for (const genreId of data.genre_ids) {
      if (genreIDs.has(genreId)) {
        this.genres.push(<string>genreIDs.get(genreId));
      }
    }
    this.id = data.id;
  }
}

const database = {
  movies: {
    storage: new Array<Movie>(),
    add(id: number) {
      if (cache.tmdb.has(id)) {
        // httpGet(
        //   `https://api.themoviedb.org/3/movie/${id.toString()}?api_key=${
        //     api.tmdb
        //   }`
        // ).then((v) => {
        //   console.log(v);
        // });
        this.storage.push(new Movie(<tmdb.search.result>cache.tmdb.get(id)));
        movieList.update();
        setTimeout(() => {
          (<HTMLElement>(
            document.getElementById("M" + id.toString())
          )).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }, 500);
      }
    },
  },
};
