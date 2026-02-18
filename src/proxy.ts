import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  const authRoutes = ["/sign-in", "/sign-up"];
  const alwaysPublicRoutes = ["/call"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAlwaysPublic = alwaysPublicRoutes.some((route) => pathname.startsWith(route));

  if (!sessionCookie && !isAuthRoute && !isAlwaysPublic) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.webp).*)",
  ],
};
