import { formatFilm, getUnwatched } from "./types";
import type { Film, Playlist } from "./types";

const films: Film[] = [
  { id: 1, title: "Arrival", year: "2016", watched: true, rating: 5 },
  { id: 2, title: "Dune", year: "2021", watched: true, rating: 4 },
  { id: 3, title: "Blade Runner 2049", year: "2017", watched: false },
];

const playlist: Playlist = {
  name: "Sci-Fi Favorites",
  films,
};

console.log("--- All films, formatted ---");
playlist.films.forEach((film) => console.log(formatFilm(film)));

console.log("\n--- Unwatched films ---");
const unwatched = getUnwatched(playlist);
unwatched.forEach((film) => console.log(formatFilm(film)));
