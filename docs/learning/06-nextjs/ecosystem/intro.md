# Next.js Ecosystem - Intro

## Learning Objectives

- Understand the performance bottlenecks of traditional React form handling.
- Build and validate user inputs efficiently without triggering unnecessary re-renders.
- Structure and manage complex, multi-layer forms without messy prop passing.
- Recognize the scaling limitations of React's native Context API for dynamic data.
- Set up and manage a centralized global state store.
- Optimize component rendering by subscribing only to the specific data a component needs.
- Extend state functionality with middlewares while safely navigating Next.js server-side rendering quirks.

## Overview

When Facebook first open-sourced React back in 2013, it didn't come with much. There was no router, no built-in data fetching, no form handling, and definitely no built-in way to share state across your app besides manually passing props down the tree. React was strictly a view layer: it turned your state into a UI, re-rendered when that state changed, and stopped there. Everything else was up to the developer.

This was the exact opposite of Angular's philosophy, which follows the "battery included" approach and aims to provide everything out of the box. React's minimalist strategy was a massive bet that the community could build better tools for those missing pieces than any single core team could.

This bet has paid off completely, since we are now facing a massive React ecosystem, but it also brought new challenges. By 2015, developer Eric Clemmons coined the term "JavaScript Fatigue." Suddenly, you couldn't just build an app; you had to glue together a router, a bundler, a state manager, and ten other packages before you even wrote your first actual component. But while that initial setup can feel overwhelming, it comes with a major upside. Working in the React ecosystem today is less about memorizing one rigid framework, and more about knowing how to pick the right community-standard tool for the problem in front of you.

Two of the most common problems you'll face in almost every frontend application is handling forms and managing global state.

Take forms. If you wire them the standard React way by binding every input to `useState`, the component re-renders on every single keystroke. Add a few more fields and some cross-field validation, and it quickly turns into a pile of repetitive wiring. `react-hook-form` sidesteps this by simply ignoring React's usual controlled-input rules. Instead of state, it tracks inputs through refs. This means the component stays completely still while the user types, and only re-renders when validation kicks in or the form submits.

Then there is global state. For years, the default answer was Redux. Redux is incredibly powerful for massive applications, but it requires so much boilerplate that even its co-creator wrote an article called "You Might Not Need Redux." Thankfully, lighter alternatives have popped up. **Zustand** (which is German for "state") is one of our favorites. Built by the same team behind React Three Fiber, it completely ditches the context providers that cause those massive re-render chains. Instead, components just subscribe to the exact slice of state they actually need.

In this section, we'll use both tools to build a running example: a cart item form. `react-hook-form` will collect and validate what the user types, while **Zustand** takes the submitted data and makes it available to the rest of the app. The real goal here isn't just to learn two specific libraries. It's to get a feel for how to size up the next gap in your architecture and confidently pick the right tool to fill it.

## Resources

- [Javascript Fatigue, Eric Clemmons (2015)](https://ericclemmons.com/blog/javascript-fatigue)
- [You Might Not Need Redux, Dan Abramov](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
