/// <reference path="login.ts" />

declare const firebase: any;
const fb = {
  loggedIn: false,
  updateTimestamp() {
    if (this.loggedIn) {
      const now = new Date().getTime();
      database.idb.pref.set("lastCommit", now);
      return <Promise<void>>(
        firebase.database().ref(`users/${loginData.usr}/timestamp`)?.set(now)
      );
    } else {
      throw new Error("Database update not allowed!");
    }
  },
  async addToShelf(id: string, mov: Movie) {
    if (this.loggedIn) {
      await (<Promise<void>>(
        firebase.database().ref(`users/${loginData.usr}/shelf/${id}`)?.set(mov)
      ));
      await this.updateTimestamp();
    } else {
      throw new Error("Database update not allowed!");
    }
  },
  async updateShelf<K extends keyof Movie, V extends Movie[K]>(
    id: string,
    key: K,
    value: V
  ) {
    if (this.loggedIn) {
      await (<Promise<void>>(
        firebase
          .database()
          .ref(`users/${loginData.usr}/shelf/${id}/${key}`)
          .set(value)
      ));
      await this.updateTimestamp();
    } else {
      throw new Error("Database update not allowed!");
    }
  },
  async deleteShelf(id: string) {
    if (this.loggedIn) {
      await (<Promise<void>>(
        firebase.database().ref(`users/${loginData.usr}/shelf/${id}`)?.set(null)
      ));
      await this.updateTimestamp();
    } else {
      throw new Error("Database update not allowed!");
    }
  },
  async deleteWishlist(id: string) {
    if (this.loggedIn) {
      await (<Promise<void>>(
        firebase
          .database()
          .ref(`users/${loginData.usr}/wishlist/${id}`)
          .set(null)
      ));
      await this.updateTimestamp();
    } else {
      throw new Error("Database update not allowed!");
    }
  },
  addToWishlist(id: string, mov: Movie) {
    if (this.loggedIn) {
      this.updateTimestamp();
      return <Promise<void>>(
        firebase
          .database()
          .ref(`users/${loginData.usr}/wishlist/${id}`)
          .set(mov)
      );
    } else {
      throw new Error("Database update not allowed!");
    }
  },
  async exchange(u: string, p: string) {
    try {
      if (u.length === 0 || p.length === 0) {
        throw new Error("No login data");
      }
      const login = await firebase
        .auth()
        .signInWithEmailAndPassword(u + "@popcornbox.web.app", p);

      if (login) {
        this.loggedIn = true;
        let localTimestamp: number;
        try {
          localTimestamp = await database.idb.pref.get("lastCommit");
        } catch {
          localTimestamp = 0;
        }
        const onlineTimestamp = <number | null>(
          (
            await firebase.database().ref(`/users/${u}/timestamp`).once("value")
          ).val()
        );
        if (onlineTimestamp && onlineTimestamp > localTimestamp) {
          // pull database from firebase
          const shelfSnapshot = <{ [key: string]: Movie } | null>(
            (
              await firebase.database().ref(`/users/${u}/shelf/`).once("value")
            ).val()
          );
          const wishlistSnapshot = <{ [key: string]: Movie } | null>(
            (
              await firebase
                .database()
                .ref(`/users/${u}/wishlist/`)
                .once("value")
            ).val()
          );
          if (wishlistSnapshot) {
            const impList = new Set<string>();
            for (const k of Object.keys(wishlistSnapshot)) {
              if (!impList.has(k)) {
                impList.add(k);
                database.movies.wishlist.push(wishlistSnapshot[k]);
                await database.idb.wishlist.set(k, wishlistSnapshot[k]);
              }
            }
            const deleteList = new Set<string>();
            await database.idb.wishlist.select(async (c) => {
              const id = (<number>c.value.id).toString();
              if (!deleteList.has(id) && !impList.has(id)) {
                deleteList.add(id);
                await database.idb.wishlist.delete(id);
              }
            });
          }
          if (shelfSnapshot) {
            const impList = new Set<string>();
            for (const k of Object.keys(shelfSnapshot)) {
              if (!impList.has(k)) {
                impList.add(k);
                await database.idb.shelf.set(k, shelfSnapshot[k]);
              }
            }
            const deleteList = new Set<string>();
            await database.idb.shelf.select(async (c) => {
              const id = (<number>c.value.id).toString();
              if (!deleteList.has(id) && !impList.has(id)) {
                deleteList.add(id);
                await database.idb.shelf.delete(id);
              }
            });
          }
          database.idb.pref.set("lastCommit", onlineTimestamp);
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (e) {
      confirm(e);
    }
  },
};
