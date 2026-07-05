import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import TelemetryWidget from "@/components/ui/TelemetryWidget";
import CustomCursor from "@/components/ui/CustomCursor";
import BackToTop from "@/components/ui/BackToTop";
import CommandPalette from "@/components/ui/CommandPalette";
import { getAllPosts } from "@/lib/blog";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFCF0" },
    { media: "(prefers-color-scheme: dark)", color: "#100F0F" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "PixelCookie — AI Agent Engineer & LLM Researcher",
    template: "%s | PixelCookie",
  },
  description:
    "Building intelligent AI agents and exploring the frontier of large language models. Portfolio of PixelCookie — AI engineer, indie game developer, and open source builder.",
  openGraph: {
    title: "PixelCookie — AI Agent Engineer & LLM Researcher",
    description:
      "Building intelligent AI agents and exploring the frontier of large language models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelCookie — AI Agent Engineer & LLM Researcher",
    description:
      "Building intelligent AI agents and exploring the frontier of large language models.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const palettePosts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
  }));

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#fffcf0]"
          >
            Skip to content
          </a>
          {children}
          <CustomCursor />
          <TelemetryWidget />
          <BackToTop />
          <CommandPalette posts={palettePosts} />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
