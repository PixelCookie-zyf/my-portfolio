export const personalInfo = {
  name: "PixelCookie",
  role: "Doctoral researcher, AI agents & recommendation",
  location: "Fuzhou, China",
  email: "metazyf@gmail.com",
  bio: "I’m a doctoral researcher working on AI agents and recommendation systems. Here I share research notes, open-source projects, and the occasional detour into game development.",
  avatar: "/images/avatar.jpg",
  socials: [
    { name: "GitHub", url: "https://github.com/PixelCookie-zyf" },
    { name: "X", url: "https://x.com/zhang_yf79186" },
    { name: "Bilibili", url: "https://space.bilibili.com/666446434" },
    { name: "Instagram", url: "https://www.instagram.com/pixelcookie_zyf/" },
  ],
} as const;

/** Short facts pinned as sticky notes under the homepage intro. */
export const nowItems = [
  { label: "researching", text: "PhD studies in AI agents & learning" },
  {
    label: "just placed",
    text: "9th at Tencent TAAC 2026 with SeRankMixer",
    href: "https://github.com/PixelCookie-zyf/TAAC-2026-SeRankMixer",
  },
  { label: "after hours", text: "Building a small game in Godot" },
] as const;

export const navLinks = [
  { label: "Writing", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#experience" },
  { label: "Travel", href: "/#travel" },
] as const;
