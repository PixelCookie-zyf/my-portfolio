export interface TimelineEntry {
  institution: string;
  role: string;
  period: string;
  type: "education" | "work" | "future";
  description: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    institution: "Hohai University",
    role: "BSc Mathematics",
    period: "2018 – 2022",
    type: "education",
    description:
      "Studied pure and applied mathematics, including analysis, probability and numerical computation.",
  },
  {
    institution: "Sun Yat-sen University",
    role: "MSc Computer Science",
    period: "2022 – 2025",
    type: "education",
    description:
      "Research on product question answering, language models and autonomous agents.",
  },
  {
    institution: "Tencent IEG",
    role: "Intern",
    period: "2024 – 2025",
    type: "work",
    description:
      "Applied machine learning to game engineering and user experience at the Interactive Entertainment Group.",
  },
  {
    institution: "Meituan",
    role: "Ad Search Algorithm Engineer",
    period: "2025 – 2026",
    type: "work",
    description:
      "Worked on ad search ranking algorithms and relevance models.",
  },
  {
    institution: "PhD Studies",
    role: "Doctoral Researcher",
    period: "2026 – Present",
    type: "education",
    description:
      "Research in AI, machine learning and intelligent agent systems.",
  },
];
