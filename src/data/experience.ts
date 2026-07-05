export interface TimelineEntry {
  institution: string;
  role: string;
  period: string;
  type: "education" | "work" | "future";
  description: string;
  tags: string[];
  /** git-branch style label shown next to the institution, e.g. "work/meituan" */
  branch: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    institution: "Hohai University",
    role: "BSc Mathematics",
    period: "2018 – 2022",
    type: "education",
    description:
      "Undergraduate studies in pure and applied mathematics. Built strong foundations in real analysis, linear algebra, probability theory, and numerical computation.",
    tags: ["Mathematics", "Statistics", "Probability"],
    branch: "edu/hohai",
  },
  {
    institution: "Sun Yat-sen University",
    role: "MSc Computer Science",
    period: "2022 – 2025",
    type: "education",
    description:
      "Graduate research focused on product question answering, large language model applications, and autonomous AI agent systems. Published work on LLM-driven solutions.",
    tags: ["LLM", "AI Agent", "NLP", "Research"],
    branch: "edu/sysu",
  },
  {
    institution: "Tencent IEG",
    role: "Intern",
    period: "2024 – 2025",
    type: "work",
    description:
      "Interned at the Interactive Entertainment Group. Applied AI and ML techniques to game-related engineering challenges and user experience optimization.",
    tags: ["AI", "Gaming", "ML", "Engineering"],
    branch: "work/tencent-ieg",
  },
  {
    institution: "Meituan",
    role: "Ad Search Algorithm Engineer",
    period: "2025 – 2026",
    type: "work",
    description:
      "Designed and optimized ad search ranking algorithms and relevance models for one of China's largest local services platforms.",
    tags: ["Search", "Ranking", "Ads", "ML"],
    branch: "work/meituan",
  },
  {
    institution: "PhD Studies",
    role: "Doctoral Researcher",
    period: "2026 – Present",
    type: "education",
    description:
      "Doctoral research in AI, machine learning, and intelligent agent systems — going deeper on the questions I kept running into while shipping.",
    tags: ["AI Research", "ML", "Agents"],
    branch: "edu/phd",
  },
];
