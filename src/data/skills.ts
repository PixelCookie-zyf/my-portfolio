export interface SkillCategory {
  label: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: "Research",
    skills: ["Language models", "Agents", "Retrieval"],
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
    label: "Games",
    skills: ["Godot", "GDScript", "Game design"],
  },
];
