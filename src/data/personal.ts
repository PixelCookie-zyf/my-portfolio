export const personalInfo = {
  name: "PixelCookie",
  location: "Fuzhou, China",
  email: "metazyf@gmail.com",
  bio: "I’m a doctoral researcher working on large language models and AI agents, with a background in search and recommendation. Here I share research notes, open-source projects, and whatever I’m digging into lately.",
  avatar: "/images/avatar.jpg",
  socials: [
    { name: "GitHub", url: "https://github.com/PixelCookie-zyf" },
    { name: "X", url: "https://x.com/zhang_yf79186" },
    { name: "Bilibili", url: "https://space.bilibili.com/666446434" },
    { name: "Instagram", url: "https://www.instagram.com/pixelcookie_zyf/" },
  ],
} as const;

/** Short facts pinned as sticky notes under the homepage intro. */
export const navLinks = [
  { label: "Writing", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Travel", href: "/#travel" },
] as const;
