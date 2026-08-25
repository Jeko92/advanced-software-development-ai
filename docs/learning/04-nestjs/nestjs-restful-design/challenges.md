# NestJS RESTful Design - Challenges

## Cyber Chat, Speak REST

Cyber Chat persists to SQLite now, but the API surface is still rough. Lets apply the best practices regarding RESTful design to the API.

### Task 1: The Request Boundary

- Create `CreateThreadDto` and `UpdateThreadDto` in `threads/dto/`. The create DTO should require `title`, `body`, and `author`, each with sensible `class-validator` rules and length limits. The update DTO should extend `PartialType(CreateThreadDto)` from `@nestjs/mapped-types`.
- Create `CreateCommentDto` in `comments/dto/` with `body` and `author`. The thread ID comes from the URL, not the body.
- Register a global `ValidationPipe` in `main.ts` with `whitelist`, `forbidNonWhitelisted`, `transform`, and `transformOptions.enableImplicitConversion` enabled.
- Update every controller method that accepts a body to use the typed DTO instead of a plain object.
- Add a `PATCH /threads/:id` route so threads can be updated without sending the full representation.

### Task 2: The Response Boundary

- Create `ThreadResponseDto` and `CommentResponseDto`. Mark every exposed field with `@Expose()`. Use `@Type(() => Date)` on the `createdAt` field so it serializes as a real `Date`.
- Register `ClassSerializerInterceptor` globally in `main.ts` with `excludeExtraneousValues: true`.
- Update the services to map TypeORM entities to response DTOs with `plainToInstance` before returning. No service method should return a raw entity.
- Confirm that adding a new column to the `Thread` entity does not change the API response. The new column should stay invisible to clients until it is opted into the response DTO.

### Task 3: Status Codes and Exceptions

- Replace any manual status-code wrangling with NestJS exceptions. `NotFoundException` for missing threads or comments. `BadRequestException` where the request itself is malformed beyond what `ValidationPipe` catches.
- Decorate the DELETE handlers with `@HttpCode(HttpStatus.NO_CONTENT)` so a successful delete returns `204` with no body.
- Confirm `POST /threads` and `POST /threads/:id/comments` return `201 Created`. Confirm `GET /threads/:id` returns `200 OK`.
- Apply `ParseUUIDPipe` to every `:id` path parameter on both controllers. A request to `GET /threads/not-a-uuid` should return `400 Bad Request` before the handler runs.

### Task 4: Paginated Thread Listing

- Create `PaginationQueryDto` in a shared location with `page` (default 1, minimum 1) and `limit` (default 10, minimum 1, maximum 100). Both must be positive integers. Use `@Type(() => Number)` so the string values from the URL get converted.
- Update `GET /threads` to accept the DTO through `@Query()`.
- Update `ThreadsService.findAll` to return `{ data, meta: { page, limit, total, totalPages } }` using `findAndCount`. Map the rows through `plainToInstance(ThreadResponseDto, ...)` before they leave the service.
- Verify that the response shape stays consistent whether or not the client passes pagination parameters.

### Bonus

- Sort threads by `createdAt` descending by default. Accept `?sort=-createdAt` or `?sort=createdAt` on the list endpoint to flip the order. Reject any other `sort` value with a `400`.
- Filter threads by author with `?author=<name>` on the list endpoint. Combine the filter with pagination so `?author=ada&page=2` works as expected.
- Write a custom `ParseDatePipe` that takes a date string from a query parameter (for example, `?startDate=2026-05-27`), validates that it is a parseable date, and transforms it into a native JavaScript `Date` object. If the provided string is invalid, the pipe should throw a `BadRequestException` (yielding a `400 Bad Request response`). Apply this pipe to a `@Query('startDate')` parameter in one of your controller endpoints.

> :exclamation: Since we have not built a custom pipe together yet, you will need to consult the documentation to see how the `PipeTransform` interface is structured. [NestJS Documentation: Custom Pipes](https://docs.nestjs.com/pipes#custom-pipes)
