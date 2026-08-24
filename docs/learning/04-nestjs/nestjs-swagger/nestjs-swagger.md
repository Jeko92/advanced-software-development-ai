# NestJS Swagger - Swagger in NestJS

Writing an OpenAPI document by hand alongside a NestJS application is a bad idea. Every change to a controller, every new DTO field, every renamed route has to be reflected in the YAML file too, and nobody remembers to do that consistently.

The `@nestjs/swagger` instead generates the OpenAPI document directly from the code at startup. Most of the information needed is already in the source: `@Get('/messages/:id')` declares the route, the constructor parameter types declare the dependencies, the DTO classes declare the request shape, the return type declares the response shape. The plugin reads all of this and produces a complete OpenAPI document with no extra YAML file to maintain.

A handful of new decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, `@ApiBearerAuth`) fill in the metadata that TypeScript types cannot carry: human-readable summaries, response status codes other than 200, example values, error response shapes. The result is a documentation page that updates itself whenever the code changes.

## Installation and bootstrap

Install the package as a normal dependency:

```bash
npm install @nestjs/swagger
```

The mounting happens in `main.ts`, after the application is created and before `listen` is called:

```ts
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Cyber Chat API")
    .setDescription("Threads, messages, and comments")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
```

Three pieces of work happen here:

- `DocumentBuilder` constructs the top-level `info` section of the OpenAPI document. The methods you call on it correspond directly to the fields described in the previous concept file: `setTitle` and `setVersion` fill in `info`, `addBearerAuth` registers a `bearerAuth` entry under `components/securitySchemes`.
- `SwaggerModule.createDocument` walks the application, inspects every controller and DTO, and assembles a complete OpenAPI document in memory.
- `SwaggerModule.setup('api', app, document)` registers two routes: `GET /api` serves the Swagger UI HTML, and `GET /api-json` serves the raw OpenAPI document.

After starting the app, `http://localhost:3000/api` shows the interactive documentation page.

## Documenting DTOs with @ApiProperty

NestJS DTOs already carry shape information: property names, TypeScript types, and `class-validator` decorators like `@IsString()` or `@IsEmail()`. The Swagger CLI plugin (covered below) can extract most of this automatically. When the plugin is not available, or when you need to add metadata that the types cannot express, use `@ApiProperty`:

```ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsUUID, IsOptional } from "class-validator";

export class CreateMessageDto {
  @ApiProperty({
    description: "The text content of the message",
    example: "Hello, world!",
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: "The thread this message belongs to",
    format: "uuid",
  })
  @IsUUID()
  threadId: string;
}
```

A few things to notice:

- `@ApiProperty` adds metadata to the OpenAPI schema for this DTO. The `description` and `example` show up in Swagger UI as helper text under each field.
- `@ApiPropertyOptional` is a shorthand for `@ApiProperty({ required: false })`. Use it for any property you would also mark with `@IsOptional`.
- The `format` field is a hint: `uuid`, `email`, `date-time`, and others come from the JSON Schema spec and are displayed by Swagger UI in the field's helper text.

The resulting OpenAPI schema for this DTO looks the same as the hand-written schemas in the previous concept file. The decorators are just a different way to write the same thing.

## Controller decorators

Routes get documented at the controller and method level. The decorators below are the ones you will reach for most often:

```ts
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./create-message.dto";
import { Message } from "./message.entity";

// @ApiTags("messages") outdated, inferred from controller name
@ApiBearerAuth()
@Controller("messages")
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get()
  @ApiOperation({ summary: "List all messages in a thread" })
  @ApiOkResponse({ type: [Message] })
  findAll(): Promise<Message[]> {
    return this.messages.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single message by id" })
  @ApiOkResponse({ type: Message })
  @ApiNotFoundResponse({ description: "No message exists with that id" })
  findOne(@Param("id") id: string): Promise<Message> {
    return this.messages.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Post a new message to a thread" })
  @ApiCreatedResponse({ type: Message })
  create(@Body() dto: CreateMessageDto): Promise<Message> {
    return this.messages.create(dto);
  }
}
```

What each decorator does:

- `@ApiTags('messages')` on the controller groups every route in this class under the `messages` heading in Swagger UI. It is outdated: the plugin infers this from the controller name.
- `@ApiBearerAuth()` on the controller marks every route inside it as requiring the bearer scheme that was registered in `main.ts` with `addBearerAuth()`. You can also apply it to individual methods if only some endpoints are protected.
- `@ApiOperation({ summary, description })` provides the human-readable label for the route. The `summary` is the one-liner shown in the collapsed view; `description` is the longer Markdown text shown when the route is expanded.
- `@ApiOkResponse`, `@ApiCreatedResponse`, `@ApiNotFoundResponse`, `@ApiBadRequestResponse`, `@ApiUnauthorizedResponse` are shorthands for `@ApiResponse({ status: 200, ... })` and so on. They are easier to read than raw status codes. The `type` option tells Swagger which DTO or entity describes the response body; passing `[Message]` documents an array response.

You can stack as many response decorators on a method as the endpoint can produce. A typical route declares one success response and one or two error responses (a 404 for a missing resource, a 400 for invalid input).

## The CLI plugin

Adding `@ApiProperty()` to every DTO property is tedious. The NestJS CLI ships with a Swagger plugin that infers most of this automatically by reading TypeScript types and `class-validator` decorators at build time.

Enable it in `nest-cli.json`:

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
```

Once the plugin is on:

- A DTO property declared as `name: string` is documented as a required string without needing `@ApiProperty()`.
- A property marked with `?` (`replyToId?: string`) is documented as optional automatically.
- `class-validator` decorators like `@IsEmail()`, `@IsUUID()`, `@Min(0)`, `@MaxLength(100)` are translated into the corresponding OpenAPI schema fields (`format: email`, `format: uuid`, `minimum: 0`, `maxLength: 100`).

You still use `@ApiProperty()` for the things the plugin cannot infer: human-readable descriptions, examples, and explicit overrides. The plugin only runs when the Nest CLI build is used; if your project uses a custom webpack or tsc setup, you have to fall back to manual decorators.

## Viewing and using the document

After `SwaggerModule.setup('api', app, document)` is in place and the server is running, two URLs are useful:

- `http://localhost:3000/api` renders Swagger UI. Each tag becomes a collapsible section. Each route inside it has a "Try it out" button that lets you fill in the parameters and request body in a form, send a real HTTP request to the running server, and inspect the response. For protected routes, paste a JWT into the "Authorize" dialog at the top of the page and Swagger UI will include it as `Authorization: Bearer <token>` in subsequent requests.
- `http://localhost:3000/api-json` returns the raw OpenAPI document. This is the file every other tool consumes. Paste its URL into `editor.swagger.io` to see it rendered there, import it into Postman or Insomnia to populate a request collection, or feed it to OpenAPI Generator to produce a typed client SDK.

The two URLs are equivalent in content: the JSON endpoint is the source of truth, and Swagger UI is one of many possible views of the same data.

**⚠️ Important Note:** as much as it is useful to expose APIs of a backend service to potential consumers, it poses a considerable risk to have this information in public if it is not intended. It might be wise to consider keeping Swagger a `development` dependency, or not setting up Swagger when the environment is `production`. In the resources section below is a link to a common implementation workaround.

## Resources

[Introduction to OpenAPI in NestJS](https://docs.nestjs.com/openapi/introduction)

[NestJS Swagger decorators](https://docs.nestjs.com/openapi/decorators)

[NestJS Swagger CLI plugin](https://docs.nestjs.com/openapi/cli-plugin)

[Setting up Swagger conditionally based on environment](https://stackoverflow.com/questions/67614748/how-to-disable-swagger-for-production-in-nestjs)
