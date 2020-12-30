declare namespace tmdb {
  class response {
    status_code: number;
    status_message: string;
    success: boolean;
  }
  class collection {
    "id": number;
    "name": string;
    "poster_path": string;
    "backdrop_path": string;
  }
  class Cast {
    cast_id: number;
    character: string;
    gender: number | null;
    name: string;
    profile_path: string | null;
  }
  class Crew {
    cast_id: number;
    department: string;
    gender: number | null;
    job: string;
    name: string;
    profile_path: string | null;
  }
  namespace search {
    class result {
      vote_count: number;
      popularity: number;
      id: number;
      video: boolean;
      media_type: string;
      vote_average: number;
      name: string | undefined;
      title: string | null;
      release_date: string;
      original_language: string;
      original_title: string;
      genre_ids: Array<number>;
      backdrop_path: string;
      adult: boolean;
      overview: string;
      poster_path: string | undefined;
    }
    class multi {
      page: number;
      total_results: number;
      results: Array<result>;
    }
  }
}

const getTitle = function (movie: tmdb.search.result) {
  return movie.title
    ? movie.title
    : movie.name
    ? movie.name
    : movie.original_title
    ? movie.original_title
    : "";
};

const getPosterUrlBypath = function (
  path: string | undefined,
  size: string = "w500"
) {
  if (path && path.length > 0) {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  } else {
    return "img/popcorn.svg";
  }
};

const genreIDs = new Map<number, string>([
  [28, "Action"],
  [12, "Adventure"],
  [16, "Animation"],
  [35, "Comedy"],
  [80, "Crime"],
  [99, "Documentary"],
  [18, "Drama"],
  [10751, "Family"],
  [14, "Fantasy"],
  [36, "History"],
  [27, "Horror"],
  [10402, "Music"],
  [9648, "Mystery"],
  [10749, "Romance"],
  [878, "Science Fiction"],
  [10770, "TV Movie"],
  [53, "Thriller"],
  [10752, "War"],
  [37, "Western"],
]);
