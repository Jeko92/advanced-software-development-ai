# NestJS TypeORM - Intro

## Learning Objectives

- Explain the historical "Object-Relational Impedance Mismatch" and how an ORM fundamentally addresses it.
- Configure `TypeOrmModule` to establish a secure, asynchronous connection pool to PostgreSQL.
- Enforce strict module encapsulation using `forFeature` to inject repositories.
- Model secure, production-ready database tables using TypeScript classes and TypeORM decorators (including UUIDs and strict Postgres types).
- Query and mutate data using the Data Mapper pattern via injected repositories instead of vulnerable, raw SQL strings.
- Safely evolve a live PostgreSQL schema without data loss using version-controlled migrations.

## Overview

In 1970, an IBM computer scientist named Edgar F. Codd published a paper that changed software engineering forever. He introduced the Relational Model, a mathematical approach to organizing data into tables, rows, and columns. Decades later, relational databases like PostgreSQL remain the undisputed backbone of the modern web.

Simultaneously, the software application world evolved in a completely different direction. Languages like Java, C#, and TypeScript adopted **Object-Oriented Programming (OOP)**, structuring logic around deeply nested, behavior-rich objects.

This created a massive historical collision. State is stored in flat grids, but applications run on complex object graphs.

Bridging this gap is notoriously difficult. In fact, writing the translation layer between objects and relational tables is so complex and fraught with edge cases that software architect Ted Neward famously described it using a highly dramatic analogy. A debate you can explore further in [Martin Fowler's article, ORM Hate](https://martinfowler.com/bliki/OrmHate.html).

This module is about how modern backend engineers navigate that difficulty.

Instead of writing thousands of lines of fragile translation code, we use an **Object-Relational Mapper (ORM)**. You will learn how to use TypeORM, NestJS's default database abstraction, to translate your TypeScript classes into robust SQL tables seamlessly. More importantly, you won't just learn the syntax; you will learn to establish clean architectural boundaries, ensuring database operations never tangle with your application's business rules.

## Ressources

[IBM, The relational database](https://www.ibm.com/history/relational-database)
