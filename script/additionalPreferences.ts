/// <reference path="database.ts" />

setTimeout(async () => {
  const navBar = <HTMLInputElement | null>document.getElementById("navBar");
  database.idb.pref
    .get("navBarHeight")
    .then((val) => {
      if (navBar) {
        navBar.value = val.toString();
      }
      document.body.style.setProperty("--nav-nar-height", `${val}px`);
    })
    .catch(() => {
      if (navBar) {
        navBar.value = "45";
      }
      database.idb.pref.set("navBarHeight", 45);
      document.body.style.setProperty("--nav-nar-height", "45");
    })
    .finally(() => {
      if (navBar) {
        navBar.addEventListener("change", () => {
          const val = navBar.value;
          database.idb.pref.set("navBarHeight", Number(val));
          document.body.style.setProperty("--nav-nar-height", `${val}px`);
        });
      }
      bottomBar.addEventListener("touchstart", (evSt) => {
        bottomBar.addEventListener("touchmove", (evMv) => {
          const swipe =
            Math.clamp(
              evSt.touches[0].clientY - evMv.touches[0].clientY,
              -100,
              100
            ) / Math.abs(evSt.touches[0].clientX - evMv.touches[0].clientX);
          if (swipe > 20) {
            bottomBar.classList.add("open");
            evMv.preventDefault();
          } else if (swipe < -20) {
            bottomBar.classList.remove("open");
            evMv.preventDefault();
          }
        });
      });
    });
}, 200);
