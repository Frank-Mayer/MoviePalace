/// <reference path="version.ts"/>

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
  wishlist: indexedDB.open(dbStoreNames.shelf, version),
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
        const nm = new Movie(<tmdb.search.result>cache.tmdb.get(id));
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
  console.debug(e);
};
database.idb.onsuccess = (e) => {
  let t = e.target;
  if (t) {
    database.dbRef = (<any>t).result;
  }
  console.debug(e);
  database.loadFullDB();
};
database.idb.onerror = (e) => {
  console.error(e);
};
