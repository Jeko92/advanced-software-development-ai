# NestJS Swagger - OpenAPI & Swagger

Most teams describe their REST APIs in some kind of prose document: a Confluence page, a README, a Word file in a shared drive. That works for about a week. The first time someone renames a field or adds a query parameter, the document drifts away from reality, and from then on every consumer of the API has to read the source code anyway.

OpenAPI is the standard solution to this problem. It is a specification for describing a REST API in a single structured file: YAML or JSON, vendor-neutral, machine-readable. Because the file is structured rather than prose, tools can consume it directly. The same file can be used by tools to automatically render an interactive HTML documentation page, generate a typed TypeScript client, configure a mock server, and validate that your real responses match the contract during Continuous Integration (CI).

Swagger is the most widely used family of tools that work with OpenAPI files. The two names get used interchangeably in conversation, which is confusing because they used to mean the same thing and now mean different things. This chapter untangles that history, sketches what the specification covers, and lists the tools you are likely to encounter.

## The OpenAPI specification

The OpenAPI Specification (OAS) is maintained by the OpenAPI Initiative, a working group under the Linux Foundation. It is vendor-neutral and freely available at `spec.openapis.org`.

An OpenAPI document describes a single API. It lists:

- the servers the API runs on
- the endpoints (paths) and which HTTP methods each one supports
- the request bodies, query parameters, path parameters, and headers each endpoint expects
- the responses each endpoint can return, by status code, with their data shapes
- the authentication schemes the API uses

The point of a structured format is that the same document is the source of truth for everyone. The frontend team reads it to know what to call. The QA team reads it to know what to test. A code generator reads it to produce a client SDK. Swagger UI reads it to render docs. Nobody has to translate between formats.

## Swagger vs OpenAPI

The names are confusing because they have changed meaning over time.

Swagger started in 2010 as a side project at a startup called Wordnik, built by Tony Tam. It was both a specification and a set of tools that worked with it. By 2015 the specification had become widely adopted, and the original team donated it to a new vendor-neutral body called the OpenAPI Initiative. The specification was renamed: "Swagger 2.0" became "OpenAPI 3.0" with the next major release.

The tools kept the Swagger name. SmartBear, the company that had acquired Swagger by that point, continued to develop and brand them as Swagger Editor, Swagger UI, and so on.

The rule of thumb today is straightforward. If you are talking about a file or a structure, the right word is OpenAPI. If you are talking about a tool, the right word is Swagger. The NestJS integration package is called `@nestjs/swagger` for historical reasons, but the document it produces is an OpenAPI 3 document, not a Swagger 2 document.

## The Swagger toolchain

The tools below are the ones you will run into most often. All of them consume the same OpenAPI file as input.

**Swagger UI** is a single-page HTML app that reads an OpenAPI document and renders an interactive documentation page. Each endpoint becomes a collapsible row with its method, path, description, parameters, request body, and possible responses. A "Try it out" button on each endpoint lets you fill in a form, send a real HTTP request to the API, and see the response. This page is mounted at `/api` by `@nestjs/swagger` in a NestJS application.

**Swagger Editor** is a browser-based YAML editor with live validation and a Swagger UI preview rendered side-by-side. It is useful for writing or inspecting an OpenAPI document by hand. You can use the hosted version at `editor.swagger.io` without installing anything.

**Swagger Codegen** and the closely related **OpenAPI Generator** take an OpenAPI document and produce code from it: typed clients in TypeScript, Java, Python, Go, and many others, and server stubs in roughly as many languages. The two projects share a common ancestor, with OpenAPI Generator being the actively maintained community fork.

**SwaggerHub** is SmartBear's hosted platform for designing and reviewing APIs collaboratively. It bundles the editor, versioning, mock servers, and team permissions. You are unlikely to need it during this bootcamp, but you will see it in larger organizations that adopt a design-first workflow.

There are tools outside the Swagger family that also consume OpenAPI: Redoc renders three-column docs that some teams prefer to Swagger UI, Postman and Bruno import OpenAPI files to populate their request collections, and Stoplight Studio is an alternative graphical editor. The file format is the same in every case.

## Resources

[OpenAPI Initiative](https://www.openapis.org/)

[OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

[Swagger tools](https://swagger.io/tools/)

[Bruno OAS Import](https://docs.usebruno.com/open-api/importOAS)
