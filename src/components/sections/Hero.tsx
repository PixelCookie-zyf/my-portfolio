import Link from "next/link";
import PageMascot from "@/components/ui/PageMascot";
import { Arrow, Circled, Highlight, Sparkle, Squiggle } from "@/components/ui/Doodles";
import { personalInfo, nowItems } from "@/data/personal";

const noteStyles = [
  "bg-note-yellow -rotate-2",
  "bg-note-green rotate-[1.5deg] md:translate-y-3",
  "bg-note-pink -rotate-1",
];

export default function Hero() {
  return (
    <section id="home" className="wrap pb-28 pt-8 md:pt-14">
      <div className="grid items-center gap-y-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-x-12">
        <div>
          <p className="flex items-center gap-2 text-sm text-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
            </span>
            PhD student · {personalInfo.location}
          </p>
          <p className="font-hand mt-7 text-[2rem] leading-none text-tomato">hi, I’m {personalInfo.name} —</p>
          <h1 className="font-display mt-3 text-[clamp(2.5rem,5.4vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.025em]">
            I study <Circled delay={0.3}>LLMs</Circled>, build <Highlight delay={0.9}>AI agents</Highlight>, and{" "}
            <Squiggle delay={1.4}>
              <em className="font-normal">write it all down</em>
            </Squiggle>
            .
          </h1>
          <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-soft">
            This is my notebook on the web: research notes on language models, agents and
            recommendation, open-source projects, and a few places I’ve been.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-transform hover:-translate-y-0.5"
            >
              Read my notes <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href={personalInfo.socials[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[15px] text-soft transition-colors hover:border-ink hover:text-ink"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[380px] justify-center pb-6 pt-4">
          <svg aria-hidden="true" viewBox="-80 -80 160 160" className="absolute inset-0 m-auto h-[92%] w-[92%] text-note-yellow">
            <path
              fill="currentColor"
              d="M44.7,-58.2C57.1,-49.7,66.1,-35.7,70.1,-20.3C74.1,-4.9,73.1,11.9,66.3,25.6C59.5,39.3,46.9,49.9,32.6,57.6C18.3,65.3,2.3,70.1,-14.4,69.2C-31.1,68.3,-48.5,61.7,-59.4,49.1C-70.3,36.5,-74.7,17.9,-73.4,0.3C-72.1,-17.3,-65.1,-34.6,-53.1,-43.6C-41.1,-52.6,-24.1,-53.3,-8.2,-56.4C7.7,-59.5,32.3,-66.7,44.7,-58.2Z"
            />
          </svg>
          <Sparkle className="absolute right-[12%] top-[6%] h-6 w-6 text-tomato" />
          <Sparkle className="absolute left-[10%] top-[30%] h-3.5 w-3.5 text-blue" />
          <Sparkle className="absolute bottom-[18%] right-[6%] h-4 w-4 text-forest" />
          <div className="relative">
            <PageMascot size={232} />
          </div>
          <p className="font-hand absolute -bottom-2 left-0 flex items-start gap-1 text-[1.6rem] leading-none text-soft sm:left-[-4%]">
            <span className="-rotate-6">say hi to Fox!</span>
            <Arrow className="h-9 w-12 -translate-y-6 -rotate-[70deg]" />
          </p>
        </div>
      </div>

      <ul className="mt-20 grid gap-6 sm:grid-cols-3 md:gap-8">
        {nowItems.map((item, index) => (
          <li key={item.label} className={`paper-shadow relative rounded-[4px] px-6 pb-6 pt-7 ${noteStyles[index]}`}>
            <span aria-hidden="true" className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" />
            <p className="font-hand text-2xl leading-none text-soft">{item.label}</p>
            <p className="mt-2 text-[15px] leading-snug text-ink">
              {"href" in item ? (
                <a
                  href={item.href}
                  className="link"
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
