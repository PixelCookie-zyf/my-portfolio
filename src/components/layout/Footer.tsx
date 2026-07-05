import { personalInfo } from "@/data/personal";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {personalInfo.name}
          <span className="text-accent">.</span>
        </p>

        <p className="text-xs text-muted/70">
          Built with Next.js &amp; Tailwind CSS &middot; &copy; {year}{" "}
          {personalInfo.name}
        </p>

        <div className="flex items-center gap-4">
          {personalInfo.socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-muted/70 transition-colors hover:text-accent"
              >
                <Icon className="text-base" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
