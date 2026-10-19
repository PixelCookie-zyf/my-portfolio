import { personalInfo } from "@/data/personal";
import { Sparkle } from "@/components/ui/Doodles";

export default function Footer() {
  return (
    <footer className="wrap mt-28 border-t border-dashed border-line py-8 text-sm text-muted">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="flex items-center gap-2">
          <Sparkle className="h-3 w-3 text-ochre" />© {new Date().getFullYear()} {personalInfo.name} · made slowly in{" "}
          {personalInfo.location}
        </p>
        <a href="#" className="transition-colors hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
