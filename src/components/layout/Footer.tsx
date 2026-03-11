import { personalInfo } from "@/data/personal";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted/60">
        <p>
          Built with Next.js &amp; Tailwind CSS. &copy; {year}{" "}
          {personalInfo.name}
        </p>
      </div>
    </footer>
  );
}
