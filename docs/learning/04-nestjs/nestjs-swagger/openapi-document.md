# NestJS Swagger - OpenAPI Document

An OpenAPI document is just one file. It can be JSON or YAML. YAML is more common in practice because it allows comments, has less syntactic noise than JSON, and produces cleaner diffs in pull requests. The examples in this file all use YAML.

The document has a small, fixed top-level structure. Every API document, no matter how large, starts with the same handful of keys: `openapi`, `info`, `servers`, `paths`, and `components`. Everything else lives inside those keys.

The aim of this file is recognition, not memorization. You should be able to open an OpenAPI document from a third party, find the endpoints you care about, and read off the request shape and response shape without consulting the spec. Writing one by hand is rare; the chapter is about generating one from NestJS code instead.

## Top-level structure

The smallest valid OpenAPI document looks like this:

```yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths: {}
components: {}
```

Each top-level key has a specific purpose:

- `openapi` declares the version of the specification this document conforms to. `3.0.3` is the most common value in the wild.
- `info` carries metadata about the API. The two required fields are `title` and `version`; you can also add `description`, `contact`, and `license`.
- `servers` lists the base URLs the API runs on. You can declare several (production, staging, local) and Swagger UI will let users pick which one "Try it out" sends to.
- `paths` is where every endpoint lives. The empty object above means no endpoints yet.
- `components` is the reusable type library. Schemas, security schemes, and reusable parameters are defined here and referenced elsewhere with `$ref`.

## Paths and operations

Each endpoint is keyed by its path. Under the path, each HTTP method becomes a separate operation:

```yaml
paths:
  /users:
    get:
      summary: List all users
      tags: [Users]
      responses:
        "200":
          description: A list of users
    post:
      summary: Create a new user
      tags: [Users]
      responses:
        "201":
          description: The newly created user
```

The keys under `/users` are `get` and `post`, which means this single path supports both methods. Each operation has its own `summary`, `tags`, `parameters`, `requestBody`, and `responses`.

- `summary` is a one-line human-readable description shown in Swagger UI next to the route.
- `tags` is an array of group names. Swagger UI uses tags to render collapsible sections. An endpoint can belong to more than one tag.
- `responses` is a map keyed by HTTP status code (as a string, because YAML would interpret `200` as a number). Every operation should declare at least one response.

You can document the same operation more thoroughly by adding `description` (a longer prose explanation, in Markdown) and `operationId` (a unique identifier that code generators use to name client methods).

## Parameters

Parameters live on an operation under the `parameters` key. The `in` field tells OpenAPI where the parameter appears in the HTTP request. There are four values:

- `path` for parameters embedded in the URL like `/users/{id}`
- `query` for parameters after the `?` in the URL like `/users?role=admin`
- `header` for HTTP request headers
- `cookie` for values in the Cookie header

A path parameter and a query parameter on the same operation:

```yaml
paths:
  /users/{id}:
    get:
      summary: Get a user by id
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: include
          in: query
          required: false
          schema:
            type: string
            enum: [posts, comments]
      responses:
        "200":
          description: The user
```

A few rules apply here:

- Path parameters must have `required: true`. There is no such thing as an optional path parameter; the URL either has the segment or it does not.
- Query parameters default to `required: false`. Set it explicitly only when the parameter is mandatory.
- The `schema` describes the type. `enum` constrains the allowed values to a fixed list.

## Request bodies and responses

Request bodies and responses both describe a payload. They share the same shape: a `content` map keyed by media type, with each media type carrying a `schema`.

A request body with an inline schema:

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [name, email]
        properties:
          name:
            type: string
          email:
            type: string
            format: email
```

The same request body using a reusable component:

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: "#/components/schemas/CreateUserDto"
```

The two forms produce the same result. The difference is reuse. As soon as the same type appears in more than one place (the request body of `POST /users`, the response of `GET /users/{id}`, an array element in `GET /users`), defining it once under `components/schemas` and referencing it with `$ref` keeps the document consistent and readable.

We will take a look at defining a schema in the next section.

A response works the same way:

```yaml
responses:
  "200":
    description: A list of users
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: "#/components/schemas/UserDto"
  "404":
    description: User not found
```

Every response key must include a `description`. The `content` is optional; some responses (a 204 No Content, for example) have no body.

## Components and schemas

`components/schemas` is the reusable type library for the API. A schema describes the shape of a JSON object, array, or primitive, using a subset of JSON Schema. The fields you will use most often are:

- `type` for the JSON type: `object`, `array`, `string`, `integer`, `number`, `boolean`
- `properties` for the fields of an object
- `required` for an array of property names that must be present
- `items` for the element type of an array
- `enum` for a fixed set of allowed values
- `format` for a refinement of a type, like `email`, `uuid`, `date-time`

A `UserDto` schema and a corresponding response that returns an array of users:

```yaml
components:
  schemas:
    UserDto:
      type: object
      required: [id, name]
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
        role:
          type: string
          enum: [admin, member, guest]
```

The reference path is always `#/components/schemas/<Name>`. The `#` at the start means "this same document"; OpenAPI also supports references into other files, but you will not need that often.

## Security schemes

Authentication is declared in two places. First, the schemes themselves go under `components/securitySchemes`. Then a top-level or per-operation `security` block applies one of those schemes to specific endpoints.

A bearer JWT scheme, the kind your nest-auth session covered:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

The fields here:

- `type: http` means HTTP authentication (as opposed to an API key in a header, or OAuth2).
- `scheme: bearer` selects the bearer scheme inside HTTP auth.
- `bearerFormat: JWT` is a hint to documentation tools; it does not affect validation.
- The top-level `security` block applies `bearerAuth` to every operation by default.

To opt a single operation out of the global requirement, set `security: []` on that operation. To require a different scheme on one operation, list it there.

OpenAPI supports several other security types you will see less often: `apiKey` for keys in a header or query string, `oauth2` for full OAuth flows, and `openIdConnect` for OIDC discovery URLs. The shape of each is documented in the specification.

## Resources

[OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

[JSON Schema reference](https://json-schema.org/)

[Swagger Editor](https://editor.swagger.io/)
