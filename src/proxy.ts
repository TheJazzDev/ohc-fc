import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
