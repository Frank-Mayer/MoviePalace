/// <reference path="version.ts"/>
/// <reference path="lib/rocket.ts"/>
/// <reference path="ui.ts"/>

class Movie {
  cover: string;
  title: string;
  info: string;
  adult: boolean;
  genres: Array<string>;
  id: number;
  cast: Array<tmdb.Cast>;
  crew: Array<tmdb.Crew>;
  collection: tmdb.collection | null;
  constructor(data: tmdb.search.result) {
    this.collection = null;
    this.cast = new Array<tmdb.Cast>();
    this.crew = new Array<tmdb.Crew>();
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

enum dbStoreNames {
  shelf = "shelf",
  wishlist = "wishlist",
}

const database = {
  idb: {
    shelf: new IDB("shelf", version),
    wishlist: new IDB("wishlist", version),
  },
  loadFullDB() {
    if (this.idb.shelf) {
      this.idb.shelf.select<Movie>((cursor) => {
        database.movies.storage.push(cursor.value);
        movieList.update();
      });
    }
  },
  addToShelf(a: Movie) {
    if (this.idb.shelf) {
      this.idb.shelf.set(a.id.toString(), a);
    }
  },
  addToWishList(a: Movie) {
    if (this.idb.wishlist) {
      this.idb.wishlist.set(a.id.toString(), a);
    }
  },
  movies: {
    storage: new Array<Movie>(),
    context(id: number) {
      const controls = document.getElementsByClassName("control");
      for (let i = 0; i < controls.length; i++) {
        (<HTMLElement>controls[i]).style.display = "none";
      }
      const movieLiEl = document.getElementById(id.toString());
      if (movieLiEl) {
        const contr = movieLiEl.getElementsByClassName("control");
        if (contr.length === 1) {
          (<HTMLElement>contr[0]).style.display = "block";
        }
      }
    },
    async remove(id: number): Promise<void> {
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].id == id) {
          database.movies.storage.splice(i, 1);
          await database.idb.shelf.delete(id.toString());
          movieList.update();
          break;
        }
      }
    },
    add(id: number) {
      if (cache.tmdb.has(id)) {
        const nm = new Movie(<tmdb.search.result>cache.tmdb.get(id));
        httpGet(
          `https://api.themoviedb.org/3/movie/${id.toString()}?api_key=${
            api.tmdb
          }&language=de`,
          true
        )
          .then((r) => {
            if (r) {
              const obj = JSON.parse(r);
              console.debug(obj);
              nm.collection = obj.belongs_to_collection;
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            httpGet(
              `https://api.themoviedb.org/3/movie/${id.toString()}/credits?api_key=${
                api.tmdb
              }&language=de`,
              true
            )
              .catch((e) => {
                console.error(e);
              })
              .then((r) => {
                if (r) {
                  const obj = JSON.parse(r);
                  if (obj.cast) {
                    for (const actor of obj.cast) {
                      if (actor.order < 10) {
                        nm.cast.push(actor);
                      }
                    }
                  }
                  if (obj.crew) {
                    for (const actor of obj.crew) {
                      if (actor.order < 5) {
                        nm.crew.push(actor);
                      }
                    }
                  }
                }
              })
              .finally(() => {
                database.addToShelf(nm);
                this.storage.push(nm);
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
              });
          });
      }
    },
  },
};

database.loadFullDB();
