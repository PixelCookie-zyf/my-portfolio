import type { City } from "@/data/travel";
import type { Project } from "@/data/projects";
import type { SkillCategory } from "@/data/skills";
import type { TimelineEntry } from "@/data/experience";
import type { PostMeta } from "@/lib/blog";

export interface IslandData {
  personal: {
    name: string;
    location: string;
    email: string;
    avatar: string;
    bio: string;
    socials: readonly { name: string; url: string }[];
  };
  skills: SkillCategory[];
  timeline: TimelineEntry[];
  projects: Project[];
  posts: PostMeta[];
  cities: readonly City[];
}

export type IslandSpot = "writing" | "projects" | "about" | "travel" | "contact";

export interface IslandHandle {
  setNight(on: boolean): void;
  setOutline(on: boolean): void;
  setSpin(on: boolean): void;
  open(key: IslandSpot): void;
  /** Walk down to the jetty and start the fishing game. */
  fish(): void;
  close(): void;
  dispose(): void;
}

export function mountIsland(
  stage: HTMLElement,
  options: {
    data: IslandData;
    navigate: (href: string) => void;
    night?: boolean;
    fullscreen?: boolean;
    onModal?: (key: IslandSpot | null) => void;
    onFishing?: (on: boolean) => void;
  },
): Promise<IslandHandle>;
