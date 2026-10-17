import Row, { SectionHeading } from "@/components/layout/Row";
import GitHubWidget from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="pb-24">
      <SectionHeading index="04" title="Code & tools" />
      <Row note="on GitHub">
        <GitHubWidget username="PixelCookie-zyf" />
      </Row>
      <Row note="usually with" className="mt-12">
        <dl className="max-w-[36rem] space-y-2.5 text-[15px]">
          {skillCategories.map((category) => (
            <div key={category.label} className="flex gap-4">
              <dt className="w-24 shrink-0 text-muted">{category.label}</dt>
              <dd>{category.skills.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Row>
    </section>
  );
}
