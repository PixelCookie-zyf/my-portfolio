"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkle } from "@/components/ui/Doodles";
import { personalInfo } from "@/data/personal";

const copyLabels = { idle: "copy", copied: "copied!", error: "could not copy" } as const;

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState<keyof typeof copyLabels>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyStatus("idle"), 2500);
  };

  return (
    <section id="contact" className="wrap">
      {/* An airmail envelope. */}
      <div className="paper-shadow rounded-[20px] bg-[repeating-linear-gradient(135deg,var(--tomato)_0_14px,var(--card)_14px_22px,var(--blue)_22px_36px,var(--card)_36px_44px)] p-2.5">
        <div className="relative rounded-[14px] bg-card px-7 py-12 text-center md:px-16 md:py-16">
          <Sparkle className="absolute left-8 top-8 h-5 w-5 text-ochre" />
          <Sparkle className="absolute bottom-10 right-10 h-3.5 w-3.5 text-tomato" />
          <p className="font-hand text-[1.8rem] leading-none text-tomato">write me a letter</p>
          <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            Say hello.
          </h2>
          <p className="mx-auto mt-5 max-w-[30rem] text-[17px] leading-relaxed text-soft">
            About research, a project, or something you read here — I reply to every note.
          </p>
          <div className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-display link break-all text-[clamp(1.5rem,3.4vw,2.3rem)] italic"
            >
              {personalInfo.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="font-hand text-xl text-muted transition-colors hover:text-tomato"
            >
              <span aria-live="polite">({copyLabels[copyStatus]})</span>
            </button>
          </div>
          <ul className="mt-9 flex flex-wrap justify-center gap-2.5">
            {personalInfo.socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-line px-4 py-2 text-sm text-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {social.name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
