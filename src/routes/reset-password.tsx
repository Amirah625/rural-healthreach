import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | RuralReach Health" },
      { name: "description", content: "Set a new password for your RuralReach Health account." },
      { property: "og:title", content: "Set a new password | RuralReach Health" },
      { property: "og:description", content: "Securely update your RuralReach Health account password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password needs at least one uppercase letter.")
  .regex(/[a-z]/, "Password needs at least one lowercase letter.")
  .regex(/[0-9]/, "Password needs at least one number.");

function ResetPassword() {
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    setRecovery(hash.get("type") === "recovery");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Choose a stronger password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: parsed.data });
    setBusy(false);
    if (updateError) setError("We couldn't complete your request. Please try again.");
    else setSuccess(true);
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:grid lg:place-items-center">
      <section className="mx-auto w-full max-w-lg">
        <Logo className="justify-center" size={52} />
        <section className="card-surface rise mt-8 p-5 sm:p-8">
          {success ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-leaf" aria-hidden="true" />
              <h1 className="mt-3 text-2xl font-extrabold">Password updated</h1>
              <p className="mt-2 text-sm text-muted-foreground">Your password has been changed securely.</p>
              <Link to="/profile" className="tap mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground">Continue to profile</Link>
            </div>
          ) : !recovery ? (
            <div className="text-center">
              <KeyRound className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h1 className="mt-3 text-2xl font-extrabold">Reset link unavailable</h1>
              <p className="mt-2 text-sm text-muted-foreground">Open the password reset link from your email to choose a new password.</p>
              <Link to="/auth" className="tap mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground">Back to sign in</Link>
            </div>
          ) : (
            <>
              <KeyRound className="h-8 w-8 text-primary" aria-hidden="true" />
              <h1 className="mt-3 text-2xl font-extrabold">Set a new password</h1>
              <p className="mt-2 text-sm text-muted-foreground">Use at least 8 characters, including uppercase, lowercase and a number.</p>
              {error && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">{error}</p>}
              <form onSubmit={submit} className="mt-6 space-y-4">
                <label className="block text-sm font-bold" htmlFor="new-password">New password</label>
                <div className="relative">
                  <input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="min-h-12 w-full rounded-xl border border-input bg-background px-3.5 py-3 pr-11 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  <button type="button" aria-label={showPassword ? "Hide new password" : "Show new password"} onClick={() => setShowPassword((value) => !value)} className="tap absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-secondary">{showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}</button>
                </div>
                <label className="block text-sm font-bold" htmlFor="confirm-new-password">Confirm new password</label>
                <div className="relative">
                  <input id="confirm-new-password" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="min-h-12 w-full rounded-xl border border-input bg-background px-3.5 py-3 pr-11 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  <button type="button" aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"} onClick={() => setShowConfirm((value) => !value)} className="tap absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-secondary">{showConfirm ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}</button>
                </div>
                <button type="submit" disabled={busy} className="tap flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground disabled:opacity-70">{busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}Update password</button>
              </form>
            </>
          )}
        </section>
      </section>
    </main>
  );
}