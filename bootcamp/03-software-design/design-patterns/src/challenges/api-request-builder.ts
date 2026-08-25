/**
 * The API Request Builder — Builder pattern
 *
 * Source: docs/learning/03-software-design/software-design-patterns/challenges.md
 *         ("The API request builder")
 *
 * A flexible way to construct HTTP requests without one optional-heavy
 * configuration object.
 *
 * TODO:
 * - `RequestBuilder` class with chained setters for HTTP method, URL,
 *   headers, query parameters, and a JSON body
 * - `build()` returns an immutable `Request` object; it must validate the
 *   configuration first and throw if the method is `POST` with no body, or
 *   if the URL was never set
 * - demonstrate a couple of chained builds, including one that triggers
 *   each validation error
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Request {
  method: HttpMethod;
  url: string;
  headers: Readonly<Record<string, string>>;
  params: Readonly<Record<string, string>>;
  body?: unknown;
}

class RequestBuilder {
  private httpMethod: HttpMethod = 'GET';
  private requestUrl?: string;
  private readonly headers: Record<string, string> = {};
  private readonly params: Record<string, string> = {};
  private requestBody?: unknown;

  method(method: HttpMethod): this {
    this.httpMethod = method;
    return this;
  }

  url(url: string): this {
    this.requestUrl = url;
    return this;
  }

  header(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  param(key: string, value: string): this {
    this.params[key] = value;
    return this;
  }

  body(data: unknown): this {
    this.requestBody = data;
    return this;
  }

  build(): Request {
    if (!this.requestUrl) {
      throw new Error('RequestBuilder requires a URL.');
    }

    if (this.httpMethod === 'POST' && this.requestBody === undefined) {
      throw new Error('POST requests require a body.');
    }

    return Object.freeze({
      method: this.httpMethod,
      url: this.requestUrl,
      headers: Object.freeze({ ...this.headers }),
      params: Object.freeze({ ...this.params }),
      ...(this.requestBody !== undefined && { body: this.requestBody }),
    });
  }
}

const getRequest = new RequestBuilder()
  .method('GET')
  .url('https://api.example.com/users')
  .header('Accept', 'application/json')
  .param('page', '1')
  .build();

console.log('GET request:', getRequest);

const postRequest = new RequestBuilder()
  .method('POST')
  .url('https://api.example.com/users')
  .header('Content-Type', 'application/json')
  .body({ name: 'Ada Lovelace' })
  .build();

console.log('POST request:', postRequest);

try {
  new RequestBuilder()
    .method('POST')
    .url('https://api.example.com/users')
    .build();

  console.error('❌ Test 1 failed: expected an error');
} catch (error) {
  console.log('Test 1 — expected error (POST without body):');
  console.error(error);
}

try {
  new RequestBuilder().method('GET').build();

  console.error('❌ Test 2 failed: expected an error');
} catch (error) {
  console.log('Test 2 — expected error (missing URL):');
  console.error(error);
}
