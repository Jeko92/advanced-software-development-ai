# Software Design Paradigms - Object-Oriented Programming

Functional code works well when your main job is to move data through a system. At some point, though, some domains start to feel awkward as loose functions plus plain objects. If an `Order` should know whether it can be cancelled, or a `BankAccount` should guard how its balance changes, it can make sense to keep data and behavior together. That is the main idea behind object-oriented programming. OOP models a program as objects that each carry their own state and the behavior that operates on it.

## Objects, classes, and instances

An object is a value that can store data and functions together. A class is a blueprint for creating objects with the same structure and behavior. Each object created from that blueprint is called an instance of that class.

```typescript
class BankAccount {
  ownerName: string;
  balance: number;

  constructor(ownerName: string, balance: number) {
    this.ownerName = ownerName;
    this.balance = balance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}

const account = new BankAccount("Aylin", 1000);
account.deposit(250);
```

This example puts the account data and the account behavior in one place. That is often easier to follow than storing the account as a plain object and updating it through unrelated helper functions.

## The four pillars of OOP

You will often see four terms used to describe OOP:

- encapsulation means controlling how internal state is read or changed
- abstraction means exposing what another part of the program needs without exposing every internal detail
- inheritance means creating a class from another class so it can reuse or extend behavior
- polymorphism means different objects can respond to the same method name in different ways

These ideas are useful, but they are not a checklist you must force into every class. In practice, the most important questions are simpler:

- does this object have state that should be controlled
- does this behavior naturally belong to this object
- would grouping them in a class make the code easier to understand

## Stateful entities

OOP is often a good fit when:

- the project contains long-lived entities such as users, orders, carts, or invoices
- those entities have rules about how state may change
- several behaviors rely on the same internal data

For example, an order object might allow `pay()` only when the current status is `"open"`. That rule belongs to the order itself, not to a random helper function somewhere else in the codebase.

## TypeScript and the class model

TypeScript does not invent classes. It builds on JavaScript's class system and adds types, access modifiers, interfaces, and abstract classes. That combination makes it easier to model domain rules clearly and catch mistakes earlier during development.

## Resources

[MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

[TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
