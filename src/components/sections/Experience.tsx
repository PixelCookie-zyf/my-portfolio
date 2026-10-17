import Row, { SectionHeading } from "@/components/layout/Row";
import { timelineEntries } from "@/data/experience";

export default function Experience() {
  const entries = [...timelineEntries].reverse();

  return (
    <section id="experience" className="pb-24">
      <SectionHeading index="03" title="Along the way" />
      <ol className="space-y-8">
        {entries.map((entry) => {
          const isCurrent = entry.period.endsWith("Present");
          return (
            <li key={`${entry.institution}-${entry.period}`}>
              <Row note={entry.period.replace("Present", "now")}>
                {/* The margin line doubles as the timeline. */}
                <span
                  aria-hidden="true"
                  className={`line-dot top-[0.55rem] ${isCurrent ? "!border-accent !bg-accent" : ""}`}
                />
                <div className="max-w-[42rem]">
                  <h3 className="serif text-xl font-medium">
                    {entry.institution}
                    <span className="ml-2 text-base font-normal italic text-muted">{entry.role}</span>
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{entry.description}</p>
                </div>
              </Row>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
