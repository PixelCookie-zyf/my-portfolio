"use client";

import { useSyncExternalStore } from "react";
import { FaSun, FaMoon } from "react-icons/fa6";
import { useTheme } from "next-themes";
import {
  canRenderThemeToggle,
  emptySubscribe,
  getClientHydratedSnapshot,
  getServerHydratedSnapshot,
} from "@/lib/hydration";

export default function BlogThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot
  );
  const canShow = canRenderThemeToggle(hydrated, resolvedTheme);

  if (!canShow) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card-bg/80 text-muted shadow-lg backdrop-blur-md transition-all hover:border-accent/40 hover:text-foreground hover:shadow-accent/10"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <FaSun className="text-lg" />
      ) : (
        <FaMoon className="text-lg" />
      )}
    </button>
  );
}
