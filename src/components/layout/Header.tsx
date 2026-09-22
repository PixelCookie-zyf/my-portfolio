"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FaBars, FaXmark, FaSun, FaMoon } from "react-icons/fa6";
import { useTheme } from "next-themes";
import { personalInfo, navLinks } from "@/data/personal";
import {
  canRenderThemeToggle,
  emptySubscribe,
  getClientHydratedSnapshot,
  getServerHydratedSnapshot,
} from "@/lib/hydration";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const canShowThemeToggle = canRenderThemeToggle(hydrated, resolvedTheme);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav
        className="site-container flex h-20 items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="font-editorial text-[24px] tracking-[-0.06em]"
        >
          {personalInfo.name}
          <span className="text-accent">.</span>
        </Link>
        <div className="ml-auto hidden items-center gap-7 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`nav-link ${
                pathname === link.href ||
                (link.href === "/blog" && pathname.startsWith("/blog/"))
                  ? "text-foreground"
                  : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:ml-2">
          <div className="h-10 w-10">
            {canShowThemeToggle && (
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-bg hover:text-foreground"
                aria-label={
                  resolvedTheme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                {resolvedTheme === "dark" ? <FaSun size={15} /> : <FaMoon size={15} />}
              </button>
            )}
          </div>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center sm:hidden"
          >
            {mobileOpen ? <FaXmark size={19} /> : <FaBars size={17} />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="site-container flex flex-col border-t border-border pb-5 pt-2 sm:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm text-muted hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
