/// <reference path="database.ts" />

setTimeout(async () => {
  // await database.idb.pref.set("navBarHeight", 45);
  database.idb.pref
    .get("navBarHeight")
    .then((val) => {
      document.body.style.setProperty("--nav-nar-height", `${val}px`);
    })
    .catch(() => {
      document.body.style.setProperty("--nav-nar-height", "0");
    });
}, 200);
