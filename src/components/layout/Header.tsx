"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot
  );
  const canShowThemeToggle = canRenderThemeToggle(hydrated, resolvedTheme);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6">
      <nav
        className={`mx-auto flex items-center justify-between px-5 transition-all duration-500 ease-out ${
          scrolled
            ? "mt-3 max-w-4xl rounded-2xl border border-border/80 bg-background/80 py-2.5 shadow-[0_12px_40px_-16px_rgba(16,15,15,0.25)] backdrop-blur-xl"
            : "mt-0 max-w-6xl border border-transparent bg-transparent py-4"
        }`}
      >
        <a
          href="#home"
          className="text-lg font-extrabold tracking-tight text-foreground"
        >
          {personalInfo.name}
          <span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover underline for non-active links */}
                {!isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full origin-left scale-x-0 transition-transform duration-200 hover:scale-x-100" />
                )}
              </a>
            );
          })}
        </div>

        {/* Social icons + theme toggle - desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {personalInfo.socials.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-muted hover:text-foreground transition-colors"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-lg" />
              </motion.a>
            );
          })}
          <motion.button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className="ml-1 hidden items-center gap-1 rounded-full border border-border px-2.5 py-1.5 font-mono text-[11px] text-muted transition-all hover:border-accent/40 hover:text-accent lg:flex"
            aria-label="Open command palette"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⌘K
          </motion.button>
          {canShowThemeToggle && (
            <motion.button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:bg-card-bg transition-all"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              {resolvedTheme === "dark" ? (
                <FaSun className="text-lg" />
              ) : (
                <FaMoon className="text-lg" />
              )}
            </motion.button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-2 max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-background/90 shadow-[0_12px_40px_-16px_rgba(16,15,15,0.25)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm transition-colors ${
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                {personalInfo.socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      <Icon className="text-lg" />
                    </a>
                  );
                })}
                {canShowThemeToggle && (
                  <button
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:bg-card-bg transition-all"
                    aria-label="Toggle theme"
                  >
                    {resolvedTheme === "dark" ? (
                      <FaSun className="text-lg" />
                    ) : (
                      <FaMoon className="text-lg" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
