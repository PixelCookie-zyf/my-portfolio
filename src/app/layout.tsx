import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import TelemetryWidget from "@/components/ui/TelemetryWidget";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelCookie — AI Agent Engineer & LLM Researcher",
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
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <CustomCursor />
          <TelemetryWidget />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
