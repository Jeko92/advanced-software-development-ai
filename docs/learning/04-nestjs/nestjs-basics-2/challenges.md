# NestJS Basics 2 - Challenges

## Cyber Chat

Build the foundation of a threaded discussion app using NestJS modules, controllers, services, and providers. The discussion app can only be used via API, so you don't have to worry about building a frontend. For now, the data will be stored in memory.

**Data**

```typescript
type Thread = {
  id: number;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
};

type Comment = {
  id: number;
  threadId: number;
  author: string;
  body: string;
  createdAt: Date;
};
```

**Modules**

Create `ThreadsModule` and `CommentsModule`, both imported into `AppModule`.

**Providers**

Build `ThreadsRepository` and `CommentsRepository` as injectable providers. Store data in memory using `Map<number, Thread>` and `Map<number, Comment>`.

Build `ThreadsService` and `CommentsService`, each depending on its repository via constructor injection.

**Controllers**

| Method | Route                   | Purpose                                                                    |
| ------ | ----------------------- | -------------------------------------------------------------------------- |
| POST   | `/threads`              | Create a thread with `title` and `body`                                    |
| GET    | `/threads`              | List all threads                                                           |
| GET    | `/threads/:id`          | Get one thread including its comments                                      |
| POST   | `/threads/:id/comments` | Add a comment to a thread                                                  |
| DELETE | `/threads/:id/`         | Deletes the thread and all of its comments (comments are actually deleted) |

| GET | `/comments/:id/` | Get one comment |
| DELETE | `/comments/:id/` | Special: Does not delete the comment, but sets its body to "deleted" |

### Bonus Task

Throw a proper `NotFoundException` when a thread doesn't exist.
