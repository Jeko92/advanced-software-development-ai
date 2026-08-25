# NestJS Swagger - Intro

## Learning objectives

- Explain what OpenAPI is and how it relates to Swagger
- Read a basic OpenAPI YAML document and recognize its main sections
- Identify the main Swagger tools and what each one is used for
- Use the `@nestjs/swagger` package to generate API documentation from a NestJS application
- Mount Swagger UI on a running NestJS server and try endpoints from the browser

## Overview

Building a functioning REST API in NestJS is only half the job. Right now, your endpoints handle data perfectly, but they are a black box to anyone else. A frontend developer trying to consume your API has to reverse-engineer your DTOs to figure out the required JSON payloads, or rely on trial and error to map out your error responses. (And let's be honest, they will usually just ping you on Slack and break your flow).

The standard approach to this issue is a separate document, written by hand, that describes every endpoint. But let's be honest: nobody keeps those updated. As soon as you merge a controller update, that manual documentation becomes obsolete, and you are right back to explaining payloads in chat.

OpenAPI is the modern alternative. It is a specification for describing a REST API in a structured, machine-readable file (YAML or JSON). Because the file is machine-readable, tools can do useful things with it: render interactive documentation, generate typed client SDKs, run contract tests in CI, spin up mock servers. The Swagger toolchain is the most common set of those tools.

The interesting question is how to keep the OpenAPI file in sync with the code. Writing it by hand has the same staleness problem as a markdown document. The NestJS answer is, you guessed it, decorators! They allow you to derive the OpenAPI document from the code itself. The `@nestjs/swagger` package reads the same decorators you are already using on controllers and DTOs (`@Get`, `@Post`, `@IsString`, type annotations) and assembles the OpenAPI document at startup. A few extra `@Api*` decorators fill in what TypeScript cannot infer, like response codes and human-readable descriptions.

In this session, we unpack the OpenAPI standard and its underlying document format before wiring it directly into a NestJS project. By the end, you will put this into practice during the challenge: generating a live, interactive Swagger interface for the Cyber Chat API you built in the previous modules.
