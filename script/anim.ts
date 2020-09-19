const scrollIntoViewOptions: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "center",
  inline: "nearest",
};

const anim = {
  popup: {
    close(id: string) {
      let el = document.getElementById(id);
      if (el) {
        el.style.transition = "all 200ms ease-in-out";
        el.style.setProperty("backdrop-filter", "blur(0) saturate(1)");
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
  },
  movieList: {
    shouldBeClosed: "",
    open(id: string) {
      let el = document.getElementById(id);
      if (el) {
        let remEl = document.getElementById(this.shouldBeClosed);
        if (remEl) {
          remEl.classList.remove("open");
        }
        (<HTMLElement>el).classList.add("open");
        this.shouldBeClosed = id;
      }
    },
    close(id: string) {
      let el = document.getElementById(id);
      if (el) {
        el.classList.remove("open");
        el.scrollIntoView(scrollIntoViewOptions);
        if (this.shouldBeClosed === id) {
          this.shouldBeClosed = "";
        }
      }
    },
  },
};
