function collectionName(name: string): string {
  let repl: string;
  if (/Filmreihe/i.test(name)) {
    repl = "";
  } else {
    repl = "Filmreihe";
  }
  return name
    .replace(/collection/i, repl)
    .replace(/trilogie/i, repl)
    .replace(/trilogy/i, repl)
    .replace("-", "")
    .replace(/\s+/, " ")
    .trim();
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
    b2.innerHTML = n;
    b2.classList.add("n");
    b2.onclick = () => {
      anim.popup.close("confirmDialog");
      resolve(0);
    };
    view.appendChild(b2);

    const b1 = document.createElement("button");
    b1.innerHTML = y;
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
