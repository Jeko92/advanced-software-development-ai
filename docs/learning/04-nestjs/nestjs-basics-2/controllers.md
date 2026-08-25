# NestJS Basics 2 - Controllers

A controller in NestJS plays the same role it does in the Express MVC architecture: it sits at the edge of the application, receives incoming HTTP requests, and returns responses. What changes is how the code inside the controller is structured. As discussed before, NestJS uses decorators to define a lot of its structure. Each controller class and each handler method gets a decorator that tells the framework which HTTP method and URL path it handles.

## Route decorators

The `@Controller("base-path")` decorator marks a class as a controller and sets its base path. Method decorators inside the class like `@Get()`, `@Post()`, `@Patch()` or `@Delete()` map to their HTTP equivalents and append to that base path:

```typescript
import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAllUsers();
  }

  @Get("random")
  getRandom(): User {
    return this.userService.getRandomUser();
  }
}
```

- `@Controller("users")` sets the base path; every route in this class starts with `/users`
- `@Get()` without an argument maps to `GET /users`
- `@Get("random")` maps to `GET /users/random`

## Parameter decorators

In order to extract data from the request, NestJS provides dedicated decorators for each use case. These decorators are a bit different from the ones we saw already. Instead of decorating a class or a method, they are placed before a parameter of a route handler. They add additional functionality to that parameter, in this case injecting the value of the corresponding part of the request into the parameter.

`@Param("id")` in combination with `@Get(":id")` extracts a named segment, in this case `id`, from the URL path:

```typescript
@Get(":id")
getById(@Param("id") userId: string): User {
  console.log(userId) // id = "42" for GET /users/42
}
```

`@Body()` extracts the parsed JSON body from a POST, PUT or PATCH request:

```typescript
@Post()
createUser(@Body() user: UserPayload): User {
  return this.userService.createUser(user);
}
```

`@Query("search")` extracts a query string value:

```typescript
@Get()
searchUsers(@Query("search") search: string): User[] {
  console.log(search) // search = "alice" for GET /users?search=alice
}
```

What is important to note here is that the parameters of our handler method can now be anything we want; we just need to prefix it with the appropriate decorator.

A controller that handles reading and writing a single resource uses all of these:

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./interfaces/user.interface";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAllUsers();
  }

  @Get(":id")
  getOne(@Param("id") id: string): User {
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  @Post()
  create(@Body() body: UserPayload): User {
    return this.userService.addNewUser(body.name, body.email);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<UserPayload>): User {
    const updated = this.userService.updateUser(id, body.name, body.email);
    if (!updated) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return updated;
  }

  @Delete(":id")
  remove(@Param("id") id: string): { message: string } {
    const deleted = this.userService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return { message: `User with ID "${id}" deleted.` };
  }
}
```

`NotFoundException` is imported from `@nestjs/common`. Throwing it causes NestJS to send a `404` response automatically, without any additional configuration.

## Resources

[NestJS Controllers documentation](https://docs.nestjs.com/controllers)
