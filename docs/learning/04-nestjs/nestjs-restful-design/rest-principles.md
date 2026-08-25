# NestJS RESTful Design - REST Principles

REST gives you a handful of rules that look arbitrary at first glance. Use plural nouns in URLs. Keep verbs out of paths. Prefer PUT over POST when replacing a resource. Return 204 instead of 200 when there is nothing to send back. The rules become obvious once you see what they protect. They make endpoints predictable, so two developers on different teams can guess what a URL does without reading the docs. They give caching proxies a clear signal about which responses are safe to remember. And they let a client retry a failed network call without wondering whether the second attempt will charge the credit card twice.

Four ground rules sit underneath every REST API. Resources are the nouns the API exposes. URIs are the addresses where those nouns live. HTTP methods are the verbs that act on them, each carrying its own promise about side effects and retries. Representations are the format the data takes when shipped over the wire, almost always JSON. And statelessness is the constraint that keeps the whole system scalable: every request is self-contained, and the server forgets the client between calls.

## Resources and URIs

A resource is whatever the API exposes as a thing the client can read or change. A concert, a user, a refund, a search result, a shopping cart. Most resources map to a row in a database, but they do not have to. A resource is whatever the API decides to make addressable.

Each resource gets an address: a URI. REST favors a small number of conventions for what those addresses look like:

- Use plural nouns for collections. `/concerts`, not `/concert` or `/getConcerts`.
- Append the identifier for a single item. `/concerts/9a4f...` for a UUID, `/concerts/42` for an integer ID.
- Nest sub-resources when they only make sense in the context of a parent. `/concerts/42/tickets` lists tickets for one specific concert. A top-level `/tickets` route only earns its place if tickets are meaningful on their own.
- Avoid verbs in paths. `/concerts/42/cancel` is a smell. Model the cancellation as a state change (`PATCH /concerts/42` with `{ status: "cancelled" }`) or as its own resource (`POST /concerts/42/cancellations`) instead.

The payoff is guessability. A client that knows the `/concerts` endpoint can derive the URL for one concert, for that concert's tickets, and for the tickets of a different concert without opening the documentation again.

## HTTP methods, safe and idempotent

The methods are not interchangeable. Each carries a promise to the client about what calling it will do.

- **GET** reads. It does not change server state. A GET can be repeated, cached, prefetched, or pulled by a search engine crawler without consequence. GET is _safe_.
- **POST** creates or starts something. It is neither safe nor idempotent. Posting the same payload twice typically creates two resources or charges a card twice. Clients should not automatically retry a POST.
- **PUT** replaces a resource at a known URL. The client sends the full new representation and the server stores it. PUT is _idempotent_: sending the same PUT twice leaves the server in the same state as sending it once. That property is what makes PUT safe to retry after a network blip.
- **PATCH** updates part of a resource. The client sends only the fields that should change. PATCH is not guaranteed idempotent by the spec, although most implementations treat it that way.
- **DELETE** removes a resource. DELETE is idempotent. Deleting a resource that is already gone returns 404, but the server state is identical to a successful first call.

One useful gut check: imagine a retry job that resends every failed request three times. Which methods would survive that without damage? GET, PUT, and DELETE would. POST and PATCH would risk duplicates.

> **:exclamation: Watch out:** Idempotent does not mean "returns the same response." Two DELETE calls return 204 the first time and 404 the second. They are still idempotent because the _server state_ is the same after either call.

## JSON as the representation

A resource and its representation are not the same thing. The resource is the abstract concept (the concert in the system). The representation is the concrete bytes shipped over the wire: a JSON document, an XML blob, a binary protobuf message, sometimes even an HTML page. REST itself does not pick a format. Client and server negotiate one via the `Content-Type` and `Accept` headers.

JSON has won in practice. It reads well enough for `curl` debugging, parses without ceremony in every language a backend cares about, and stays small enough that gzip compression makes the curly-brace overhead invisible.

Two representations of the same resource can coexist. `/concerts/42` might return a full object for a detail page, while `/concerts` returns a slimmer summary for a list view. Same underlying resource, two representations, both valid.

## Statelessness

Every request must carry everything the server needs to handle it. The server holds no memory of the client between calls. If a request needs the user's identity, the request includes it, typically as a token in an `Authorization` header. If a request needs filter criteria, the request includes them as query parameters. The server does not remember "the filter you set on the previous page."

The reward is horizontal scalability. A hundred identical server instances can sit behind a load balancer, and any of them can answer any request. No sticky sessions, no in-memory client state to migrate between hosts. Scaling out becomes a configuration change rather than a re-architecture.

The cost is verbosity. A logged-in browser sends its token on every call, and a paginated list endpoint receives the page number on every page turn. The trade is almost always worth it. Stateful protocols that tried the opposite (FTP, RPC frameworks built on long-lived connections) routinely hit a wall the moment they need to scale beyond a single server.

> **_:bulb: Good to know:_** Statelessness is about the server forgetting the client, not about the API forgetting your data. The database still stores the concert. The server just does not remember which client asked about it last.

## Resources

[MDN, HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

[Mastering RESTful API Design: A Practical Guide](https://dev.to/leapcell/mastering-restful-api-design-a-practical-guide-408)
