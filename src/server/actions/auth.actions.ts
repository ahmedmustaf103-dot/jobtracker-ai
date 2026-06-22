"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { headers } from "next/headers";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { loginSchema, registerSchema } from "@/validations/auth";

export type AuthActionState = {
  error?: string;
};

const AUTH_GENERIC_ERROR = "Invalid email or password";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = await clientIp();
  const limited = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return { error: rateLimitMessage(limited.retryAfterSec) };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error:
        "Unable to create account. If you already have one, try signing in.",
    };
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please log in." };
    }
    throw error;
  }

  return {};
}

export async function credentialsSignInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = await clientIp();
  const limited = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return { error: rateLimitMessage(limited.retryAfterSec) };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: AUTH_GENERIC_ERROR };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: AUTH_GENERIC_ERROR };
      }
      return { error: "Something went wrong. Please try again." };
    }
    throw error;
  }

  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
