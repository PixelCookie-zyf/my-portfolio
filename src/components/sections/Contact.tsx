"use client";

import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa6";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { personalInfo } from "@/data/personal";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      {/* Warm glow behind the CTA */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="font-mono text-sm font-medium text-accent">06</span>
            <span className="h-px w-12 bg-accent/40" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              reach out
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
            Let&apos;s build something{" "}
            <span className="italic text-accent">together</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Open to collaborations, research conversations, and interesting
            ideas — my inbox is always happy to hear about them.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <motion.a
            href={`mailto:${personalInfo.email}`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-[#fffcf0] shadow-[0_16px_40px_-12px_rgba(188,82,21,0.55)] transition-colors hover:bg-accent-strong"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaEnvelope className="text-lg" />
            Say hello
          </motion.a>

          <p className="mt-4 font-mono text-xs tracking-wide text-muted">
            {personalInfo.email}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="mt-12 flex justify-center gap-4">
            {personalInfo.socials.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card-bg/60 text-muted transition-all hover:border-accent/40 hover:text-accent"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-lg" />
                </motion.a>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
