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
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-accent"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <FaSun className="text-base" />
      ) : (
        <FaMoon className="text-base" />
      )}
    </button>
  );
}
