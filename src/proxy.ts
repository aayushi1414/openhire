import { headers } from "next/dist/server/request/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;
  const authRoutes = ["/sign-in", "/sign-up"];
  const alwaysPublicRoutes = ["/call"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAlwaysPublic = alwaysPublicRoutes.some((route) => pathname.startsWith(route));

  if (!session && !isAuthRoute && !isAlwaysPublic) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/interviews", "/interviews/:path*", "/call", "/call/:path*"],
};
