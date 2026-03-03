export interface Skill {
  name: string;
  level: number; // 0-100
}

export const skills: Skill[] = [
  { name: "Python", level: 92 },
  { name: "LLM / Prompt Engineering", level: 88 },
  { name: "AI Agent Frameworks", level: 85 },
  { name: "RAG & Vector Databases", level: 80 },
  { name: "Godot Engine / GDScript", level: 78 },
  { name: "LangChain / LlamaIndex", level: 82 },
  { name: "Docker / DevOps", level: 70 },
  { name: "TypeScript / JavaScript", level: 68 },
  { name: "Data Structures & Algorithms", level: 75 },
  { name: "Game Design", level: 65 },
];
