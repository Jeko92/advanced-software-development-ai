# Recap Project 1 - The IT-Book Library

## Learning Objectives

- Apply TypeScript types, interfaces, and DOM manipulation in a real project
- Fetch data from a REST API and render it dynamically without a framework
- Filter and search a dataset client-side using TypeScript logic
- Persist user data across page reloads using `localStorage`
- Structure a multi-page TypeScript application with separate entry points per page

## Overview

Up to now the TypeScript sessions have focused on one concept at a time: the type system, the compiler, client-side DOM work. This recap project is where those pieces come together. You build a fully working browser application for a fictional IT book library, entirely in TypeScript, without a UI framework.

The data comes from a local REST API provided by the `bookmonkey-api` package. You run it alongside your app, fetch the book catalog from it, and use the data to drive three pages: a filterable book listing, a detail page for each book, and a favorites list the user builds up over time.

The listing page is the main entry point. It shows every book in a table and lets the user narrow the results either by typing into a search field or picking a publisher from a dropdown. Both filters work at the same time. Each row links to the book's detail page, which pulls the ISBN from the URL and fetches only that book's data from the API.

The favorites feature runs entirely in the browser. The user marks a book as a favorite from the listing view, and the header updates immediately to show the current count. The favorites page lists the saved books and lets the user remove them. Because favorites are stored in `localStorage`, they survive a page refresh.

There are no starter components to fill in. The HTML templates are pre-built and waiting in the `src` folder. Your job is to write a TypeScript file for each page that reads the DOM, calls the API, and wires up the interactions.
