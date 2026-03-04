export interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: "HotRecForCTR",
    description:
      "A modular CTR prediction framework implementing ranking models like LR-GBDT and Factorization Machines. Features a registry-based architecture, custom TorchPrint for model analysis (FLOPs, MACs, memory), and trains on the Criteo dataset for ad click-through rate prediction.",
    tags: ["Python", "PyTorch", "LightGBM", "CTR", "Recommendation"],
    github: "https://github.com/PixelCookie-zyf/HotRecForCTR",
  },
  {
    title: "AI Agent Framework",
    description:
      "A modular Python framework for building multi-step AI agents with tool use, memory, and planning capabilities. Supports multiple LLM backends.",
    image: "/images/projects/agent-framework.webp",
    tags: ["Python", "LLM", "AI Agents", "OpenAI", "Tool Use"],
    github: "https://github.com/yourusername/ai-agent-framework",
  },
  {
    title: "RAG Knowledge Assistant",
    description:
      "A retrieval-augmented generation system that lets you chat with your own documents. Features hybrid search and re-ranking for high-accuracy answers.",
    image: "/images/projects/rag-assistant.webp",
    tags: ["Python", "RAG", "LangChain", "Qdrant", "FastAPI"],
    github: "https://github.com/yourusername/rag-knowledge-assistant",
    demo: "https://rag-demo.yourdomain.com",
  },
  {
    title: "Godot Roguelite",
    description:
      "A procedurally generated roguelite dungeon crawler built with Godot 4, featuring dynamic enemy AI and a hand-crafted pixel art style.",
    image: "/images/projects/godot-roguelite.webp",
    tags: ["Godot 4", "GDScript", "Pixel Art", "Procedural Generation"],
    github: "https://github.com/yourusername/godot-roguelite",
    demo: "https://yourusername.itch.io/roguelite",
  },
  {
    title: "LLM Benchmark Suite",
    description:
      "An evaluation toolkit for benchmarking LLM performance across reasoning, coding, and instruction-following tasks. Generates detailed comparison reports.",
    image: "/images/projects/llm-benchmark.webp",
    tags: ["Python", "LLM Evaluation", "Benchmarks", "Data Analysis"],
    github: "https://github.com/yourusername/llm-benchmark-suite",
  },
];
