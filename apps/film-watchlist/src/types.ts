export interface Watchable {
  readonly id: number;
  title: string;
  year: string;
}

export interface Film extends Watchable {
  watched: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface Playlist {
  name: string;
  films: Film[];
}

export function formatFilm(film: Film): string {
  const base = `${film.title} (${film.year}) - ${film.watched ? "Watched" : "Unwatched"}`;
  return film.rating !== undefined ? `${base} - Rating: ${film.rating}/5` : base;
}

export function getUnwatched(playlist: Playlist): Film[] {
  return playlist.films.filter((film) => film.watched === false);
}
