# NestJS Auth - Intro

## Learning Objectives

- Distinguish authentication from authorization and explain why both are necessary
- Identify common REST API authentication methods and when each fits
- Explain how a JWT is structured and how its signature ensures integrity
- Use NestJS guards to protect individual routes and entire applications
- Implement a JWT authentication module with Passport.js strategies

## Overview

An API without an authentication layer is open to anyone who can reach it. Someone who discovers your endpoints can read, create, or delete data without restriction. Before shipping any real application, you need a way to verify who is making a request and whether they are allowed to do what they are asking.

This session covers authentication and authorization in a NestJS REST API. The terms are related but not interchangeable. Authentication asks whether the person is who they claim to be. Authorization asks whether that person has permission to do what they are trying to do. Authorization always depends on authentication coming first.

Of the several approaches to API authentication, this session uses JSON Web Tokens (JWT). A JWT is a compact, signed string that a server issues after a successful login. The client sends that token with every subsequent request, and the server verifies it rather than looking up a session in a database. This stateless design fits NestJS applications well, particularly when the API needs to scale or serve multiple clients.

On the NestJS side, authentication runs through guards. A guard is a class that inspects an incoming request before it reaches a route handler and decides whether to let it through. NestJS integrates with Passport.js to handle token verification. You will configure two Passport strategies: a local strategy that validates credentials on login, and a JWT strategy that validates the token on every subsequent request.

The session ends with a working auth module that issues tokens on login, protects routes with guards, and exposes a `@Public()` decorator for routes that should stay open.
