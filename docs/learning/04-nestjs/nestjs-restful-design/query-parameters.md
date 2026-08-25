# NestJS RESTful Design - Query Parameters

A list endpoint without query parameters is barely useful past a few dozen records. `GET /concerts` returns every concert in the database. That works for a developer poking at the API with `curl`. It breaks the moment the table has ten thousand rows and the client only wants the next ten jazz concerts in San Francisco sorted by date.

Query parameters are how REST keeps the URL identity stable while letting the client modify what the collection returns. The resource is still `/concerts`. Adding `?genre=jazz&city=san-francisco&sort=date&page=2&limit=10` does not change which resource is being addressed; it changes the slice of that collection the server should send back. The path stays stable, and the API does not sprout a new endpoint every time a client wants a different view of the data.

Five operations cover almost every realistic list query. Filtering selects a subset based on field values. Sorting controls the order of the result. Pagination cuts the result into pages. Field selection trims each item to a subset of its fields. Inclusion (sometimes called expansion) embeds related resources inline so the client does not need a second round-trip. Each operation has a conventional URL shape that REST APIs across the industry have converged on.

Pagination is the only one of the five that earns a full implementation in this file. The others are sketched at the URL level because the right server-side approach depends heavily on which fields the resource exposes, and trying to build a generic filter engine before the API has real users is usually wasted effort.

## Filtering

Filtering reduces a collection to the items matching a condition. The simplest form is direct equality. `GET /concerts?genre=jazz` returns concerts whose genre field equals jazz. Multiple parameters combine as AND. `GET /concerts?genre=jazz&venue=blue-note` returns jazz concerts at the Blue Note. The server treats each parameter as a separate predicate against the corresponding column.

Once equality is not enough, comparison operators come into play. Two URL conventions show up across the industry:

- Bracket notation: `GET /concerts?ticketPrice[gte]=50&ticketPrice[lte]=200`
- Suffix notation: `GET /concerts?ticketPrice_gte=50&ticketPrice_lte=200`

Both are valid. Pick one and use it everywhere in your API. Common operators include `gt` (greater than), `gte`, `lt`, `lte`, `ne` (not equal), and `in` (one of a list).

Multi-value filters typically use a comma-separated list: `GET /concerts?genre=jazz,classical` returns concerts in either genre. Some APIs repeat the parameter (`?genre=jazz&genre=classical`); both are acceptable, and most server frameworks parse repeated parameters into an array automatically.

On the server side, each accepted filter becomes an optional field on a query DTO with the appropriate validation decorators. The service translates the DTO into a `WHERE` clause when it calls the repository. The URL design is the easy part. The translation logic is where filtering becomes nontrivial.

## Sorting

Sorting controls the order of the items in the result. The conventional parameter is `sort`, with a leading `-` indicating descending order:

- `GET /concerts?sort=date` returns concerts ordered by date ascending.
- `GET /concerts?sort=-date` returns concerts ordered by date descending.
- `GET /concerts?sort=artist,-date` sorts by artist ascending first, then by date descending within each artist.

A whitelist on the server side keeps arbitrary column names from leaking through. Letting the client sort by any field, including ones the API was never intended to expose, is a leak waiting to happen. The query DTO should declare the allowed sort fields explicitly and reject everything else.

## Pagination

Pagination is worth implementing concretely, because the wrong approach causes performance problems that compound as the data grows. Two patterns dominate.

Page-based pagination uses `page` and `limit`. The client requests page N of size M:

```
GET /concerts?page=2&limit=10
```

The server skips the first `(page - 1) * limit` rows and returns the next `limit`. Page-based is the right default for most APIs. Clients understand it, UI controls map to it directly, and the math is obvious.

Offset-based pagination uses `offset` and `limit` directly:

```
GET /concerts?offset=20&limit=10
```

Same idea, different parameter names. Offset-based is slightly more flexible (the client picks any starting point) but otherwise equivalent.

A query DTO captures the input rules:

```typescript
import { IsInt, IsOptional, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;
}
```

The decorators encode the rules:

- `page` and `limit` must be positive integers.
- `limit` is capped at 100 so a malicious or careless client cannot request a million rows at once.
- `@Type(() => Number)` converts the query string value (which arrives as a string) into a number before validation runs.
- Default values cover requests where the client omits one or both parameters.

The controller takes the DTO through `@Query()`:

```typescript
import { Controller, Get, Query } from "@nestjs/common";
import { ConcertsService } from "./concerts.service";
import { PaginationQueryDto } from "./dto/pagination-query.dto";

@Controller("concerts")
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.concertsService.findAll(pagination);
  }
}
```

The service translates the DTO into a repository call:

```typescript
async findAll(pagination: PaginationQueryDto) {
  const { page, limit } = pagination;

  const [data, total] = await this.concertsRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

`findAndCount` returns both the page of rows and the total count in one query, which the client needs to render pagination controls.

The response shape is consistent with what most consumers expect:

```json
{
  "data": [
    { "id": "9a4f...", "title": "Coltrane Tribute" },
    { "id": "1b2e...", "title": "Mingus Live" }
  ],
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 247,
    "totalPages": 25
  }
}
```

The `data` array holds the items. The `meta` object tells the client where it is in the collection and how many items exist in total. With this shape, a frontend can render "Page 2 of 25" without making a separate count request.

> **_:exclamation: Watch out:_** Offset-based pagination becomes slow on very large tables. Fetching page 1000 of size 10 requires the database to scan and discard 9990 rows before returning the next 10. Cursor-based pagination (where the client passes the last item's ID as a starting point) avoids that cost but is more complex to implement. Stick with offset-based until query performance actually forces a change.

## Excursion: Field selection and inclusion

Two operations show up less often in standard REST APIs, but both are worth knowing about (You don't need to implement them).

Field selection lets the client ask for a subset of the fields on each resource. The conventional parameter is `fields`:

```
GET /concerts?fields=id,title,date
```

The server returns each concert with only the three requested fields. This trims the response size when clients only need to display a summary view, which matters more for mobile clients on slow networks than for desktop browsers. Implementing it requires the service to project columns at the database level, which is more involved than filtering and less commonly worth the complexity.

Inclusion (or expansion) does the opposite. It embeds related resources inline:

```
GET /concerts/9a4f...?include=venue,artist
```

Instead of returning just the foreign-key references, the response includes the full venue and artist objects nested inside the concert. This saves the client a round trip for the common case of "give me a concert and everything I need to display it." On the server side, the service has to load the relations (typically via TypeORM's `relations` option), and the response DTO has to declare nested DTOs with `@Type(() => VenueResponseDto)`.

Both operations earn their place when the API serves clients with constrained data budgets. However, for most internal APIs, a fixed response shape is the simpler choice and stays simpler as the API grows. If your application heavily relies on dynamic field selection and deep relationship inclusion, it is usually a sign that the project would benefit from GraphQL rather than a traditional REST API.

## Resources

[JSON:API specification, Fetching Data](https://jsonapi.org/format/#fetching)

[NestJS docs, Repository API](https://docs.nestjs.com/techniques/database#repository-pattern)
