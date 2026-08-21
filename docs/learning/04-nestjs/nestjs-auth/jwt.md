# NestJS Auth - JSON Web Tokens

Traditional session-based authentication stores state on the server. When a user logs in, the server creates a session record, stores it in a database or in memory, and sends the client a session ID. On each subsequent request, the server looks up that session ID to identify the user.

JSON Web Tokens move the state into the token itself. A JWT is a compact string that encodes claims about the user (their ID, roles, and when the token expires) and signs them cryptographically. The server that issued the token can verify it on any subsequent request without consulting a database. Any other server that shares the same secret can also verify it, which makes JWTs well-suited to distributed systems and microservices.

## JWT structure

A JWT consists of three parts, each base64url-encoded and joined by dots: `header.payload.signature`.

The header is a JSON object that describes the token type and the signing algorithm. Most JWTs use HMAC SHA256, identified in the header as `HS256`.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

The payload carries the claims. A claim is a statement about an entity, usually the user. There are registered claim names with well-defined meanings: `sub` for the subject (typically the user's ID), `exp` for expiration time as a Unix timestamp, `iss` for the issuer, and `aud` for the audience. Alongside these, you can include your own properties, such as the user's username or roles.

```json
{
  "sub": "1234567890",
  "username": "alice",
  "roles": ["viewer"],
  "exp": 1753760000
}
```

The expiration time above is a Unix timestamp in seconds from the Unix epoch (January 1, 1970). When the server verifies the token, it checks whether `exp` is in the past, and rejects the token if it has expired.

The signature is created by encoding the header and payload, concatenating them with a dot, and running that string through the signing algorithm with a secret key that only the server knows:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

The complete token looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMzM3NDIiLCJuYW1lIjoiVG9tbXkgV2lzZWF1Iiwicm9sZXMiOlsicHJvZHVjZXIiLCJkaXJlY3RvciIsIndyaXRlciIsIm1haW4gYWN0b3IiXX0.GsFW-7-0AqYjrJSyiH6XtsR7sB4YENmGhg5VEYNIgAA
```

## Authentication flow

When a user sends valid credentials to the login endpoint, the server generates a JWT containing the user's ID, roles, and an expiration time, then signs it with the secret key. The token is returned to the client in the response body.

The client stores the token and includes it in the `Authorization` header of every subsequent request using the `Bearer` scheme:

```
Authorization: Bearer <token>
```

When the server receives a protected request, it extracts the token from the header, decodes the header and payload, and recomputes the signature using the same secret. If the recomputed signature matches the one in the token, the payload has not been tampered with. The server then checks whether the token has expired.

## Signing vs encryption

JWTs are signed, not encrypted. This distinction is important. Signing guarantees that the token has not been modified since it was issued. If anyone changes even one character of the payload, the signature will no longer match and verification will fail. However, signing does not hide the contents. The header and payload are base64url-encoded, not encrypted, and anyone who has the token can decode and read the claims. You can try it yourself by decoding the token payload in a JWT debugger like [jwt.io](https://jwt.io/).

This means sensitive data like passwords, private keys, or full personal records should never appear in a JWT payload unless you encrypt them yourself first. Put in only what the server needs to identify the user and check their permissions: an ID, a role, and an expiration time.

If you need the payload to be unreadable, you need JSON Web Encryption (JWE), which is a separate standard. Most applications do not require it because the payload contains no sensitive data.

The storage location on the client side is also crucial. Storing it in `localStorage` means any JavaScript running on the page can read it, creating an XSS vulnerability. HTTP-only cookies are a safer option because they are not accessible to JavaScript; the browser sends them automatically with each request, but scripts cannot read them.

## Resources

[JWT Debugger](https://jwt.io/)
