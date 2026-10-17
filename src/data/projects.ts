export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  highlight?: string;
}

export const projects: Project[] = [
  {
    title: "SeRankMixer",
    description:
      "A single-model conversion ranking network for the Tencent Advertising Algorithm Competition. Placed ninth in the UNI-REC track with a weighted AUC of 0.8288, without ensembling.",
    tags: ["PyTorch", "Recommendation", "Ranking"],
    github: "https://github.com/PixelCookie-zyf/TAAC-2026-SeRankMixer",
    highlight: "TAAC 2026 · 9th place",
  },
  {
    title: "Paper Digest",
    description:
      "A paper-reading pipeline that searches arXiv, screens results and turns individual papers into bilingual MDX summaries.",
    tags: ["Python", "arXiv", "NLP"],
    github: "https://github.com/PixelCookie-zyf/paper-digest",
  },
  {
    title: "HotRecForCTR",
    description:
      "A framework for experimenting with click-through rate models on the Criteo dataset, including LR-GBDT, Factorization Machines and model profiling tools.",
    tags: ["PyTorch", "LightGBM", "CTR"],
    github: "https://github.com/PixelCookie-zyf/HotRecForCTR",
  },
  {
    title: "Clawd on Desk",
    description:
      "An animated desktop pet that reacts to Claude Code sessions through hooks: thinking, typing, juggling and sleeping.",
    tags: ["JavaScript", "Electron", "Claude Code"],
    github: "https://github.com/rullerzhou-afk/clawd-on-desk",
  },
  {
    title: "TorchInsight",
    description:
      "A PyTorch model inspection tool with layer-by-layer summaries, custom formatting and profiling for recommendation models.",
    tags: ["Python", "PyTorch"],
    github: "https://github.com/PixelCookie-zyf/TorchInsight",
  },
  {
    title: "My Portfolio",
    description:
      "My personal website: research notes, projects and a map of places I have visited.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/PixelCookie-zyf/my-portfolio",
    demo: "https://www.pixelcookie.me",
  },
];
