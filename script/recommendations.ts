declare class RecommendationData {
  title: string;
  cover: string;
  id: number;
  uri: string;
  like: number;
}

async function getRecommendations(): Promise<HTMLUListElement> {
  const ul = document.createElement("ul");
  let filled = false;
  const now = new Date();
  const today = Number(
    now.getMonth().toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0")
  );
  const save = new IDB<{ date: number; likes: Array<RecommendationData> }>(
    "recommendations",
    version
  );
  try {
    const rec = await save.get("rec");
    if (rec && rec.date == today) {
      for (const like of rec.likes) {
        const li = document.createElement("li");
        li.style.backgroundImage = `url("${like.cover}")`;
        li.onclick = () => {
          window.open(like.uri)?.focus();
        };
        ul.appendChild(li);
        filled = true;
      }
      return ul;
    }
  } finally {
    if (!filled) {
      if (brain) {
        console.warn("searching...");
        const usedGenres = new Set<number>();
        const getTrainingIdent = (
          mov: Movie | tmdb.search.result
        ): Array<number> | null => {
          const ident = new Array<number>();
          if (
            typeof (<Movie>mov).genres !== "undefined" &&
            (<Movie>mov).genres
          ) {
            for (let i = 0; i < (<Movie>mov).genres.length && i < 5; i++) {
              const gId = genreIDs.findKeyByValue((<Movie>mov).genres[i]);
              ident.push(gId);
              usedGenres.add(gId);
            }
            for (let i = 0; ident.length < 5; i++) {
              ident.push(
                genreIDs.findKeyByValue(
                  (<Movie>mov).genres[i % (<Movie>mov).genres.length]
                )
              );
            }
          } else if (
            typeof (<tmdb.search.result>mov).genre_ids !== "undefined"
          ) {
            for (
              let i = 0;
              i < (<tmdb.search.result>mov).genre_ids.length && i < 5;
              i++
            ) {
              const gId = (<tmdb.search.result>mov).genre_ids[i];
              ident.push(gId);
              usedGenres.add(gId);
            }
            for (let i = 0; ident.length < 5; i++) {
              ident.push(
                (<tmdb.search.result>mov).genre_ids[
                  i % (<tmdb.search.result>mov).genre_ids.length
                ]
              );
            }
          } else {
            return null;
          }
          return ident;
        };
        const data = new Array<brain.INeuralNetworkTrainingData>();
        for await (const mov of database.movies.storage) {
          const trainingData = getTrainingIdent(mov[1]);
          if (trainingData) {
            const rating =
              Math.clamp(mov[1].watchcount / 11, 0, 0.5) +
              (mov[1].fav ? 1.25 : 0.75) *
                Math.pow(mov[1].rating ? mov[1].rating / 100 : 0.5, 2);
            data.push({
              input: trainingData,
              output: [rating],
            });
          }
        }

        const net = new brain.NeuralNetwork();
        net.train(data);

        const negativeData = new Array<number>();
        const unusedGenreList = new Array<number>();
        for (const g of genreIDs) {
          if (!usedGenres.has(g[0])) {
            usedGenres.add(g[0]);
            unusedGenreList.push(g[0]);
          }
        }
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < unusedGenreList.length; j++) {
            const r = Math.floor(Math.random() * unusedGenreList.length);
            negativeData.push(unusedGenreList[r]);
            if (negativeData.length >= 5) {
              net.train({ input: negativeData, output: [0] });
              negativeData.clear();
            }
          }
        }

        const likes = new SortedList<RecommendationData>("like");

        const duplicateBlock = new Set<number>();
        const nowYear = now.getFullYear();
        for (let year = nowYear; year > nowYear - 4; year--) {
          for (let page = 1; page < 4; page++) {
            const json = await httpGet(
              `https://api.themoviedb.org/3/trending/movie/week?api_key=${api.tmdb}&page=${page}&year=${year}&language=de&include_adult=true&region=de`,
              false
            );
            const popular = <tmdb.search.multi>JSON.parse(json);
            if (typeof popular.results != "undefined") {
              for (const newMov of popular.results) {
                if (!duplicateBlock.has(newMov.id)) {
                  duplicateBlock.add(newMov.id);
                  const prc = (<Float32Array>(
                    (<unknown>net.run(getTrainingIdent(newMov)))
                  ))[0];
                  if (prc > 0.05 && !database.movies.storage.has(newMov.id)) {
                    likes.add({
                      title: getTitle(newMov),
                      cover: getPosterUrlBypath(newMov.poster_path),
                      id: newMov.id,
                      like: Math.round(prc * 200),
                      uri: `https://www.themoviedb.org/${newMov.media_type}/${
                        newMov.id
                      }-${watchTitle(
                        newMov.original_title,
                        getTitle(newMov)
                      )}/watch`,
                    });
                  }
                }
              }
            }
          }
        }

        const saveLikeList = new Array<RecommendationData>();
        for (const like of likes.pop(5)) {
          const li = document.createElement("li");
          li.style.backgroundImage = `url("${like.cover}")`;
          li.onclick = () => {
            window.open(like.uri)?.focus();
          };
          ul.appendChild(li);
          saveLikeList.push(like);
        }
        save.set("rec", { date: today, likes: saveLikeList });
      } else {
        ul.appendChild(
          tsx("li", {
            innerHTML: "ERROR: brain is undefined",
          })
        );
      }
    }
  }
  return ul;
}
