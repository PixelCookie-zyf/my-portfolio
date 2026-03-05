"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data/personal";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <h3 className="text-xl font-semibold text-foreground">
            Let&apos;s Collaborate
          </h3>
          <p className="max-w-md text-muted">
            I&apos;m always open to new opportunities and interesting projects.
            Feel free to reach out!
          </p>
          <div className="flex gap-4">
            {personalInfo.socials.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card-bg text-muted hover:bg-accent hover:text-white transition-all"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-lg" />
                </motion.a>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-muted/60">
            <p>
              Built with Next.js & Tailwind CSS.{" "}
              &copy; {new Date().getFullYear()} {personalInfo.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
