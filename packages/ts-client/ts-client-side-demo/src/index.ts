const key = import.meta.env.VITE_TMDB_API_KEY;

type Movie = {
  title: string;
  overview: string;
  popularity: number;
};

const form = document.getElementById("form") as HTMLFormElement;
const list = document.querySelector<HTMLUListElement>("#list");

if (!list) {
  throw new Error("HTML broken...");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const data = new FormData(form);
  const query = data.get("query") as string;

  const movies = await findMovies(query);

  list.innerHTML = "";
  movies.forEach((movie) => {
    const card = getMovieCard(movie);
    const li = document.createElement("li");
    li.append(card);
    list.append(li);
  });
});

function getMovieCard(data: Movie): HTMLElement {
  const article = document.createElement("article");

  article.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.overview}</p>
    <span>${data.popularity}</span>
    <a href='#'>more</a>
  `;

  return article;
}

async function findMovies(query: string): Promise<Movie[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const data = await response.json();

  return data.results as Movie[];
}
