"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
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

export default function Hero() {
  const typedRole = useTypewriter(personalInfo.roles);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* ASCII Canvas — absolute, top half only */}
      <div className="absolute top-0 left-0 right-0 z-0 h-[50vh]">
        <AsciiCanvas variant="hero" className="h-full" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Avatar */}
        <motion.div
          className="mb-8 flex justify-center"
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
                  width={160}
                  height={160}
                  priority
                  className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted">
            <FaLocationDot className="text-accent" />
            <span>{personalInfo.city}</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
            <TextScramble text={personalInfo.name} trigger="mount" />
          </h1>

          {/* Typewriter */}
          <p className="mt-4 text-xl text-accent font-medium">
            I&apos;m a{" "}
            <span>{typedRole}</span>
            <span
              className="ml-0.5 inline-block w-[2px] h-5 bg-accent align-middle"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          </p>

          <p className="mt-4 text-lg text-muted leading-relaxed">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Role tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {personalInfo.roles.map((role) => (
            <motion.span
              key={role}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="cursor-default rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm text-muted backdrop-blur-sm"
            >
              {role}
            </motion.span>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          {personalInfo.socials.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted shadow-sm hover:text-accent hover:border-accent/30 hover:shadow-md transition-all"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-xl" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#experience"
        aria-label="Scroll to experience"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-accent sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          scroll
        </span>
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
