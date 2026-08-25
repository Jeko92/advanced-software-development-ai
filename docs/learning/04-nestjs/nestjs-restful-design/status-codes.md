# NestJS RESTful Design - Status Codes

The status code is the first thing a client looks at, and it is the only piece of the response that a program can act on without parsing the body. A `201` means "created, here is where it lives." A `422` means "your payload was syntactically fine but semantically wrong, do not retry without changes." A `503` says "I am alive but temporarily out of commission, try again later." Two clients reading the same status code reach the same conclusion. That predictability is the entire point of the system.

The first rule is that there must always be a status code, even when there is no body. A successful DELETE has nothing meaningful to return, but `204 No Content` is still a complete HTTP response with a status line and headers. Closing the connection without sending anything is not an API behavior; it is a bug.

The second rule is that the code must tell the truth. Returning `200 OK` with `{ "error": "User not found" }` is a lie that breaks every client that trusts the status line. Logging dashboards and retry middleware both key off the status code, not the body. If the request failed, the status code has to say so.

Three families of codes do almost all the work in a typical REST API: `2xx` for success, `4xx` when the client did something wrong, `5xx` when the server did. The `1xx` (informational) and `3xx` (redirects) families exist, though a backend developer writing a JSON API will rarely have a reason to return them directly.

## 2xx, the success codes

Each success code says something specific about what kind of success happened.

- **200 OK** is the default for a successful read or update that has data to return. Examples: a `GET /concerts/42`, a `PATCH /concerts/42` that returns the updated resource, a `PUT /concerts/42` that confirms the replacement. Most success responses are 200.
- **201 Created** is the response to a successful POST that produced a new resource. The response should include a `Location` header pointing at the new resource's URL (e.g. `Location: /concerts/9a4f...`) along with the new resource in the body.
- **202 Accepted** says the request was accepted but the work is still in flight. Useful for jobs that take long enough to process asynchronously: bulk imports, video transcoding, sending emails to thousands of recipients. The body usually contains an ID the client can poll later.
- **204 No Content** is the right answer when the operation succeeded but there is nothing to send back. A DELETE that worked, an idempotent "mark as read," a `PATCH` whose result the client already knows. A 204 response must not have a body.

The difference between 200 and 201 matters because clients often write different code paths for them. A frontend that just got a 201 knows it can read the `Location` header to find the new record. A 200 carries no such promise.

## 4xx, client errors

The 4xx family is the noisiest part of the cheat sheet, and most of the confusion lives between codes that look similar but mean different things.

- **400 Bad Request** is the generic "I cannot parse what you sent." Malformed JSON, missing required headers, a query parameter that should have been a number but is not, a field the API expects but the request omitted. If the request failed before any business logic ran, 400 is the right code.
- **401 Unauthorized** means "I do not know who you are." The credentials are missing or invalid. The client should authenticate and try again.
- **403 Forbidden** means "I know who you are, and you are not allowed to do this." The credentials are valid; the permissions are not.
- **404 Not Found** means the resource the URL points at does not exist. Use it for missing concerts, missing users, missing whatever. Do not use 404 to hide existence for permission reasons unless leaking no information is an explicit goal.
- **409 Conflict** means the request is well-formed but conflicts with the current state of the resource. The classic example is creating a record with a unique field that already exists, like a second user with the same email address.
- **422 Unprocessable Entity** means the request parsed fine but failed validation. The JSON was valid; the values inside it broke a business rule. A 16-character password requirement, a date in the past for an upcoming concert, a ticket price below zero.
- **429 Too Many Requests** means the client is over its rate limit. The response should include a `Retry-After` header telling the client when it is safe to try again.

The 400 vs 422 distinction is the most argued-over decision in this whole family. A rough rule: 400 if the request itself is broken (the parser would reject it), 422 if the request was readable but the values inside it failed validation. NestJS's `ValidationPipe` returns 400 by default; many teams configure it to return 422 instead. Either choice is defensible. Pick one and apply it everywhere.

A typical NestJS error response looks like this:

```json
{
  "statusCode": 404,
  "message": "Concert with ID '9a4f-...' not found",
  "error": "Not Found"
}
```

When `ValidationPipe` rejects a payload, the `message` field becomes an array with one entry per failed rule:

```json
{
  "statusCode": 400,
  "message": ["title must be a string", "ticketPrice must not be less than 0"],
  "error": "Bad Request"
}
```

The shape is consistent across handlers, which is what makes client-side error handling tractable. A client can read `statusCode` for branching logic and surface `message` to the user.

## 5xx, server errors

The 5xx family is shorter because the client cannot do much about it. Its job is to tell the client that the failure is on the server's side, and to be careful not to leak internal details while doing so.

- **500 Internal Server Error** is the catch-all for an unhandled exception. A null reference, an uncaught error, a database connection that died mid-query, the disk filling up. The response should not include stack traces in production; that information belongs in the server's logs, not in the response body.
- **503 Service Unavailable** is the right code when the server is intentionally not handling requests right now. A maintenance window, an overload-protection circuit breaker, a downstream dependency the API needs but cannot reach. Include a `Retry-After` header when possible so clients know how long to back off.

## NestJS exceptions and the default error shape

NestJS turns thrown exceptions into HTTP status codes automatically. The framework ships with an `HttpException` class hierarchy that maps directly to the codes above.

```typescript
import { Controller, Get, Param, NotFoundException } from "@nestjs/common";

@Controller("concerts")
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get(":id")
  findOne(@Param("id") id: string) {
    const concert = this.concertsService.findOne(id);
    if (!concert) {
      throw new NotFoundException(`Concert with ID '${id}' not found`);
    }
    return concert;
  }
}
```

Each subclass sets the status code, the error label, and the message field on the response. Throwing `NotFoundException` produces the 404 body shown above. Throwing `ConflictException` produces a 409. The mapping is direct:

- `BadRequestException` → 400
- `UnauthorizedException` → 401
- `ForbiddenException` → 403
- `NotFoundException` → 404
- `ConflictException` → 409
- `UnprocessableEntityException` → 422
- `InternalServerErrorException` → 500
- `ServiceUnavailableException` → 503

When none of the built-in subclasses fit, the base `HttpException` lets you set any status code directly:

```typescript
throw new HttpException("I'm a teapot", HttpStatus.I_AM_A_TEAPOT);
```

Unhandled exceptions that do not extend `HttpException` become 500 responses with a generic message. That default protects against accidentally exposing error details from third-party libraries.

> **_:bulb: Good to know:_** While the default 500 behavior is safe, production applications rarely leave unhandled exceptions completely untouched. Instead, they use a global Exception Filter to catch, log, and format these errors consistently before sending the response to the client. We will not build one in this session, but if you are interested in how it works, the [NestJS Exception Filters documentation](https://docs.nestjs.com/exception-filters) is an excellent read.

## Customizing success status codes

While NestJS automatically maps exceptions to specific error codes, it also has default success codes: `200 OK` for `GET`, `PUT`, and `PATCH`, and `201 Created` for `POST`.

However, true RESTful design sometimes requires different success codes. The most common example is a DELETE request. When a resource is successfully deleted and there is no data left to return in the response body, the correct status is `204 No Content`.

To override the default behavior, decorate the handler with `@HttpCode()`:

```typescript
import {
  Controller,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

@Controller("concerts")
export class ConcertsController {
  // ... constructor and other methods ...

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    this.concertsService.remove(id);
  }
}
```

You will also rely on this decorator if you ever need to build asynchronous endpoints, such as triggering a long-running background job, where returning a `202 Accepted` (`@HttpCode(HttpStatus.ACCEPTED)`) is the standard practice.

## Resources

[MDN, HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

[NestJS docs, Exception filters](https://docs.nestjs.com/exception-filters)
