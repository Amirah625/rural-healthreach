import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Logo } from "@/components/brand/Logo";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { saveProfile } from "@/lib/auth";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account | RuralReach Health" },
      {
        name: "description",
        content: "Sign in to personalize RuralReach Health, or continue as a guest to find care.",
      },
      { property: "og:title", content: "Sign in or create an account | RuralReach Health" },
      {
        property: "og:description",
        content: "Personalize your RuralReach Health experience while keeping healthcare discovery open to everyone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthScreen,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(100, "Name is too long."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password needs at least one uppercase letter.")
      .regex(/[a-z]/, "Password needs at least one lowercase letter.")
      .regex(/[0-9]/, "Password needs at least one number."),
    confirmPassword: z.string(),
    phone: z.string().trim().max(30, "Phone number is too long."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "An account with this email already exists.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  if (lower.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return "We couldn't complete your request. Please try again.";
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  const inputType = password && visible ? "text" : type;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-h-12 w-full rounded-xl border border-input bg-background px-3.5 py-3 pr-11 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            className="tap absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-secondary"
          >
            {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

function AuthScreen() {
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (forgot) {
      const parsed = z.string().trim().email("Enter a valid email address.").safeParse(email);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
        return;
      }
      setBusy(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (resetError) {
        setError("We couldn't complete your request. Please try again.");
      } else {
        setMessage("Check your email for a secure password reset link.");
      }
      return;
    }

    const parsed = mode === "signin"
      ? signInSchema.safeParse({ email, password })
      : signUpSchema.safeParse({ fullName, email, password, confirmPassword, phone });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    setBusy(true);
    if (mode === "signin") {
      const result = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
      setBusy(false);
      if (result.error) setError(friendlyAuthError(result.error.message));
      else setMessage("You’re signed in. Welcome back to RuralReach.");
      return;
    }

    const values = parsed.data;
    const result = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: { full_name: values.fullName, phone: values.phone || null },
      },
    });
    if (result.data.user && result.data.session) {
      try {
        await saveProfile(result.data.user, values.fullName, values.phone);
      } catch {
        setBusy(false);
        setError("Your account was created, but we couldn't save your profile details. Please try again after signing in.");
        return;
      }
    }
    setBusy(false);
    if (result.error) {
      setError(friendlyAuthError(result.error.message));
    } else if (!result.data.session) {
      setMessage("Account created. Check your email to confirm your account, then sign in.");
    } else {
      setMessage("Your account is ready. Welcome to RuralReach.");
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setBusy(false);
    if (result.error) setError("We couldn't complete your request. Please try again.");
  }

  if (user && !authLoading) {
    return (
      <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:grid lg:place-items-center lg:py-12">
        <section className="mx-auto w-full max-w-lg text-center">
          <Logo className="justify-center" size={52} />
          <div className="card-surface rise mt-8 p-6 sm:p-8">
            <CheckCircle2 className="mx-auto h-10 w-10 text-leaf" aria-hidden="true" />
            <h1 className="mt-3 text-2xl font-extrabold">You’re already signed in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Continue to your personalized RuralReach experience.</p>
            <Link to="/profile" className="tap mt-6 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground">
              Open my profile <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const title = forgot ? "Reset your password" : mode === "signin" ? "Welcome back" : "Create your account";

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:grid lg:place-items-center lg:py-12">
      <section className="mx-auto w-full max-w-5xl lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
        <div className="hidden lg:block">
          <Logo size={58} />
          <p className="mt-8 text-sm font-bold text-primary">Healthcare that reaches you</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">Care discovery for every community.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">Create an account to keep your experience personal. You can always browse facilities and resources as a guest.</p>
        </div>
        <div>
          <div className="lg:hidden"><Logo className="justify-center" size={52} /></div>
          <section className="card-surface rise mt-8 p-5 sm:p-8 lg:mt-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary">RuralReach Health</p>
                <h1 className="mt-1 text-2xl font-extrabold">{title}</h1>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
                {mode === "signin" && !forgot ? <LogIn className="h-5 w-5" aria-hidden="true" /> : <UserPlus className="h-5 w-5" aria-hidden="true" />}
              </span>
            </div>

            {!forgot && (
              <div className="mt-6 grid grid-cols-2 rounded-xl bg-secondary p-1" role="tablist" aria-label="Account access">
                <button type="button" role="tab" aria-selected={mode === "signin"} onClick={() => { setMode("signin"); setError(""); setMessage(""); }} className={`tap rounded-lg px-3 py-2.5 text-sm font-extrabold ${mode === "signin" ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>Sign in</button>
                <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => { setMode("signup"); setError(""); setMessage(""); }} className={`tap rounded-lg px-3 py-2.5 text-sm font-extrabold ${mode === "signup" ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>Create account</button>
              </div>
            )}

            {message && <p className="mt-5 rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground" role="status">{message}</p>}
            {error && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">{error}</p>}

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "signup" && !forgot && <Field id="fullName" label="Full name" value={fullName} onChange={setFullName} placeholder="Your full name" autoComplete="name" />}
              <Field id="email" label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
              {!forgot && <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete={mode === "signin" ? "current-password" : "new-password"} />}
              {mode === "signup" && !forgot && <>
                <p className="-mt-1 text-xs text-muted-foreground">At least 8 characters, with uppercase, lowercase and a number.</p>
                <Field id="confirmPassword" label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                <Field id="phone" label="Phone number (optional)" type="tel" value={phone} onChange={setPhone} placeholder="+234…" autoComplete="tel" />
              </>}
              <button type="submit" disabled={busy} className="tap flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70">
                {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {forgot ? "Send reset link" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            {mode === "signin" && !forgot && <button type="button" onClick={() => { setForgot(true); setError(""); setMessage(""); }} className="tap mt-4 w-full rounded-xl px-3 py-2 text-sm font-bold text-primary hover:bg-accent">Forgot password?</button>}
            {forgot && <button type="button" onClick={() => { setForgot(false); setError(""); setMessage(""); }} className="tap mt-4 w-full rounded-xl px-3 py-2 text-sm font-bold text-primary hover:bg-accent">Back to sign in</button>}

            {!forgot && <>
              <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
              <button type="button" onClick={signInWithGoogle} disabled={busy} className="tap flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-base font-extrabold text-foreground disabled:opacity-70">Continue with Google</button>
            </>}
          </section>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
            <Link to="/" className="font-extrabold text-primary">Continue as guest</Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link to="/" className="font-semibold text-muted-foreground hover:text-foreground">Return to RuralReach</Link>
          </div>
        </div>
      </section>
    </main>
  );
}