/**
 * What a service hands back for a list endpoint.
 *
 * Deliberately plain: the rows themselves plus the total the database counted.
 * Turning that into the client-facing envelope (page numbers, total pages) is
 * the controller's job — the service never thinks in HTTP.
 */
export type Page<T> = {
  data: T[];
  totalItems: number;
};

/**
 * What a service needs to know about pagination.
 *
 * `offset` / `limit` map straight onto `skip` / `take` in a repository call.
 * A service never sees `page=2`; the controller has already done that sum.
 */
export type PageRequest = {
  offset: number;
  limit: number;
};
