"use client";

import { useState } from "react";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function OAuthButtons({ next = "/dashboard" }: { next?: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: "google" | "github") {
    const supabase = createClient();
    if (!supabase) {
      setError("Sign-in isn't configured yet (Supabase keys missing).");
      return;
    }
    setBusy(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setError(error.message);
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" onClick={() => signIn("google")} disabled={!!busy}>
        <GoogleLogo weight="bold" className="h-5 w-5" />
        {busy === "google" ? "Redirecting…" : "Continue with Google"}
      </Button>
      <Button size="lg" variant="secondary" className="w-full" onClick={() => signIn("github")} disabled={!!busy}>
        <GithubLogo weight="bold" className="h-5 w-5" />
        {busy === "github" ? "Redirecting…" : "Continue with GitHub"}
      </Button>
      {error && <p className="text-sm text-bad" role="alert">{error}</p>}
    </div>
  );
}
