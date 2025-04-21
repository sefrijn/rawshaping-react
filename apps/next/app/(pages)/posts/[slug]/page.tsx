import { fetchPostBySlug } from "@/lib/fetchPostBySlug";
import PostContent from "@/components/PostContent";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  return <PostContent post={post} />;
}
