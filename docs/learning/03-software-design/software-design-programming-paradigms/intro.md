# Software Design Paradigms - Intro

## Learning Objectives

- Explain what functional programming means in everyday TypeScript code
- Recognize where pure functions, immutability, and controlled side effects appear in MVC service layers
- Describe what object-oriented programming adds and when classes are a better fit than functions
- Understand the JavaScript prototype model that TypeScript class syntax builds on
- Use TypeScript classes with access modifiers, interfaces, and abstract classes
- Apply SRP, DRY, and separation of concerns when organizing code

## Overview

Many TypeScript applications are built from small functions that validate input, transform data, and pass results from one layer to the next. That style works well because functions are easy to test and reuse when each one does a single clear job.

Functional programming in JavaScript and TypeScript often means writing small functions, keeping data transformations explicit, and being careful about side effects such as database writes, logging, or HTTP responses. You do not need advanced theory to get value from that approach. In most codebases, the practical version of functional programming is about predictability and clear data flow.

Object-oriented programming solves a different kind of problem. When a system has entities with state and behavior that belong together (accounts, orders, carts, game characters), it can become awkward to keep passing plain objects through unrelated functions. OOP lets you model the rules directly on a class and control how its state changes, keeping related data and behavior in one place.

The session opens with functional programming since you have already used that style in TypeScript MVC projects. From there it moves into OOP: first the JavaScript runtime model that class syntax builds on, including prototypes and inheritance, then the TypeScript features that make classes more useful in larger codebases. The session closes with three design principles (single responsibility, DRY, and separation of concerns) that apply regardless of which style you are writing in.
