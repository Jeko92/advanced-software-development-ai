"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseErrorMessage } from "@/lib/api/fetch-api";

const TOKEN_COOKIE = "darkbay_token";

interface Credentials {
  username: string;
  password: string;
}

async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}

export async function loginAction(
  input: Credentials,
): Promise<{ error?: string }> {
  let token: string;
  try {
    const response = await fetch(`${process.env.DARKBAY_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return {
        error: parseErrorMessage(body) ?? "Invalid username or password",
      };
    }
    const data = await response.json();
    token = data.access_token;
  } catch {
    return { error: "Unable to reach DarkBay. Please try again." };
  }

  await setSessionCookie(token);
  redirect("/dashboard");
}

export async function registerAction(
  input: Credentials,
): Promise<{ error?: string }> {
  try {
    const response = await fetch(
      `${process.env.DARKBAY_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return { error: parseErrorMessage(body) ?? "Registration failed" };
    }
  } catch {
    return { error: "Unable to reach DarkBay. Please try again." };
  }

  return loginAction(input);
}

export async function logoutAction(): Promise<never> {
  (await cookies()).delete(TOKEN_COOKIE);
  redirect("/");
}
