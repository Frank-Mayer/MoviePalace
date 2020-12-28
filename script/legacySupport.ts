/// <reference path="database.ts" />

declare const legacy: {
  lib: Array<{
    alpha: string;
    comment: string;
    cover: string;
    date: string;
    episode: string;
    fav: "true" | "false";
    group: string;
    id: string;
    status: "0" | "1" | "2" | "3" | "4";
    title: string;
    typ: "0" | "1" | "2";
    watchcount: string;
  }>;
  wishlist: Array<{
    title: string;
  }>;
};

setTimeout(() => {
  if (legacy) {
    confirm(
      `Es wurde ein Backup von ${legacy.lib.length} Filmen gefunden, soll soll es importiert werden? Vorhandene werden nicht überschrieben.`,
      "Importieren",
      "Abbrechen"
    ).then((v) => {
      if (v == 1) {
        const imported = new Set<string>();
        const findMovie = async (
          name: string,
          shelf: boolean = true,
          callback?: (mov: Movie) => void
        ) => {
          const v = await httpGet(
            `https://api.themoviedb.org/3/search/multi?api_key=${
              api.tmdb
            }&language=de&query=${encodeURIComponent(
              name
            )}&include_adult=true&region=de`,
            true
          );
          const response = <tmdb.search.multi>JSON.parse(v);
          if (response.results && response.results.length > 0) {
            for (const level of [0, 1]) {
              for (const el of response.results) {
                if (
                  (el.media_type === "movie" || el.media_type === "tv") &&
                  !database.movies.storage.has(el.id)
                ) {
                  if (!cache.tmdb.has(el.id)) {
                    cache.tmdb.set(el.id, el);
                  }
                  const foundName = (el.title
                    ? el.title
                    : el.name
                    ? el.name
                    : "###"
                  )
                    .toLowerCase()
                    .replace(/[^0-9a-zA-Z]+/g, "");
                  const ncName = name
                    .toLowerCase()
                    .replace(/[^0-9a-zA-Z]+/g, "");
                  if (
                    (level == 0 && ncName === foundName) ||
                    (level == 1 &&
                      (ncName.includes(foundName) ||
                        foundName.includes(ncName)))
                  ) {
                    database.movies.add(el.id, shelf ? 1 : 0, callback);
                    await delay(250);
                    return;
                  } else {
                    await delay(250);
                    continue;
                  }
                }
              }
            }
          } else {
            console.error("No movies found\n" + v);
          }
        };
        for (const legMov of legacy.lib) {
          if (!imported.has(legMov.title)) {
            imported.add(legMov.title);
            findMovie(legMov.title, true, (mov) => {
              let date = legMov.date.split(".");
              date = date.reverse();
              mov.date = date.join("-");
              mov.fav = legMov.fav.toLowerCase() == "true";
              mov.status = forceNumber(legMov.status);
              mov.typ = forceNumber(legMov.typ);
              mov.watchcount = forceNumber(legMov.watchcount);
            });
          }
        }
        for (const legMov of legacy.wishlist) {
          if (!imported.has(legMov.title)) {
            imported.add(legMov.title);
            findMovie(legMov.title, false);
          }
        }
      }
    });
  }
}, 1000);
