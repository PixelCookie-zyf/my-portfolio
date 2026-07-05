import { IconType } from "react-icons";
import { TbChartScatter, TbPaw, TbBooks, TbTestPipe, TbWorldWww } from "react-icons/tb";
import { SiGodotengine } from "react-icons/si";

export interface Project {
  title: string;
  description: string;
  thumbnail: { gradient: string; icon: IconType };
  tags: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: "My Portfolio",
    description:
      "The site you're looking at right now! A personal portfolio built with Next.js and Tailwind CSS, featuring generative ASCII canvas art, custom cursor, text scramble effects, dark/light theme, interactive travel map, and smooth Framer Motion animations.",
    thumbnail: { gradient: "from-[#DA702C] via-[#C87A2E] to-[#AD8301]", icon: TbWorldWww },
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/PixelCookie-zyf/my-portfolio",
    demo: "https://www.pixelcookie.me",
  },
  {
    title: "HotRecForCTR",
    description:
      "A modular CTR prediction framework implementing ranking models like LR-GBDT and Factorization Machines. Features a registry-based architecture, custom TorchPrint for model analysis (FLOPs, MACs, memory), and trains on the Criteo dataset for ad click-through rate prediction.",
    thumbnail: { gradient: "from-[#D14D41] via-[#D0576B] to-[#CE5D97]", icon: TbChartScatter },
    tags: ["Python", "PyTorch", "LightGBM", "CTR", "Recommendation"],
    github: "https://github.com/PixelCookie-zyf/HotRecForCTR",
  },
  {
    title: "Clawd on Desk",
    description:
      "A desktop pet that reacts to your Claude Code sessions in real-time — thinking, typing, juggling, sleeping, and more. Built with Electron and integrates via Claude Code hooks.",
    thumbnail: { gradient: "from-[#8B7EC8] via-[#6C7ABF] to-[#4385BE]", icon: TbPaw },
    tags: ["JavaScript", "Electron", "Desktop Pet", "Claude Code"],
    github: "https://github.com/rullerzhou-afk/clawd-on-desk",
  },
  {
    title: "Paper Digest",
    description:
      "Let AI read papers for you — an AI-powered paper reading pipeline that searches arXiv, screens papers, and generates bilingual summaries in MDX format.",
    thumbnail: { gradient: "from-[#3AA99F] via-[#5F9E6B] to-[#879A39]", icon: TbBooks },
    tags: ["Python", "arXiv", "AI", "NLP", "Bilingual"],
    github: "https://github.com/PixelCookie-zyf/paper-digest",
  },
  {
    title: "Godot Roguelite",
    description:
      "A procedurally generated roguelite dungeon crawler built with Godot 4, featuring dynamic enemy AI and a hand-crafted pixel art style.",
    thumbnail: { gradient: "from-[#CE5D97] via-[#AC6ECB] to-[#8B7EC8]", icon: SiGodotengine },
    tags: ["Godot 4", "GDScript", "Pixel Art", "Procedural Generation"],
    github: "https://github.com/yourusername/godot-roguelite",
    demo: "https://yourusername.itch.io/roguelite",
  },
  {
    title: "LLM Benchmark Suite",
    description:
      "An evaluation toolkit for benchmarking LLM performance across reasoning, coding, and instruction-following tasks. Generates detailed comparison reports.",
    thumbnail: { gradient: "from-[#4385BE] via-[#3F97AF] to-[#3AA99F]", icon: TbTestPipe },
    tags: ["Python", "LLM Evaluation", "Benchmarks", "Data Analysis"],
    github: "https://github.com/yourusername/llm-benchmark-suite",
  },
];
