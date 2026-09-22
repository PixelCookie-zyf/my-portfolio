import Link from "next/link";
import { personalInfo } from "@/data/personal";

export default function Footer() {
  return (
    <footer className="site-container border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-8 text-xs text-muted">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link href="/" className="transition-colors hover:text-accent">
            {personalInfo.name}
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-5">
          {personalInfo.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
