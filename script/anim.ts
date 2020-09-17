const anim = {
  rem(id: string) {
    let el = document.getElementById(id);
    if (el) {
      el.style.transition = "all 200ms ease-in-out";
      el.style.setProperty("backdrop-filter", "blur(0)");
      let ch = <HTMLElement>el.firstElementChild;
      ch.style.transition = "all 200ms ease-in-out";
      ch.style.transform = "translateY(50vh)";
      setTimeout(() => {
        if (el) {
          el.remove();
        }
      }, 200);
    }
  },
};
