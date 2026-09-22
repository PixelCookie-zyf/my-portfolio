import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Work from "@/components/sections/Work";

export const metadata: Metadata = { title: "Projects", description: "Open-source projects in recommendation systems, research tools, and game development." };

export default function ProjectsPage() {
  return <><Header /><main id="main-content" className="min-h-[70vh] pt-28 pb-12"><Work /></main><Footer /></>;
}
