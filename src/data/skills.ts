import { IconType } from "react-icons";
import { SiPython, SiGodotengine, SiDocker, SiTypescript } from "react-icons/si";
import { FaRobot, FaLink, FaGamepad } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { TbDatabaseSearch, TbBinaryTree } from "react-icons/tb";

export interface Skill {
  name: string;
  icon: IconType;
  category: string;
}

export const skillCategories = [
  {
    label: "AI & ML",
    color: "from-violet-500 to-purple-600",
    bgHover: "hover:border-violet-300 hover:shadow-violet-200/50",
    iconColor: "text-violet-500",
  },
  {
    label: "Languages & Frameworks",
    color: "from-blue-500 to-cyan-500",
    bgHover: "hover:border-blue-300 hover:shadow-blue-200/50",
    iconColor: "text-blue-500",
  },
  {
    label: "Tools & Infra",
    color: "from-emerald-500 to-teal-500",
    bgHover: "hover:border-emerald-300 hover:shadow-emerald-200/50",
    iconColor: "text-emerald-500",
  },
  {
    label: "Creative",
    color: "from-orange-500 to-rose-500",
    bgHover: "hover:border-orange-300 hover:shadow-orange-200/50",
    iconColor: "text-orange-500",
  },
] as const;

export const skills: Skill[] = [
  // AI & ML
  { name: "LLM / Prompt Eng", icon: LuBrainCircuit, category: "AI & ML" },
  { name: "AI Agent Frameworks", icon: FaRobot, category: "AI & ML" },
  { name: "RAG & Vector DB", icon: TbDatabaseSearch, category: "AI & ML" },
  { name: "LangChain / LlamaIndex", icon: FaLink, category: "AI & ML" },
  // Languages & Frameworks
  { name: "Python", icon: SiPython, category: "Languages & Frameworks" },
  { name: "TypeScript / JS", icon: SiTypescript, category: "Languages & Frameworks" },
  { name: "DSA", icon: TbBinaryTree, category: "Languages & Frameworks" },
  // Tools & Infra
  { name: "Docker / DevOps", icon: SiDocker, category: "Tools & Infra" },
  // Creative
  { name: "Godot / GDScript", icon: SiGodotengine, category: "Creative" },
  { name: "Game Design", icon: FaGamepad, category: "Creative" },
];
