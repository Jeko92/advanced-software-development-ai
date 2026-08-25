# Software Design Patterns - Intro

## Learning objectives

- Explain what a design pattern is and why patterns exist
- Tell the three pattern categories apart: creational, structural, and
  behavioural
- Recognise common patterns by name: Singleton, Factory, Builder, Repository,
  Dependency Injection, Decorator, Observer, Strategy, State Machine
- Use interfaces and composition to keep classes loosely connected, so parts can
  be swapped or tested without rewriting the whole program
- Decide when a pattern actually pays for itself and when it just adds noise

## Overview

Design patterns are named solutions to recurring common challenges and pitfalls
developers encounter regularly. They help to think about problems in a
structured way that a lot of programmers share. When two developers can both say
"this is a Strategy" or "let's wrap it in a Repository", they skip the long
detour of explaining the underlying problem to each other and start talking
about the actual implementation.

Patterns fall into three groups, based on the kind of problem they solve:

- **Creational patterns** are about how objects get built. They take the messy
  work of constructing things (deciding which subclass to use, plugging in
  shared resources, setting many options) out of the code that just wants to use
  the result.
- **Structural patterns** are about how objects fit together. They keep parts
  loosely connected so you can swap one piece without rewriting the others,
  including when you want to test a piece in isolation.
- **Behavioural patterns** are about how objects talk to each other while the
  program is running. They replace tangled conditional logic with clear,
  dedicated objects for each responsibility.

Underneath, the patterns lean on the same object-oriented ideas you have just
started learning. They favour _composition_ (small objects holding references to
other small objects) over deep inheritance trees, because composition is easier
to change later. They also follow the SOLID principles, especially the rule that
a class should be open to extension but closed to modification.

When learning patterns for the first time, one might be tempted to apply a
pattern to a problem that doesn't really need it. A pattern only earns its keep
when it removes more pain than it adds. Forcing a Repository onto a 30-line
script is a worse outcome than a slightly messy 30-line script. The point of
learning patterns is partly to know when to use them, and partly to know when to
leave them alone.
