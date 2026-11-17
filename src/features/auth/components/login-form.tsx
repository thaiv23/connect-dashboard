"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const SESSION_EXPIRED = "Your session has expired. Please log in again.";

const fieldClass =
  "h-11 w-full rounded-lg border border-input bg-white px-3.5 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-brand-navy focus-visible:ring-3 focus-visible:ring-brand-navy/15 disabled:opacity-60 aria-invalid:border-red-400";

export function LoginForm({ sessionExpired = false }: { sessionExpired?: boolean }) {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(sessionExpired ? SESSION_EXPIRED : null);
  const submitting = React.useRef(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    submitting.current = true;
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as { redirectTo?: string; error?: string };

      if (res.ok && data.redirectTo) {
        router.replace(data.redirectTo);
        router.refresh();
        return;
      }
      setError(data.error ?? "Unable to log in. Please try again.");
    } catch {
      setError("Unable to reach the server. Check your connection and try again.");
    }

    submitting.current = false;
    setPending(false);
  }

  const invalid = Boolean(error) && error !== SESSION_EXPIRED;

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-slate-200/80 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-8px_rgba(15,23,42,0.10)] sm:px-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Log in</h1>

      <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5" aria-busy={pending}>
        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-sm font-medium text-foreground">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
            disabled={pending}
            aria-invalid={invalid || undefined}
            aria-describedby={error ? "login-error" : undefined}
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              disabled={pending}
              aria-invalid={invalid || undefined}
              aria-describedby={error ? "login-error" : undefined}
              className={cn(fieldClass, "pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="password"
              className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy/40"
            >
              {showPassword ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
            </button>
          </div>
        </div>

        {error && (
          <p
            id="login-error"
            role="alert"
            className={cn(
              "rounded-lg border px-3.5 py-2.5 text-[13px] leading-snug",
              invalid ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-800",
            )}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#095180] text-[15px] font-medium text-white outline-none transition-colors hover:bg-[#074468] focus-visible:ring-3 focus-visible:ring-[#095180]/30 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
