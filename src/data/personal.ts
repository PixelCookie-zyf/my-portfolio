import { FaGithub, FaXTwitter, FaBilibili, FaInstagram } from "react-icons/fa6";

export const personalInfo = {
  name: "PixelCookie",
  email: "metazyf@gmail.com",
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
    { name: "GitHub", url: "https://github.com/PixelCookie-zyf", icon: FaGithub },
    { name: "X", url: "https://x.com/zhang_yf79186", icon: FaXTwitter },
    { name: "Bilibili", url: "https://space.bilibili.com/666446434", icon: FaBilibili },
    { name: "Instagram", url: "https://www.instagram.com/pixelcookie_zyf/", icon: FaInstagram },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Build Log", href: "#build-log" },
  { label: "Travel", href: "#travel" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
] as const;
