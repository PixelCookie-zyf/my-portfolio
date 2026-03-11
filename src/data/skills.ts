import { IconType } from "react-icons";
import { SiPython, SiGodotengine, SiDocker, SiTypescript } from "react-icons/si";
import { FaRobot, FaGamepad } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { TbBinaryTree } from "react-icons/tb";

export interface Skill {
  name: string;
  icon: IconType;
}

export interface SkillCategory {
  label: string;
  description: string;
  bg: string;
  categoryIcon: IconType;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: "AI & ML",
    description:
      "Building intelligent agents and exploring the frontier of large language models, RAG pipelines, and prompt engineering.",
    bg: "bg-violet-600",
    categoryIcon: LuBrainCircuit,
    skills: [
      { name: "LLM / Prompt Eng", icon: LuBrainCircuit },
      { name: "AI Agent Frameworks", icon: FaRobot },
    ],
  },
  {
    label: "Languages",
    description:
      "Proficient in Python for AI/backend and TypeScript for full-stack web development. Strong foundation in data structures and algorithms.",
    bg: "bg-blue-600",
    categoryIcon: SiPython,
    skills: [
      { name: "Python", icon: SiPython },
      { name: "TypeScript / JS", icon: SiTypescript },
      { name: "DSA", icon: TbBinaryTree },
    ],
  },
  {
    label: "Tools & Infra",
    description:
      "Containerized deployments, CI/CD pipelines, and cloud infrastructure for scalable AI applications.",
    bg: "bg-emerald-600",
    categoryIcon: SiDocker,
    skills: [{ name: "Docker / DevOps", icon: SiDocker }],
  },
  {
    label: "Creative",
    description:
      "Indie game development with Godot engine. Designing mechanics, narratives, and interactive experiences from scratch.",
    bg: "bg-orange-500",
    categoryIcon: FaGamepad,
    skills: [
      { name: "Godot / GDScript", icon: SiGodotengine },
      { name: "Game Design", icon: FaGamepad },
    ],
  },
];
