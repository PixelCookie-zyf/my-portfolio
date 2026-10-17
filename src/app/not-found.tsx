import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import Row from "@/components/layout/Row";
import PageMascot from "@/components/ui/PageMascot";

export default function NotFound() {
  return (
    <PageShell>
      <PageTitle title="Nothing here." note="404">
        This page may have moved, or the address may be incomplete. Fox looked too.
      </PageTitle>
      <Row>
        <PageMascot size={140} />
        <p className="mt-6 flex gap-6 text-[15px]">
          <Link href="/" className="link">Back home</Link>
          <Link href="/blog" className="link">Read the notes</Link>
        </p>
      </Row>
    </PageShell>
  );
}
