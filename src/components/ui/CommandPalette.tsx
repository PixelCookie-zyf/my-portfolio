"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, personalInfo } from "@/data/personal";
import { projects } from "@/data/projects";

interface PalettePost {
  slug: string;
  title: string;
}

interface PaletteItem {
  id: string;
  group: string;
  glyph: string;
  label: string;
  hint?: string;
  keywords?: string;
}

const GROUP_ORDER = ["navigate", "writing", "projects", "actions"];

export default function CommandPalette({ posts }: { posts: PalettePost[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const items = useMemo<PaletteItem[]>(
    () => [
      ...navLinks.map((link) => ({
        id: `nav-${link.href}`,
        group: "navigate",
        glyph: "#",
        label: link.label,
        keywords: "section go jump anchor",
      })),
      ...posts.map((post) => ({
        id: `post-${post.slug}`,
        group: "writing",
        glyph: "md",
        label: post.title,
        keywords: "blog post article read",
      })),
      ...projects.map((project) => ({
        id: `proj-${project.title}`,
        group: "projects",
        glyph: "gh",
        label: project.title,
        hint: "↗",
        keywords: `github repo ${project.tags.join(" ")}`,
      })),
      {
        id: "action-theme",
        group: "actions",
        glyph: "$",
        label:
          resolvedTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode",
        keywords: "theme toggle dark light appearance",
      },
      {
        id: "action-email",
        group: "actions",
        glyph: "$",
        label: copied ? "Copied to clipboard ✦" : "Copy email address",
        keywords: `email contact ${personalInfo.email}`,
      },
    ],
    [posts, resolvedTheme, copied]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${item.label} ${item.group} ${item.keywords ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    setCopied(false);
  }, []);

  const perform = useCallback(
    (item: PaletteItem) => {
      if (item.id.startsWith("nav-")) {
        const hash = item.id.replace("nav-", "");
        close();
        if (pathname === "/") {
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(`/${hash}`);
        }
        return;
      }
      if (item.id.startsWith("post-")) {
        close();
        router.push(`/blog/${item.id.replace("post-", "")}`);
        return;
      }
      if (item.id.startsWith("proj-")) {
        const project = projects.find(
          (p) => p.title === item.id.replace("proj-", "")
        );
        const url = project?.github ?? project?.demo;
        if (url) window.open(url, "_blank", "noopener,noreferrer");
        close();
        return;
      }
      if (item.id === "action-theme") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }
      if (item.id === "action-email") {
        navigator.clipboard?.writeText(personalInfo.email).then(() => {
          setCopied(true);
          setTimeout(close, 900);
        });
      }
    },
    [close, pathname, router, resolvedTheme, setTheme]
  );

  // Global shortcuts: ⌘K / Ctrl+K toggle, Esc close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) {
            setQuery("");
            setActiveIndex(0);
            setCopied(false);
          }
          return !prev;
        });
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  // Focus input + lock scroll while open
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 20);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(id);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keep active item in view
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered.length]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) perform(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const groups = GROUP_ORDER.filter((g) =>
    filtered.some((item) => item.group === g)
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-[#100f0f]/40 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background shadow-[0_40px_120px_-24px_rgba(16,15,15,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <span className="select-none font-mono text-sm text-accent">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Type to search…"
                aria-label="Search commands"
                className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted/60"
              />
              <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
                esc
              </span>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              role="listbox"
              aria-label="Command results"
              className="max-h-[46vh] overflow-y-auto p-2"
            >
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center font-mono text-xs text-muted">
                  no matches — try something else
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group}>
                    <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted/70">
                      {group}
                    </p>
                    {filtered
                      .filter((item) => item.group === group)
                      .map((item) => {
                        const flatIndex = filtered.indexOf(item);
                        const active = flatIndex === activeIndex;
                        return (
                          <button
                            key={item.id}
                            role="option"
                            aria-selected={active}
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            onClick={() => perform(item)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                              active
                                ? "bg-card-bg text-accent"
                                : "text-foreground/85"
                            }`}
                          >
                            <span
                              className={`w-6 shrink-0 text-center font-mono text-[11px] ${
                                active ? "text-accent" : "text-muted/70"
                              }`}
                            >
                              {item.glyph}
                            </span>
                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>
                            {item.hint && (
                              <span className="shrink-0 font-mono text-xs text-muted/70">
                                {item.hint}
                              </span>
                            )}
                            {active && (
                              <span className="shrink-0 font-mono text-[10px] text-muted">
                                ↵
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 border-t border-border px-5 py-3 font-mono text-[10px] text-muted/70">
              <span>
                <kbd className="rounded border border-border px-1">↑</kbd>{" "}
                <kbd className="rounded border border-border px-1">↓</kbd>{" "}
                navigate
              </span>
              <span>
                <kbd className="rounded border border-border px-1">↵</kbd> select
              </span>
              <span className="ml-auto text-accent/70">pixelcookie.me</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
