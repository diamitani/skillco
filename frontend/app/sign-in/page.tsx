import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  oauth: "Sign-in didn't complete. Try again.",
  auth_not_configured: "Accounts are coming online soon. Sign-in isn't configured on this deployment yet.",
};

export default async function SignIn({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const { user } = await getUser();
  if (user) redirect(safeNext);

  return (
    <>
      <Nav theme="light" />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8">
          <p className="t-mono mb-3 text-xs text-link">skillco.work/sign-in</p>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to SkillCo</h1>
          <p className="mt-2 text-sm text-fg-2">
            Build skills, keep every version, and export to Claude Code, Cursor, Codex and more.
          </p>
          {error && ERRORS[error] && (
            <p className="mt-4 rounded-md border border-line bg-surface-2 p-3 text-sm text-fg-2">{ERRORS[error]}</p>
          )}
          <div className="mt-6">
            {isSupabaseConfigured() ? (
              <OAuthButtons next={safeNext} />
            ) : (
              <p className="text-sm text-fg-3">Google and GitHub sign-in will appear here once Supabase is connected.</p>
            )}
          </div>
          <p className="mt-6 text-xs text-fg-3">
            Free plan includes 3 generations a month. <Link href="/pricing" className="text-link underline-offset-4 hover:underline">See pricing</Link>.
          </p>
        </div>
      </main>
    </>
  );
}
