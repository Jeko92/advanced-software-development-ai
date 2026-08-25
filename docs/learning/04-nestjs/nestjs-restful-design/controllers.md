# NestJS RESTful Design - Controllers

The controller is the layer that turns HTTP requests into method calls and method returns into HTTP responses. The router matches an incoming URL to a class and a method on that class. NestJS reads the method's decorators to figure out which parts of the request to hand it. The method runs, returns a value, and the framework serializes that value to JSON and sends it back with a status code. That is the entire job of a controller.

Good controllers stay thin. They translate request shapes into service calls, raise the right exception when the service comes back empty, and let the framework do everything else: parsing JSON, setting `Content-Type`, picking a status code. When a controller starts to hold business logic, two things go wrong. The same logic gets duplicated across the next three endpoints that need it. And the rules get hard to unit-test because they sit tangled inside HTTP plumbing. Keeping logic out of the controller pays off the moment the API grows past basic CRUD.

The example through the rest of this session is a Concerts API. The resource looks like this:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Concert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  venue: string;

  @Column({ type: "datetime" })
  date: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  ticketPrice: number;

  @Column()
  genre: string;
}
```

A concert has a UUID, a title, an artist, a venue, a date, a price, and a genre. Standard TypeORM entity, persisted in SQLite. The controller exposes five endpoints over it: list, read-one, create, update, delete.

## Routing and the controller prefix

The `@Controller()` decorator marks a class as a controller and sets the base path for every route it defines:

```typescript
import { Controller } from "@nestjs/common";

@Controller("concerts")
export class ConcertsController {}
```

Every endpoint declared inside `ConcertsController` is automatically prefixed with `/concerts`. There is no separate route file. The class itself is the routing table.

Inside the class, method-level decorators declare the HTTP method and the path suffix for each endpoint:

```typescript
@Get()           // GET /concerts
@Get(":id")      // GET /concerts/:id
@Post()          // POST /concerts
@Patch(":id")    // PATCH /concerts/:id
@Delete(":id")   // DELETE /concerts/:id
```

The full URL for an endpoint is the controller prefix joined to the method suffix. `@Get(":id")` on `ConcertsController` becomes `GET /concerts/:id`. Path parameters (the `:id` piece) are extracted from the URL and made available to the method through `@Param()`.

### Design Challenge: Sub-resources

Now, consider a closely related entity: `Tickets`.  
If every concert has tickets, how should we structure the routes to purchase or view them? Should a ticket be treated as a sub-resource nested under the concert (e.g., `GET /concerts/:id/tickets`), or does it represent a distinct entity that deserves its own dedicated controller (e.g., `GET /tickets/:id`)? Furthermore, what happens to your route design if a user wants to fetch a list of all the tickets they have purchased across multiple different concerts?

> _Think about how you would structure these routes before moving on. There is no single correct answer, but your decision will fundamentally shape how clients interact with your API._

## Reading data from the request

Three decorators cover almost every controller method:

- `@Param('name')` reads a URL path parameter. For `GET /concerts/9a4f...`, `@Param('id')` gives the controller the string `'9a4f...'`.
- `@Body()` reads the parsed JSON body of the request. NestJS hands the method a plain object whose keys match the JSON. When the method's parameter type is a DTO class, the framework can validate and transform that object into an instance of the DTO.
- `@Query('name')` reads a query parameter from the URL. For `GET /concerts?genre=jazz`, `@Query('genre')` returns `'jazz'`. Calling `@Query()` without a name returns the full query object.

Two more decorators surface less often: `@Headers()` for reading request headers (useful when the method needs the `Authorization` header directly), and `@Req()` / `@Res()` for the underlying Express request and response objects. Reach for those only when the typed shortcuts above fall short. Touching `@Res()` directly disables most of the framework's response handling.

## The full Concerts controller

Putting the decorators together, the controller for the Concert resource looks like this:

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ConcertsService } from "./concerts.service";
import { CreateConcertDto } from "./dto/create-concert.dto";
import { UpdateConcertDto } from "./dto/update-concert.dto";

@Controller("concerts")
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const concert = await this.concertsService.findOne(id);
    if (!concert) {
      throw new NotFoundException(`Concert with ID '${id}' not found`);
    }
    return concert;
  }

  @Post()
  create(@Body() dto: CreateConcertDto) {
    return this.concertsService.create(dto);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateConcertDto,
  ) {
    const concert = await this.concertsService.update(id, dto);
    if (!concert) {
      throw new NotFoundException(`Concert with ID '${id}' not found`);
    }
    return concert;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    const removed = await this.concertsService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Concert with ID '${id}' not found`);
    }
  }
}
```

A few details worth calling out:

- The constructor injects `ConcertsService` through `private readonly`. NestJS resolves the dependency from the module's provider list. The controller never instantiates the service directly.
- `ParseUUIDPipe` on `@Param('id', ...)` rejects any path parameter that is not a syntactically valid UUID before the method runs. It is one of NestJS's built-in pipes.
- `findOne`, `update`, and `remove` throw `NotFoundException` when the service returns `null` or `undefined`. The framework turns that exception into a `404` response with the `message` field set to the string passed in.
- `@HttpCode(HttpStatus.NO_CONTENT)` overrides the default `200` on the DELETE handler. A successful delete returns `204` with no body.
- `findAll`, `findOne`, `update`, and `remove` return the value from the service. NestJS serializes whatever the method returns to JSON, so explicit response building is unnecessary.

## Delegating to the service

The controller never touches the database. Every persistence operation routes through `ConcertsService`:

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Concert } from "./concert.entity";
import { CreateConcertDto } from "./dto/create-concert.dto";
import { UpdateConcertDto } from "./dto/update-concert.dto";

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertsRepository: Repository<Concert>,
  ) {}

  findAll() {
    return this.concertsRepository.find();
  }

  findOne(id: string) {
    return this.concertsRepository.findOneBy({ id });
  }

  create(dto: CreateConcertDto) {
    const concert = this.concertsRepository.create(dto);
    return this.concertsRepository.save(concert);
  }

  async update(id: string, dto: UpdateConcertDto) {
    const concert = await this.findOne(id);
    if (!concert) return null;
    Object.assign(concert, dto);
    return this.concertsRepository.save(concert);
  }

  async remove(id: string) {
    const result = await this.concertsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
```

The service is also thin, but for a different reason. Its only job is to translate domain operations into repository calls. The repository, injected through `@InjectRepository(Concert)`, is where the actual SQL gets generated. Once the API grows past CRUD (sending email confirmations, charging cards, emitting domain events, queuing background jobs), that logic belongs in the service, never in the controller.

> **_:pencil2: Note:_** Returning the entity directly from the service exposes every database column to the API client. The next section covers response DTOs, which shape the data on its way out and prevent internal fields from leaking.

## Wiring it together in a module

For the sake of completeness: Controllers and services do not register themselves. The module they belong to declares both, and imports the TypeORM feature module for the entity:

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Concert } from "./concert.entity";
import { ConcertsController } from "./concerts.controller";
import { ConcertsService } from "./concerts.service";

@Module({
  imports: [TypeOrmModule.forFeature([Concert])],
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
```

This forms the complete technical foundation. Controllers handle the routing, parameters are strictly typed and parsed, the service takes over all database operations, errors automatically translate into HTTP status codes, and the module binds everything together into a cohesive unit.

## Resources

[NestJS docs, Controllers](https://docs.nestjs.com/controllers)

[NestJS docs, Modules](https://docs.nestjs.com/modules)
