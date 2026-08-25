# Software Design Paradigms - TypeScript Classes

JavaScript gives you the runtime model for classes. TypeScript adds types and design constraints on top of that model. Access modifiers, interfaces, and abstract classes help you express intent to the compiler and to other developers. But knowing the syntax is not enough on its own. The features are only useful when they reflect a real design decision: who may read this value, how should this state change, what must every subclass provide.

Language features are only useful when they reflect a design decision. This lesson covers both sides: the TypeScript syntax for classes and the design patterns that give those features meaning.

The `BankAccount` example from previous chapters gets a proper TypeScript treatment here. Access modifiers and private fields let you enforce the deposit rule at the language level, not just by convention.

In a TypeScript backend, classes are useful when they make domain rules clearer, not just because the feature exists. You should be able to explain why a class is helping before you add one.

## Typed properties and constructors

TypeScript lets you describe the shape of a class directly by typing its fields at the top of the class similar to an interface.

```typescript
class User {
  id: number;
  email: string;
  isActive: boolean;

  constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
    this.isActive = true;
  }
}
```

## Access modifiers

TypeScript adds `public`, `private`, and `protected` to control how members may be used in your code.

```typescript
class UserAccount {
  public email: string;
  private failedLoginAttempts: number;
  protected role: "user" | "admin";

  constructor(email: string, role: "user" | "admin") {
    this.email = email;
    this.role = role;
    this.failedLoginAttempts = 0;
  }

  registerFailedLogin(): void {
    this.failedLoginAttempts += 1;
  }
}
```

Use them with clear intent:

- `public` is the default API of the class
- `private` is for members that only the class itself should access
- `protected` is for members that the class and its subclasses may use

The `protected` modifier is useful when you have a base class with shared behavior or state that subclasses need to use, but you don't want that behavior to be part of the public API of every instance. Take this example:

```typescript
class Employee {
  protected department: string;

  constructor(department: string) {
    this.department = department;
  }
}

class Manager extends Employee {
  describeDepartment(): string {
    return `Manages the ${this.department} department.`;
  }
}

const manager = new Manager("Engineering");
console.log(manager.department); // Error: 'department' is protected
console.log(manager.describeDepartment()); // "Manages the Engineering department.
```

This is useful when a base class has data or helper methods that child classes need, but that should not become part of the public API of every instance.

Use `protected` carefully. It can be a good fit in a stable inheritance hierarchy, but it also increases coupling between parent and child classes. If subclasses only need shared behavior, composition is often simpler.

## TypeScript `private` versus JavaScript `#private`

TypeScript `private` is checked by the TypeScript compiler. JavaScript `#private` is enforced by the JavaScript runtime.

```typescript
class Wallet {
  private ownerId: string;
  #balance: number;

  constructor(ownerId: string, initialBalance: number) {
    this.ownerId = ownerId;
    this.#balance = initialBalance;
  }

  getBalance(): number {
    return this.#balance;
  }
}
```

The practical effect is different:

- `private ownerId` expresses design intent to TypeScript; the compiler rejects access outside the class
- `#balance` creates a real private field in the emitted JavaScript; code that bypasses TypeScript cannot read or change it at runtime
- a `private` property still exists as a normal property in the generated JavaScript
- trying to access a `#private` field from outside the class body is a real JavaScript error, not just a TypeScript complaint

That means `private` mainly protects you during development, while `#private` protects the field in the running program as well.

## Shorthand syntax for fields

TypeScript checks whether the data you put into an instance matches the class's declared shape. As you maybe noticed, in the UserAccount class the type annotations for `email` and `role` needed to be duplicated, since typescript does not automatically know that the constructor parameter `role` will become the internal `role` field.

But there is a shorthand syntax that allows exactly that connection. By stating the access modifier (`private`, `public`, or `protected`) before the constructor parameter, TypeScript automatically adds the value to the class as a field of the same name:

```typescript
class UserAccount {
  private failedLoginAttempts: number = 0;

  constructor(
    public email: string,
    protected role: string,
  ) {}
}
```

With moving the initial value for failedLoginAttempts to the field declaration, the constructor body is now actually empty. This might look a bit odd at first, but it is actually quite common, especially with `Nest.js`.

There is one downside to this shorthand syntax: it cannot be used with `#private` fields.

## Encapsulation and controlled state changes

Encapsulation means that only a class can decide how its internal state may change. Instead of letting any other part of the program rewrite values directly, the class exposes methods that protect its rules.

```typescript
class BankAccount {
  #balance: number;

  constructor(initialBalance: number) {
    this.#balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than zero.");
    }

    this.#balance += amount;
  }

  getBalance(): number {
    return this.#balance;
  }
}
```

This class is stronger than a plain object with a public `balance` property because it protects the rule that a deposit must be positive. The `#balance` field is unreachable from outside the class, both at the language level and at runtime.

## Getters and setters

Getters and setters can support encapsulation, but they are not automatically better than plain properties. Use them when you need logic during read or write access.

```typescript
class Employee {
  #salary = 0;

  get salary(): number {
    return this.#salary;
  }

  set salary(newSalary: number) {
    if (newSalary < this.#salary) {
      throw new Error("Salary cannot be decreased.");
    }

    this.#salary = newSalary;
  }
}
```

This setter makes sense because it enforces a rule. A getter or setter that only forwards data without adding meaning is usually unnecessary noise.

## Interfaces

In the typescript sessions, we already introducted interfaces. Now we will see their intended use case. They are typically used to define "contracts" that classes must adhere to. In other words, we define the shape of the class first and create the implementation later.

```typescript
interface Entity {
  id: number;
}

interface Activatable {
  activate(): void;
}

class User implements Entity, Activatable {
  id: number;
  isActive: boolean;

  constructor(id: number) {
    this.id = id;
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}
```

Interfaces are useful when you want to describe what a class must provide without forcing a shared implementation.

That is different from inheritance:

- `implements` means the class matches a contract
- `extends` means the class reuses behavior from a parent class

Choose an interface for public APIs, DTO-like shapes, or capabilities such as `Serializable`. Choose an abstract class when subclasses should inherit real code and follow the same base structure.

## Abstract classes, polymorphism and method overriding

Polymorphism means related objects can respond to the same method name in different ways. This is often implemented with abstract classes and multiple implementations of them. An abstract class is a class that cannot be instantiated directly, but must be extended by other classes. On the abstract class level, you define the functionality that all subclasses must implement. This is the polymorphism bit: the different class instances implement the same method in different ways, but from the outside the method call is the same.

```typescript
abstract class NotificationChannel {
  abstract send(message: string): void;
}

class EmailChannel extends NotificationChannel {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class SmsChannel extends NotificationChannel {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}
```

Code that depends on `NotificationChannel` can work with either subclass without caring which one it received.

Use an abstract class when you need both shared logic across a family of related classes and a required structure that all subclasses must follow. If you only need the contract, an interface is usually enough.

## Resources

[TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

[TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

[MDN: extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)

[Refactoring Guru: Encapsulation](https://refactoring.guru/concepts/oop/encapsulation)
