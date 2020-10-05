async function scrollBarUpdate(ev: TouchEvent | MouseEvent) {
  let y =
    (ev instanceof TouchEvent ? ev.changedTouches[0].clientY : ev.clientY) /
    window.innerHeight;

  let scroll: string | undefined = undefined;
  let highestVal: number = -1;
  for (const el of scrollBar.childNodes) {
    let letter = <HTMLLIElement>el;
    let rect = letter.getBoundingClientRect();
    let val = 1 - Math.abs(rect.top / window.innerHeight - y);
    if (val > highestVal) {
      highestVal = val;
      scroll = letter.innerText;
    }
    letter.style.color = "white";
    letter.style.setProperty(
      "--pos-x",
      `-${Math.floor(Math.pow(100, val)).toString()}px`
    );
    letter.style.setProperty(
      "color",
      `rgba(255,255,255, ${(Math.pow(25, val) / 25).toFixed(2).toString()})`
    );
  }
  if (scroll && cache.lastScrollLetter !== scroll) {
    cache.lastScrollLetter = scroll;
    let scrollToEl = document.getElementById("letter" + scroll);
    if (scrollToEl) {
      scrollToEl.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}

addEventListener("touchstart", async (ev) => {
  if (
    ev.target === scrollBar ||
    (<HTMLElement>ev.target).parentNode === scrollBar
  ) {
    addEventListener("touchmove", scrollBarUpdate);
  }
});

addEventListener("touchend", async () => {
  removeEventListener("touchmove", scrollBarUpdate);
  for await (const el of scrollBar.childNodes) {
    (<HTMLLIElement>el).style.color = "transparent";
    (<HTMLLIElement>el).style.setProperty("--pos-x", "0");
  }
});
