import Image from "next/image";
import SectionHeading from "@/components/layout/SectionHeading";
import { personalInfo } from "@/data/personal";
import { timelineEntries } from "@/data/experience";

export default function Experience() {
  const entries = [...timelineEntries].reverse();

  return (
    <section id="experience" className="wrap pb-28">
      <SectionHeading kicker="a bit about me" title="Along the way" tone="text-blue" />
      <div className="grid gap-14 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
        <figure className="paper-shadow relative mx-auto h-fit w-[248px] -rotate-3 bg-white p-3 pb-14 dark:bg-[#2b2925]">
          <span aria-hidden="true" className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" />
          <Image
            src={personalInfo.avatar}
            alt={`Portrait of ${personalInfo.name}`}
            width={224}
            height={224}
            className="aspect-square w-full object-cover"
          />
          <figcaption className="font-hand absolute inset-x-0 bottom-3 text-center text-[1.6rem] leading-none text-soft">
            me, mid-debug
          </figcaption>
        </figure>

        <div>
          <p className="font-display max-w-[40rem] text-[1.55rem] leading-[1.45] tracking-[-0.01em]">
            {personalInfo.bio}
          </p>

          <ol className="relative mt-12 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:border-l-2 before:border-dashed before:border-line">
            {entries.map((entry) => {
              const isCurrent = entry.period.endsWith("Present");
              const isWork = entry.type === "work";
              return (
                <li key={`${entry.institution}-${entry.period}`} className="relative pb-9 pl-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-paper ${
                      isWork ? "bg-tomato" : "bg-forest"
                    } ${isCurrent ? "ring-4 ring-forest/25" : ""}`}
                  />
                  <p className="font-display text-[15px] italic text-muted">
                    {entry.period.replace("Present", "now")}
                  </p>
                  <h3 className="font-display mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[1.35rem] font-medium leading-snug">
                    {entry.institution}
                    <span className="text-base font-normal italic text-muted">{entry.role}</span>
                    {isCurrent && (
                      <span className="font-hand rounded-full bg-note-green px-2.5 text-lg leading-6 text-forest">
                        right now
                      </span>
                    )}
                  </h3>
                  <p className="mt-1.5 max-w-[38rem] text-[15px] leading-relaxed text-soft">{entry.description}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-10 flex gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-forest" /> study
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-tomato" /> industry
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
