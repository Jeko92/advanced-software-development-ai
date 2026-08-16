# Software Design CS Fundamentals - Intro

## Learning objectives

- Recognize at what scale each architecture pattern (monolith, microservices,
  serverless, layered/n-tier) applies, and how patterns combine in a single
  system
- Reason about which architecture fits a given team and product, and how that
  choice changes as the system grows
- Describe the trade-offs of linked lists, stacks, and trees in terms of insert,
  lookup, and traversal cost
- Use Big O notation to talk about how runtime and memory grow with input size
- Compare bubble sort, insertion sort, and merge sort using complexity classes

## Overview

Frameworks and managed services have made it possible to ship a working web app
without thinking much about the computer science underneath. That stops being
enough at a certain point. Picking the right tool for a job, recognizing when an
architecture is going to start hurting, and reasoning about why one piece of
code is slower than another all depend on what is happening below the framework
layer.

This session is a breadth-first survey across three pillars where that
understanding shows up. . The first is data structures: how data is held in
memory, and why some operations on it are cheap while others are expensive. The
second is algorithms: how data is processed, and how to compare two approaches
without running them. The last is architecture: how a system is shaped at the
highest level, and how that shape decides which problems are easy and which
become painful.

Each pillar gets a conceptual treatment with web-relevant examples rather than
exhaustive coverage. You will see monoliths next to microservices, linked lists
next to stacks and trees, Big O notation next to a few representative sorting
algorithms. The goal is not to make you implement a self-balancing tree from
memory. It is to give you the vocabulary and the trade-off framework so that the
next time someone says "this endpoint is O (n²)" or "we should split this out
into a service", you know what they mean and can reason about whether the
trade-off fits.
