# TypeScript Client-Side - Intro

## Learning objectives

- Understand why Node.js cannot access the DOM and what to use instead
- Configure tsconfig.json for a browser environment
- Use type assertion to work with the generic types returned by DOM methods
- Type event objects and event targets in DOM event listeners
- Apply interfaces and type assertion when fetching data from an API

## Overview

Browser APIs were not written with TypeScript in mind. `document.getElementById()` returns `HTMLElement | null` because TypeScript cannot know at compile time whether the element in your HTML is an input, a button, or a div. The same goes for event handlers, where the event object is a generic `Event`, and for the Fetch API, where `response.json()` returns untyped data.

This session covers the techniques needed to safely handle these boundaries. You will learn how to explicitly provide the missing context when TypeScript's built-in inference is too broad or when it simply cannot know the exact shapes of your data at runtime.
