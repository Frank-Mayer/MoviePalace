const cache = {
  imdb: new Map<string, any>(),
  imgList: new Map<string, HTMLImageElement>(),
  img(src: string): HTMLImageElement {
    if (this.imgList.has(src)) {
      return <HTMLImageElement>this.imgList.get(src);
    } else {
      let img = document.createElement("img");
      img.src = src;
      this.imgList.set(src, img);
      return img;
    }
  },
};
