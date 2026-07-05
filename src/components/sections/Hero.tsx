"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLocationDot, FaEnvelope } from "react-icons/fa6";
import { personalInfo } from "@/data/personal";
import AsciiCanvas from "@/components/ui/AsciiCanvas";
import TextScramble from "@/components/ui/TextScramble";

function useTypewriter(words: readonly string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      setText(currentWord.slice(0, text.length + 1));
      if (text.length + 1 === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
    } else {
      setText(currentWord.slice(0, text.length - 1));
      if (text.length - 1 === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
    }
  }, [text, wordIndex, isDeleting, words]);

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  return text;
}

const nowItems = [
  "PhD research — AI & intelligent agents",
  "Fresh off TAAC 2026 — #9 w/ SeRankMixer",
  "After hours: Godot & pixel art",
];

const tickerItems = [
  ...personalInfo.roles,
  "RecSys & Ranking",
  "Godot Engine",
  "Pixel Art",
];

export default function Hero() {
  const typedRole = useTypewriter(personalInfo.roles);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-40 pt-28 sm:pt-24"
    >
      {/* ASCII Canvas — absolute, top half only */}
      <div className="absolute top-0 left-0 right-0 z-0 h-[50vh]">
        <AsciiCanvas variant="hero" className="h-full" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-x-16 gap-y-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ---- Text column ---- */}
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-muted">
              <FaLocationDot className="text-accent" />
              {personalInfo.city} · UTC+8
            </p>

            <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl xl:text-7xl">
              <TextScramble text={personalInfo.name} trigger="mount" />
              <span className="text-accent">.</span>
            </h1>

            {/* Typewriter — terminal style */}
            <p className="mt-5 font-mono text-base text-foreground/90 sm:text-lg">
              <span className="select-none text-muted">&gt; </span>
              {typedRole}
              <span
                className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 bg-accent"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            </p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {personalInfo.bio}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <motion.a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#fffcf0] shadow-[0_14px_36px_-14px_rgba(188,82,21,0.6)] transition-colors hover:bg-accent-strong"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Selected work ↓
            </motion.a>
            <motion.a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaEnvelope className="text-sm" />
              Say hello
            </motion.a>

            <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />

            <div className="flex items-center gap-5">
              {personalInfo.socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-xl text-muted transition-colors hover:text-accent"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ---- Avatar + now card ---- */}
        <div className="order-1 contents lg:order-2 lg:flex lg:flex-col lg:items-center lg:gap-10">
          <motion.div
            className="order-1 flex justify-center lg:order-none"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <motion.div
              className="relative cursor-pointer"
              animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Rotating dashed ring */}
              <div
                className="absolute -inset-3 rounded-full border-2 border-dashed border-accent/30 transition-all duration-500 hover:border-accent/60"
                style={{ animation: "avatar-ring-spin 20s linear infinite" }}
              />

              {/* Glow wrapper with gradient border */}
              <motion.div
                className="relative rounded-full bg-gradient-to-br from-[#DA702C] via-[#BC5215] to-[#AD8301] p-[3px]"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(218,112,44,0.28), 0 0 40px rgba(173,131,1,0.14)",
                    "0 0 30px rgba(218,112,44,0.45), 0 0 60px rgba(173,131,1,0.26)",
                    "0 0 20px rgba(218,112,44,0.28), 0 0 40px rgba(173,131,1,0.14)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="overflow-hidden rounded-full bg-background p-[2px]">
                  <Image
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    width={192}
                    height={192}
                    priority
                    className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Now card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="order-3 mx-auto w-full max-w-sm rounded-2xl border border-border bg-card-bg/60 p-5 backdrop-blur-sm lg:order-none lg:mx-0"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              /* now */
            </p>
            <ul className="mt-3 space-y-2">
              {nowItems.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-2.5 text-sm leading-6 text-muted"
                >
                  <span className="select-none font-mono text-xs text-accent/70">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Interest ticker */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-16 left-0 right-0 z-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {tickerItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.24em] text-muted/70"
                >
                  <span className="px-5 text-accent/60">✦</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.a
        href="#experience"
        aria-label="Scroll to experience"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-accent sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.span
          aria-hidden="true"
          className="h-8 w-px bg-gradient-to-b from-accent/70 to-transparent"
          animate={{ scaleY: [1, 0.55, 1], opacity: [0.9, 0.4, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.a>
    </section>
  );
}
