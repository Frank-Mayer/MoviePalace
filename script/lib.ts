function collectionName(collection: tmdb.collection): string {
  const name: string = ((): string => {
    if (cache.collectionNames.has(collection.id)) {
      return <string>cache.collectionNames.get(collection.id);
    } else {
      cache.collectionNames.set(collection.id, collection.name);
      return collection.name;
    }
  })();
  return name.replace(/\s+/, " ").trim();
}

function lazyLoad(el: HTMLImageElement) {
  el.setAttribute("loading", "lazy");
}

/**
 * @param message Ask user
 * @param y Text for agree button
 * @param n Text for contradict button
 * @returns 1=Yes, 0=No, -1=Aborted
 */
async function confirm(
  message: string = "",
  y: string = "Ok",
  n: string = "Abbrechen"
): Promise<0 | 1 | -1> {
  return new Promise<0 | 1 | -1>((resolve) => {
    const view = document.createElement("div");
    view.classList.add("popup");

    const p = document.createElement("p");
    p.innerText = message;
    view.appendChild(p);

    const b2 = document.createElement("button");
    b2.innerText = n;
    b2.classList.add("n");
    b2.onclick = () => {
      anim.popup.close("confirmDialog");
      resolve(0);
    };
    view.appendChild(b2);

    const b1 = document.createElement("button");
    b1.innerText = y;
    b1.classList.add("y");
    b1.onclick = () => {
      anim.popup.close("confirmDialog");
      resolve(1);
    };
    view.appendChild(b1);

    const blur = document.createElement("div");
    blur.classList.add("blur");
    blur.appendChild(view);
    blur.id = "confirmDialog";
    blur.addEventListener("click", (ev: MouseEvent) => {
      if (ev.target && (<HTMLElement>ev.target).id === "confirmDialog") {
        anim.popup.close("confirmDialog");
        resolve(-1);
      }
    });
    document.body.appendChild(blur);
  });
}

function watchTitle(title: string, alt?: string): string {
  if (!title && alt) {
    title = alt;
  }
  title = title.replace(/[^0-9a-zA-Z-]+/g, "-");
  while (title[0] == "-") {
    title = title.slice(1, title.length - 1);
  }
  while (title[title.length] == "-") {
    title = title.slice(0, title.length - 1);
  }
  return title;
}

function htmlEscaper(text?: string): string {
  if (text) {
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot")
      .replace(/&/g, "&amp;");
  } else {
    return "";
  }
}

function pushState(state: string) {
  if (history.pushState) {
    history.pushState(null, state, "#" + state);
  } else {
    location.hash = "#" + state;
  }
}

function sortValue(mov: Movie, firstLetter: boolean = false): string {
  let a: string;
  if (mov.collection) {
    if (firstLetter) {
      return collectionName(mov.collection)[0].toUpperCase();
    }
    a = collectionName(mov.collection) + mov.id.toString().padStart(16, "0");
  } else {
    if (firstLetter) {
      return mov.title[0].toUpperCase();
    }
    a = mov.title;
  }
  return a.toLowerCase();
}
