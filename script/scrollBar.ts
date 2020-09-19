async function scrollBarUpdate(ev: TouchEvent | MouseEvent) {
  let x =
    (ev instanceof TouchEvent ? ev.changedTouches[0].clientX : ev.clientX) /
    window.innerWidth;
  let y =
    (ev instanceof TouchEvent ? ev.changedTouches[0].clientY : ev.clientY) /
    window.innerHeight;
  if (x > 1 - 20 / window.innerWidth && y < 1 - 50 / window.innerHeight) {
    let scroll: string | undefined = undefined;
    let highestVal: number = -1;
    for await (const el of scrollBar.childNodes) {
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
        `-${Math.floor(Math.pow(50, val)).toString()}px`
      );
    }
    if (scroll) {
      let scrollToEl = document.getElementById("letter" + scroll);
      if (scrollToEl) {
        scrollToEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  } else {
    for await (const el of scrollBar.childNodes) {
      (<HTMLLIElement>el).style.color = "transparent";
      (<HTMLLIElement>el).style.setProperty("--pos-x", "0");
    }
  }
}
let addEventListenerOptions: AddEventListenerOptions = {
  passive: true,
};
addEventListener("mousemove", scrollBarUpdate);
addEventListener("touchstart", async () => {
  addEventListener("touchmove", scrollBarUpdate);
});
addEventListener("touchend", async () => {
  removeEventListener("touchmove", scrollBarUpdate);
  for await (const el of scrollBar.childNodes) {
    (<HTMLLIElement>el).style.color = "transparent";
    (<HTMLLIElement>el).style.setProperty("--pos-x", "0");
  }
});
