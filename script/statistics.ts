/// <reference path="ui.ts"/>

statisticsButton.addEventListener(
  "click",
  async (): Promise<void> => {
    const genreCounter = new Map<string, number>();
    const actorCounter = new Map<string, number>();
    const actorImages = new Map<string, string>();

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
            if (actor.profile_path) {
              actorImages.set(actor.name, actor.profile_path);
            }
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

    const genres = new Array<{ name: string; count: number }>();
    genreCounter.forEach((count, genre) => {
      genres.push({ name: genre, count: count });
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

    const actors = new Array<{ name: string; count: number; image: string }>();
    actorCounter.forEach((count, actor) => {
      if (actorImages.has(actor)) {
        actors.push({
          name: actor,
          count: count,
          image: <string>actorImages.get(actor),
        });
      } else {
        actors.push({ name: actor, count: count, image: "" });
      }
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

    const htmlList = new StringBuilder();
    htmlList.append("<h1>Statistik</h1>");
    htmlList.append("<h3>Lieblingsschauspieler</h3>");
    htmlList.append('<ol type="1">');
    for (let i = 0; i < actors.length && i < 5; i++) {
      htmlList.append(
        `<li><img loading="lazy" src="${getPosterUrlBypath(actors[i].image)}"/>`
      );
      htmlList.append(
        `&nbsp;${htmlEscaper(actors[i].name)} (${actors[i].count} Filme)</li>`
      );
    }
    htmlList.append("</ol>");
    htmlList.append("<h3>Lieblingsgenres</h3>");
    htmlList.append('<ol type="1">');
    for (let i = 0; i < genres.length && i < 5; i++) {
      htmlList.append(`<li>${genres[i].name} (${genres[i].count} Filme)</li>`);
    }
    htmlList.append("</ol>");

    const view = document.createElement("div");
    view.id = "stat";
    view.classList.add("AddTitleView");
    view.innerHTML += htmlList.toString();
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
  }
);
