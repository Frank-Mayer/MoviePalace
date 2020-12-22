declare const appInfo: {
  version: string;
};
if (appInfo && forceNumber(appInfo.version) < 3.1) {
  confirm(
    "Ein Update ist verfügbar",
    "Jetzt herunterladen",
    "Später erinnern"
  ).then((v) => {
    if (v == 1) {
      window.open("https://frank-mayer.tk/download/PopcornBox.apk", "_blank");
    }
  });
}
