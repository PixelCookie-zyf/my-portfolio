import Image from "next/image";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { personalInfo } from "@/data/personal";
import PageMascot from "@/components/ui/PageMascot";

export default function Hero() {
  return (
    <section id="home" className="site-container hero-section">
      <div className="hero-intro">
        <div className="mb-7 flex items-center gap-3">
          <Image
            src={personalInfo.avatar}
            alt=""
            width={36}
            height={36}
            priority
            className="rounded-full"
          />
          <p className="eyebrow">A personal notebook</p>
        </div>
        <h1 className="font-editorial text-[clamp(3.6rem,7.5vw,6.2rem)] leading-[1.04] tracking-[-0.055em]">
          Hi, I’m
          <br />
          PixelCookie<span className="text-accent">.</span>
        </h1>
        <p className="mt-7 max-w-[30rem] text-[16px] leading-[1.85] text-muted sm:text-[17px]">
          {personalInfo.bio}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link href="/blog" className="text-link text-foreground">
            Read my notes <IoArrowForward aria-hidden="true" />
          </Link>
          <a
            href={personalInfo.socials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            GitHub <FiArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
      <aside className="hero-aside" aria-label="What I’m working on">
        <p className="eyebrow mb-5">These days</p>
        <div className="space-y-5 text-sm leading-6">
          <p>
            <span className="block text-foreground">Back to research</span>
            <span className="text-muted">PhD studies in AI &amp; learning.</span>
          </p>
          <p>
            <a
              className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
              href="https://github.com/PixelCookie-zyf/TAAC-2026-SeRankMixer"
              target="_blank"
              rel="noopener noreferrer"
            >
              SeRankMixer <FiArrowUpRight aria-hidden="true" className="text-muted" />
            </a>
            <span className="block text-muted">9th place · Tencent TAAC 2026</span>
          </p>
          <p>
            <span className="block text-foreground">After hours</span>
            <span className="text-muted">Making little things with Godot.</span>
          </p>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <span className="pb-5 font-editorial text-sm italic text-muted">
            A little company.
          </span>
          <PageMascot size={116} />
        </div>
      </aside>
    </section>
  );
}
