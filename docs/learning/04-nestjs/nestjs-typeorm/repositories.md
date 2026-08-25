# NestJS TypeORM - Repositories

If the entity defines the shape of your data, the repository is the engine that moves it.

Because NestJS strictly follows the Data Mapper pattern, your `Boardgame` entity is entirely passive. It holds data, but it cannot save itself to the database. Instead, you interact exclusively through a `Repository<Entity>`.

This API provides the standard operations you expect like finding rows, inserting records, updating fields, and deleting data. Because TypeORM leverages TypeScript generics, the repository knows exactly what columns exist on your `Boardgame` entity. If you try to filter by a column that doesn't exist, the compiler throws an error before the code even runs.

## Dependency Injection in Services

Similar to other providers in NestJS, repositories are injected into Services. Since Repositories are inferred from entity class by TypeORM, we need to use a slightly different syntax to inject them:

```typescript
// src/boardgames/bordgames.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Boardgame } from "./boardgame.entity";

@Injectable()
export class BoardgameService {
  constructor(
    @InjectRepository(Boardgame)
    private readonly boardgames: Repository<Boardgame>,
  ) {}

  // Business logic goes here...
}
```

Instead of relying on the type alone, we decorate the property with `@InjectRepository(Boardgame)`. This is necessary because TypeScript generics are erased at compile time, so NestJS's DI system can't distinguish `Repository<Boardgame>` from any other `Repository<T>`. Here, the decorator supplies the runtime token to inject the correct repository.

The repository itself is created when you import `TypeOrmModule.forFeature([Boardgame])` in the module. The `Repository<Boardgame>` annotation is only there to give TypeScript proper type information.

> 💡 Naming convention tip: Call the injected property `boardgames` rather than `boardgameRepository`. It makes the calling code read much closer to natural language: `this.boardgames.find()`.

## Querying Data

The repository exposes several read methods. The most common are `find`, `findOne` and `findOneBy`.

```typescript
// src/boardgames/bordgames.service.ts
// methods that might extend our class BoardgameService

async findAll(): Promise<Boardgame[]> {
  return this.boardgames.find({
    order: { name: "ASC" },
  });
}

async findByName(name: string): Promise<Boardgame[]> {
  const game = await this.boardgames.findOne({where: { name }});

  if (!game) {
    throw new NotFoundException(`Boardgame with Name ${name} not found`);
  }
  return game;
}

async findById(id: string): Promise<Boardgame> {
  const game = await this.boardgames.findOneBy({ id });
  if (!game) {
    throw new NotFoundException(`Boardgame with ID ${id} not found`);
  }
  return game;
}
```

The two methods `findOne` and `findOneBy` behave very similar. The `findOneBy` method is a shortcut for `findOne({ where: { column: value } })`.

A common pitfall is calling `findOne()` without providing a `where` clause. If you pass an empty object, TypeORM simply executes `SELECT * FROM boardgames LIMIT 1`, returning the first row the database happens to read. Always use `findOneBy({ column: value })` when filtering by a specific constraint.

For ranges and partial matches, TypeORM exports specific operator functions:

```typescript
// src/boardgames/bordgames.service.ts
// methods that might extend our class BoardgameService
import { LessThanOrEqual, Like } from "typeorm";

async findQuickGames(maxMinutes: number): Promise<Boardgame[]> {
  return this.boardgames.find({
    where: { playtimeMinutes: LessThanOrEqual(maxMinutes) },
  });
}

async searchByName(term: string): Promise<Boardgame[]> {
  // SQLite's standard LIKE operator is inherently case-insensitive
  return this.boardgames.find({
    where: { name: Like(`%${term}%`) }
  });
}
```

## Modifying Data

Writing data involves two distinct steps. `create` builds the object in memory. `save` actually executes the SQL against the database.

```typescript
// src/boardgames/bordgames.service.ts
// method that might extend our class BoardgameService

async createGame(dto: CreateBoardgameDto): Promise<Boardgame> {
  // 1. Synchronous (Local): Builds the entity instance in memory
  const boardgame = this.boardgames.create(dto);

  // 2. Asynchronous (API): Executes the INSERT statement via TypeORM
  return this.boardgames.save(boardgame);
}
```

Splitting these methods gives you a window to manipulate the object, run validation routines, or attach relational data before committing the transaction to the database.

The `save()` method handles both inserts and updates. If the entity has no primary key (or the ID does not exist in the database), `save` triggers an `INSERT`. If the ID already exists, TypeORM executes an `UPDATE` to overwrite the modified fields.

For purely partial updates where you don't need the updated entity returned to the client, `update()` is vastly more efficient because it skips the initial `SELECT` query:

```typescript
// src/boardgames/bordgames.service.ts
// method that might extend our class BoardgameService

// Executes a direct UPDATE statement. Does not return the modified row.
async updatePlaytime(id: string, newTime: number): Promise<void> {
  await this.boardgames.update(id, { playtimeMinutes: newTime });
}
```

Deleting is a simple matter of calling `delete()` on the repository:

```typescript
// src/boardgames/bordgames.service.ts
// method that might extend our class BoardgameService

async deleteGame(id: string): Promise<void> {
  await this.boardgames.delete(id);
}
```

## Query Builder

The option-object syntax (`find({ where: ... })`) handles the vast majority of CRUD operations perfectly. But when you need to execute complex `JOIN`s, group rows, or utilize specific SQL aggregate functions, the standard repository methods break down.

Instead of writing raw, untyped SQL strings, you switch to TypeORM's Query Builder:

```typescript
// src/boardgames/bordgames.service.ts
// method that might extend our class BoardgameService

async getAverageComplexity(): Promise<number> {
  const result = await this.boardgames
    .createQueryBuilder("bg")
    .select("AVG(bg.complexity)", "average")
    .getRawOne();

  return parseFloat(result.average);
}
```

The Query Builder translates your chained method calls into an optimized SQL string. Notice the deliberate use of aliases (`"bg"`). You explicitly map out the query structure, retaining complete control over the execution plan while still gaining protection against SQL injection.
