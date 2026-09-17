import { cookies } from "next/headers";
import { cache } from "react";

export interface SessionUser {
  id: string;
  username: string;
  roles: ("user" | "admin")[];
}

export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get("darkbay_token")?.value;
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.DARKBAY_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as SessionUser;
  } catch {
    return null;
  }
});

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}
