import { fetchPosts } from "@/lib/fetchPosts";
import HorizontalMasonry from "./Masonry";

export async function AllPosts() {
  const { posts } = await fetchPosts("posts", {
    per_page: 50,
    page: 1,
    order: "desc",
    orderby: "date",
  });
  if (!posts) return <div>No posts found</div>;
  return <HorizontalMasonry posts={posts} />;
}
