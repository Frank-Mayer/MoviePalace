/// <reference path="version.ts"/>
/// <reference path="lib/rocket.ts"/>
/// <reference path="ui.ts"/>
/// <reference path="login.ts"/>
/// <reference path="firebase.ts"/>

enum MediaType {
  "Blu-Ray",
  "DVD",
  "Prime Video",
  "Google Play",
  "Apple TV",
  "Sonstiges",
}

enum OwningStatus {
  "Verfügbar",
  "Verliehen",
  "Ausgeliehen",
  "Bestellt",
  "Reserviert",
}

class Movie {
  fav: boolean = false;
  date: string = new Date().toJSON();
  watchcount: number = 0;
  typ: MediaType = MediaType["Blu-Ray"];
  status: OwningStatus = OwningStatus["Verfügbar"];
  cover: string;
  mediaType: string;
  title: string;
  original: string;
  info: string;
  adult: boolean;
  genres: Array<string>;
  id: number;
  cast: Array<tmdb.Cast>;
  crew: Array<tmdb.Crew>;
  collection: tmdb.collection | null;
  backdropPath: string;
  constructor(data: tmdb.search.result) {
    this.collection = null;
    this.cast = new Array<tmdb.Cast>();
    this.crew = new Array<tmdb.Crew>();
    this.cover = getPosterUrlBypath(data.poster_path);
    this.mediaType = data.media_type ? data.media_type : "movie";
    this.title = data.title ? data.title : data.name ? data.name : "";
    this.backdropPath = data.backdrop_path ? data.backdrop_path : "";
    this.original = data.original_title ? data.original_title : this.title;
    this.info = data.overview ? data.overview : "";
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
  idb: {
    shelf: new IDB<Movie>("shelf", version),
    wishlist: new IDB<Movie>("wishlist", version),
    pref: new IDB<number>("pref", version),
  },
  loadFullDB() {
    if (this.idb.shelf) {
      database.movies.storage = new Array<Movie>();
      this.idb.shelf.select((cursor) => {
        database.movies.storage.push(cursor.value);
        retriggerableDelay("loadFullDB", 500, movieList.update);
      });
    }
    if (this.idb.wishlist) {
      database.movies.wishlist = new Array<Movie>();
      this.idb.wishlist.select((cursor) => {
        database.movies.wishlist.push(cursor.value);
      });
    }
  },
  addToShelf(a: Movie) {
    if (this.idb.shelf) {
      this.idb.shelf.set(a.id.toString(), a);
      fb.addToShelf(a.id.toString(), a);
    }
  },
  addToWishList(a: Movie) {
    if (this.idb.wishlist) {
      this.idb.wishlist.set(a.id.toString(), a);
      fb.addToWishlist(a.id.toString(), a);
    }
  },
  movies: {
    storage: new Array<Movie>(),
    wishlist: new Array<Movie>(),
    getMovieById(id: number): Promise<Movie | null> {
      return new Promise<Movie | null>(async (resolve, reject) => {
        for await (const mov of this.storage) {
          if (mov.id == id) {
            resolve(mov);
            return;
            break;
          }
        }
        reject(`Movie '${id}' not found`);
      });
    },
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
            await fb.deleteShelf(id.toString());
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
          await fb.addToShelf(id.toString(), database.movies.storage[i]);
          movieList.update();
          break;
        }
      }
    },
    setType(id: number, value: MediaType): void {
      this.getMovieById(id).then(async (mov) => {
        if (mov) {
          mov.typ = value;
          await database.idb.shelf.update(id.toString(), "typ", value);
          await fb.updateShelf(id.toString(), "typ", value);
          const movEl = document.getElementById("M" + mov.id.toString());
          if (movEl) {
            const typIcon = <HTMLCollectionOf<HTMLImageElement>>(
              movEl.getElementsByClassName("typIcon")
            );
            if (typIcon.length > 0) {
              typIcon[0];
              switch (mov.typ) {
                case MediaType["Blu-Ray"]:
                  typIcon[0].src = "img/bluray.svg";
                  break;
                case MediaType["DVD"]:
                  typIcon[0].src = "img/dvd.svg";
                  break;
                case MediaType["Prime Video"]:
                  typIcon[0].src = "img/prime.svg";
                  break;
                case MediaType["Google Play"]:
                  typIcon[0].src = "img/googleplay.svg";
                  break;
                case MediaType["Apple TV"]:
                  typIcon[0].src = "img/appletv.svg";
                  break;
                default:
                  typIcon[0].src = "img/popcorn.svg";
                  break;
              }
            }
          }
        }
      });
    },
    setStatus(id: number, value: OwningStatus): void {
      this.getMovieById(id).then(async (mov) => {
        if (mov) {
          mov.status = value;
          await database.idb.shelf.update(id.toString(), "status", value);
          await fb.updateShelf(id.toString(), "status", value);
        }
      });
    },
    async setWatchCount(id: number, value: number) {
      if (value >= 0) {
        this.getMovieById(id).then((mov) => {
          if (mov) {
            mov.watchcount = value;
          }
        });
        await database.idb.shelf.update(id.toString(), "watchcount", value);
        await fb.updateShelf(id.toString(), "watchcount", value);
      }
    },
    addWatchCount(id: number, amount: -1 | 1): void {
      const wc = <HTMLInputElement>(
        document.getElementById("WC" + id.toString())
      );
      if (wc) {
        const nv = Math.max(0, Number(wc.value) + amount);
        wc.value = nv.toString();
        this.setWatchCount(id, nv);
      }
    },
    async addFromWishlist(id: number) {
      if (!fb.loggedIn) {
        confirm(
          "Es konnte keine Verbindung zu einer Datenbank hergestellt werden. Entweder ist die Anmeldung fehlgeschlagen oder du bist offline. "
        );
        return;
      }
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
            await database.idb.shelf.set(id.toString(), nm);
            await fb.addToShelf(id.toString(), nm);
            database.movies.storage.push(nm);
            movieList.update();
            setTimeout(() => {
              anim.movieList.scrollToMovie(id);
            }, 500);
            await database.idb.wishlist.delete(id.toString()).catch((e) => {
              console.error(e);
            });
            await fb.deleteWishlist(id.toString());
            break;
          case 0:
            for (let i = 0; i < database.movies.wishlist.length; i++) {
              if (database.movies.wishlist[i].id == id) {
                database.movies.wishlist.splice(i, 1);
                break;
              }
            }
            await database.idb.wishlist.delete(id.toString()).catch((e) => {
              console.error(e);
            });
            await fb.deleteWishlist(id.toString());
            break;
        }
      }
    },
    add(id: number, dontAsk?: number, callback?: (mov: Movie) => void) {
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
                if (dontAsk == 0 || dontAsk == 1) {
                  if (callback) {
                    callback(nm);
                  }
                  switch (dontAsk) {
                    case 1:
                      database.addToShelf(nm);

                      this.storage.push(nm);
                      movieList.update();
                      break;
                    case 0:
                      database.addToWishList(nm);
                      this.wishlist.push(nm);
                      break;
                  }
                } else {
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
                }
              });
          });
      }
    },
  },
};

if (loginData.usr && loginData.pwd) {
  fb.exchange(loginData.usr, loginData.pwd).finally(() => {
    database.loadFullDB();
  });
} else {
  database.loadFullDB();
}
