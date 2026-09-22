"use client";

import { Mascot } from "page-mascot";

type PageMascotProps = {
  size?: number;
  className?: string;
};

export default function PageMascot({
  size = 120,
  className = "",
}: PageMascotProps) {
  return (
    <div className={`page-mascot ${className}`} title="和小狐狸打个招呼">
      <div lang="en">
        <Mascot
          directions="/mascots/fox-sketch-directions.webp"
          reactions="/mascots/fox-sketch-reactions.webp"
          size={size}
          label="little fox"
          className="page-mascot-control rounded-[28%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        />
      </div>
      <style jsx>{`
        .page-mascot {
          width: fit-content;
        }

        @media (prefers-reduced-motion: reduce) {
          /* The library disables its squash animation; also keep its gaze still. */
          .page-mascot :global(.page-mascot-control > span > span:first-child) {
            background-position: 50% 50% !important;
          }
        }
      `}</style>
    </div>
  );
}
