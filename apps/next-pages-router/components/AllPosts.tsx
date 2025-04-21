import { fetchPosts } from "@/lib/fetchPosts";
import HorizontalMasonry from "./Masonry";
import { useQuery } from "@tanstack/react-query";

export function AllPosts() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetchPosts("posts", {
        per_page: 25,
        page: 1,
        order: "desc",
        orderby: "date",
      }),
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No posts found</div>;

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
