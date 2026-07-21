# TypeScript Client-Side - Challenges

## Code Along - Book Search

Build a small book search app that queries the Open Library API and renders results in the browser. Each step adds to the same project.

### Setup

- Create a project with the following structure:

  ```
  book-search/
    index.html
    src/
      main.ts
    tsconfig.json
  ```

- Add this HTML to `index.html`:

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Book Search</title>
    </head>
    <body>
      <form id="search-form">
        <input name="query" type="text" placeholder="Enter a book title" />
        <button>Search</button>
      </form>
      <ul id="book-list"></ul>
    </body>
  </html>
  ```

### Step 1: Configure TypeScript for the browser

- Write a `tsconfig.json` with:
  - lib: `["dom", "esnext"]`, so `document` and other browser globals are recognized
  - `ESNext` as both `target` and `module`

- Add a `<script type="module">` tag to `index.html` that loads `dist/main.js`.

- To test: write `console.log("ready")` in `src/main.ts`, run `tsc`, open `index.html` in a browser.

### Step 2: Select and type DOM elements

- Select the form and list from the HTML using `document.getElementById`. Assert each to the correct element-specific type.

### Step 3: Listen for the search event

- Add a `"submit"` listener to the form. In the callback, annotate the event parameter with the correct submit event type.
- Prevent the default form submission, and extract the form element from `event.target`. Assert it to `HTMLFormElement`.
- Retrieve the input value by using `FormData`. Either use `get("query")`, or use `Object.fromEntries` to iterate over the form data.
- Log the input value to the console.

- Run `tsc`, reload the browser, type something, click the button, and check the console.

### Step 4: Define a data shape and fetch books

- The DBooks API search endpoint returns JSON like this:

  ```json
  {
    "status": "ok",
    "total": "87",
    "books": [
      {
        "id": "3030168778",
        "title": "Programming for Computations - Python",
        "subtitle": "A Gentle Introduction to Numerical Simulations with Python 3.6",
        "authors": "Svein Linge, Hans Petter Langtangen",
        "image": "https://www.dbooks.org/img/books/3030168778s.jpg",
        "url": "https://www.dbooks.org/programming-for-computations-python-3030168778/"
      }
    ]
  }
  ```

- Define two interfaces: `Book` for a single entry and `SearchResult` for the full response, which wraps the book array under `books`.

- Write an async function `fetchBooks(term: string): Promise<Book[]>`. It should fetch from `https://www.dbooks.org/api/search/{query}` and return the parsed docs with a type assertion.

- Call it from the click handler. For each book, add an `<li>` to the `book-list` element showing the title and first author name.

## Update Text on Button Click

**Objective:** Display a message when a button is clicked.

### HTML

```html
<button id="helloBtn">Say Hello</button>
<p id="output"></p>
```

### Task

In `main.ts`:

- Select the button and paragraph.
- Add a click listener to the button.
- Update the paragraph text to "Hello from TypeScript!".

---

## Input and Display

**Objective:** Capture user input and display it on screen.

### HTML

```html
<input type="text" id="nameInput" placeholder="Enter name" />
<button id="submitBtn">Submit</button>
<p id="displayName"></p>
```

### Task

- Get input value when the button is clicked.
- Display the name inside the paragraph.

---

## Toggle Visibility

**Objective:** Hide or show a paragraph with a button click.

### HTML

```html
<button id="toggleBtn">Toggle</button>
<p id="hiddenText">Now you see me!</p>
```

### Task

- On click, toggle the visibility of the paragraph using `.style.display`.

---

## Add Items to List

**Objective:** Dynamically add list items based on input.

### HTML

```html
<input type="text" id="itemInput" />
<button id="addBtn">Add Item</button>
<ul id="itemList"></ul>
```

### Task

- Add input text as a new `<li>` to the list each time the button is clicked.

---

## Delete Items from List

**Objective:** Add a delete button next to each list item and remove on click.

### Task

- Extend \*\*.
- When an item is added, add a "Delete" button beside it.
- Clicking "Delete" removes that `<li>`.

---

## Counter with Increment and Decrement

**Objective:** Create a counter app with "+" and "−" buttons.

### HTML

```html
<button id="decreaseBtn">-</button>
<span id="counter">0</span>
<button id="increaseBtn">+</button>
```

### Task

- Increment or decrement the counter on button click.

---

## Change Background Color

**Objective:** Change the background color of a `div` using a dropdown.

### HTML

```html
<select id="colorSelect">
  <option value="white">White</option>
  <option value="lightblue">Light Blue</option>
  <option value="lightgreen">Light Green</option>
</select>
<div
  id="colorBox"
  style="width:100px; height:100px; border:1px solid black;"
></div>
```

### Task

- Change the `colorBox`'s background color based on the selected option.

---

## Character Count

**Objective:** Display a real-time character count from a textarea.

### HTML

```html
<textarea id="textInput"></textarea>
<p id="charCount">0 characters</p>
```

### Task

- On input, update the character count paragraph.

---

## Bonus Challenge: To-Do App

**Objective:** Build a basic to-do list with the ability to:

- Add tasks
- Mark them as done
- Remove tasks

### HTML

```html
<input id="todoInput" placeholder="New task" />
<button id="addTodo">Add</button>
<ul id="todoList"></ul>
```

### Task

- Add new list items with the input text.
- Each item has:
  - A checkbox to mark it as done
  - A delete button

- Style done items with a strikethrough.
