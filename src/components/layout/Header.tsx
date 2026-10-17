"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Row from "@/components/layout/Row";
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
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
          </svg>
        </button>
      )}
    </span>
  );

  return (
    <header className="pb-16 pt-7 md:pb-24">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Row>
        <nav className="flex items-center justify-between gap-6" aria-label="Main navigation">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <Image
              src={personalInfo.avatar}
              alt=""
              width={28}
              height={28}
              priority
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="serif text-lg font-medium">{personalInfo.name}</span>
          </Link>

          <div className="hidden items-center gap-6 text-sm sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`transition-colors hover:text-foreground ${
                  isActive(link.href) ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {themeToggle}
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            {themeToggle}
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="h-9 text-sm text-muted"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="mt-4 flex flex-col sm:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="serif border-b border-border py-3 text-xl last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Row>
    </header>
  );
}
