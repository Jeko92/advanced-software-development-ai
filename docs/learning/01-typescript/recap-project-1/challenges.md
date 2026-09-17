# IT-Book library

## Introduction

The customer is a library focused on IT books in the fictitious city of Foobar town. The library wants to make its books
available online to give customers the possibility to save their favorite books in a list. It is your task to create
this app for the customer.

## Prerequisites

### Starter Files

Download the starter files for this challenge with:

```bash
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-1 recap-project-1
```

### Rest-API

The REST-API is available at https://www.npmjs.com/package/bookmonkey-api. Follow the instructions to start the api
server on your local machine. Or use `npx bookmonkey-api`

### HTML Templates

The HTML pages for the project are already pre-designed. You'll find them in the `src` directory of this project. Use
these html files as templates and only add your typescript.

## Tasks

Your task is to implement the following features in the app. You can find the requirements for each feature in the
checklist below.
Use just plain TypeScript for DOM manipulation and avoid using any component library to solve the problems.
You are allowed to change the

### Setup

- Create the necessary configuration files for the project, such as `tsconfig.json` and `../../../../package.json`.
- Create step by step a TypeScript file for each html page and add the necessary code to implement the required
  features.
- Fetch the data of all books from the REST-API and use it to implement the following features.

### Add a filterable book listing

- [ ] All books of the customer must be presented in a table.
  - The following information of a book should be displayed per row
    - title
    - isbn
    - author
    - publisher
- [ ] Implement a search by title functionality
- [ ] Implement a filter to show only books from a specific publisher

### Add detail page

- [ ] Create a detail page for each book. All required information in the template file `src/detail.html`
      should be displayed on this page.
- [ ] The detail page of each book should be accessible from the list view

### Add a favorites list

- [ ] It must be possible to add a book as a favorite in the list view
- [ ] The favorites list should be accessible in the header of the application
  - [ ] The count of favorite books should be displayed in the header
- [ ] It should be possible to remove a favorite
- [ ] The favorites should be permanently saved in the user's client, so that the next time he visits, his saved books
      will be displayed again.
