import Row from "@/components/layout/Row";

/** Opening title of a secondary page. */
export default function PageTitle({
  title,
  note,
  children,
}: {
  title: string;
  note?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Row note={note} className="mb-16 md:mb-20">
      <h1 className="serif text-[clamp(2.75rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em]">
        {title}
      </h1>
      {children && (
        <div className="mt-5 max-w-[36rem] text-[17px] leading-[1.75] text-muted">{children}</div>
      )}
    </Row>
  );
}
