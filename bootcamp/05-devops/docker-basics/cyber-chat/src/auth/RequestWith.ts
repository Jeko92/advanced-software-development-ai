export type RequestWith<T> = Request & {
  user: T;
};
