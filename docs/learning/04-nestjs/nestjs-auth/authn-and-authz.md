# NestJS Auth - Authentication and Authorization

Authentication and authorization are two distinct concepts that often get used as if they were interchangeable. Understanding the difference is important because they solve different problems and happen in a specific order. Getting this wrong leads to either broken access control or unnecessary complexity in your code.

The clearest way to separate them is through an analogy. At an airport, you first show your passport at security. The officer checks whether you are who you claim to be. That is authentication: confirming your identity. Later, at the gate, you hand over your boarding pass. The boarding pass does not prove who you are - that was already established. It tells the gate agent which flight you are allowed to board and which seat you can take. That is authorization: determining what you are permitted to do.

## Authentication

Authentication is the process of verifying an identity. When a user submits a username and password to a login endpoint, the server checks whether those credentials match what is stored. If they do, identity is confirmed. The server responds by issuing a token (for example, a JWT) that represents the verified identity for the duration of the session.

Authentication can rely on different kinds of evidence: something you know (a password or PIN), something you have (a hardware token or an OTP sent to a phone), or something you are (a fingerprint or face scan). Multi-factor authentication combines two or more of these categories to raise the bar for impersonation.

When authentication fails, the server returns a `401 Unauthorized` response. This status signals that the request lacked valid credentials, which makes the status name (Unauthorized) a bit inaccurate since it actually refers to a failure in authentication.

## Authorization

Authorization determines what an authenticated identity is allowed to do. It happens after authentication and relies on the identity information established in that step. The system checks the authenticated user's roles or permissions against the action they are trying to perform.

If the check passes, the request proceeds. If not, the server returns a `403 Forbidden` response, which signals that the request's authentication was successful, but the user is not allowed to perform the requested action.

## Role-Based Access Control

Most applications manage permissions by grouping them into roles. A user is assigned one or more roles, and each role carries a set of allowed actions. This pattern is called role-based access control (RBAC).

In a quotes API, for example, you might have a `viewer` role that can only read quotes and an `admin` role that can create, update, and delete them. When a request arrives, the server checks whether the authenticated user's role includes the required permission for that operation.

This approach is simpler to manage than listing individual permissions per user. When you want to change what a group of users can do, you update the role definition rather than updating every user account. The challenge in this session asks you to implement exactly this: an authorization layer that uses roles to decide who can manage quotes.

A related pattern is attribute-based access control (ABAC), which makes decisions based on combinations of user attributes, resource attributes, and context. ABAC is more expressive but also more complex. For most applications, RBAC is the right starting point.
