import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Self-hosted copies of the Google Fonts latin subsets (variable files), so builds don't
// depend on what fonts.googleapis.com serves the build machine.
const inter = localFont({
  variable: "--font-inter",
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  display: "swap",
});

// Variable axes: opsz, wght, SOFT, WONK.
const fraunces = localFont({
  variable: "--font-fraunces",
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-italic-latin.woff2", weight: "100 900", style: "italic" },
  ],
  adjustFontFallback: "Times New Roman",
  display: "swap",
});

// Only used for a few handwritten annotations.
const caveat = localFont({
  variable: "--font-caveat",
  src: "./fonts/caveat-latin.woff2",
  weight: "400 700",
  display: "swap",
});

// Rounded face for the island's cartoon buttons and pop-ups. One variable file, declared at the
// three weights the site uses (as Google's stylesheet did).
const fredoka = localFont({
  variable: "--font-fredoka",
  src: [
    { path: "./fonts/fredoka-latin.woff2", weight: "500" },
    { path: "./fonts/fredoka-latin.woff2", weight: "600" },
    { path: "./fonts/fredoka-latin.woff2", weight: "700" },
  ],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#191815" },
  ],
};

const title = "PixelCookie — Notes, research & small projects";
const description =
  "Research notes on large language models, AI agents and recommendation, plus open-source projects by PixelCookie.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s | PixelCookie" },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", siteName: "PixelCookie" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} ${caveat.variable} ${fredoka.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
