/// <reference path="version.ts"/>
/// <reference path="lib/rocket.ts"/>
/// <reference path="ui.ts"/>
/// <reference path="login.ts"/>
/// <reference path="firebase.ts"/>
/// <reference path="movieList.ts"/>

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
  rating: number = 50;
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
    this.title = getTitle(data);
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
      database.movies.storage.clear();
      this.idb.shelf.select((cursor) => {
        database.movies.pushMovie(cursor.value);
        retriggerableDelay("loadFullDB", 450, () => {
          movieList.update();
          doOnce(() => {
            setTimeout(() => {
              const recommendations = document.getElementById(
                "recommendations"
              );
              if (recommendations) {
                getRecommendations().then((ul) => {
                  recommendations.appendChild(ul);
                });
              }
            }, 750);
          });
        });
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
    storage: new Map<number, Movie>(),
    wishlist: new Array<Movie>(),
    pushMovie(mov: Movie) {
      this.storage.set(mov.id, mov);
    },
    context(id: number) {
      const controls = shelfUi.getElementsByClassName("control");
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
          setTimeout(() => {
            contr[0].style.display = "none";
          }, 3000);
        }
      }
    },
    async remove(id: number): Promise<void> {
      const mov = this.storage.get(id);
      if (
        mov &&
        (await confirm(`Willst Du '${mov.title}' wirklich entfernen?`)) == 1
      ) {
        this.storage.delete(id);
        const awaitIdb = database.idb.shelf.delete(id.toString());
        const awaitFb = fb.deleteShelf(id.toString());
        await awaitIdb;
        await awaitFb;
        movieList.update();
      }
    },
    async toggleFav(id: number): Promise<void> {
      const mov = this.storage.get(id);
      if (mov) {
        mov.fav = !mov.fav;
        const awaitIdb = database.idb.shelf.set(id.toString(), mov);
        const awaitFB = fb.addToShelf(id.toString(), mov);
        await awaitIdb;
        await awaitFB;
        movieList.update();
      }
    },
    async setType(id: number, value: MediaType): Promise<void> {
      const mov = this.storage.get(id);
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
    },
    async setStatus(id: number, value: OwningStatus): Promise<void> {
      const mov = this.storage.get(id);
      if (mov) {
        mov.status = value;
        await database.idb.shelf.update(id.toString(), "status", value);
        await fb.updateShelf(id.toString(), "status", value);
      }
    },
    setWatchCount(id: number, value: number): void {
      if (value >= 0) {
        retriggerableDelay("setWatchCount", 750, async () => {
          const mov = this.storage.get(id);
          if (mov) {
            mov.watchcount = value;
          }
          await database.idb.shelf.update(id.toString(), "watchcount", value);
          await fb.updateShelf(id.toString(), "watchcount", value);
        });
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
    setRating(id: number): void {
      retriggerableDelay(
        `setRating${id}`,
        750,
        async (elId: string = `R${id}`) => {
          const slider = <HTMLInputElement | null>document.getElementById(elId);
          if (slider) {
            await database.idb.shelf.update(
              id.toString(),
              "rating",
              Number(slider.value)
            );
            await fb.updateShelf(id.toString(), "rating", Number(slider.value));
          }
        }
      );
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
            database.movies.pushMovie(nm);
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

                      this.pushMovie(nm);
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
                      this.pushMovie(nm);
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
  database.loadFullDB();
  fb.exchange(loginData.usr, loginData.pwd).finally(() => {
    database.loadFullDB();
  });
} else {
  confirm("Du musst dich anmelden um alle Funktionen nutzen zu können").then(
    (v) => {
      if (v == 1) {
        const newUsr = prompt("Nutzername");
        if (newUsr) {
          const newPwd = prompt("Passwort");
          if (newPwd) {
            loginData.usr = newUsr;
            loginData.pwd = newPwd;
            fb.exchange(loginData.usr, loginData.pwd).finally(() => {
              database.loadFullDB();
            });
          }
        }
      }
    }
  );
  database.loadFullDB();
}
