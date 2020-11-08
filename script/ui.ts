const addButton = <HTMLElement>document.getElementById("addButton");
const statisticsButton = <HTMLElement>(
  document.getElementById("statisticsButton")
);
const listView = <HTMLUListElement>document.getElementById("listView");
const scrollBar = <HTMLUListElement>document.getElementById("scrollBar");

let config = {
  theme: "default",
  fontSize: 18,
  logLevel: "fatal",
  securityLevel: "strict",
  startOnLoad: true,
  arrowMarkerAbsolute: false,
};
mermaid.initialize(config);
