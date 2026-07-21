document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 App works");

  const form = document.querySelector<HTMLFormElement>("#main-form");
  const input = document.querySelector<HTMLInputElement>("#search-term");
  const mainSection = document.querySelector<HTMLElement>("main");

  if (!form || !input || !mainSection) {
    console.error("Required DOM elements are missing!");
    return;
  }

  const resultDisplay = document.createElement("div");
  resultDisplay.style.marginTop = "1rem";
  resultDisplay.style.padding = "0.5rem 1rem";
  resultDisplay.style.borderRadius = "0.25rem";
  resultDisplay.style.backgroundColor = "Coral";

  mainSection.appendChild(resultDisplay);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = input.value.trim();

    if (!searchTerm) {
      alert("Please enter search query!");
    }

    alert(`Searching for: ${searchTerm}`);

    resultDisplay.innerHTML = `
        <p>🔍 Active search: <strong>${searchTerm}</strong></p>
        <small>Last updated at: ${new Date().toLocaleTimeString()}</small>
    `;

    input.value = "";
  });
});
