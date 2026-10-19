import { Squiggle } from "@/components/ui/Doodles";

/** Opening title of a secondary page. */
export default function PageTitle({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap pb-14 pt-10 md:pb-20 md:pt-16">
      <p className="font-hand text-[1.7rem] leading-none text-tomato">{kicker}</p>
      <h1 className="font-display mt-3 text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.98] tracking-[-0.03em]">
        <Squiggle delay={0.4}>{title}</Squiggle>
      </h1>
      {children && (
        <div className="mt-8 max-w-[38rem] text-lg leading-relaxed text-soft">{children}</div>
      )}
    </header>
  );
}
