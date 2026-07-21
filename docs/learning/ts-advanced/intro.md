# TypeScript Advanced Setup - Intro

## Learning objectives

- Learning about additional config options for the typescript compiler.
- Understand what `nodemon` does and how it fits into a Node.js development workflow
- Set up `tsx` watch as a single-tool replacement for the `tsc` + `nodemon` combination
- Use `concurrently` to run multiple long-running processes from one script
- Know when to combine `nodemon` with `tsx` for advanced file watching

## Overview

Node.js (versions < 25.9) can only run JavaScript. TypeScript must be compiled into JavaScript first, which means every TypeScript project needs a build step before it can run. During development, that build step also needs to re-run every time you save a change, and the server needs to restart to pick it up. Doing all of that manually after every edit gets old fast. This session covers the tools that automate it and how they relate to each other.

The starting point is nodemon. It watches your project files and restarts the server whenever something changes. To use it with TypeScript, you need two processes running at the same time: the TypeScript compiler (`tsc --watch`) outputs JavaScript into a dist folder, and nodemon watches that folder and restarts the server when new JavaScript appears. It works, but managing two terminals is awkward. `concurrently` solves that by letting you run both processes from a single npm command.

`tsx` is the modern alternative to the whole setup. It uses Esbuild to transpile TypeScript in memory and restart the process directly, without writing any JavaScript to disk. The result is fewer moving parts and noticeably faster restarts. For most projects, `tsx` watch is enough.

The case for bringing nodemon back alongside `tsx` is specific: watching files `tsx` ignores by default, excluding paths from triggering restarts, or running custom scripts when the server restarts. In those cases, you configure nodemon to call `tsx` as its executor and let nodemon own the file watching.

Understanding when to use which tool matters because you will encounter all three patterns in real codebases. Older projects often use `tsc` + `nodemon` + `concurrently`. Most new ones default to `tsx`. The combined nodemon + `tsx` setup shows up when a project has non-standard watching requirements.
