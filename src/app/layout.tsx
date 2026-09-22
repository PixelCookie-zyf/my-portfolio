import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import BackToTop from "@/components/ui/BackToTop";
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
    { media: "(prefers-color-scheme: light)", color: "#FAF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#191917" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "PixelCookie — Notes, research & small projects",
    template: "%s | PixelCookie",
  },
  description:
    "Research notes on AI and recommendation systems, open-source projects, and experiments in game development by PixelCookie.",
  openGraph: {
    title: "PixelCookie — Notes, research & small projects",
    description:
      "Research notes, open-source projects, and experiments in game development.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelCookie — Notes, research & small projects",
    description:
      "Research notes, open-source projects, and experiments in game development.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <BackToTop />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
