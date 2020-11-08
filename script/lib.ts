function collectionName(name: string): string {
  let repl: string;
  if (/Filmreihe/i.test(name)) {
    repl = "";
  } else {
    repl = "Filmreihe";
  }
  return name
    .replace(/collection/i, repl)
    .replace(/trilogie/i, repl)
    .replace(/trilogy/i, repl)
    .replace("-", "")
    .replace(/\s+/, " ")
    .trim();
}
