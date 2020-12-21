const cache = {
  tmdb: new Map<number, tmdb.search.result>(),
  imgList: new Map<string, HTMLImageElement>(),
  img(src: string): HTMLImageElement {
    if (this.imgList.has(src)) {
      return <HTMLImageElement>this.imgList.get(src);
    } else {
      let img = document.createElement("img");
      img.src = src;
      lazyLoad(img);
      this.imgList.set(src, img);
      return img;
    }
  },
  collectionNames: new Map<number, string>(),
  lastScrollLetter: "\0",
};
