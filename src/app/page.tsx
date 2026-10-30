import IslandHome from "@/components/island/IslandHome";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  return <IslandHome posts={getAllPosts()} />;
}
