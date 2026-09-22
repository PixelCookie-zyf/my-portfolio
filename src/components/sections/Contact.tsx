"use client";

import { useEffect, useRef, useState } from "react";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";
import { personalInfo } from "@/data/personal";

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
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
    <section id="contact" className="site-section">
      <div className="site-container">
        <div className="grid gap-8 border-t border-border pt-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="eyebrow">Keep in touch</p>
            <h2 className="section-heading">Say hello.</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
              For research, projects, or a note about something you read here.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-lg text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent sm:text-xl"
              >
                {personalInfo.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="inline-flex min-h-10 items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
              >
                {copyStatus === "copied" ? (
                  <IoCheckmarkOutline aria-hidden="true" />
                ) : (
                  <IoCopyOutline aria-hidden="true" />
                )}
                <span aria-live="polite">
                  {copyStatus === "copied"
                    ? "Copied"
                    : copyStatus === "error"
                      ? "Could not copy"
                      : "Copy email"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
