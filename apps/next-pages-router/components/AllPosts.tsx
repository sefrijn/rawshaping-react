import { fetchPosts } from "@/lib/fetchPosts";
import HorizontalMasonry from "./Masonry";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
export function AllPosts() {
  const router = useRouter();
  const tag = router?.query?.tag;
  // Check if tag is a string, not an array, and is defined
  const isValidTag = typeof tag === "string" && tag !== "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["posts", tag],
    queryFn: () =>
      fetchPosts("posts", {
        per_page: 25,
        page: 1,
        order: "desc",
        orderby: "date",
        tags: isValidTag ? tag : undefined,
      }),
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!isPending && !data) return <div>No posts found</div>;

  const currentPage = data.currentPage || 1;
  const totalPages = Number(data.pages || 1);
  const hasNextPage = currentPage < totalPages;

  return (
    <HorizontalMasonry
      posts={data.posts}
      initialPage={currentPage}
      hasNextPage={hasNextPage}
    />
  );
}
