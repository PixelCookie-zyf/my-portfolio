
export interface Project {
  title: string;
  description: string;
  /** basename of the themed SVG pair under public/icons/{dark,light}/ */
  icon: string;
  tags: string[];
  github?: string;
  demo?: string;
  /** Short badge shown next to the title, e.g. a competition result */
  highlight?: string;
}

export const projects: Project[] = [
  {
    title: "SeRankMixer",
    description:
      "Single-model pCVR ranking network for the Tencent Advertising Algorithm Competition (UNI-REC track): a semantically-tokenized RankMixer backbone with DIN behavior pooling and group-wise bilinear fusion, trained with Muon, SWA and SAM. Finished #9 on the final leaderboard (weighted-AUC 0.8288) — no ensembling.",
    icon: "serankmixer",
    tags: ["Python", "PyTorch", "RankMixer", "pCVR / LTR"],
    github: "https://github.com/PixelCookie-zyf/TAAC-2026-SeRankMixer",
    highlight: "TAAC 2026 · rank #9",
  },
  {
    title: "My Portfolio",
    description:
      "The site you're looking at right now — generative ASCII canvas, custom cursor, text scramble, a warm paper-and-ember design system, and an interactive travel map. Built with Next.js, Tailwind CSS and Framer Motion.",
    icon: "portfolio",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/PixelCookie-zyf/my-portfolio",
    demo: "https://www.pixelcookie.me",
  },
  {
    title: "HotRecForCTR",
    description:
      "A modular CTR prediction framework implementing ranking models like LR-GBDT and Factorization Machines. Registry-based architecture, custom TorchPrint model analysis (FLOPs, MACs, memory), trained on the Criteo dataset.",
    icon: "hotrec",
    tags: ["Python", "PyTorch", "LightGBM", "CTR"],
    github: "https://github.com/PixelCookie-zyf/HotRecForCTR",
  },
  {
    title: "Clawd on Desk",
    description:
      "A desktop pet that reacts to your Claude Code sessions in real-time — thinking, typing, juggling, sleeping, and more. Built with Electron and wired up through Claude Code hooks.",
    icon: "clawd",
    tags: ["JavaScript", "Electron", "Desktop Pet", "Claude Code"],
    github: "https://github.com/rullerzhou-afk/clawd-on-desk",
  },
  {
    title: "Paper Digest",
    description:
      "Let AI read papers for you — an AI-powered reading pipeline that searches arXiv, screens papers, and generates bilingual summaries in MDX, one paper at a time, from classics to the cutting edge.",
    icon: "paper-digest",
    tags: ["Python", "arXiv", "NLP", "Bilingual"],
    github: "https://github.com/PixelCookie-zyf/paper-digest",
  },
  {
    title: "TorchInsight",
    description:
      "An enhanced PyTorch model-analysis tool in the spirit of torchinfo — layer-by-layer summaries with custom formatting and extra profiling features, built for poking at recommendation models.",
    icon: "torchinsight",
    tags: ["Python", "PyTorch", "Tooling"],
    github: "https://github.com/PixelCookie-zyf/TorchInsight",
  },
  {
    title: "Agent Sprite Forge",
    description:
      "An Agent Skill that turns prompts into game-ready 2D assets — sprite sheets, tile maps, transparent PNG frames and animated GIFs — so coding agents can forge pixel art on demand.",
    icon: "sprite-forge",
    tags: ["Agent Skill", "GenAI", "Pixel Art"],
    github: "https://github.com/PixelCookie-zyf/agent-sprite-forge",
  },
];
