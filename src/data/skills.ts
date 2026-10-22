export interface SkillCategory {
  label: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: "Research",
    skills: ["LLMs", "AI agents", "Retrieval"],
  },
  {
    label: "Programming",
    skills: ["Python", "TypeScript", "JavaScript"],
  },
  {
    label: "Infrastructure",
    skills: ["Docker", "CI/CD"],
  },
  {
    label: "Machine learning",
    skills: ["PyTorch", "Reinforcement learning", "Recommender systems"],
  },
];
