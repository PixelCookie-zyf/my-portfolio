import Row from "@/components/layout/Row";
import { personalInfo } from "@/data/personal";

export default function Footer() {
  return (
    <footer className="mt-24 pb-10 pt-6 text-sm text-muted">
      <Row note={`© ${new Date().getFullYear()}`}>
        <div className="flex flex-wrap justify-between gap-x-8 gap-y-2">
          <p>
            {personalInfo.name} · {personalInfo.location}
          </p>
          <a href="#" className="link">
            Back to top ↑
          </a>
        </div>
      </Row>
    </footer>
  );
}
