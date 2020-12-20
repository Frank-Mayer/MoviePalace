/// <reference path="version.ts"/>
/// <reference path="lib/rocket.ts"/>
/// <reference path="ui.ts"/>

class Movie {
  fav?: boolean;
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
    shelf: new IDB<Movie>("shelf", version),
    wishlist: new IDB<Movie>("wishlist", version),
  },
  loadFullDB() {
    if (this.idb.shelf) {
      this.idb.shelf.select((cursor) => {
        database.movies.storage.push(cursor.value);
        movieList.update();
      });
    }
    if (this.idb.wishlist) {
      this.idb.wishlist.select((cursor) => {
        database.movies.wishlist.push(cursor.value);
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
    wishlist: new Array<Movie>(),
    async context(id: number) {
      const controls = document.getElementsByClassName("control");
      for (let i = 0; i < controls.length; i++) {
        (<HTMLElement>controls[i]).style.display = "none";
      }
      const movieLiEl = document.getElementById(id.toString());
      if (movieLiEl) {
        const contr = <HTMLCollectionOf<HTMLElement>>(
          movieLiEl.getElementsByClassName("control")
        );
        if (contr.length === 1) {
          contr[0].style.display = "block";
          await delay(4000);
          contr[0].style.display = "none";
        }
      }
    },
    async remove(id: number): Promise<void> {
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].id == id) {
          if (
            (await confirm(
              `Willst Du '${this.storage[i].title}' wirklich entfernen?`
            )) == 1
          ) {
            database.movies.storage.splice(i, 1);
            await database.idb.shelf.delete(id.toString());
            movieList.update();
          }
          break;
        }
      }
    },
    async has(id: number): Promise<boolean> {
      for await (const mov of this.storage) {
        if (mov.id == id) {
          return true;
        }
      }
      return false;
    },
    async toggleFav(id: number): Promise<void> {
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].id == id) {
          database.movies.storage[i].fav = !database.movies.storage[i].fav;
          await database.idb.shelf.set(
            id.toString(),
            database.movies.storage[i]
          );
          movieList.update();
          break;
        }
      }
    },
    async addFromWishlist(id: number) {
      const nm = await database.idb.wishlist.get(id.toString());
      if (nm) {
        switch (
          await confirm(
            `Möchtest Du '${nm.title}' in dein Regal stellen oder nur aus der Wunschliste entfernen?`,
            "In das Regal stellen",
            "Aus der Wunschliste entfernen"
          )
        ) {
          case 1:
            for (let i = 0; i < database.movies.wishlist.length; i++) {
              if (database.movies.wishlist[i].id == id) {
                database.movies.wishlist.splice(i, 1);
                break;
              }
            }
            database.idb.shelf.set(id.toString(), nm);
            database.movies.storage.push(nm);
            movieList.update();
            setTimeout(() => {
              anim.movieList.scrollToMovie(id);
            }, 500);
            database.idb.wishlist
              .delete(id.toString())
              .catch((e) => console.error);
            break;
          case 0:
            for (let i = 0; i < database.movies.wishlist.length; i++) {
              if (database.movies.wishlist[i].id == id) {
                database.movies.wishlist.splice(i, 1);
                break;
              }
            }
            database.idb.wishlist
              .delete(id.toString())
              .catch((e) => console.error);
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
                      if (actor.order <= 20) {
                        nm.cast.push(actor);
                      }
                    }
                  }
                  if (obj.crew) {
                    for (const cr of obj.crew) {
                      if (cr.order <= 5) {
                        nm.crew.push(cr);
                      }
                    }
                  }
                }
              })
              .finally(() => {
                confirm(
                  `Willst Du '${nm.title}' direkt in dein Regal stellen oder auf die Wunschliste setzen?`,
                  "In das Regal",
                  "Auf die Wunschliste"
                ).then((v) => {
                  if (v == 1) {
                    database.addToShelf(nm);
                    this.storage.push(nm);
                    movieList.update();
                    setTimeout(() => {
                      anim.movieList.scrollToMovie(id);
                    }, 500);
                  } else if (v == 0) {
                    database.addToWishList(nm);
                    this.wishlist.push(nm);
                  }
                });
              });
          });
      }
    },
  },
};

database.loadFullDB();
