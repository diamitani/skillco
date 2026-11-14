import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** OAuth (Google / GitHub) PKCE callback from Supabase Auth. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const nextParam = req.nextUrl.searchParams.get("next") || "/dashboard";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";
  const supabase = await createClient();
  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, req.nextUrl.origin));
  }
  return NextResponse.redirect(new URL("/sign-in?error=oauth", req.nextUrl.origin));
}
