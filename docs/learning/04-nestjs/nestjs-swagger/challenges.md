# NestJS Swagger - Challenges

## Document the Cyber Chat API

Take the cyber-chat NestJS API you built in previous sessions (threads, messages, comments, JWT auth) and add full Swagger documentation to it. By the end, a developer who has never seen your project should be able to open `http://localhost:3000/api`, understand every endpoint, and call the API from the browser without reading any source code.

- Install `@nestjs/swagger` and configure `SwaggerModule.setup('api', app, document)` in `main.ts` so the docs are served at `/api` and the raw OpenAPI document at `/api-json`.
- Set a sensible `title`, `description`, and `version` on the `DocumentBuilder`.
- Register the bearer JWT scheme with `.addBearerAuth()` so protected endpoints can be tried from Swagger UI.
- Enable the `@nestjs/swagger` CLI plugin in `nest-cli.json` so most DTO metadata is inferred automatically.
- Add `@ApiOperation({ summary })` to every route so every endpoint has a one-line description.
- For every endpoint, declare at least one success response (`@ApiOkResponse`, `@ApiCreatedResponse`) and at least one error response that the endpoint can actually return (`@ApiNotFoundResponse` for lookups by id, `@ApiBadRequestResponse` for validated input, `@ApiUnauthorizedResponse` for protected routes).
- Mark every protected route with `@ApiBearerAuth()` (or apply it once at the controller level).
- For each DTO, add `@ApiProperty` or `@ApiPropertyOptional` to any property where the CLI plugin cannot infer the metadata you want (descriptions, examples, enums for status fields, formats for UUIDs and dates).
- Verify in the browser:
  - "Try it out" calls an unprotected endpoint (for example, the login route) and shows a real response.
  - The "Authorize" dialog accepts a JWT, and after authorizing, "Try it out" works on a protected endpoint.

### Optional

- Open `http://localhost:3000/api-json`, copy the document, paste it into `editor.swagger.io`, and confirm it validates with no errors.
- Use OpenAPI Generator (`npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/api-json -g typescript-fetch -o ./client`) to produce a typed TypeScript client. Write a small script that imports the generated client and calls one endpoint against your running server.
