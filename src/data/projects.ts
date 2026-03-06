import { IconType } from "react-icons";
import { TbChartScatter, TbBrain, TbBooks, TbTestPipe, TbWorldWww } from "react-icons/tb";
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
    thumbnail: { gradient: "from-emerald-400 via-cyan-400 to-blue-500", icon: TbWorldWww },
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/PixelCookie-zyf/my-portfolio",
    demo: "https://my-portfolio-zyf.vercel.app",
  },
  {
    title: "HotRecForCTR",
    description:
      "A modular CTR prediction framework implementing ranking models like LR-GBDT and Factorization Machines. Features a registry-based architecture, custom TorchPrint for model analysis (FLOPs, MACs, memory), and trains on the Criteo dataset for ad click-through rate prediction.",
    thumbnail: { gradient: "from-orange-500 via-rose-500 to-pink-600", icon: TbChartScatter },
    tags: ["Python", "PyTorch", "LightGBM", "CTR", "Recommendation"],
    github: "https://github.com/PixelCookie-zyf/HotRecForCTR",
  },
  {
    title: "AI Agent Framework",
    description:
      "A modular Python framework for building multi-step AI agents with tool use, memory, and planning capabilities. Supports multiple LLM backends.",
    thumbnail: { gradient: "from-violet-600 via-purple-600 to-indigo-700", icon: TbBrain },
    tags: ["Python", "LLM", "AI Agents", "OpenAI", "Tool Use"],
    github: "https://github.com/yourusername/ai-agent-framework",
  },
  {
    title: "RAG Knowledge Assistant",
    description:
      "A retrieval-augmented generation system that lets you chat with your own documents. Features hybrid search and re-ranking for high-accuracy answers.",
    thumbnail: { gradient: "from-teal-500 via-emerald-500 to-cyan-600", icon: TbBooks },
    tags: ["Python", "RAG", "LangChain", "Qdrant", "FastAPI"],
    github: "https://github.com/yourusername/rag-knowledge-assistant",
    demo: "https://rag-demo.yourdomain.com",
  },
  {
    title: "Godot Roguelite",
    description:
      "A procedurally generated roguelite dungeon crawler built with Godot 4, featuring dynamic enemy AI and a hand-crafted pixel art style.",
    thumbnail: { gradient: "from-fuchsia-500 via-purple-600 to-violet-700", icon: SiGodotengine },
    tags: ["Godot 4", "GDScript", "Pixel Art", "Procedural Generation"],
    github: "https://github.com/yourusername/godot-roguelite",
    demo: "https://yourusername.itch.io/roguelite",
  },
  {
    title: "LLM Benchmark Suite",
    description:
      "An evaluation toolkit for benchmarking LLM performance across reasoning, coding, and instruction-following tasks. Generates detailed comparison reports.",
    thumbnail: { gradient: "from-sky-500 via-blue-600 to-indigo-600", icon: TbTestPipe },
    tags: ["Python", "LLM Evaluation", "Benchmarks", "Data Analysis"],
    github: "https://github.com/yourusername/llm-benchmark-suite",
  },
];
