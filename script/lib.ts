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
function confirm(
  message: string = "",
  y: string = "Ok",
  n: string = "Abbrechen",
  noThirdOption: boolean = false
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
    if (!noThirdOption) {
      blur.addEventListener("click", (ev: MouseEvent) => {
        if (ev.target && (<HTMLElement>ev.target).id === "confirmDialog") {
          anim.popup.close("confirmDialog");
          resolve(-1);
        }
      });
    }
    document.body.appendChild(blur);
  });
}

function prompt(
  message: string = "",
  confirm: string = "Ok",
  noAbort: boolean = false,
  value?: string,
  password: boolean = false,
  placeholder?: string
): Promise<string> {
  return new Promise<string>((resolve) => {
    const view = document.createElement("div");
    view.classList.add("popup");

    const p = document.createElement("p");
    p.innerText = message;
    view.appendChild(p);

    const input = document.createElement("input");
    input.autofocus = true;
    if (placeholder) {
      input.placeholder = placeholder;
    }
    if (password) {
      const form = document.createElement("form");
      if (value) {
        const usrNam = document.createElement("input");
        usrNam.defaultValue = value;
        usrNam.value = value;
        usrNam.autocomplete = "username";
        usrNam.style.display = "none";
        form.appendChild(usrNam);
      }
      input.type = "password";
      input.autocomplete = "current-password";
      form.appendChild(input);
      view.appendChild(form);
    } else {
      input.type = "text";
      if (value) {
        input.defaultValue = value;
        input.value = value;
      }
      view.appendChild(input);
    }

    const b = document.createElement("button");
    b.innerText = confirm;
    b.classList.add("y");
    b.onclick = () => {
      anim.popup.close("promptDialog");
      resolve(input.value);
    };
    view.appendChild(b);

    const blur = document.createElement("div");
    blur.classList.add("blur");
    blur.appendChild(view);
    blur.id = "promptDialog";
    if (!noAbort) {
      blur.addEventListener("click", (ev: MouseEvent) => {
        if (ev.target && (<HTMLElement>ev.target).id === "promptDialog") {
          anim.popup.close("promptDialog");
          resolve("");
        }
      });
    }
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
  if (
    mov.collection &&
    (typeof Preferences == "undefined" || Preferences.sortMode == 0)
  ) {
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
  if (a) {
    return a.toLowerCase();
  } else {
    throw new Error(JSON.stringify(mov));
  }
}

function forceNumber(number: string): number {
  const n = Number(number);
  if (isNaN(n) || !n) {
    return 0;
  }
  return n;
}
