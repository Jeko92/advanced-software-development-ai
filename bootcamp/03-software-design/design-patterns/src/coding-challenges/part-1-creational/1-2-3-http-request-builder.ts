/**
 * Challenge 1.2.3 — HTTP Request Builder
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.2.3)
 *
 * TODO:
 * - `HttpRequestBuilder` with fluent setters:
 *   - `url(url: string)`
 *   - `method(method: 'GET' | 'POST' | 'PUT' | 'DELETE')` (default to 'GET')
 *   - `header(key: string, value: string)` (key-value map, additive)
 *   - `param(key: string, value: string)` (URL query params, additive)
 *   - `body(data: unknown)`
 *   - `timeout(ms: number)`
 * - `build()` validates:
 *   - `url` must be non-empty
 *   - if `method` is 'GET' or 'DELETE', throwing an Error if a `body` was set
 *   - `timeout` (if set) must be > 0
 * - returns an immutable `HttpRequest` object
 *
 * Focus: Key-value map aggregation and method-dependent validation rules.
 */
interface HttpRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  params: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class HttpRequestBuilder {
  private readonly request: Partial<HttpRequest> = {
    method: 'GET',
    headers: {},
    params: {},
  };

  url(url: string): this {
    this.request.url = url;
    return this;
  }

  method(method: HttpMethod): this {
    this.request.method = method;
    return this;
  }

  header(key: string, value: string): this {
    this.request.headers![key] = value;
    return this;
  }

  param(key: string, value: string): this {
    this.request.params![key] = value;
    return this;
  }

  body(data: unknown): this {
    this.request.body = data;
    return this;
  }

  timeout(ms: number): this {
    this.request.timeout = ms;
    return this;
  }

  build(): HttpRequest {
    const {
      url,
      method = 'GET',
      headers = {},
      params = {},
      body,
      timeout,
    } = this.request;

    if (!url || url.trim() === '') {
      throw new Error('URL must be non-empty.');
    }

    if ((method === 'GET' || method === 'DELETE') && body !== undefined) {
      throw new Error(`${method} requests cannot have a body.`);
    }

    if (timeout !== undefined && timeout <= 0) {
      throw new Error('Timeout must be greater than 0.');
    }

    return Object.freeze({
      url,
      method,
      headers: Object.freeze({ ...headers }),
      params: Object.freeze({ ...params }),
      ...(body !== undefined && { body }),
      ...(timeout !== undefined && { timeout }),
    });
  }
}

const request = new HttpRequestBuilder()
  .url('https://google.com')
  .method('GET')
  .header('Content-Type', 'application/json')
  .param('page', '1')
  .timeout(200)
  .build();

console.log(request);
