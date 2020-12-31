declare const appInfo: {
  version: string;
};
if (appInfo) {
  const newestVersion = "3.5";
  if (appInfo && appInfo.version != newestVersion) {
    confirm(
      `Ein Update ist verfügbar\nDu hast ${appInfo.version}, aktualisiere jetzt auf ${newestVersion}`,
      "Jetzt herunterladen",
      "Später erinnern"
    ).then((v) => {
      if (v == 1) {
        location.href =
          "https://play.google.com/store/apps/details?id=io.frankmayer.library";
      }
    });
  }
}
