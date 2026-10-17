import Link from "next/link";
import Row from "@/components/layout/Row";
import PageMascot from "@/components/ui/PageMascot";
import { personalInfo, nowItems } from "@/data/personal";

export default function Hero() {
  return (
    <section id="home" className="pb-24 md:pb-32">
      <Row note={personalInfo.location}>
        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[36rem]">
            <h1 className="serif text-[clamp(2.75rem,6.4vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.025em]">
              Hi, I’m <em className="font-normal">PixelCookie</em>.
            </h1>
            <p className="mt-7 text-[17px] leading-[1.75] text-muted">{personalInfo.bio}</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              <Link href="/blog" className="link">
                Read the notes
              </Link>
              <a href={personalInfo.socials[0].url} target="_blank" rel="noopener noreferrer" className="link">
                GitHub
              </a>
              <a href={`mailto:${personalInfo.email}`} className="link">
                Email
              </a>
            </div>
          </div>

          <figure className="flex shrink-0 flex-col items-end self-end md:-mt-6 md:items-center md:self-auto">
            <PageMascot size={156} />
            <figcaption className="serif mt-1 text-sm italic text-muted">
              Fox keeps me company. Say hi.
            </figcaption>
          </figure>
        </div>
      </Row>

      <Row note="Now" className="mt-14">
        <ul className="max-w-[36rem] text-[15px]">
          {nowItems.map((item) => (
            <li key={item.label} className="flex gap-4 border-b border-border py-2.5 last:border-0">
              <span className="w-28 shrink-0 text-muted">{item.label}</span>
              {"href" in item ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                  {item.text}
                </a>
              ) : (
                <span>{item.text}</span>
              )}
            </li>
          ))}
        </ul>
      </Row>
    </section>
  );
}
