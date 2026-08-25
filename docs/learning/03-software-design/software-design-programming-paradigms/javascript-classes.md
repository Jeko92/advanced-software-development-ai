# Software Design Paradigms - JavaScript Classes

Before diving deeper into the Typescript specific class syntax, let's take a look at the JavaScript native class model. The Javascript class syntax gives developers a well known structure and process of creating classes, but under the hood it uses old concepts that were used to build class-like structures before class syntax was introduced to Javascript.

The most important thing to understand is what part of the class syntax belongs to Javascript and Typescript respectively, since Javascript syntax features stay valid at runtime - in contrast to Typescript features, which are stripped from the codebase at compile time.

## Defining a class

JavaScript uses the `class` keyword to define a blueprint for creating objects.

```javascript
class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }

  describe() {
    return `${this.title} by ${this.author}`;
  }
}

const dune = new Book("Dune", "Frank Herbert");
console.log(dune.describe()); // "Dune by Frank Herbert"
```

These parts make up the class:

- `class Book` defines the blueprint
- `constructor(...)` runs when you create a new instance with `new`
- `describe()` defines behavior shared by every instance
- the `this` keyword is a placeholder for the class instance object. It gives access to all other values, state and methods defined and known to this instance. When calling `dune.describe()`, using `this` inside the method refers to the object `dune`.

## Public, private, and static fields

JavaScript classes support public members by default, `static` members on the class itself, and `#private` fields for true runtime privacy.

```javascript
class Counter {
  static description = "Counts things";
  #count = 0;

  increment() {
    this.#count += 1;
  }

  getCount() {
    return this.#count;
  }
}
```

TypeScript has its own `private` keyword, but it works differently from `#private`. That distinction is covered in an upcoming chapter.

## Getters and setters

JavaScript classes can define getters and setters to control how a property is read or written. They look like properties when you use them, but they run methods behind the scenes.

```javascript
class BankAccount {
  #balance = 0;

  constructor(initialBalance) {
    this.balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  set balance(newBalance) {
    if (newBalance < 0) {
      throw new Error("Balance cannot be negative.");
    }

    this.#balance = newBalance;
  }
}

const account = new BankAccount(100);
console.log(account.balance); // calls the getter
account.balance = 250; // calls the setter
account.balance = -100; // throws an Error, since newBalance is smaller than 0
```

Getters and setters are useful when a class needs to validate a value, compute a value, or protect internal state behind a property-like API.

## Inheritance in JavaScript

JavaScript classes use `extends` to inherit from another class and `super(...)` to call the parent constructor.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks.`;
  }
}
```

`Dog` calls `Animal`'s constructor through `super(...)` and overrides `speak`. With this background, the TypeScript-specific class features in the next chapter will be easier to follow.

## Optional: JavaScript Classes before ES6

Before `class` syntax was added, JavaScript already allowed objects to store functions as properties, also known as methods. Methods are not exclusive to classes:

```javascript
const book = {
  title: "Dune",
  describe() {
    return this.title;
  },
};
console.log(book.describe());
```

When you wanted to define methods that a lot of objects inherit, you need a more structured approach. Before ES6 classes, developers used constructor functions together with `new`, attaching shared methods to a `prototype` object:

```javascript
function Book(title, author) {
  this.title = title;
  this.author = author;
}

Book.prototype.describe = function () {
  return `${this.title} by ${this.author}`;
};

const dune = new Book("Dune", "Frank Herbert");
console.log(dune.describe()); // "Dune by Frank Herbert"
```

The mechanism that makes this work is JavaScript's prototype system. Each object has an internal link to another object called its prototype. When you access a property or method, JavaScript checks the object itself first; if the property is not there, it follows the prototype link and checks the next object, continuing until the property is found or the chain ends. A prototype is therefore the place where shared behavior can live: instead of storing the same method on every object, JavaScript stores it once on a prototype and lets many objects reuse it.

Modern `class` syntax solves the same problem but is easier to read. Underneath, it still uses prototypes — defining a method in a class stores it on the class prototype rather than copying it into every instance, so all `Book` instances share the same `describe()` method:

```javascript
class Book {
  constructor(title) {
    this.title = title;
  }
  describe() {
    return this.title;
  }
}
const duneBook = new Book("Dune");
console.log(Object.getPrototypeOf(duneBook) === Book.prototype); // true
```

Two related ideas come up when inspecting this: `Book.prototype` is the object where shared methods for `Book` instances live, while an instance's internal link points back to that same object. In developer tools and older explanations, you will see that link shown as `__proto__`:

```javascript
console.log(duneBook.__proto__ === Book.prototype); // true
```

Both refer to the same object from different directions. `Object.getPrototypeOf(...)` is the standard way to inspect an object's prototype today, but `__proto__` is still worth recognizing because it shows up in debugging output and older material.

Prototype lookup does not continue forever. Most chains eventually reach `Object.prototype`, and above that is `null`:

```javascript
console.log(Object.getPrototypeOf(Book.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

That is why methods such as `toString()` are available on so many objects: they come from `Object.prototype`.

## Resources

[MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

[MDN: Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)
