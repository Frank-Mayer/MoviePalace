/// <reference path="version.ts"/>

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
  idb: indexedDB.open("library", version),
  dbRef: <IDBDatabase>(<unknown>null),
  loadFullDB() {
    if (this.dbRef) {
      const tx = this.dbRef.transaction(dbStoreNames.shelf, "readonly");
      const shelf = tx.objectStore(dbStoreNames.shelf);
      const request = shelf.openCursor();
      if (request) {
        (<IDBRequest<IDBCursorWithValue>>request).onsuccess = (ev) => {
          const cursor = <IDBCursorWithValue>(<any>ev.target).result;
          if (cursor) {
            database.movies.storage.push(cursor.value);
            movieList.update();
            cursor.continue();
          }
        };
      }
    }
  },
  addToShelf(a: Movie) {
    if (this.dbRef) {
      const tx = this.dbRef.transaction(dbStoreNames.shelf, "readwrite");
      tx.onerror = (ev) => {
        alert((<any>ev.target).error);
        console.error(ev);
      };
      const shelf = tx.objectStore(dbStoreNames.shelf);
      shelf.add(a);
    }
  },
  addToWishList(a: Movie) {
    if (this.dbRef) {
      const tx = this.dbRef.transaction(dbStoreNames.wishlist, "readwrite");
      tx.onerror = (ev) => {
        alert((<any>ev.target).error);
        console.error(ev);
      };
      const wishlist = tx.objectStore(dbStoreNames.wishlist);
      wishlist.add(a);
    }
  },
  movies: {
    storage: new Array<Movie>(),
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

database.idb.onupgradeneeded = (e) => {
  let t = e.target;
  if (t) {
    database.dbRef = (<any>t).result;
    database.dbRef.createObjectStore(dbStoreNames.shelf, { keyPath: "id" });
    database.dbRef.createObjectStore(dbStoreNames.wishlist, { keyPath: "id" });
  }
};
database.idb.onsuccess = (e) => {
  let t = e.target;
  if (t) {
    database.dbRef = (<any>t).result;
  }
  database.loadFullDB();
};
database.idb.onerror = (e) => {
  console.error(e);
};
