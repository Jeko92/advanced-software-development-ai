# TypeScript Basics - Intro

## Learning Objectives

- Explain how TypeScript differs from JavaScript and why static typing matters.
- Describe how the TypeScript compiler turns `.ts` files into runnable `.js` files.
- Configure a TypeScript project with `tsconfig.json` for predictable builds.
- Compile single files and full projects, including watch mode for iteration.

> 💡 This session has a **code along** challenge. Check out the challenges section, the first challenge accompanies the handout content. You can solve it while reading through the session content.

## Overview

TypeScript exists to solve a problem most JavaScript developers eventually hit: your app grows, more people touch the codebase, and runtime errors become harder to predict. JavaScript is dynamically typed, so many type mistakes are only discovered after code is executed. TypeScript adds static typing on top of JavaScript, so many of those mistakes are caught while writing code, before shipping. It is a superset, which means valid JavaScript is still valid TypeScript, but now you can describe the expected shape of data and get compiler feedback when code drifts from that contract.

In practice, TypeScript introduces a build step. You write `.ts` files, and the TypeScript compiler (`tsc`) transpiles them to plain JavaScript. During this process, type annotations are erased, so there is no runtime cost for using types. The browser or Node.js still runs JavaScript, while TypeScript improves correctness during development. That tradeoff is the core value: more confidence at authoring time, same execution model at runtime.

This session focuses on the setup and compilation fundamentals that make the rest of TypeScript usable. You will see how to install the compiler, verify your environment, and define project behavior with `tsconfig.json`. You will also connect compiler options to real outcomes: where compiled files are written, how modules are resolved, and how strict checks prevent common mistakes. Finally, you will look at single-file compilation, project-wide compilation, and watch mode, which supports a tight feedback loop while coding. By the end, you should understand not just the commands, but the reasoning behind the TypeScript workflow.
