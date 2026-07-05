"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowUp } from "react-icons/io5";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="group fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-muted shadow-lg backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] text-muted opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100 md:block"
          >
            cd ~
          </span>
          <IoArrowUp className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
