import GitHubWidget from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="site-section">
      <div className="site-container">
        <div className="mb-8">
          <p className="eyebrow">Day to day</p>
          <h2 className="section-heading">Code & tools</h2>
        </div>

        <GitHubWidget username="PixelCookie-zyf" />

        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category) => (
            <div key={category.label} className="border-t border-border pt-4">
              <dt className="text-sm font-medium text-foreground">
                {category.label}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-muted">
                {category.skills.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
