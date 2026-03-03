export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

export const experiences: Experience[] = [
  {
    company: "AI Startup",
    role: "Senior AI Agent Engineer",
    period: "2024 - Present",
    description:
      "Architecting and building production-grade AI agent systems powered by large language models. Leading research on multi-agent orchestration, tool use, and long-horizon task planning.",
    tags: ["Python", "LLM", "AI Agents", "LangChain", "RAG"],
  },
  {
    company: "Tech Company",
    role: "Machine Learning Engineer",
    period: "2022 - 2024",
    description:
      "Developed and deployed NLP pipelines for document understanding and information extraction. Worked on fine-tuning and evaluation of domain-specific language models.",
    tags: ["Python", "PyTorch", "Transformers", "NLP", "MLOps"],
  },
  {
    company: "Software Company",
    role: "Backend Developer",
    period: "2020 - 2022",
    description:
      "Built scalable backend services and APIs. Gained strong foundations in distributed systems, data engineering, and cloud infrastructure.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
  },
];
