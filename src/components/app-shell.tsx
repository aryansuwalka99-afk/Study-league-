import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, LayoutGrid, Shield, Users } from "lucide-react";
import type { ReactNode } from "react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const nav = [
  { to: "/", label: "Today", icon: ClipboardList },
  { to: "/board", label: "Board", icon: LayoutGrid },
  { to: "/teams", label: "Teams", icon: Users },
] as const;

export function AppShell({
  children,
  isAdmin,
}: {
  children: ReactNode;
  isAdmin?: boolean;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <div className="min-h-dvh bg-background">
        <header className="border-b border-border px-4 py-4">
          <p className="font-display text-lg tracking-tight">Desk League</p>
        </header>
        <div className="mx-auto max-w-5xl space-y-4 p-4">
          <p className="text-sm text-muted-foreground">Loading your board…</p>
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-dvh bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" className="font-display text-lg tracking-tight">
            Desk League
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.to
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                to="/admin"
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === "/admin"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Admin
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-3 [&_img]:size-8 [&_span]:text-sm">
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className={cn("grid", isAdmin ? "grid-cols-4" : "grid-cols-3")}>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              to="/admin"
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
                pathname === "/admin" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Shield className="size-4" />
              Admin
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
