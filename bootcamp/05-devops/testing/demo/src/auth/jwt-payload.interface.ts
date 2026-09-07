/**
 * What gets signed into the token.
 *
 * `sub` (subject) is the registered JWT claim for "who this token is about".
 * Keep the payload small and non-secret: anyone holding the token can read it,
 * the signature only proves it has not been tampered with.
 */
export interface JwtPayload {
  sub: string;
  email: string;
}
