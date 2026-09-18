export type UserRole = "user" | "admin";

export interface UserSummary {
  id: string;
  username: string;
}

export interface User extends UserSummary {
  roles: UserRole[];
}
