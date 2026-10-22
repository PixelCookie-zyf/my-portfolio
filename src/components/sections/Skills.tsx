import SectionHeading from "@/components/layout/SectionHeading";
import GitHubWidget from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

const tones = ["text-tomato", "text-forest", "text-blue", "text-ochre"];

export default function Skills() {
  return (
    <section id="skills" className="wrap pb-28">
      <SectionHeading kicker="what’s on my desk" title="Code & tools" tone="text-ochre" />
      <div>
        <GitHubWidget username="PixelCookie-zyf" />
        <dl className="mt-10 grid gap-x-6 gap-y-8 px-2 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, index) => (
            <div key={category.label}>
              <dt className={`font-hand text-2xl leading-none ${tones[index % tones.length]}`}>
                {category.label.toLowerCase()}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="whitespace-nowrap rounded-full border border-line bg-card px-3 py-1 text-sm text-soft">
                    {skill}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
