declare class imdbSearchResEl {
  id: string;
  resultType: string;
  image: string;
  title: string;
  description: string;
}

declare class imdbSearchRes {
  searchType: string;
  expression: string;
  results: Array<imdbSearchResEl>;
  errorMessage: string;
}
