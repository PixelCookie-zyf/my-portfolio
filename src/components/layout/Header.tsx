"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  const isDark = resolvedTheme === "dark";
  const isActive = (href: string) =>
    !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

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

  const themeToggle = (
    <span className="inline-flex h-9 w-9 items-center justify-center">
      {canShowThemeToggle && (
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-9 w-9 items-center justify-center rounded-full text-soft transition-colors hover:bg-inset hover:text-ink"
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            </svg>
          )}
        </button>
      )}
    </span>
  );

  return (
    <header className="wrap relative z-20 pb-6 pt-6 md:pt-8">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav className="flex items-center justify-between gap-6" aria-label="Main navigation">
        <Link href="/" onClick={() => setMobileOpen(false)} className="group flex items-center gap-3">
          <Image
            src={personalInfo.avatar}
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-full object-cover ring-1 ring-line transition-transform group-hover:-rotate-6"
          />
          <span className="font-display text-xl font-semibold tracking-[-0.01em]">{personalInfo.name}</span>
        </Link>

        <div className="hidden items-center gap-7 text-[15px] sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`scribble-hover transition-colors hover:text-ink ${
                isActive(link.href) ? "text-ink" : "text-soft"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {themeToggle}
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          {themeToggle}
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="h-9 rounded-full px-3 text-sm text-soft hover:bg-inset"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="paper-shadow absolute inset-x-0 top-full mt-1 flex flex-col rounded-2xl border border-line bg-card p-3 sm:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-display rounded-xl px-3 py-3 text-xl hover:bg-inset"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
