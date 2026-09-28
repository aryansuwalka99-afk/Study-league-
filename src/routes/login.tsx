import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background text-muted-foreground">
        Loading…
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (!authEnabled) throw new Error("Sign-in is disabled");
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
        });
        if (err) throw new Error(err.message || "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || "Could not sign in");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto grid min-h-dvh max-w-5xl md:grid-cols-2">
        <section className="flex flex-col justify-between border-b border-border px-6 py-10 md:border-r md:border-b-0 md:px-10 md:py-14">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Study league</p>
          <div className="mt-16 md:mt-0">
            <h1 className="font-display text-5xl leading-[0.95] font-medium tracking-tight md:text-6xl">
              Desk League
            </h1>
            <p className="mt-5 max-w-sm text-pretty text-muted-foreground">
              Log daily study, cam time, and scores. Everyone sees the board. Teams rank together.
              The first person to join is admin.
            </p>
          </div>
          <p className="mt-16 hidden text-xs text-muted-foreground md:block">
            Personal accounts. No demo logins.
          </p>
        </section>

        <section className="flex items-center px-6 py-10 md:px-10">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium">
                {mode === "in" ? "Sign in" : "Create account"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Join as a participant. Admins manage names and groups.
              </p>
            </div>

            {authEnabled ? (
              <>
                <form className="grid gap-3" onSubmit={onEmail}>
                  {mode === "up" ? (
                    <div className="grid gap-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name on the board"
                      />
                    </div>
                  ) : null}
                  <div className="grid gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete={mode === "up" ? "new-password" : "current-password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" disabled={busy}>
                    {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  {mode === "in" ? "New here?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    className="text-foreground underline-offset-4 hover:underline"
                    onClick={() => {
                      setMode(mode === "in" ? "up" : "in");
                      setError(null);
                    }}
                  >
                    {mode === "in" ? "Create an account" : "Sign in"}
                  </button>
                </p>

                <div className="flex items-center gap-3 text-xs tracking-wide text-muted-foreground uppercase">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-2">
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="secondary"
                      onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                    >
                      Continue with {p.label}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
