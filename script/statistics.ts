/// <reference path="ui.ts"/>

statisticsButton.addEventListener(
  "click",
  async (): Promise<void> => {
    const md = new StringBuilder();
    md.appendWithLinebreak("gantt");
    md.appendWithLinebreak("\ttitle Statistik");
    const genreCounter = new Map<string, number>();
    const actorCounter = new Map<string, number>();
    for await (const movie of database.movies.storage) {
      if (movie.cast) {
        for await (const actor of movie.cast) {
          if (actorCounter.has(actor.name)) {
            actorCounter.set(
              actor.name,
              <number>actorCounter.get(actor.name) + 1
            );
          } else {
            actorCounter.set(actor.name, 1);
          }
        }
      }
      for await (const genre of movie.genres) {
        if (genreCounter.has(genre)) {
          genreCounter.set(genre, <number>genreCounter.get(genre) + 1);
        } else {
          genreCounter.set(genre, 1);
        }
      }
    }
    md.appendWithLinebreak("\tsection Genres");
    const genres = new Array<{ name: string; count: number }>();
    genreCounter.forEach((count, genre) => {
      genres.push({ name: genre, count: count });
      const pct = count / database.movies.storage.length;
      if (pct > 0.05) {
        md.appendWithLinebreak(`\t${genre}:0,${count}d`);
      }
    });
    genres.sort((a, b) => {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return 0;
    });

    md.appendWithLinebreak("\tsection Schauspieler");
    const actors = new Array<{ name: string; count: number }>();
    actorCounter.forEach((count, actor) => {
      actors.push({ name: actor, count: count });
    });
    actors.sort((a, b) => {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < actors.length && i < 5; i++) {
      md.appendWithLinebreak(`\t${actors[i].name}:0,${actors[i].count}d`);
    }
    mermaid.render("stat_genre", md.toString(), (svg: string) => {
      const view = document.createElement("div");
      view.id = "stat";
      view.classList.add("AddTitleView");
      view.innerHTML += svg;
      const blur = document.createElement("div");
      blur.classList.add("blur");
      blur.appendChild(view);
      blur.id = "statisticsDialog";
      blur.addEventListener("click", (ev: MouseEvent) => {
        if (ev.target && (<HTMLElement>ev.target).id === "statisticsDialog") {
          anim.popup.close("statisticsDialog");
        }
      });
      document.body.appendChild(blur);
    });
  }
);
