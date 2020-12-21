window.addEventListener(
  "popstate",
  (event) => {
    const open = document.getElementsByClassName("open");
    if (open.length > 0) {
      event.preventDefault();
      for (let i = 0; i < open.length; i++) {
        if (open[i].classList.contains("movie")) {
          anim.movieList.close(open[i].id);
        }
      }
    } else {
      history.go(-1);
    }
  },
  false
);
