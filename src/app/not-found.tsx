import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageMascot from "@/components/ui/PageMascot";

export default function NotFound() {
  return (
    <PageShell>
      <div className="wrap flex flex-col items-center py-16 text-center md:py-24">
        <PageMascot size={180} />
        <p className="font-hand mt-4 text-[1.8rem] leading-none text-tomato">Fox looked everywhere…</p>
        <h1 className="font-display mt-4 text-[clamp(3.5rem,10vw,7rem)] font-medium leading-none tracking-[-0.03em]">
          404
        </h1>
        <p className="mt-5 max-w-md text-lg text-soft">
          This page may have moved, or the address may be incomplete.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-paper">
            Back home
          </Link>
          <Link href="/blog" className="rounded-full border border-line px-5 py-3 text-[15px] text-soft hover:border-ink hover:text-ink">
            Read the notes
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
