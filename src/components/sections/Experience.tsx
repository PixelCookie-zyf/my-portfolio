import { FiArrowRight, FiBookOpen, FiBriefcase } from "react-icons/fi";
import { timelineEntries } from "@/data/experience";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section id="experience" className="site-section">
      <div className="site-container">
        <div className={styles.heading}>
          <div>
            <p className="eyebrow">Along the way</p>
            <h2 id="experience-heading" className="section-heading">
              Experience
            </h2>
          </div>
          <p className={styles.scrollHint} aria-hidden="true">
            Scroll through the years <FiArrowRight size={14} />
          </p>
        </div>

        <div
          className={styles.viewport}
          role="region"
          aria-labelledby="experience-heading"
          aria-describedby="experience-scroll-help"
          tabIndex={0}
        >
          <p id="experience-scroll-help" className="sr-only">
            A chronological timeline. On smaller screens, scroll horizontally
            or use the left and right arrow keys to see all entries.
          </p>
          <ol className={styles.timeline}>
            {timelineEntries.map((entry) => {
              const [startYear, endYear] = entry.period.split(" – ");
              const isCurrent = endYear === "Present";
              const Icon = entry.type === "work" ? FiBriefcase : FiBookOpen;

              return (
                <li
                  key={`${entry.institution}-${entry.period}`}
                  className={`${styles.entry} ${isCurrent ? styles.current : ""}`}
                >
                  <p className={styles.period} aria-label={entry.period}>
                    <span className={styles.year}>{startYear}</span>
                    <span className={styles.endYear}>— {endYear}</span>
                  </p>

                  <div className={styles.track} aria-hidden="true">
                    <span className={styles.marker}>
                      <Icon size={15} strokeWidth={1.5} />
                    </span>
                  </div>

                  <div className={styles.details}>
                    <p className={styles.category}>
                      {entry.type === "work" ? "Industry" : "Education"}
                      {isCurrent && <span className={styles.currentLabel}>Now</span>}
                    </p>
                    <h3 className={styles.institution}>{entry.institution}</h3>
                    <p className={styles.role}>{entry.role}</p>
                    <p className={styles.description}>{entry.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
