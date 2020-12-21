declare const firebase: any;
function backup(u: string, p: string) {
  try {
    if (u.length === 0 || p.length === 0) {
      throw new Error("Login failed");
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(u + "@popcornbox.web.app", p)
      .catch((error: string) => {
        throw error;
      })
      .then((e: any) => {
        if (e) {
          (() => {
            firebase
              .database()
              .ref("/data/" + u)
              .set(
                {
                  shelf: database.movies.storage,
                  wishlist: database.movies.wishlist,
                },
                function (error: Error) {
                  if (error) {
                    throw error;
                  }
                }
              );
          })();
        } else {
          throw new Error("Login failed");
        }
      });
  } catch (e) {
    confirm(e);
  }
}
