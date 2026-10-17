"use client";

import { useEffect, useRef, useState } from "react";
import Row, { SectionHeading } from "@/components/layout/Row";
import { personalInfo } from "@/data/personal";

const copyLabels = { idle: "copy", copied: "copied", error: "could not copy" } as const;

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
    <section id="contact">
      <SectionHeading index="06" title="Say hello" />
      <Row>
        <p className="max-w-[36rem] text-[17px] leading-[1.75] text-muted">
          For research, projects, or a note about something you read here — my inbox is open.
        </p>
        <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <a
            href={`mailto:${personalInfo.email}`}
            className="serif link break-all text-[clamp(1.6rem,3.6vw,2.4rem)] italic"
          >
            {personalInfo.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            <span aria-live="polite">({copyLabels[copyStatus]})</span>
          </button>
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          {personalInfo.socials.map((social) => (
            <li key={social.name}>
              <a href={social.url} target="_blank" rel="noopener noreferrer" className="link">
                {social.name}
              </a>
            </li>
          ))}
        </ul>
      </Row>
    </section>
  );
}
