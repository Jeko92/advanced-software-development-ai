# Recap Project 2 - Trail Guide

## Learning Objectives

- Combine routing, middleware, MVC, Nunjucks, and SQLite into a single working application
- Serve HTML pages and JSON responses from the same Express app and the same model layer
- Use a one-to-many relationship in SQLite and read it back with an `INNER JOIN`
- Protect write endpoints on a public API with a header-based key check
- Style a semantic HTML site with pico.css and no custom utility classes

## Overview

Up to now, each backend session has focused on one layer at a time: HTTP and Express, then middleware, then MVC, then templates, then SQL. This recap project is where the layers meet. You build one application that uses all of them, and you do it without a tutorial walking you line by line through each step.

The project is a small directory of hiking trails called Trail Guide. Visitors browse trails on a public website. An admin user manages the catalog through a separate set of routes with HTML forms. External developers can read and write data through a JSON API that lives at `/api`. All three surfaces share the same Express app, the same SQLite database, and the same model functions. Only the controllers and the response format change.

The data model has two tables. A `regions` table holds the area each trail belongs to, like "Bavarian Alps" or "Scottish Highlands". A `trails` table holds individual trails and references its region through a foreign key. This one-to-many relationship is what gives you something to join: every trail page and every API response that returns a trail also includes the region's name and country.

Styling is handled by pico.css, a class-less CSS framework. You add it once via a CDN link in your base template, then write plain semantic HTML — `<header>`, `<nav>`, `<article>`, `<form>`, `<table>` — and pico styles it for you. There is no design work to do beyond writing correct markup.

The project is broken into four chunks: setup and database, public website, admin panel, public API. Tackle them in order. Each partdepends on the previous one being in place.
