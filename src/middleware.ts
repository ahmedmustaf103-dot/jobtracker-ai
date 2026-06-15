import NextAuth from "next-auth";

import { authConfig } from "@/config/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/cover-letters/:path*",
    "/login",
    "/register",
  ],
};
