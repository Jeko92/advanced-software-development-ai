# NestJS Auth - Types of Authentication

Before building authentication into an API, it helps to know what options exist. Different applications have different security requirements, different client types, and different tolerances for complexity. The method that works well for a simple internal tool is not necessarily right for a mobile app or a third-party integration. This file is an overview of the most common approaches, ending with the token-based authentication that this session implements.

## Basic authentication

The client sends a username and password with every request. The credentials are combined into the string `username:password`, base64-encoded, and placed in the `Authorization` header with the prefix `Basic`.

Base64 encoding is not encryption, though tt is easily reversible. Any party who intercepts the request can decode it and read the credentials. Because of this, basic authentication must always run over HTTPS, and even then, sending credentials on every request increases exposure compared to methods that exchange credentials for a token once and use the token thereafter. It is appropriate for simple internal APIs or scripts where the environment is tightly controlled.

## API key authentication

The API provider generates a unique key for each client application. The client includes this key in every request, usually in a custom header such as `X-API-Key`. The server validates the key against a stored list.

API keys authenticate an application rather than a specific user, which makes them a good fit for machine-to-machine communication and tracking API usage or billing. They are less suited to scenarios requiring per-user access control. A compromised key is valid until it is explicitly revoked, which is why regular key rotation and request monitoring are central to a secure API key authentication setup.

## Session-based authentication

The client submits credentials once, typically through a login form. On successful verification, the server creates a session record in a database or session store and returns a session identifier to the client, usually as an HTTP-only cookie. The browser automatically includes this cookie on subsequent requests, and the server looks up the session on each request to identify the user.

Since the server keeps track of the currently active sessions, session-based authentication is stateful. This makes revocation straightforward, since deleting the session record immediately invalidates the client's access. It also keeps sensitive data off the client, as the cookie contains only an opaque identifier rather than user claims.

The trade-off is the infrastructure required to maintain session state. In a distributed system, every instance of the application must be able to read the same session store, which means either a centralized store or sticky sessions at the load balancer. For applications served from a single domain with a traditional server-rendered frontend, session-based authentication remains a solid, well-understood choice.

## Token-based authentication

The client exchanges credentials for a signed token once, then uses that token for all subsequent requests. The server verifies the token's signature on each request without consulting a session store. Compared to session-based authentication, this authentication scheme is stateless and does not require a centralized session store. User claims are embedded in the token itself, and the signature prevents malicious actors from tampering with the token. JSON Web Tokens (JWT) are the most widely used format for this.

This stateless design makes token-based authentication a natural fit for distributed systems and single-page applications. The server can scale horizontally without any additional infrastructure (i.e., without the need to synchronize session state across multiple instances of the same application). The trade-off is token revocation: because the token is self-contained, invalidating it before it expires requires additional infrastructure such as a blocklist.

## OAuth 2.0

OAuth 2.0 is an authorization framework, not an authentication protocol. It allows a user to grant a third-party application limited access to resources on another server without sharing their actual credentials. The flow most people encounter is "Login with Google" or "Login with GitHub": the user authenticates with the external provider, which then grants the client application a scoped access token.

OAuth 2.0 is the right choice when your application needs to act on behalf of a user across different services. It is more complex to implement than the other options here because it involves multiple parties, redirect flows, and several grant types suited to different client contexts.

## OpenID Connect

OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0. Where OAuth 2.0 addresses authorization, OIDC addresses authentication: it adds a standardized ID token (a JWT) to the OAuth 2.0 flow that contains verified claims about the user's identity. This makes it the standard choice for single sign-on (SSO) across multiple applications.

If you are building an application that delegates authentication to an external provider and needs reliable identity information in return, OIDC is the right tool.

## Important considerations

Regardless of the authentication method, all API traffic must run over HTTPS. Without transport encryption, tokens and credentials are exposed to interception. On the client side, tokens should be stored in HTTP-only cookies where possible; storing them in `localStorage` makes them accessible to JavaScript running on the page, which creates an XSS vulnerability.
