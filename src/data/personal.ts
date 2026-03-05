import { FaGithub, FaTwitter, FaBilibili, FaInstagram } from "react-icons/fa6";

export const personalInfo = {
  name: "PixelCookie",
  city: "Shanghai, China",
  roles: [
    "AI Agent Engineer",
    "LLM Researcher",
    "Indie Game Developer",
    "Python Developer",
    "Open Source Builder",
  ],
  bio: "Building intelligent AI agents and exploring the frontier of large language models. Also an indie game developer crafting experiences with Godot engine.",
  avatar: "/images/avatar.jpg",
  socials: [
    { name: "GitHub", url: "https://github.com/yourusername", icon: FaGithub },
    { name: "Twitter", url: "https://twitter.com/yourusername", icon: FaTwitter },
    { name: "Bilibili", url: "https://space.bilibili.com/youruid", icon: FaBilibili },
    { name: "Instagram", url: "https://instagram.com/yourusername", icon: FaInstagram },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Travel", href: "#travel" },
] as const;
