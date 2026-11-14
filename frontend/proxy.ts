import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session cookie and guards /dashboard.
 * Marketing pages and /marketplace are not matched, so they stay static.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (!url || !key) {
    // Auth not configured yet: send dashboard visitors to sign-in, which explains setup.
    if (isDashboard) {
      const to = request.nextUrl.clone();
      to.pathname = "/sign-in";
      to.searchParams.set("error", "auth_not_configured");
      return NextResponse.redirect(to);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isDashboard && !user) {
    const to = request.nextUrl.clone();
    to.pathname = "/sign-in";
    to.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(to);
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/auth/:path*", "/api/builder/:path*", "/api/skills/:path*"],
};
